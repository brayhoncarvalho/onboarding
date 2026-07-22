<script setup lang="ts">
import AuthHeader from './AuthHeader.vue'

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'navigate', action: 'sair' | 'emprestimos' | 'meus-dados'): void
}>()

const props = withDefaults(
  defineProps<{ valor?: string }>(),
  { valor: 'R$ 3.500,00' }
)

const depositoDate = (() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
})()
</script>

<template>
  <div class="cls-screen">
    <AuthHeader back-label="Pagina inicial" @voltar="emit('voltar')" @navigate="(a) => emit('navigate', a)" />
    <main class="proposal-main">
      <div class="proposal-main__inner">
        <div class="proposal-form cls-center">
          <div class="cls-icon" aria-hidden="true">
            <svg width="80" height="80" viewBox="0 0 88 88" fill="none"><circle cx="44" cy="44" r="44" fill="#e7f2ff"/><circle cx="44" cy="44" r="34" fill="#d2e6ff"/><circle cx="44" cy="44" r="24" fill="#00d8d8"/><path d="M33 44.5L40 51.5L55 37" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="14" cy="20" r="3" fill="#eeff88"/><circle cx="74" cy="20" r="3" fill="#eeff88"/><line x1="14" y1="10" x2="14" y2="16" stroke="#eeff88" stroke-width="2" stroke-linecap="round"/><line x1="11" y1="13" x2="17" y2="13" stroke="#eeff88" stroke-width="2" stroke-linecap="round"/><line x1="74" y1="10" x2="74" y2="16" stroke="#eeff88" stroke-width="2" stroke-linecap="round"/><line x1="71" y1="13" x2="77" y2="13" stroke="#eeff88" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
          <h1 class="cls-title">Parabéns!</h1>
          <p class="cls-body">Seu pedido de empréstimo foi concluído com sucesso. O valor de <strong>{{ props.valor }}</strong> será depositado em sua conta em instantes.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.cls-screen { min-height: 100vh; background: var(--color-gray-50); display: flex; flex-direction: column; }
.proposal-main { flex: 1; padding: 32px 20px 64px; display: flex; align-items: center; justify-content: center; }
.proposal-main__inner { max-width: 560px; width: 100%; }
.proposal-form { background: #ffffff; border: 1px solid var(--color-primary-100); border-radius: 20px; box-shadow: 0 8px 32px rgba(10, 22, 40, 0.06); padding: 48px 32px; }
.cls-center { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 24px; }
.cls-icon { display: flex; animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.cls-title { font-family: "Bricolage Grotesque", sans-serif; font-size: 36px; font-weight: 700; color: var(--color-navy-800); margin: 0; }
.cls-body { font-family: "Instrument Sans", sans-serif; font-size: 16px; color: var(--color-navy-500); line-height: 1.6; margin: 0; max-width: 360px; }
@keyframes pop-in { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
@media (min-width: 640px) { .proposal-main { padding: 40px 32px 80px; } .cls-title { font-size: 42px; } }
</style>