<script setup lang="ts">
const emit = defineEmits<{
  (e: 'irParaArea'): void
  (e: 'voltar'): void
}>()
</script>

<template>
  <div class="cc-screen">
    <header class="proposal-header">
      <div class="proposal-header__inner">
        <img src="/assets/dock-logo-color.png" alt="Dock" class="proposal-header__logo" />
        <button type="button" class="proposal-header__back" @click="emit('voltar')" aria-label="Voltar">
          <span aria-hidden="true">←</span> Voltar
        </button>
      </div>
    </header>
    <main class="proposal-main" aria-live="polite" aria-atomic="true">
      <div class="proposal-main__inner">
        <ol class="proposal-steps" aria-label="Progresso da proposta">
          <li class="proposal-steps__item is-done"><span class="proposal-steps__mark">✓</span><span class="proposal-steps__label">DADOS INICIAIS</span></li>
          <li class="proposal-steps__item is-done"><span class="proposal-steps__mark">✓</span><span class="proposal-steps__label">PROPOSTA</span></li>
          <li class="proposal-steps__item is-done"><span class="proposal-steps__mark">✓</span><span class="proposal-steps__label">CADASTRO</span></li>
          <li class="proposal-steps__item is-done"><span class="proposal-steps__mark">✓</span><span class="proposal-steps__label">DOCUMENTOS</span></li>
          <li class="proposal-steps__item is-active"><span class="proposal-steps__mark">5</span><span class="proposal-steps__label">CONCLUSÃO</span></li>
        </ol>
        <div class="proposal-form cc-center">
          <div class="cc-icon" aria-hidden="true">
            <svg width="88" height="88" viewBox="0 0 88 88" fill="none"><circle cx="44" cy="44" r="44" fill="#dff3f1"/><circle cx="44" cy="44" r="34" fill="#b5e8e4"/><circle cx="44" cy="44" r="24" fill="#063b3e"/><path d="M33 44.5L40 51.5L55 37" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h1 class="cc-title">Em Análise</h1>
          <p class="cc-subtitle">Você concluiu o preenchimento da sua proposta!</p>
          <p class="cc-body">Vamos avaliar os documentos enviados e entraremos em contato se surgir alguma dúvida. Nos próximos dias, você receberá o resultado por e-mail.</p>
          <button type="button" class="proposal-submit" @click="emit('irParaArea')">Ir para a Área do Cliente</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.cc-screen { min-height: 100vh; background: #fafcfc; display: flex; flex-direction: column; }
.proposal-header { position: sticky; top: 0; z-index: 10; background: #fafcfc; border-bottom: 1px solid #e3edec; }
.proposal-header__inner { max-width: 1024px; margin: 0 auto; padding: 0 20px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
.proposal-header__back { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border: 1.5px solid #e3edec; border-radius: 999px; background: transparent; color: #0b2528; font-family: 'Instrument Sans', sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
.proposal-header__back:hover { background: #f0f7f7; }
.proposal-header__logo { height: 24px; width: auto; }
.proposal-main { flex: 1; padding: 32px 20px 64px; }
.proposal-main__inner { max-width: 560px; margin: 0 auto; }
.proposal-steps { list-style: none; margin: 0 0 40px; padding: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; }
.proposal-steps__item { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; padding-top: 2px; }
.proposal-steps__item:not(:last-child)::after { content: ""; position: absolute; top: 14px; left: calc(50% + 18px); right: calc(-50% + 18px); height: 1.5px; background: #e3edec; }
.proposal-steps__item.is-done::after { background: #063b3e; }
.proposal-steps__mark { width: 28px; height: 28px; border-radius: 999px; border: 1.5px solid #d5e4e2; background: #ffffff; color: #607374; display: inline-flex; align-items: center; justify-content: center; font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 700; position: relative; z-index: 1; }
.proposal-steps__item.is-done .proposal-steps__mark { background: #063b3e; border-color: #063b3e; color: #ffffff; }
.proposal-steps__item.is-active .proposal-steps__mark { border-color: #063b3e; color: #063b3e; background: #ffffff; box-shadow: 0 0 0 3px #dff3f1; }
.proposal-steps__label { font-family: "Bricolage Grotesque", sans-serif; font-size: 15px; font-weight: 600; color: #607374; text-align: center; line-height: 1.2; letter-spacing: 0.03em; }
.proposal-steps__item.is-active .proposal-steps__label { color: #0b2528; }
.proposal-steps__item.is-done .proposal-steps__label { color: #5b6b6c; }
.proposal-form { background: #ffffff; border: 1px solid #e3edec; border-radius: 20px; box-shadow: 0 8px 32px rgba(6,59,62,0.06); padding: 40px 32px; }
.cc-center { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 20px; }
.cc-icon { display: flex; align-items: center; justify-content: center; }
.cc-title { font-family: "Bricolage Grotesque", sans-serif; font-size: 28px; font-weight: 700; color: #0b2528; margin: 0; }
.cc-subtitle { font-family: "Bricolage Grotesque", sans-serif; font-size: 18px; font-weight: 600; color: #063b3e; margin: 0; }
.cc-body { font-family: "Instrument Sans", sans-serif; font-size: 16px; color: #5b6b6c; line-height: 1.6; margin: 0; max-width: 380px; }
.proposal-submit { width: 100%; max-width: 320px; height: 52px; border: none; border-radius: 999px; background: #00d8d8; color: #042a2c; font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.proposal-submit:hover { background: #0fc5c5; }
@media (min-width: 640px) { .proposal-header__inner { height: 72px; } .proposal-header__logo { height: 26px; } .proposal-main { padding: 40px 32px 80px; } .cc-title { font-size: 34px; } }
</style>