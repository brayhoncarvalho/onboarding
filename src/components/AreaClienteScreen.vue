<script setup lang="ts">
import AuthHeader from './AuthHeader.vue'

const emit = defineEmits<{
  (e: 'irParaEmail'): void
  (e: 'cancelar'): void
  (e: 'voltar'): void
  (e: 'navigate', action: 'sair' | 'emprestimos' | 'meus-dados'): void
}>()

const props = withDefaults(
  defineProps<{ valor?: string; condicoes?: string }>(),
  { valor: 'R$ 3.500,00', condicoes: '18x de R$ 209,32' }
)

const hoje = new Date()
const dataAtual = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

const emprestimo = {
  dataSolicitacao: dataAtual,
  status: 'Análise',
}
</script>

<template>
  <div class="ac-screen">
    <AuthHeader back-label="Voltar" @voltar="emit('voltar')" @navigate="(a) => emit('navigate', a)" />
    <main class="proposal-main">
      <div class="proposal-main__inner">
        <h1 class="ac-title">Meus Empréstimos</h1>
        <div class="ac-card">
          <div class="ac-card__topbar" aria-hidden="true"></div>
          <div class="ac-card__body">
            <div class="ac-row"><span class="ac-row__label">Valor</span><span class="ac-row__value">{{ props.valor }}</span></div>
            <hr class="ac-row__divider" />
            <div class="ac-row"><span class="ac-row__label">Condições</span><span class="ac-row__value">{{ props.condicoes }}</span></div>
            <hr class="ac-row__divider" />
            <div class="ac-row"><span class="ac-row__label">Data de Solicitação</span><span class="ac-row__value">{{ emprestimo.dataSolicitacao }}</span></div>
            <hr class="ac-row__divider" />
            <div class="ac-row ac-row--top">
              <span class="ac-row__label">Status</span>
              <div class="ac-status">
                <span aria-hidden="true">
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none"><circle cx="9.5" cy="9.5" r="8" stroke="#00d8d8" stroke-width="3" fill="white"/><line x1="9.5" y1="5" x2="9.5" y2="10" stroke="#00d8d8" stroke-width="2" stroke-linecap="round"/><line x1="9.5" y1="10" x2="13" y2="12.5" stroke="#00d8d8" stroke-width="2" stroke-linecap="round"/></svg>
                </span>
                <span class="ac-row__value">{{ emprestimo.status }}</span>
              </div>
            </div>
            <div class="ac-actions">
              <button type="button" class="ac-btn ac-btn--dark" aria-label="Cancelar solicitação" @click="emit('cancelar')">
                <span class="ac-btn__circle" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><line x1="2" y1="2" x2="10" y2="10" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="2" x2="2" y2="10" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
                </span>
                Cancelar
              </button>
            </div>
          </div>
        </div>
        <button type="button" class="proposal-submit" @click="emit('irParaEmail')">Ir para E-mail de Assinatura</button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.ac-screen { min-height: 100vh; background: #fafcfc; display: flex; flex-direction: column; }
.proposal-main { flex: 1; padding: 32px 20px 64px; }
.proposal-main__inner { max-width: 520px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
.ac-title { font-family: "Bricolage Grotesque", sans-serif; font-size: 28px; font-weight: 700; color: #00d8d8; margin: 0; }
.ac-card { background: #ffffff; border: 1px solid #e3edec; border-radius: 20px; box-shadow: 0 8px 32px rgba(6,59,62,0.06); overflow: hidden; }
.ac-card__topbar { height: 6px; background: #00d8d8; }
.ac-card__body { padding: 20px 24px; }
.ac-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; gap: 12px; }
.ac-row--top { align-items: flex-start; }
.ac-row__label { font-family: "Instrument Sans", sans-serif; font-size: 16px; font-weight: 600; color: #00d8d8; flex-shrink: 0; }
.ac-row__value { font-family: "Instrument Sans", sans-serif; font-size: 16px; color: #5b6b6c; text-align: right; }
.ac-row__divider { border: none; border-top: 1px solid #e3edec; margin: 0; }
.ac-status { display: flex; align-items: center; gap: 8px; }
.ac-actions { padding-top: 16px; }
.ac-btn { display: inline-flex; align-items: center; gap: 8px; height: 42px; padding: 0 18px; border: none; border-radius: 999px; cursor: pointer; font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; transition: background 0.15s; }
.ac-btn--dark { background: #444746; }
.ac-btn--dark:hover { background: #333534; }
.ac-btn__circle { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; background: rgba(255,255,255,0.2); border-radius: 50%; flex-shrink: 0; }
.proposal-submit { width: 100%; height: 52px; border: none; border-radius: 999px; background: #00d8d8; color: #042a2c; font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.proposal-submit:hover { background: #0fc5c5; }
@media (min-width: 640px) { .proposal-main { padding: 40px 32px 80px; } .ac-title { font-size: 32px; } }
</style>