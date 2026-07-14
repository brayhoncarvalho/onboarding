#!/usr/bin/env node
/**
 * screenshots.mjs
 *
 * Gera screenshots oficiais de todas as telas/screens do projeto.
 * Esses screenshots servem como:
 *   1. Referência visual para o time de design (frontend → Figma)
 *   2. Base para visual regression testing
 *   3. Documentação viva do estado atual da UI
 *
 * Output: screenshots/ pasta com PNGs nomeados por tela
 *
 * Uso:
 *   npm run screenshots
 *   node scripts/screenshots.mjs --base-url=http://localhost:5173
 *
 * Requer: Playwright instalado (npx playwright install chromium)
 */

import { chromium } from 'playwright'
import { mkdirSync, existsSync, writeFileSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, '..')
const OUTPUT_DIR = join(PROJECT_ROOT, 'screenshots')

// === Config ===

const BASE_URL_ARG = process.argv.find(a => a.startsWith('--base-url='))
const BASE_URL = BASE_URL_ARG ? BASE_URL_ARG.split('=')[1] : 'http://localhost:5173'
const FAIL_ON_ERROR = process.argv.includes('--fail-on-error')

// Telas para capturar (baseado no roteamento por query string)
const SCREENS = [
  { name: 'landing', query: '?screen=landing', description: 'Landing Page completa' },
  { name: 'proposta', query: '?screen=proposta', description: 'Tela de Proposta' },
  { name: 'dados-acesso', query: '?screen=dados-acesso', description: 'Dados de Acesso' },
  { name: 'proposta-personalizada', query: '?screen=proposta-personalizada', description: 'Proposta Personalizada' },
  { name: 'cadastro', query: '?screen=cadastro', description: 'Cadastro' },
  { name: 'senha', query: '?screen=senha', description: 'Confirmação de Cadastro (Senha)' },
  { name: 'dados-pessoais', query: '?screen=dados-pessoais', description: 'Dados Pessoais' },
  { name: 'endereco-telefone', query: '?screen=endereco-telefone', description: 'Endereço e Telefone' },
  { name: 'envio-documentos', query: '?screen=envio-documentos', description: 'Envio de Documentos' },
  { name: 'documentos-status', query: '?screen=documentos-status', description: 'Status dos Documentos' },
  { name: 'concluir', query: '?screen=concluir', description: 'Proposta Concluída' },
  { name: 'area-cliente', query: '?screen=area-cliente', description: 'Área do Cliente' },
  { name: 'area-cliente-2', query: '?screen=area-cliente-2', description: 'Área do Cliente II' },
  { name: 'revisao', query: '?screen=revisao', description: 'Revisão da Proposta' },
  { name: 'autenticacao-sms', query: '?screen=autenticacao-sms', description: 'Autenticação SMS' },
  { name: 'codigo-sms', query: '?screen=codigo-sms', description: 'Código SMS' },
  { name: 'contrato', query: '?screen=contrato', description: 'Contrato' },
  { name: 'conclusao', query: '?screen=conclusao', description: 'Conclusão' },
]

// Viewports para capturar
const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
]

// === Main ===

async function main() {
  console.log('📸 Screenshots — Gerando capturas oficiais...\n')
  console.log(`   Base URL: ${BASE_URL}`)
  console.log(`   Output: ${OUTPUT_DIR}`)
  console.log(`   Telas: ${SCREENS.length}`)
  console.log(`   Viewports: ${VIEWPORTS.length}`)
  console.log(`   Total: ${SCREENS.length * VIEWPORTS.length} screenshots\n`)

  // Criar diretório de output
  if (existsSync(OUTPUT_DIR)) {
    rmSync(OUTPUT_DIR, { recursive: true, force: true })
  }
  mkdirSync(OUTPUT_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const results = []

  for (const viewport of VIEWPORTS) {
    const vpDir = join(OUTPUT_DIR, viewport.name)
    if (!existsSync(vpDir)) {
      mkdirSync(vpDir, { recursive: true })
    }

    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 2, // Retina quality
    })

    for (const screen of SCREENS) {
      const page = await context.newPage()
      const url = `${BASE_URL}/${screen.query}`

      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 })
        // Aguardar fontes e transições
        await page.waitForTimeout(1000)

        const filename = `${screen.name}.png`
        const filepath = join(vpDir, filename)

        // Screenshot full page (captura scroll completo)
        await page.screenshot({
          path: filepath,
          fullPage: true,
          type: 'png',
        })

        results.push({ screen: screen.name, viewport: viewport.name, status: '✅', filepath })
        console.log(`   ✅ ${viewport.name}/${filename}`)
      } catch (err) {
        results.push({ screen: screen.name, viewport: viewport.name, status: '❌', error: err.message })
        console.log(`   ❌ ${viewport.name}/${screen.name} — ${err.message}`)
      }

      await page.close()
    }

    await context.close()
  }

  await browser.close()

  // Gerar manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    screens: SCREENS,
    viewports: VIEWPORTS,
    results,
    summary: {
      total: results.length,
      success: results.filter(r => r.status === '✅').length,
      failed: results.filter(r => r.status === '❌').length,
    },
  }

  writeFileSync(
    join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
    'utf-8'
  )

  console.log('\n' + '─'.repeat(50))
  console.log(`✅ ${manifest.summary.success}/${manifest.summary.total} screenshots gerados`)
  if (manifest.summary.failed > 0) {
    console.log(`❌ ${manifest.summary.failed} falharam (servidor rodando em ${BASE_URL}?)`)
  }
  console.log(`📁 Output: ${OUTPUT_DIR}/`)
  console.log(`📋 Manifest: ${OUTPUT_DIR}/manifest.json`)

  if (FAIL_ON_ERROR && manifest.summary.failed > 0) {
    process.exit(1)
  }
}

main().catch(err => {
  console.error('\n❌ Erro:', err.message)
  console.error('   Certifique-se de que o dev server está rodando: npm run dev')
  process.exit(1)
})
