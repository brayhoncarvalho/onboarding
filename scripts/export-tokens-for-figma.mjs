#!/usr/bin/env node
/**
 * export-tokens-for-figma.mjs
 *
 * Exporta os tokens atuais do projeto (dock-ds.config.json + tailwind.config.js)
 * em formato W3C Design Tokens Community Group (DTCG), compatível com:
 *   - Figma Tokens Studio plugin
 *   - Style Dictionary
 *   - Tokens Studio for Figma
 *   - Qualquer ferramenta que consuma design-tokens.json
 *
 * O designer pode importar esse arquivo no Figma para manter variáveis sincronizadas
 * com o que o frontend realmente usa.
 *
 * Output: tokens/design-tokens.json (DTCG format)
 *
 * Uso:
 *   node scripts/export-tokens-for-figma.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, '..')
const OUTPUT_DIR = join(PROJECT_ROOT, 'tokens')
const CONFIG_PATH = join(PROJECT_ROOT, 'dock-ds.config.json')
const TAILWIND_CONFIG_PATH = join(PROJECT_ROOT, 'tailwind.config.js')
const DEFAULT_SPACING_TOKENS = {
  '0': '0px',
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '8': '32px',
  '10': '40px',
  '12': '48px',
  '16': '64px',
  '20': '80px',
  '24': '96px',
}

// === Load Config ===

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
const tailwindModule = await import(pathToFileURL(TAILWIND_CONFIG_PATH).href)
const tailwindConfig = tailwindModule.default || tailwindModule

// === Color Token Names (semantic mapping) ===

const COLOR_NAMES = {
  '#00d8d8': 'primary',
  '#1cc0c0': 'tertiary',
  '#eeff88': 'yellow-accent',
  '#444746': 'button-dark',
  '#242424': 'text-dark',
  '#5c5c5c': 'text-gray',
  '#777777': 'text-muted',
  '#e6e6e6': 'bg-light',
  '#000000': 'black',
  '#ffffff': 'white',
  '#b9b9b9': 'slider-inactive',
  '#dc3545': 'error',
  '#b8b8b8': 'border-light',
  '#eeeeee': 'bg-lighter',
  '#efefef': 'bg-section',
  '#666666': 'text-secondary',
  '#8d8d8d': 'text-placeholder',
  '#c8c8c8': 'border-default',
  '#dcdcdc': 'divider',
  '#9a9a9a': 'text-disabled',
  '#f8f9fa': 'bg-card',
  '#dee2e6': 'border-card',
  '#333333': 'text-heading',
  '#cccccc': 'border-muted',
  '#ececec': 'bg-input',
  '#495057': 'text-form',
  '#00d8d8cc': 'primary-alpha-80',
}

// === Build DTCG Format ===

function toTokenKey(name) {
  return String(name)
    .replace(/^["']|["']$/g, '')
    .replace(/\./g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

function flattenObject(obj, prefix = '', result = {}) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return result

  for (const [key, value] of Object.entries(obj)) {
    const nextKey = prefix ? `${prefix}-${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, nextKey, result)
    } else {
      result[toTokenKey(nextKey)] = value
    }
  }

  return result
}

function normalizeTokenValue(value) {
  if (Array.isArray(value)) return value[0]
  return value
}

function buildColorTokens(colorsFromConfig, colorsFromTailwind) {
  const tokens = {}
  const flattenedTailwindColors = flattenObject(colorsFromTailwind)

  for (const [name, rawValue] of Object.entries(flattenedTailwindColors)) {
    const value = normalizeTokenValue(rawValue)
    if (typeof value !== 'string' || !value.startsWith('#')) continue

    const tokenName = name.startsWith('dock-') ? name.replace(/^dock-/, '') : name
    tokens[tokenName] = {
      $type: 'color',
      $value: value,
      $description: `Tailwind color token: ${tokenName}`,
    }
  }

  for (const hex of colorsFromConfig) {
    const name = COLOR_NAMES[hex] || `color-${hex.replace('#', '')}`
    if (!tokens[name]) {
      tokens[name] = {
        $type: 'color',
        $value: hex,
        $description: `Dock DS — ${name}`,
      }
    }
  }

  return tokens
}

function buildFontTokens(fontsFromConfig, fontsFromTailwind) {
  const tokens = {}
  const allowed = fontsFromConfig.allowed || []
  const flattenedTailwindFonts = flattenObject(fontsFromTailwind)

  for (const [key, rawValue] of Object.entries(flattenedTailwindFonts)) {
    const value = normalizeTokenValue(rawValue)
    if (typeof value !== 'string') continue

    tokens[key] = {
      $type: 'fontFamily',
      $value: value.replace(/^"|"$/g, ''),
      $description: `Tailwind font family: ${key}`,
    }
  }

  for (const font of allowed) {
    const key = toTokenKey(font)
    if (!tokens[key]) {
      tokens[key] = {
        $type: 'fontFamily',
        $value: font,
        $description: `Fonte aprovada: ${font}`,
      }
    }
  }

  return tokens
}

function buildTypographyTokens(typography) {
  const tokens = {}
  const weights = typography.weights || []

  const weightNames = {
    300: 'light',
    400: 'regular',
    500: 'medium',
    600: 'semibold',
    700: 'bold',
  }

  for (const weight of weights) {
    const name = weightNames[weight] || `weight-${weight}`
    tokens[name] = {
      $type: 'fontWeight',
      $value: weight,
      $description: `Font weight: ${name} (${weight})`,
    }
  }

  // Font roles
  if (typography.headingFont) {
    tokens['heading-font'] = {
      $type: 'fontFamily',
      $value: typography.headingFont,
      $description: 'Fonte para headings',
    }
  }
  if (typography.bodyFont) {
    tokens['body-font'] = {
      $type: 'fontFamily',
      $value: typography.bodyFont,
      $description: 'Fonte para corpo de texto',
    }
  }
  if (typography.ctaFont) {
    tokens['cta-font'] = {
      $type: 'fontFamily',
      $value: typography.ctaFont,
      $description: 'Fonte para CTAs e botões',
    }
  }

  return tokens
}

function buildDimensionTokens(source, prefix, description) {
  const tokens = {}

  for (const [key, rawValue] of Object.entries(source || {})) {
    const value = normalizeTokenValue(rawValue)
    if (typeof value !== 'string' && typeof value !== 'number') continue

    tokens[`${prefix}-${toTokenKey(key)}`] = {
      $type: 'dimension',
      $value: String(value),
      $description: `${description}: ${key}`,
    }
  }

  return tokens
}

// === Assemble ===

const designTokens = {
  $schema: 'https://design-tokens.github.io/community-group/format/',
  $description: 'Dock Design System — Tokens exportados do frontend',
  $metadata: {
    source: 'dock-ds.config.json',
    tailwindSource: 'tailwind.config.js',
    exportedAt: new Date().toISOString(),
    version: config.version || '1.0.0',
    project: config.project?.name || 'dock',
  },
  color: buildColorTokens(config.tokens?.colors || [], tailwindConfig.theme?.extend?.colors || {}),
  font: buildFontTokens(config.tokens?.fonts || {}, tailwindConfig.theme?.extend?.fontFamily || {}),
  typography: buildTypographyTokens(config.tokens?.typography || {}),
  spacing: buildDimensionTokens(
    tailwindConfig.theme?.spacing || tailwindConfig.theme?.extend?.spacing || DEFAULT_SPACING_TOKENS,
    'space',
    'Spacing token'
  ),
  borderRadius: buildDimensionTokens(
    tailwindConfig.theme?.borderRadius || tailwindConfig.theme?.extend?.borderRadius || {},
    'radius',
    'Border radius token'
  ),
  size: {
    width: buildDimensionTokens(tailwindConfig.theme?.extend?.width || {}, 'width', 'Custom width token'),
    height: buildDimensionTokens(tailwindConfig.theme?.extend?.height || {}, 'height', 'Custom height token'),
  },
}

// === Output ===

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true })
}

const outputPath = join(OUTPUT_DIR, 'design-tokens.json')
writeFileSync(outputPath, JSON.stringify(designTokens, null, 2) + '\n', 'utf-8')

// Summary
const colorCount = Object.keys(designTokens.color).length
const fontCount = Object.keys(designTokens.font).length
const typoCount = Object.keys(designTokens.typography).length
const spacingCount = Object.keys(designTokens.spacing).length
const radiusCount = Object.keys(designTokens.borderRadius).length
const widthCount = Object.keys(designTokens.size.width).length
const heightCount = Object.keys(designTokens.size.height).length
const total = colorCount + fontCount + typoCount + spacingCount + radiusCount + widthCount + heightCount

console.log('🎨 Export Tokens for Figma — Concluído!\n')
console.log(`   Formato: W3C DTCG (Design Tokens Community Group)`)
console.log(`   Output: ${outputPath}\n`)
console.log(`   Tokens exportados:`)
console.log(`     Cores:          ${colorCount}`)
console.log(`     Fontes:         ${fontCount}`)
console.log(`     Tipografia:     ${typoCount}`)
console.log(`     Espaçamentos:   ${spacingCount}`)
console.log(`     Border Radius:  ${radiusCount}`)
console.log(`     Width tokens:   ${widthCount}`)
console.log(`     Height tokens:  ${heightCount}`)
console.log(`     ─────────────────────`)
console.log(`     Total:          ${total}\n`)
console.log(`📌 Próximo passo:`)
console.log(`   Importe "${outputPath}" no plugin Tokens Studio for Figma`)
console.log(`   ou use Style Dictionary para gerar variáveis Figma.`)
