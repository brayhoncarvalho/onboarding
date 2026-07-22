<script setup lang="ts">
import { ref } from 'vue'
import AuthHeader from './AuthHeader.vue'

const emit = defineEmits<{
  (e: 'confirmar', codigo: string): void
  (e: 'cancelar'): void
  (e: 'voltar'): void
  (e: 'navigate', action: 'sair' | 'emprestimos' | 'meus-dados'): void
}>()

const codigo = ref('847291')

function onConfirmar() {
  if (codigo.value.trim().length === 0) return
  emit('confirmar', codigo.value.trim())
}
</script>

<template>
  <div class="csms-screen">
    <AuthHeader @voltar="emit('voltar')" @navigate="(a) => emit('navigate', a)" />
    <main class="proposal-main">
      <div class="proposal-main__inner">
        <h1 class="csms-title">Código SMS</h1>
        <p class="csms-subtitle">Insira o código recebido por SMS para continuar.</p>
        <div class="proposal-form">
          <p class="csms-desc">Enviamos um SMS para seu celular. Você deve recebê-lo em alguns segundos. Insira o código abaixo e clique em <strong>Confirmar</strong>.</p>
          <div class="proposal-field">
            <label for="codigo-sms">Código SMS</label>
            <input id="codigo-sms" v-model="codigo" type="text" inputmode="numeric" maxlength="10"
              placeholder="Digite o código recebido" autocomplete="one-time-code"
              class="proposal-input proposal-input--center"
              @keydown.enter="onConfirmar" />
          </div>
          <button type="button" class="proposal-submit" :disabled="codigo.trim().length === 0" @click="onConfirmar">Confirmar</button>
          <button type="button" class="csms-btn-cancel" @click="emit('cancelar')">Cancelar</button>
          <p class="csms-note">Se não receber o SMS, toque em “Cancelar”, verifique o número e tente novamente.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.csms-screen { min-height: 100vh; background: var(--color-gray-50); display: flex; flex-direction: column; }
.proposal-main { flex: 1; padding: 32px 20px 64px; }
.proposal-main__inner { max-width: 520px; margin: 0 auto; }
.csms-title { font-family: "Bricolage Grotesque", sans-serif; font-size: 28px; font-weight: 700; color: var(--color-navy-800); margin: 0 0 6px; }
.csms-subtitle { font-family: "Instrument Sans", sans-serif; font-size: 16px; color: var(--color-navy-500); margin: 0 0 28px; }
.proposal-form { background: #ffffff; border: 1px solid var(--color-primary-100); border-radius: 20px; box-shadow: 0 8px 32px rgba(10, 22, 40, 0.06); padding: 28px 24px; display: flex; flex-direction: column; gap: 16px; }
.csms-desc { font-family: "Instrument Sans", sans-serif; font-size: 16px; color: var(--color-navy-500); line-height: 1.6; margin: 0; }
.proposal-field { display: flex; flex-direction: column; gap: 6px; }
.proposal-field label { font-family: "Instrument Sans", sans-serif; font-size: 16px; font-weight: 500; color: var(--color-navy-800); }
.proposal-input { height: 50px; border: 1.5px solid var(--color-primary-200); border-radius: 12px; padding: 0 14px; font-family: "Instrument Sans", sans-serif; font-size: 16px; color: var(--color-navy-800); background: #ffffff; outline: none; transition: border-color 0.15s; }
.proposal-input--center { text-align: center; font-size: 20px; font-weight: 600; letter-spacing: 0.3em; }
.proposal-input:focus { border-color: var(--color-primary-500); }
.proposal-submit { width: 100%; height: 52px; border: none; border-radius: 999px; background: var(--btn-primary-bg); color: var(--btn-primary-color); font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.proposal-submit:hover:not(:disabled) { background: var(--btn-primary-bg-hover); color: #ffffff; }
.proposal-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.csms-btn-cancel { width: 100%; height: 52px; border: 1.5px solid var(--color-primary-100); border-radius: 999px; background: transparent; color: var(--color-navy-800); font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.csms-btn-cancel:hover { background: var(--color-primary-50); }
.csms-note { font-family: "Instrument Sans", sans-serif; font-size: 16px; color: var(--color-navy-400); line-height: 1.55; margin: 0; }
@media (min-width: 640px) { .proposal-main { padding: 40px 32px 80px; } .csms-title { font-size: 32px; } .proposal-form { padding: 36px 40px; border-radius: 24px; } }
</style>