#!/usr/bin/env node
/**
 * prepare-figma-import.mjs
 *
 * Gera um pacote completo para o designer importar/referenciar no Figma.
 * Executa em sequência:
 *   1. Export de tokens em formato DTCG (design-tokens.json)
 *   2. Inventário de componentes (component-inventory.json)
 *   3. Screenshots de todas as telas em múltiplos viewports
 *   4. Manifest final com tudo reunido
 *
 * Output: figma-import/ (pasta pronta para entregar ao designer)
 *
 * Uso:
 *   npm run figma:prepare-import
 *   npm run figma:prepare-import -- --base-url=http://localhost:5173
 *   npm run figma:prepare-import -- --skip-screenshots
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync, statSync } from 'fs'
import { join, dirname, basename, extname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { execSync, spawn } from 'child_process'
import { createRequire } from 'module'
import http from 'http'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, '..')
const OUTPUT_DIR = join(PROJECT_ROOT, 'figma-import')
const CONFIG_PATH = join(PROJECT_ROOT, 'dock-ds.config.json')
const TAILWIND_CONFIG_PATH = join(PROJECT_ROOT, 'tailwind.config.js')
const SRC_DIR = join(PROJECT_ROOT, 'src')

const SKIP_SCREENSHOTS = process.argv.includes('--skip-screenshots')
const BASE_URL_ARG = process.argv.find(a => a.startsWith('--base-url='))
const EXPLICIT_BASE_URL = BASE_URL_ARG ? BASE_URL_ARG.split('=')[1] : null
const AUTO_PREVIEW_PORT = 4173

// ═══════════════════════════════════════════════════
// STEP 0 — Setup
// ═══════════════════════════════════════════════════

console.log('═'.repeat(60))
console.log('  📦 Figma Import Package — Preparando artefatos')
console.log('═'.repeat(60))
console.log()

if (existsSync(OUTPUT_DIR)) {
  rmSync(OUTPUT_DIR, { recursive: true, force: true })
}
mkdirSync(OUTPUT_DIR, { recursive: true })

const startTime = Date.now()

// ═══════════════════════════════════════════════════
// STEP 1 — Export de Tokens (DTCG)
// ═══════════════════════════════════════════════════

console.log('🎨 [1/4] Exportando tokens...')

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
const tailwindModule = await import(pathToFileURL(TAILWIND_CONFIG_PATH).href)
const tailwindConfig = tailwindModule.default || tailwindModule

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

function toTokenKey(name) {
  return String(name).replace(/^["']|["']$/g, '').replace(/\./g, '-').replace(/\s+/g, '-').toLowerCase()
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

function buildColorTokens() {
  const tokens = {}
  const flatColors = flattenObject(tailwindConfig.theme?.extend?.colors || {})

  for (const [name, rawValue] of Object.entries(flatColors)) {
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue
    if (typeof value !== 'string' || !value.startsWith('#')) continue
    const tokenName = name.startsWith('dock-') ? name.replace(/^dock-/, '') : name
    tokens[tokenName] = { $type: 'color', $value: value }
  }

  for (const hex of (config.tokens?.colors || [])) {
    const name = COLOR_NAMES[hex] || `color-${hex.replace('#', '')}`
    if (!tokens[name]) {
      tokens[name] = { $type: 'color', $value: hex }
    }
  }
  return tokens
}

function buildFontTokens() {
  const tokens = {}
  const fonts = flattenObject(tailwindConfig.theme?.extend?.fontFamily || {})
  for (const [key, rawValue] of Object.entries(fonts)) {
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue
    if (typeof value !== 'string') continue
    tokens[key] = { $type: 'fontFamily', $value: value.replace(/^"|"$/g, '') }
  }
  return tokens
}

function buildDimensionTokens(source, prefix) {
  const tokens = {}
  for (const [key, rawValue] of Object.entries(source || {})) {
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue
    if (typeof value !== 'string' && typeof value !== 'number') continue
    tokens[`${prefix}-${toTokenKey(key)}`] = { $type: 'dimension', $value: String(value) }
  }
  return tokens
}

const designTokens = {
  $schema: 'https://design-tokens.github.io/community-group/format/',
  $description: 'Dock Design System — Tokens para importar no Figma (Tokens Studio)',
  $metadata: {
    exportedAt: new Date().toISOString(),
    source: 'tailwind.config.js + dock-ds.config.json',
  },
  color: buildColorTokens(),
  font: buildFontTokens(),
  spacing: buildDimensionTokens(
    { '0': '0px', '1': '4px', '2': '8px', '3': '12px', '4': '16px', '5': '20px', '6': '24px', '8': '32px', '10': '40px', '12': '48px', '16': '64px', '20': '80px', '24': '96px' },
    'space'
  ),
  borderRadius: buildDimensionTokens(tailwindConfig.theme?.extend?.borderRadius || {}, 'radius'),
  width: buildDimensionTokens(tailwindConfig.theme?.extend?.width || {}, 'width'),
  height: buildDimensionTokens(tailwindConfig.theme?.extend?.height || {}, 'height'),
}

const tokensPath = join(OUTPUT_DIR, 'design-tokens.json')
writeFileSync(tokensPath, JSON.stringify(designTokens, null, 2) + '\n', 'utf-8')

const tokenCount = Object.values(designTokens).reduce((sum, group) => {
  if (group && typeof group === 'object' && !group.$type) {
    return sum + Object.keys(group).length
  }
  return sum
}, 0)

console.log(`   ✅ ${tokenCount} tokens exportados → design-tokens.json\n`)

// ═══════════════════════════════════════════════════
// STEP 2 — Inventário de Componentes
// ═══════════════════════════════════════════════════

console.log('🧩 [2/4] Gerando inventário de componentes...')

function collectVueFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory() && entry !== 'node_modules' && entry !== '__tests__') {
      collectVueFiles(full, acc)
    } else if (extname(entry) === '.vue') {
      acc.push(full)
    }
  }
  return acc
}

function extractComponentInfo(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const name = basename(filePath, '.vue')

  // Extrair props
  const propsMatch = content.match(/defineProps[<(]([^)>]*)[)>]/s)
  const props = propsMatch ? propsMatch[1].trim().split('\n').map(l => l.trim()).filter(Boolean) : []

  // Extrair emits
  const emitsMatch = content.match(/defineEmits[<(]([^)>]*)[)>]/s)
  const emits = emitsMatch ? emitsMatch[1].trim().split('\n').map(l => l.trim()).filter(Boolean) : []

  // Detectar slots
  const hasSlots = content.includes('<slot')

  // Detectar tipo de componente (tela ou componente)
  const isScreen = name.includes('Screen')
  const isSection = name.includes('Section')

  // Tamanho aproximado
  const lines = content.split('\n').length

  return {
    name,
    file: filePath.replace(PROJECT_ROOT, '.').replace(/\\/g, '/'),
    type: isScreen ? 'screen' : isSection ? 'section' : 'component',
    lines,
    hasProps: props.length > 0,
    hasEmits: emits.length > 0,
    hasSlots,
  }
}

const vueFiles = collectVueFiles(join(SRC_DIR, 'components'))
const appFile = join(SRC_DIR, 'App.vue')
if (existsSync(appFile)) vueFiles.unshift(appFile)

const inventory = vueFiles.map(extractComponentInfo)

const inventoryPath = join(OUTPUT_DIR, 'component-inventory.json')
writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2) + '\n', 'utf-8')

console.log(`   ✅ ${inventory.length} componentes mapeados → component-inventory.json`)
console.log(`      Telas: ${inventory.filter(c => c.type === 'screen').length}`)
console.log(`      Seções: ${inventory.filter(c => c.type === 'section').length}`)
console.log(`      Componentes: ${inventory.filter(c => c.type === 'component').length}\n`)

// ═══════════════════════════════════════════════════
// HELPERS — Servidor automático
// ═══════════════════════════════════════════════════

/** Testa se uma URL está respondendo (HTTP GET simples, sem Playwright) */
function probeUrl(url, timeoutMs = 2000) {
  return new Promise(resolve => {
    try {
      const req = http.get(url, { timeout: timeoutMs }, res => {
        res.destroy()
        resolve(true)
      })
      req.on('error', () => resolve(false))
      req.on('timeout', () => { req.destroy(); resolve(false) })
    } catch {
      resolve(false)
    }
  })
}

/** Aguarda até a URL responder, com tentativas espaçadas */
async function waitForServer(url, maxWaitMs = 30000, intervalMs = 500) {
  const deadline = Date.now() + maxWaitMs
  while (Date.now() < deadline) {
    if (await probeUrl(url)) return true
    await new Promise(r => setTimeout(r, intervalMs))
  }
  return false
}

// ═══════════════════════════════════════════════════
// STEP 3 — Screenshots
// ═══════════════════════════════════════════════════

let screenshotResults = null
let previewProcess = null

if (SKIP_SCREENSHOTS) {
  console.log('📸 [3/4] Screenshots — PULADOS (--skip-screenshots)\n')
} else {
  console.log('📸 [3/4] Gerando screenshots...')

  const SCREENS = [
    { name: 'landing', query: '?screen=landing' },
    { name: 'proposta', query: '?screen=proposta' },
    { name: 'dados-acesso', query: '?screen=dados-acesso' },
    { name: 'proposta-personalizada', query: '?screen=proposta-personalizada' },
    { name: 'cadastro', query: '?screen=cadastro' },
  ]

  const VIEWPORTS = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 800 },
  ]

  // Determinar BASE_URL — usar explícita, ou tentar auto-start
  let BASE_URL = EXPLICIT_BASE_URL
  let skipShots = false

  if (!BASE_URL) {
    const autoUrl = `http://127.0.0.1:${AUTO_PREVIEW_PORT}`
    const alreadyUp = await probeUrl(autoUrl)

    if (alreadyUp) {
      console.log(`   🔗 Servidor já rodando em ${autoUrl}`)
      BASE_URL = autoUrl
    } else {
      // Build automático
      console.log('   🔨 Rodando build do projeto...')
      try {
        // Instalar dependências se necessário
        if (!existsSync(join(PROJECT_ROOT, 'node_modules', '.bin', 'vite'))) {
          console.log('   📦 Instalando dependências (npm install)...')
          execSync('npm install', { cwd: PROJECT_ROOT, stdio: 'pipe' })
          console.log('   ✅ Dependências instaladas')
        }
        execSync('npm run build', { cwd: PROJECT_ROOT, stdio: 'pipe' })
        console.log('   ✅ Build concluído')
      } catch (err) {
        console.log(`   ❌ Build falhou: ${err.stderr?.toString().slice(0, 200) || err.message}`)
        console.log('   Gerando pacote sem screenshots (tokens e inventário mantidos).\n')
        skipShots = true
      }

      if (!skipShots) {
        console.log(`   🚀 Subindo preview na porta ${AUTO_PREVIEW_PORT}...`)
        previewProcess = spawn(
          'npx',
          ['vite', 'preview', '--host', '127.0.0.1', '--port', String(AUTO_PREVIEW_PORT)],
          { cwd: PROJECT_ROOT, stdio: 'pipe', shell: true }
        )

        const ready = await waitForServer(autoUrl, 30000)
        if (ready) {
          console.log(`   ✅ Preview disponível em ${autoUrl}`)
          BASE_URL = autoUrl
        } else {
          console.log('   ⚠️  Preview não respondeu em 30s — gerando pacote sem screenshots.\n')
          previewProcess?.kill()
          previewProcess = null
          skipShots = true
        }
      }
    }
  } else {
    console.log(`   🔗 Usando URL explícita: ${BASE_URL}`)
  }

  if (BASE_URL && !skipShots) {
    const screenshotsDir = join(OUTPUT_DIR, 'screenshots')
    mkdirSync(screenshotsDir, { recursive: true })

    try {
      const { chromium } = await import('playwright')
      const browser = await chromium.launch({ headless: true })
      screenshotResults = []

      for (const viewport of VIEWPORTS) {
        const vpDir = join(screenshotsDir, viewport.name)
        mkdirSync(vpDir, { recursive: true })

        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: 2,
        })

        for (const screen of SCREENS) {
          const page = await context.newPage()
          const url = `${BASE_URL}/${screen.query}`

          try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 })
            await page.waitForTimeout(1000)

            const filepath = join(vpDir, `${screen.name}.png`)
            await page.screenshot({ path: filepath, fullPage: true, type: 'png' })

            screenshotResults.push({ screen: screen.name, viewport: viewport.name, status: 'ok' })
            console.log(`   ✅ ${viewport.name}/${screen.name}.png`)
          } catch (err) {
            screenshotResults.push({ screen: screen.name, viewport: viewport.name, status: 'failed', error: err.message })
            console.log(`   ❌ ${viewport.name}/${screen.name} — ${err.message}`)
          }

          await page.close()
        }

        await context.close()
      }

      await browser.close()

      const success = screenshotResults.filter(r => r.status === 'ok').length
      const total = screenshotResults.length
      console.log(`   ${success}/${total} screenshots gerados\n`)
    } catch (err) {
      console.log(`   ⚠️  Playwright não disponível: ${err.message}`)
      console.log('   Execute: npx playwright install chromium\n')
      screenshotResults = null
    } finally {
      // Encerrar preview se foi iniciado por este script
      if (previewProcess) {
        previewProcess.kill()
        previewProcess = null
        console.log('   🛑 Preview encerrado')
      }
    }
  }
}

// ═══════════════════════════════════════════════════
// STEP 4 — Manifest Final
// ═══════════════════════════════════════════════════

console.log('📋 [4/4] Gerando manifest...')

const manifest = {
  generatedAt: new Date().toISOString(),
  project: config.project?.name || 'dock',
  version: config.version || '1.0.0',
  duration: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,

  contents: {
    'design-tokens.json': {
      description: 'Tokens em formato W3C DTCG — importar no Tokens Studio for Figma',
      tokenCount,
    },
    'component-inventory.json': {
      description: 'Inventário de componentes Vue com tipo, props e emits',
      componentCount: inventory.length,
    },
    'screenshots/': screenshotResults
      ? {
          description: 'Screenshots por viewport (mobile/tablet/desktop) em @2x',
          results: screenshotResults,
          success: screenshotResults.filter(r => r.status === 'ok').length,
          total: screenshotResults.length,
        }
      : { description: 'Não gerados nesta execução' },
  },

  instructions: {
    tokens: [
      '1. Instalar plugin "Tokens Studio for Figma" no Figma',
      '2. No plugin, Add new > File/Folder > selecionar design-tokens.json',
      '3. Tokens ficam disponíveis como variáveis no arquivo Figma',
      '4. Aplicar tokens em cores, fontes, espaçamentos e dimensões',
    ],
    screenshots: [
      '1. No Figma, criar página "Frontend Reference"',
      '2. Importar PNGs como imagens (File > Place Image)',
      '3. Organizar por viewport (mobile / tablet / desktop)',
      '4. Travar camada para não editar acidentalmente',
      '5. Usar como referência visual para reconstrução ou validação',
    ],
    inventory: [
      '1. Consultar component-inventory.json para saber quais componentes existem',
      '2. Verificar tipo (screen/section/component) para decidir granularidade no Figma',
      '3. Criar componentes Figma correspondentes aos que já existem no código',
      '4. Manter nomenclatura consistente entre Figma e frontend',
    ],
  },
}

const manifestPath = join(OUTPUT_DIR, 'manifest.json')
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8')

// ═══════════════════════════════════════════════════
// README para o designer
// ═══════════════════════════════════════════════════

const readmeContent = `# Pacote de Importação — Frontend → Figma

Gerado em: ${manifest.generatedAt}
Projeto: ${manifest.project}

## Conteúdo

| Arquivo | O que é | Como usar no Figma |
|---------|---------|-------------------|
| \`design-tokens.json\` | Tokens (cores, fontes, spacing, radius, sizes) | Importar via Tokens Studio plugin |
| \`component-inventory.json\` | Lista de componentes do frontend | Referência para criar componentes Figma |
| \`screenshots/\` | Capturas das telas em 3 viewports | Importar como imagem de referência |

## Como importar tokens no Figma

1. Instale o plugin **Tokens Studio for Figma** (gratuito)
2. Abra o plugin no Figma
3. Clique em **Add new** → **File/Folder**
4. Selecione o arquivo \`design-tokens.json\` deste pacote
5. Os tokens ficam disponíveis como variáveis para usar em qualquer frame

## Como usar os screenshots

1. No Figma, crie uma página chamada "Frontend Reference"
2. Use **File → Place Image** para importar os PNGs
3. Organize por viewport: mobile (375px), tablet (768px), desktop (1280px)
4. Trave a camada (Lock) para usar apenas como referência
5. Compare com seus frames para garantir fidelidade

## Como usar o inventário

O arquivo \`component-inventory.json\` lista todos os componentes Vue do projeto.
Use para saber:
- Quais telas existem (type: "screen")
- Quais seções compõem a landing (type: "section")
- Se o componente tem props, emits ou slots

Isso ajuda a decidir a granularidade dos componentes no Figma.

## Limitações

- Screenshots são imagens estáticas, não componentes editáveis
- Tokens não recriam composição visual automaticamente
- O inventário não inclui estados (hover, loading, error) — consultar Storybook
- Para fidelidade total, combinar este pacote com acesso ao frontend rodando
`

writeFileSync(join(OUTPUT_DIR, 'README.md'), readmeContent, 'utf-8')

// ═══════════════════════════════════════════════════
// Summary
// ═══════════════════════════════════════════════════

console.log(`   ✅ manifest.json + README.md gerados\n`)
console.log('═'.repeat(60))
console.log(`  ✅ Pacote pronto em: figma-import/`)
console.log(`  ⏱  Tempo: ${manifest.duration}`)
console.log('═'.repeat(60))
console.log()
console.log('  Arquivos gerados:')
console.log(`    📄 design-tokens.json    (${tokenCount} tokens)`)
console.log(`    📄 component-inventory.json (${inventory.length} componentes)`)
if (screenshotResults) {
  const ok = screenshotResults.filter(r => r.status === 'ok').length
  console.log(`    📸 screenshots/           (${ok} capturas)`)
}
console.log(`    📋 manifest.json`)
console.log(`    📖 README.md`)
console.log()
console.log('  Próximo passo:')
console.log('    Entregue a pasta figma-import/ ao designer.')
console.log('    Ele pode importar tokens via Tokens Studio e')
console.log('    screenshots como referência visual no Figma.')
console.log()
