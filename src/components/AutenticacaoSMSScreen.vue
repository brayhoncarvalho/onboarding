<script setup lang="ts">
import { ref } from 'vue'
import AuthHeader from './AuthHeader.vue'

const emit = defineEmits<{
  (e: 'enviarSms'): void
  (e: 'voltar'): void
  (e: 'navigate', action: 'sair' | 'emprestimos' | 'meus-dados'): void
}>()

const telefones = [
  { id: 'tel1', numero: '+55 (63) 95448-9531', label: '+55 (63) 95448-9531' },
]
const telefoneSelecionado = ref('tel1')
const signatario = 'Brayhon Oliveira Carvalho'
</script>

<template>
  <div class="sms-screen">
    <AuthHeader @voltar="emit('voltar')" @navigate="(a) => emit('navigate', a)" />
    <main class="proposal-main">
      <div class="proposal-main__inner">
        <h1 class="sms-title">Autenticação por SMS</h1>
        <p class="sms-subtitle">Confirme sua identidade para acessar o contrato.</p>
        <div class="proposal-form">
          <p class="sms-desc">Para acessar este documento, você precisa confirmar sua identidade pelo celular. Escolha um número abaixo e clique em <strong>Enviar SMS</strong> para receber o código.</p>
          <div class="sms-info">
            <p><strong>Signatário:</strong> {{ signatario }}</p>
          </div>
          <fieldset class="sms-fieldset">
            <legend class="sms-legend">Selecione o número de telefone</legend>
            <label v-for="tel in telefones" :key="tel.id" class="sms-radio-row" :for="tel.id">
              <input :id="tel.id" v-model="telefoneSelecionado" type="radio" name="telefone" :value="tel.id" class="sms-radio-input" :aria-label="`Selecionar número ${tel.label}`" />
              <span class="sms-radio-custom" :class="{ 'is-selected': telefoneSelecionado === tel.id }" aria-hidden="true">
                <span v-if="telefoneSelecionado === tel.id" class="sms-radio-dot"></span>
              </span>
              <span class="sms-radio-label">{{ tel.label }}</span>
            </label>
          </fieldset>
          <button type="button" class="proposal-submit" :disabled="!telefoneSelecionado" @click="emit('enviarSms')">Enviar SMS</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.sms-screen { min-height: 100vh; background: var(--color-gray-50); display: flex; flex-direction: column; }
.proposal-main { flex: 1; padding: 32px 20px 64px; }
.proposal-main__inner { max-width: 520px; margin: 0 auto; }
.sms-title { font-family: "Bricolage Grotesque", sans-serif; font-size: 28px; font-weight: 700; color: var(--color-navy-800); margin: 0 0 6px; }
.sms-subtitle { font-family: "Instrument Sans", sans-serif; font-size: 16px; color: var(--color-navy-500); margin: 0 0 28px; }
.proposal-form { background: #ffffff; border: 1px solid var(--color-primary-100); border-radius: 20px; box-shadow: 0 8px 32px rgba(10, 22, 40, 0.06); padding: 28px 24px; display: flex; flex-direction: column; gap: 20px; }
.sms-desc { font-family: "Instrument Sans", sans-serif; font-size: 16px; color: var(--color-navy-500); line-height: 1.6; margin: 0; }
.sms-info { background: var(--color-primary-50); border: 1px solid var(--color-primary-100); border-radius: 12px; padding: 14px 16px; font-family: "Instrument Sans", sans-serif; font-size: 16px; color: var(--color-navy-800); }
.sms-fieldset { border: none; padding: 0; margin: 0; }
.sms-legend { font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 700; color: var(--color-navy-800); margin-bottom: 12px; letter-spacing: 0.04em; text-transform: uppercase; }
.sms-radio-row { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 12px 14px; border: 1.5px solid var(--color-primary-100); border-radius: 12px; transition: border-color 0.15s; }
.sms-radio-row:hover { border-color: var(--color-primary-500); }
.sms-radio-input { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
.sms-radio-custom { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid var(--color-primary-200); background: #ffffff; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: border-color 0.15s; }
.sms-radio-custom.is-selected { border-color: var(--color-primary-500); }
.sms-radio-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--btn-primary-bg); }
.sms-radio-label { font-family: "Instrument Sans", sans-serif; font-size: 16px; color: var(--color-navy-800); font-weight: 500; }
.proposal-submit { width: 100%; height: 52px; border: none; border-radius: 999px; background: var(--btn-primary-bg); color: var(--btn-primary-color); font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.proposal-submit:hover:not(:disabled) { background: var(--btn-primary-bg-hover); }
.proposal-submit:disabled { opacity: 0.6; cursor: not-allowed; }
@media (min-width: 640px) { .proposal-main { padding: 40px 32px 80px; } .sms-title { font-size: 32px; } .proposal-form { padding: 36px 40px; border-radius: 24px; } }
</style>