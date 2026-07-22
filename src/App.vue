<script setup lang="ts">
import { ref, computed, watchEffect, watch, nextTick } from 'vue'

const menuOpen = ref(false)
const closeMenu = () => { menuOpen.value = false }
const menuTriggerRef = ref<HTMLButtonElement | null>(null)

watch(menuOpen, (isOpen) => {
  nextTick(() => {
    if (isOpen) {
      document.querySelector<HTMLElement>('.landing-nav__drawer-links a')?.focus()
    } else {
      menuTriggerRef.value?.focus()
    }
  })
})

const trapFocus = (e: KeyboardEvent) => {
  if (e.key === 'Escape') { closeMenu(); return }
  if (e.key !== 'Tab') return
  const focusable = Array.from(
    document.querySelectorAll<HTMLElement>('.landing-nav__drawer a, .landing-nav__drawer button')
  )
  if (!focusable.length) return
  if (e.shiftKey && document.activeElement === focusable[0]) {
    e.preventDefault(); focusable[focusable.length - 1].focus()
  } else if (!e.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
    e.preventDefault(); focusable[0].focus()
  }
}
import HeroSection from './components/HeroSection.vue'
import SimuladorSection from './components/SimuladorSection.vue'
import ComoFuncionaSection from './components/ComoFuncionaSection.vue'
import BeneficiosSection from './components/BeneficiosSection.vue'
import FooterSection from './components/FooterSection.vue'
import PropostaScreen from './components/PropostaScreen.vue'
import AccessDataScreen from './components/AccessDataScreen.vue'
import SenhaScreen from './components/SenhaScreen.vue'
import PropostaPersonalizadaScreen from './components/PropostaPersonalizadaScreen.vue'
import CadastroScreen from './components/CadastroScreen.vue'
import DadosPessoaisScreen from './components/DadosPessoaisScreen.vue'
import EnderecoTelefoneScreen from './components/EnderecoTelefoneScreen.vue'
import EnvioDocumentosScreen from './components/EnvioDocumentosScreen.vue'
import DocumentosStatusScreen from './components/DocumentosStatusScreen.vue'
import ConcluirScreen from './components/ConcluirScreen.vue'
import AreaClienteScreen from './components/AreaClienteScreen.vue'
import AreaClienteIIScreen from './components/AreaClienteIIScreen.vue'
import RevisaoScreen from './components/RevisaoScreen.vue'
import AutenticacaoSMSScreen from './components/AutenticacaoSMSScreen.vue'
import CodigoSMSScreen from './components/CodigoSMSScreen.vue'
import ContratoScreen from './components/ContratoScreen.vue'
import ConclusaoScreen from './components/ConclusaoScreen.vue'
import MeusDadosScreen from './components/MeusDadosScreen.vue'
import GmailSimuladorScreen from './components/GmailSimuladorScreen.vue'
import CapturaSelfieScreen from './components/CapturaSelfieScreen.vue'

type Screen = 'landing' | 'proposta' | 'dados-acesso' | 'senha' | 'proposta-personalizada' | 'dados-pessoais' | 'endereco-telefone' | 'captura-selfie' | 'envio-documentos' | 'documentos-status' | 'concluir' | 'area-cliente' | 'area-cliente-2' | 'email-simulacao' | 'revisao' | 'autenticacao-sms' | 'codigo-sms' | 'contrato' | 'conclusao' | 'cadastro' | 'meus-dados'
type AccessChannel = 'email' | 'celular'

type AccessPayload = {
  email: string
  celular: string
  canal: AccessChannel
}

interface SimulacaoState {
  valor: number
  parcelas: number
}

interface OfertaState {
  installments: number
  amount: number
  rate: number
}

const fallbackScreen: Screen = 'landing'
const validScreens = new Set<Screen>(['landing', 'proposta', 'dados-acesso', 'senha', 'proposta-personalizada', 'dados-pessoais', 'endereco-telefone', 'captura-selfie', 'envio-documentos', 'documentos-status', 'concluir', 'area-cliente', 'area-cliente-2', 'email-simulacao', 'revisao', 'autenticacao-sms', 'codigo-sms', 'contrato', 'conclusao', 'cadastro', 'meus-dados'])
const accessPayload = ref<AccessPayload | null>(null)

// Estado da simulação — alimentado pelo SimuladorSection e propagado para as próximas telas
const simulacao = ref<SimulacaoState>({ valor: 3500, parcelas: 18 })
const oferta = ref<OfertaState>({ installments: 18, amount: 209, rate: 0.0275 })

const fmtBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const propostaValor    = computed(() => fmtBRL(simulacao.value.valor))
const propostaParcela  = computed(() => fmtBRL(oferta.value.amount))
const propostaPrazo    = computed(() => `${oferta.value.installments} meses`)
const propostaCondicoes = computed(() => `${oferta.value.installments}x de ${fmtBRL(oferta.value.amount)}`)
const propostaTaxaNominal = computed(() => {
  const m = (oferta.value.rate * 100).toFixed(2).replace('.', ',')
  const a = ((Math.pow(1 + oferta.value.rate, 12) - 1) * 100).toFixed(2).replace('.', ',')
  return `${m}% a.m./ ${a}% a.a.`
})
const propostaTaxaEfetiva = computed(() => {
  const rCet = oferta.value.rate + 0.001
  const m = (rCet * 100).toFixed(2).replace('.', ',')
  const a = ((Math.pow(1 + rCet, 12) - 1) * 100).toFixed(2).replace('.', ',')
  return `${m}% a.m./ ${a}% a.a.`
})

const getScreenFromQuery = (): Screen => {
  const screen = new URLSearchParams(window.location.search).get('screen')

  if (screen && validScreens.has(screen as Screen)) {
    return screen as Screen
  }

  return fallbackScreen
}

const updateScreenQuery = (screen: Screen) => {
  const url = new URL(window.location.href)
  url.searchParams.set('screen', screen)
  url.hash = ''
  window.history.replaceState({}, '', url)
}

const currentScreen = ref<Screen>(getScreenFromQuery())

const screenTitles: Record<Screen, string> = {
  'landing': 'Dock — Empréstimo Online',
  'proposta': 'Solicitar Proposta — Dock',
  'dados-acesso': 'Dados de Acesso — Dock',
  'senha': 'Confirmação de Cadastro — Dock',
  'proposta-personalizada': 'Proposta Personalizada — Dock',
  'dados-pessoais': 'Dados Pessoais — Dock',
  'endereco-telefone': 'Endereço e Telefone — Dock',
  'captura-selfie': 'Captura de Selfie — Dock',
  'envio-documentos': 'Envio de Documentos — Dock',
  'documentos-status': 'Documentos Enviados — Dock',
  'concluir': 'Em Análise — Dock',
  'area-cliente': 'Meus Empréstimos — Dock',
  'area-cliente-2': 'Meus Empréstimos — Dock',
  'email-simulacao': 'E-mail de Simulação — Dock',
  'revisao': 'Revisão de Contrato — Dock',
  'autenticacao-sms': 'Autenticação por SMS — Dock',
  'codigo-sms': 'Código SMS — Dock',
  'contrato': 'Contrato de Crédito — Dock',
  'conclusao': 'Parabéns! — Dock',
  'meus-dados': 'Meus Dados — Dock',
  'cadastro': 'Solicitar Proposta — Dock',
}

const setScreen = (screen: Screen) => {
  currentScreen.value = screen
  updateScreenQuery(screen)
  document.title = screenTitles[screen]
  window.scrollTo({ top: 0, behavior: 'smooth' })
  nextTick(() => {
    const h1 = document.querySelector<HTMLElement>('h1')
    if (h1) {
      if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1')
      h1.focus({ preventScroll: true })
    }
  })
}

const goToProposta = (data?: { valor: number; parcelas: number }) => {
  if (data) simulacao.value = data
  setScreen('proposta')
}

const goToLanding = () => {
  setScreen('landing')
}

const goToDadosAcesso = () => {
  setScreen('dados-acesso')
}

const goToSenha = (payload: AccessPayload) => {
  accessPayload.value = payload
  setScreen('senha')
}

const goToPropostaPersonalizada = () => {
  setScreen('proposta-personalizada')
}

const goToDadosPessoais = (offer?: OfertaState & { valor?: number }) => {
  if (offer) {
    const { valor, ...ofertaData } = offer
    oferta.value = ofertaData
    if (valor !== undefined) simulacao.value.valor = valor
  }
  setScreen('dados-pessoais')
}

const goToEnderecoTelefone = () => {
  setScreen('endereco-telefone')
}

const goToCapturaSelfie = () => {
  setScreen('captura-selfie')
}

const goToEnvioDocumentos = () => {
  setScreen('envio-documentos')
}

const goToEnvioDocumentosUpload = () => {
  setScreen('envio-documentos')
  envioDocStep.value = 'upload'
}

const envioDocStep = ref<'tipo' | 'upload'>('tipo')

watchEffect(() => {
  if (currentScreen.value !== 'envio-documentos') envioDocStep.value = 'tipo'
})

const goToDocumentosStatus = () => {
  setScreen('documentos-status')
}

const goToConcluir = () => {
  setScreen('concluir')
}

const goToAreaCliente = () => {
  setScreen('area-cliente')
}

const goToAreaClienteII = () => {
  setScreen('area-cliente-2')
}

const goToEmailSimulacao = () => {
  setScreen('email-simulacao')
}

const goToRevisao = () => {
  setScreen('revisao')
}

const goToAutenticacaoSMS = () => {
  setScreen('autenticacao-sms')
}

const goToCodigoSMS = () => {
  setScreen('codigo-sms')
}

const goToContrato = () => {
  setScreen('contrato')
}

const goToConclusao = () => {
  setScreen('conclusao')
}

const handleAuthNav = (action: 'sair' | 'emprestimos' | 'meus-dados') => {
  if (action === 'sair') goToLanding()
  else if (action === 'emprestimos') goToAreaCliente()
  else if (action === 'meus-dados') setScreen('meus-dados')
}
</script>

<template>
  <div class="min-h-screen w-full bg-white">
    <a href="#main-content" class="skip-link">Ir para o conteúdo principal</a>
    <template v-if="currentScreen === 'landing'">
      <header class="landing-nav">
        <div class="landing-nav__inner">
          <img src="/assets/dock-logo-color.png" alt="Dock" class="landing-nav__logo" />
          <nav class="landing-nav__links" aria-label="Navegação principal">
            <a href="#simulador">Empréstimo</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#beneficios">Segurança</a>
            <a href="#footer">Ajuda</a>
          </nav>
          <button class="landing-nav__cta" type="button" @click="goToProposta">Simular grátis</button>
          <button ref="menuTriggerRef" class="landing-nav__btn" :aria-label="menuOpen ? 'Fechar menu' : 'Abrir menu'" :aria-expanded="menuOpen" :aria-controls="menuOpen ? 'mobile-menu' : undefined" @click="menuOpen = !menuOpen">
            <span :class="{ 'is-open-top': menuOpen }"></span>
            <span :class="{ 'is-open-mid': menuOpen }"></span>
          </button>
        </div>

        <!-- Menu mobile drawer -->
        <div v-if="menuOpen" id="mobile-menu" class="landing-nav__drawer" role="dialog" aria-modal="true" aria-label="Menu de navegação" @keydown="trapFocus">
          <nav class="landing-nav__drawer-links" aria-label="Navegação mobile">
            <a href="#simulador" @click="closeMenu">Empréstimo</a>
            <a href="#como-funciona" @click="closeMenu">Como funciona</a>
            <a href="#beneficios" @click="closeMenu">Segurança</a>
            <a href="#footer" @click="closeMenu">Ajuda</a>
          </nav>
          <button class="landing-nav__drawer-cta" type="button" @click="closeMenu(); goToProposta()">Simular grátis</button>
        </div>
      </header>

      <div id="main-content" class="landing-above-fold">
        <HeroSection @simular="goToProposta" />
        <SimuladorSection @solicitar="goToProposta" />
      </div>

      <section class="landing-trust" aria-label="Diferenciais de confiança">
        <div class="landing-trust__inner">
          <p><span aria-hidden="true">✓</span>Sem compromisso</p>
          <p><span aria-hidden="true">✓</span>Resposta rápida</p>
          <p><span aria-hidden="true">✓</span>Instituição regulada</p>
          <p><span aria-hidden="true">✓</span>Dados protegidos</p>
        </div>
      </section>

      <ComoFuncionaSection @contrate="goToProposta" />
      <BeneficiosSection />
      <FooterSection />
    </template>
    <template v-else-if="currentScreen === 'proposta'">
      <PropostaScreen :valorInicial="simulacao.valor" @voltar="goToLanding" @continuar="goToDadosAcesso" />
    </template>
    <template v-else-if="currentScreen === 'dados-acesso'">
      <AccessDataScreen @voltar="goToProposta" @enviar="goToSenha" />
    </template>
    <template v-else-if="currentScreen === 'senha'">
      <SenhaScreen
        :email="accessPayload?.email ?? ''"
        :celular="accessPayload?.celular ?? ''"
        :canal="accessPayload?.canal ?? 'celular'"
        @voltar="goToDadosAcesso"
        @continuar="goToPropostaPersonalizada"
      />
    </template>
    <template v-else-if="currentScreen === 'proposta-personalizada'">
      <PropostaPersonalizadaScreen
        :valorSolicitado="simulacao.valor"
        @voltar="goToSenha(accessPayload ?? { email: '', celular: '', canal: 'celular' })"
        @continuar="goToDadosPessoais"
      />
    </template>
    <template v-else-if="currentScreen === 'dados-pessoais'">
      <DadosPessoaisScreen @voltar="goToPropostaPersonalizada" @continuar="goToEnderecoTelefone" />
    </template>
    <template v-else-if="currentScreen === 'endereco-telefone'">
      <EnderecoTelefoneScreen @voltar="goToDadosPessoais" @continuar="goToEnvioDocumentos" />
    </template>
    <template v-else-if="currentScreen === 'captura-selfie'">
      <CapturaSelfieScreen @voltar="goToEnvioDocumentos" @continuar="goToDocumentosStatus" />
    </template>
    <template v-else-if="currentScreen === 'envio-documentos'">
      <EnvioDocumentosScreen :initialStep="envioDocStep" @voltar="goToEnderecoTelefone" @continuar="goToCapturaSelfie" />
    </template>
    <template v-else-if="currentScreen === 'documentos-status'">
      <DocumentosStatusScreen @voltar="goToCapturaSelfie" @continuar="goToConcluir" />
    </template>
    <template v-else-if="currentScreen === 'concluir'">
      <ConcluirScreen @irParaArea="goToAreaCliente" @voltar="goToDocumentosStatus" />
    </template>
    <template v-else-if="currentScreen === 'area-cliente'">
      <AreaClienteScreen
        :valor="propostaValor"
        :condicoes="propostaCondicoes"
        @irParaEmail="goToEmailSimulacao"
        @cancelar="goToLanding"
        @voltar="goToConcluir"
        @navigate="handleAuthNav"
      />
    </template>
    <template v-else-if="currentScreen === 'email-simulacao'">
      <GmailSimuladorScreen
        :valor="propostaValor"
        :condicoes="propostaCondicoes"
        nome="Brayhon Carvalho"
        @gerarContrato="goToAreaClienteII"
        @voltar="goToAreaCliente"
      />
    </template>
    <template v-else-if="currentScreen === 'area-cliente-2'">
      <AreaClienteIIScreen
        :valor="propostaValor"
        :condicoes="propostaCondicoes"
        @gerarContrato="goToRevisao"
        @cancelar="goToLanding"
        @voltar="goToEmailSimulacao"
        @navigate="handleAuthNav"
      />
    </template>
    <template v-else-if="currentScreen === 'revisao'">
      <RevisaoScreen
        :valor="propostaValor"
        :prazo="propostaPrazo"
        :parcela="propostaParcela"
        :taxaNominal="propostaTaxaNominal"
        :taxaEfetiva="propostaTaxaEfetiva"
        @gerarContrato="goToAutenticacaoSMS"
        @voltar="goToAreaClienteII"
        @navigate="handleAuthNav"
      />
    </template>
    <template v-else-if="currentScreen === 'autenticacao-sms'">
      <AutenticacaoSMSScreen @enviarSms="goToCodigoSMS" @voltar="goToRevisao" @navigate="handleAuthNav" />
    </template>
    <template v-else-if="currentScreen === 'codigo-sms'">
      <CodigoSMSScreen @confirmar="goToContrato" @cancelar="goToAutenticacaoSMS" @voltar="goToAutenticacaoSMS" @navigate="handleAuthNav" />
    </template>
    <template v-else-if="currentScreen === 'contrato'">
      <ContratoScreen
        :valor="propostaValor"
        :prazo="oferta.installments"
        :parcela="propostaParcela"
        :taxaNominalMensal="(oferta.rate * 100).toFixed(2).replace('.', ',') + '% a.m.'"
        :taxaNominalAnual="((Math.pow(1 + oferta.rate, 12) - 1) * 100).toFixed(2).replace('.', ',') + '% a.a.'"
        @continuar="goToConclusao"
        @voltar="goToCodigoSMS"
        @navigate="handleAuthNav"
      />
    </template>
    <template v-else-if="currentScreen === 'conclusao'">
      <ConclusaoScreen :valor="propostaValor" @voltar="goToLanding" @navigate="handleAuthNav" />
    </template>
    <template v-else-if="currentScreen === 'meus-dados'">
      <MeusDadosScreen @voltar="goToAreaCliente" @navigate="handleAuthNav" />
    </template>
    <template v-else-if="currentScreen === 'cadastro'">
      <CadastroScreen @voltar="goToLanding" @continuar="goToDadosAcesso" />
    </template>
  </div>
</template>

<style>
.landing-nav {
  width: 100%;
  background: #fafcfc;
  border-bottom: 1px solid #e3edec;
}

.landing-nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
  gap: 12px;
}

.landing-nav__logo {
  height: 24px;
  width: auto;
  display: block;
}

.landing-nav__links {
  display: none;
  align-items: center;
  gap: 32px;
}

.landing-nav__links a {
  color: #3c4c4d;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
}

.landing-nav__links a:hover {
  color: #00d8d8;
}

.landing-nav__cta {
  display: none;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 24px;
  border: none;
  border-radius: 999px;
  background: #00d8d8;
  color: #ffffff;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.landing-nav__cta:hover {
  background: #052c2f;
}

.landing-nav__btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eff6f5;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
}

.landing-nav__btn span {
  display: block;
  height: 2px;
  width: 18px;
  border-radius: 2px;
  background: #00d8d8;
  transition: transform 0.2s, opacity 0.2s;
}

.landing-nav__btn span.is-open-top  { transform: translateY(3px) rotate(45deg); }
.landing-nav__btn span.is-open-mid  { transform: translateY(-3px) rotate(-45deg); }

/* ── Mobile drawer ── */
.landing-nav__drawer {
  background: #fafcfc;
  border-top: 1px solid #e3edec;
  padding: 16px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.landing-nav__drawer-links {
  display: flex;
  flex-direction: column;
}

.landing-nav__drawer-links a {
  padding: 14px 4px;
  border-bottom: 1px solid #f0f7f7;
  color: #0b2528;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
}

.landing-nav__drawer-links a:last-child { border-bottom: none; }
.landing-nav__drawer-links a:active { color: #00d8d8; }

.landing-nav__drawer-cta {
  margin-top: 16px;
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 999px;
  background: #00d8d8;
  color: #ffffff;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.landing-nav__drawer-cta:hover { background: #052c2f; }

@media (min-width: 1024px) {
  .landing-nav__drawer { display: none; }
}

.landing-above-fold {
  max-width: 1240px;
  margin: 0 auto;
  padding: 28px 20px 36px;
  display: grid;
  gap: 28px;
}

.landing-trust {
  border-top: 1px solid #e3edec;
  border-bottom: 1px solid #e3edec;
  background: #ffffff;
}

.landing-trust__inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 18px 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.landing-trust__inner p {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 14px;
  color: #3c4c4d;
}

.landing-trust__inner p span {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #dff3f1;
  color: #0fa3a3;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 480px) {
  .landing-nav__inner { padding: 0 24px; }
  .landing-above-fold { padding: 36px 24px 44px; }
  .landing-trust__inner {
    padding: 20px 24px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}

@media (min-width: 1024px) {
  .landing-nav__inner {
    padding: 0 40px;
    height: 80px;
  }

  .landing-nav__links,
  .landing-nav__cta {
    display: inline-flex;
  }

  .landing-nav__btn {
    display: none;
  }

  .landing-above-fold {
    --landing-column-height: 620px;
    display: grid;
    grid-template-columns: 1fr 460px;
    align-items: stretch;
    max-width: 1240px;
    margin: 0 auto;
    padding: 56px 40px 56px;
    gap: 80px;
  }

  .landing-trust__inner {
    max-width: 1240px;
    padding: 24px 40px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 22px;
  }
}

/* Skip link — visualmente oculto até receber foco (WCAG 2.4.1) */
.skip-link {
  position: absolute;
  top: -100%;
  left: 8px;
  z-index: 9999;
  padding: 10px 16px;
  background: #052c2f;
  color: #ffffff;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  border-radius: 0 0 8px 8px;
  text-decoration: none;
  transition: top 0.1s;
}
.skip-link:focus { top: 0; }
</style>
