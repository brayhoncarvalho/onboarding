/**
 * validate-design.mjs
 * Valida que os componentes Vue do projeto usam apenas cores, fontes e tokens permitidos.
 * Roda com: node scripts/validate-design.mjs
 *
 * Exit code 0 = tudo ok
 * Exit code 1 = violações encontradas
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

// Cores permitidas (hex lowercase, sem #)
const ALLOWED_COLORS = new Set([
  '00d8d8', '1cc0c0', 'eeff88', '444746', '242424',
  '5c5c5c', '777777', 'e6e6e6', '000000', 'ffffff',
  'b9b9b9', 'b8b8b8', 'eeeeee', 'efefef', '666666',
  '8d8d8d', 'c8c8c8', '495057', 'dc3545', 'dcdcdc',
  '9a9a9a', 'f8f9fa', 'dee2e6', '333333', 'cccccc',
  'ececec',
  '00d8d8cc', // com alpha
]);

// Fontes permitidas
const ALLOWED_FONTS = new Set([
  'roboto', 'red hat display', 'red-hat', 'font-roboto', 'font-red-hat',
  'sans-serif', 'monospace', 'inherit',
]);

// Fontes proibidas explicitamente
const BANNED_FONTS = ['poppins', 'open sans', 'lato', 'nunito'];

// Padrões regex para detectar fontes proibidas em contextos de CSS/font-family
const BANNED_FONT_PATTERNS = [
  /font-family[^;]*poppins/gi,
  /font-family[^;]*open\s*sans/gi,
  /font-family[^;]*\blato\b/gi,
  /font-family[^;]*nunito/gi,
  /font-family[^;]*\binter\b/gi,
  /font-family[^;]*\barial\b/gi,
  /font-family[^;]*helvetica/gi,
  /class="[^"]*font-\[['"]?(?:Inter|Poppins|Arial|Helvetica|Open Sans|Lato|Nunito)/gi,
];

const SRC_DIR = join(process.cwd(), 'src', 'components');
const LEGACY_CONTRAST_ALLOWLIST = new Set([
  'src/components/ComoFuncionaSection.vue',
  'src/components/DadosPessoaisScreen.vue',
  'src/components/PropostaScreen.vue',
  'src/components/SimuladorSection.vue',
]);

function getAllVueFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...getAllVueFiles(full));
    } else if (entry.endsWith('.vue')) {
      files.push(full);
    }
  }
  return files;
}

function extractHexColors(content) {
  // Match #hex in classes, inline styles, etc.
  const regex = /#([0-9a-fA-F]{3,8})\b/g;
  const matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push({ hex: match[1].toLowerCase(), index: match.index });
  }
  return matches;
}

function extractFontReferences(content) {
  const issues = [];
  for (const pattern of BANNED_FONT_PATTERNS) {
    // Reset lastIndex for global regex
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(content)) !== null) {
      issues.push({ font: match[0].trim(), index: match.index });
    }
  }
  return issues;
}

function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

function normalizeHex(hex) {
  if (!hex) return null;
  const value = hex.toLowerCase();
  return value.length === 3
    ? value[0] + value[0] + value[1] + value[1] + value[2] + value[2]
    : value.slice(0, 6);
}

function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized || normalized.length !== 6) return null;

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function getRelativeLuminance({ r, g, b }) {
  const channel = (value) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  const red = channel(r);
  const green = channel(g);
  const blue = channel(b);

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function getContrastRatio(foregroundHex, backgroundHex) {
  const foreground = hexToRgb(foregroundHex);
  const background = hexToRgb(backgroundHex);

  if (!foreground || !background) return null;

  const foregroundLuminance = getRelativeLuminance(foreground);
  const backgroundLuminance = getRelativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function resolveNamedColor(token) {
  if (token === 'white') return 'ffffff';
  if (token === 'black') return '000000';
  return null;
}

function extractContrastWarnings(content) {
  const warnings = [];
  const classRegex = /class\s*=\s*(["'])([\s\S]*?)\1/g;
  let match;

  while ((match = classRegex.exec(content)) !== null) {
    const classValue = match[2];
    const textMatch = classValue.match(/(?:^|\s)text-\[#([0-9a-fA-F]{3,8})\]|(?:^|\s)text-(white|black)\b/);
    const bgMatch = classValue.match(/(?:^|\s)bg-\[#([0-9a-fA-F]{3,8})\]|(?:^|\s)bg-(white|black)\b/);

    if (!textMatch || !bgMatch) {
      continue;
    }

    const foreground = normalizeHex(textMatch[1]) ?? resolveNamedColor(textMatch[2]);
    const background = normalizeHex(bgMatch[1]) ?? resolveNamedColor(bgMatch[2]);

    if (!foreground || !background) {
      continue;
    }

    const ratio = getContrastRatio(foreground, background);
    if (ratio !== null && ratio < 4.5) {
      warnings.push({
        index: match.index,
        foreground,
        background,
        ratio,
      });
    }
  }

  return warnings;
}

function validate() {
  let violations = [];
  let warnings = [];
  let contrastViolations = [];

  let files;
  try {
    files = getAllVueFiles(SRC_DIR);
  } catch {
    console.error(`❌ Pasta não encontrada: ${SRC_DIR}`);
    process.exit(1);
  }

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const rel = relative(process.cwd(), file);

    // Check hex colors
    const colors = extractHexColors(content);
    for (const { hex, index } of colors) {
      const normalized = normalizeHex(hex);

      if (!ALLOWED_COLORS.has(normalized)) {
        const line = getLineNumber(content, index);
        violations.push(`  ${rel}:${line} — cor #${hex} não está na lista de tokens permitidos`);
      }
    }

    // Check banned fonts
    const fonts = extractFontReferences(content);
    for (const { font, index } of fonts) {
      const line = getLineNumber(content, index);
      violations.push(`  ${rel}:${line} — fonte "${font}" não é permitida (usar Roboto ou Red Hat Display)`);
    }

    const contrastWarnings = extractContrastWarnings(content);
    for (const { index, foreground, background, ratio } of contrastWarnings) {
      const line = getLineNumber(content, index);
      const message = `  ${rel}:${line} — contraste potencialmente insuficiente entre #${foreground} e #${background} (ratio ${ratio.toFixed(2)}:1)`;
      if (LEGACY_CONTRAST_ALLOWLIST.has(rel.replace(/\\/g, '/'))) {
        warnings.push(message);
      } else {
        contrastViolations.push(message);
      }
    }
  }

  if (contrastViolations.length > 0) {
    violations.push(...contrastViolations);
  }

  if (violations.length > 0) {
    console.error(`\n❌ ${violations.length} violação(ões) de design encontrada(s):\n`);
    violations.forEach(v => console.error(v));
    console.error('\nCorreção: use apenas cores e fontes definidas no DESIGN_SYSTEM.md ou tokens do tailwind.config.js. Novos componentes não podem introduzir contraste abaixo do baseline de WCAG 2.2 AA.\n');
    process.exit(1);
  } else {
    console.log('✅ Validação de design: nenhuma violação encontrada.');
    if (warnings.length > 0) {
      console.warn(`\n⚠️ ${warnings.length} alerta(s) de contraste encontrado(s):\n`);
      warnings.forEach(warning => console.warn(warning));
      console.warn('\nRevisar esses pares no contexto real da interface e confirmar aderência a WCAG 2.2 AA.\n');
    }
    process.exit(0);
  }
}

validate();
