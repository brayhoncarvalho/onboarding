<script setup lang="ts">
const emit = defineEmits<{
  (e: 'gerarContrato'): void
  (e: 'voltar'): void
}>()

const props = withDefaults(
  defineProps<{ valor?: string; condicoes?: string; nome?: string }>(),
  { valor: 'R$ 3.500,00', condicoes: '18x de R$ 209,32', nome: 'Brayhon Carvalho' }
)

const dataEmail = new Date().toLocaleDateString('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
</script>

<template>
  <div class="gm-screen" aria-label="Simulação de e-mail — Gmail">

    <!-- Barra superior estilo Gmail -->
    <header class="gm-topbar" aria-hidden="true">
      <div class="gm-topbar__left">
        <button type="button" class="gm-menu-btn" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
        <div class="gm-logo">
          <svg class="gm-logo-icon" viewBox="52 42 88 66" width="32" height="24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6z"/>
            <path fill="#34a853" d="M120 108h14c3.32 0 6-2.68 6-6V59l-20 15"/>
            <path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"/>
            <path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92"/>
            <path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2"/>
          </svg>
          <span class="gm-logo-text">Gmail</span>
        </div>
      </div>
      <div class="gm-topbar__search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#5f6368" stroke-width="2"/><line x1="17" y1="17" x2="21" y2="21" stroke="#5f6368" stroke-width="2" stroke-linecap="round"/></svg>
      </div>
      <div class="gm-topbar__right">
        <div class="gm-avatar-sm">BC</div>
      </div>
    </header>

    <div class="gm-layout">

      <!-- Sidebar estilo Gmail (decorativa) -->
      <aside class="gm-sidebar" aria-hidden="true">
        <button class="gm-compose">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#3c4043"/></svg>
          Escrever
        </button>
        <nav class="gm-nav">
          <div class="gm-nav__item gm-nav__item--active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" fill="#1a73e8"/></svg>
            <span>Caixa de entrada</span>
            <span class="gm-badge">1</span>
          </div>
          <div class="gm-nav__item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14z" fill="#444746"/></svg>
            <span>Enviados</span>
          </div>
          <div class="gm-nav__item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" fill="#444746"/></svg>
            <span>Rascunhos</span>
          </div>
        </nav>
      </aside>

      <!-- Painel principal do e-mail -->
      <main class="gm-main" role="main">

        <!-- Barra de ação do e-mail -->
        <div class="gm-email-topbar">
          <button type="button" class="gm-back-btn" @click="emit('voltar')" aria-label="Voltar para a caixa de entrada">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#444746"/></svg>
          </button>
          <div class="gm-email-topbar__actions" aria-hidden="true">
            <button class="gm-icon-btn" title="Arquivar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5z" fill="#444746"/></svg>
            </button>
            <button class="gm-icon-btn" title="Spam">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#444746"/></svg>
            </button>
            <button class="gm-icon-btn" title="Excluir">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#444746"/></svg>
            </button>
          </div>
        </div>

        <!-- Conteúdo do e-mail -->
        <div class="gm-email">

          <h1 class="gm-email__subject">
            Empréstimo Pré-Aprovado
            <span class="gm-email__inbox-tag">Caixa de entrada</span>
          </h1>

          <!-- Cabeçalho do remetente -->
          <div class="gm-email__header">
            <div class="gm-email__avatar" aria-hidden="true">DT</div>
            <div class="gm-email__meta">
              <div class="gm-email__from-row">
                <span class="gm-email__from-name">Dock Tech</span>
                <span class="gm-email__from-email">&lt;noreply@dock.tech&gt;</span>
                <span class="gm-email__date">{{ dataEmail }}</span>
              </div>
              <div class="gm-email__to-row">
                Para: <strong>{{ props.nome }}</strong>
              </div>
            </div>
            <div class="gm-email__header-actions" aria-hidden="true">
              <button class="gm-icon-btn" title="Responder">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" fill="#444746"/></svg>
              </button>
              <button class="gm-icon-btn" title="Mais opções">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.5" fill="#444746"/><circle cx="12" cy="12" r="1.5" fill="#444746"/><circle cx="12" cy="19" r="1.5" fill="#444746"/></svg>
              </button>
            </div>
          </div>

          <!-- Corpo do e-mail -->
          <div class="gm-email__body">

            <div class="gm-email__body-header" aria-hidden="true">
              <div class="gm-email__brand-logo">
                <img src="/assets/dock-logo-color.png" alt="Dock" class="gm-email__brand-img" />
              </div>
            </div>

            <p class="gm-email__greeting">Olá, {{ props.nome.split(' ')[0] }}!</p>

            <p class="gm-email__text">
              Temos uma ótima notícia para você. Após análise do seu perfil, sua proposta de crédito foi
              <strong>pré-aprovada</strong> e o valor já está disponível para liberação imediata.
            </p>

            <!-- Card de resumo da oferta -->
            <div class="gm-offer-card">
              <p class="gm-offer-card__label">Resumo da sua oferta</p>
              <div class="gm-offer-card__row">
                <span>Valor aprovado</span>
                <strong>{{ props.valor }}</strong>
              </div>
              <div class="gm-offer-card__divider"></div>
              <div class="gm-offer-card__row">
                <span>Condições</span>
                <strong>{{ props.condicoes }}</strong>
              </div>
              <div class="gm-offer-card__divider"></div>
              <div class="gm-offer-card__row">
                <span>Prazo para assinatura</span>
                <strong>7 dias corridos</strong>
              </div>
            </div>

            <p class="gm-email__text">
              Para concluir a liberação do crédito, basta revisar e assinar o contrato digital.
              O processo é rápido, seguro e 100% online.
            </p>

            <!-- CTA principal -->
            <div class="gm-email__cta-wrap">
              <button type="button" class="gm-email__cta" @click="emit('gerarContrato')">
                Gerar Contrato
              </button>
            </div>

            <p class="gm-email__small">
              Se você não solicitou este empréstimo, ignore este e-mail ou entre em contato com nossa
              central pelo <strong>0800 123 4567</strong>. Este é um e-mail automático, por favor
              não responda diretamente.
            </p>

            <div class="gm-email__footer">
              <div class="gm-email__footer-logo" aria-hidden="true">
                <img src="/assets/dock-logo-color.png" alt="Dock" class="gm-email__footer-img" />
                <span>Dock Instituição de Pagamentos S.A.</span>
              </div>
              <p>CNPJ 13.370.835/0001-85 · São Paulo – SP · Regulada pelo Banco Central do Brasil</p>
              <p>Você está recebendo este e-mail porque possui uma proposta ativa em nosso sistema.</p>
            </div>

          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ── Reset / Screen ── */
.gm-screen {
  min-height: 100vh;
  background: #f6f8fc;
  display: flex;
  flex-direction: column;
  font-family: 'Google Sans', 'Roboto', system-ui, sans-serif;
}

/* ── Topbar ── */
.gm-topbar {
  height: 64px;
  background: #f6f8fc;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  border-bottom: 1px solid #e8eaed;
  flex-shrink: 0;
}

.gm-topbar__left { display: flex; align-items: center; gap: 4px; min-width: 200px; }

.gm-menu-btn {
  width: 40px; height: 40px;
  border: none; background: transparent; cursor: pointer;
  border-radius: 50%; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 4px;
}
.gm-menu-btn span { width: 18px; height: 2px; background: #5f6368; border-radius: 2px; }

.gm-logo { display: flex; align-items: center; gap: 6px; margin-left: 4px; }
.gm-logo-icon { display: block; flex-shrink: 0; }
.gm-logo-text { font-size: 22px; font-weight: 400; color: #5f6368; letter-spacing: -0.3px; }

.gm-topbar__search {
  flex: 1;
  max-width: 720px;
  height: 46px;
  background: #eaf1fb;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  color: #5f6368;
  font-size: 16px;
}

.gm-topbar__right { margin-left: auto; display: flex; align-items: center; flex-shrink: 0; }

.gm-avatar-sm {
  width: 34px; height: 34px;
  border-radius: 50%;
  background: #063b3e;
  color: #00d8d8;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

/* ── Layout ── */
.gm-layout { display: flex; flex: 1; overflow: hidden; }

/* ── Sidebar ── */
.gm-sidebar {
  width: 256px;
  flex-shrink: 0;
  padding: 8px 0;
  display: none;
}

@media (min-width: 900px) { .gm-sidebar { display: block; } }

.gm-compose {
  display: flex; align-items: center; gap: 12px;
  margin: 8px 12px 16px;
  padding: 16px 24px;
  background: #c2e7ff;
  border: none; border-radius: 16px;
  font-size: 14px; font-weight: 600; color: #001d35;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  transition: background 0.15s;
}
.gm-compose:hover { background: #a8d8f5; }

.gm-nav { padding: 0 8px; }

.gm-nav__item {
  display: flex; align-items: center; gap: 16px;
  padding: 0 16px;
  height: 36px;
  border-radius: 0 18px 18px 0;
  cursor: pointer;
  font-size: 14px; color: #202124;
}

.gm-nav__item--active { background: #d3e3fd; font-weight: 700; color: #1a73e8; }

.gm-badge {
  margin-left: auto;
  font-size: 12px;
  font-weight: 700;
  color: #202124;
}

/* ── Main ── */
.gm-main {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  min-width: 0;
}

/* ── Topbar do e-mail ── */
.gm-email-topbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-bottom: 1px solid #e8eaed;
  background: #f6f8fc;
  position: sticky;
  top: 0;
  z-index: 2;
}

.gm-back-btn {
  width: 40px; height: 40px; border: none; background: transparent;
  border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.gm-back-btn:hover { background: #e8eaed; }

.gm-email-topbar__actions { display: flex; gap: 4px; margin-left: 8px; }

.gm-icon-btn {
  width: 36px; height: 36px; border: none; background: transparent;
  border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.gm-icon-btn:hover { background: #e8eaed; }

/* ── E-mail ── */
.gm-email {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px 32px 48px;
}

@media (max-width: 639px) { .gm-email { padding: 16px 16px 32px; } }

.gm-email__subject {
  font-size: 22px;
  font-weight: 400;
  color: #202124;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.gm-email__inbox-tag {
  font-size: 11px;
  font-weight: 500;
  background: #e8eaed;
  color: #5f6368;
  border-radius: 4px;
  padding: 2px 8px;
  letter-spacing: 0.01em;
}

/* Cabeçalho do remetente */
.gm-email__header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8eaed;
  margin-bottom: 24px;
}

.gm-email__avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: #063b3e;
  color: #00d8d8;
  font-size: 15px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.gm-email__meta { flex: 1; min-width: 0; }

.gm-email__from-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
}

.gm-email__from-name { font-size: 14px; font-weight: 600; color: #202124; }
.gm-email__from-email { font-size: 12px; color: #5f6368; }
.gm-email__date { font-size: 12px; color: #5f6368; margin-left: auto; white-space: nowrap; }

@media (max-width: 639px) {
  .gm-email__date { margin-left: 0; display: block; }
}

.gm-email__to-row { font-size: 12px; color: #5f6368; margin-top: 2px; }

.gm-email__header-actions { display: flex; gap: 4px; flex-shrink: 0; }

/* Corpo */
.gm-email__body {
  max-width: 600px;
}

.gm-email__body-header {
  margin-bottom: 28px;
}

.gm-email__brand-logo {
  display: flex; align-items: center;
}

.gm-email__brand-img {
  height: 28px;
  width: auto;
  display: block;
}

.gm-email__footer-img {
  height: 18px;
  width: auto;
  display: block;
}

.gm-email__greeting {
  font-size: 18px;
  font-weight: 600;
  color: #202124;
  margin: 0 0 16px;
}

.gm-email__text {
  font-size: 15px;
  color: #3c4043;
  line-height: 1.65;
  margin: 0 0 20px;
}

/* Card de oferta */
.gm-offer-card {
  background: #f8fffe;
  border: 1.5px solid #b5e8e4;
  border-radius: 12px;
  padding: 20px 24px;
  margin: 4px 0 24px;
}

.gm-offer-card__label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8aa0a0;
  margin: 0 0 14px;
}

.gm-offer-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14px;
  color: #3c4043;
}

.gm-offer-card__row strong { color: #063b3e; font-size: 15px; }

.gm-offer-card__divider { height: 1px; background: #e8eaed; }

/* CTA */
.gm-email__cta-wrap {
  margin: 28px 0;
}

.gm-email__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 32px;
  border: none;
  border-radius: 999px;
  background: #00d8d8;
  color: #063b3e;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.01em;
  transition: background 0.15s;
  box-shadow: 0 2px 8px rgba(0,216,216,0.30);
}

.gm-email__cta:hover { background: #00c5c5; }

.gm-email__small {
  font-size: 12px;
  color: #80868b;
  line-height: 1.6;
  margin: 0 0 32px;
}

/* Footer */
.gm-email__footer {
  border-top: 1px solid #e8eaed;
  padding-top: 20px;
}

.gm-email__footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #3c4043;
  margin-bottom: 8px;
}

.gm-email__footer p {
  font-size: 11px;
  color: #9aa0a6;
  margin: 4px 0;
  line-height: 1.5;
}
</style>
