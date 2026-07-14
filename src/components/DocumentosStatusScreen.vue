<script setup lang="ts">

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'continuar'): void
}>()


// -- Cards dos documentos -----------------------------------
const docs = [
  {
    key: 'comprovante',
    label: 'COMPROVANTE DE\nRESIDÊNCIA',
    ariaLabel: 'Comprovante de residência enviado',
  },
  {
    key: 'selfie',
    label: 'SELFIE',
    ariaLabel: 'Selfie enviada',
  },
  {
    key: 'documento',
    label: 'DOCUMENTO\nIDENTIFICAÇÃO COM FOTO',
    ariaLabel: 'Documento de identificação enviado',
  },
]
</script>

<template>
  <div class="ds-screen">

    <header class="proposal-header">
      <div class="proposal-header__inner">
        <img src="/assets/dock-logo-color.png" alt="Dock" class="proposal-header__logo" />
        <button type="button" class="proposal-header__back" @click="emit('voltar')" aria-label="Voltar">
          <span aria-hidden="true">←</span> Voltar
        </button>
      </div>
    </header>

    <main class="proposal-main">
      <div class="proposal-main__inner">

        <ol class="proposal-steps" aria-label="Progresso da proposta">
          <li class="proposal-steps__item is-done"><span class="proposal-steps__mark" aria-hidden="true">✓</span><span class="proposal-steps__label">DADOS INICIAIS</span></li>
          <li class="proposal-steps__item is-done"><span class="proposal-steps__mark" aria-hidden="true">✓</span><span class="proposal-steps__label">PROPOSTA</span></li>
          <li class="proposal-steps__item is-done"><span class="proposal-steps__mark" aria-hidden="true">✓</span><span class="proposal-steps__label">DADOS COMPLEMENTARES</span></li>
          <li class="proposal-steps__item is-active"><span class="proposal-steps__mark" aria-hidden="true">4</span><span class="proposal-steps__label">DOCUMENTOS</span></li>
          <li class="proposal-steps__item"><span class="proposal-steps__mark" aria-hidden="true">5</span><span class="proposal-steps__label">CONCLUSÃO</span></li>
        </ol>

        <h1 class="ds-title">Documentos Enviados</h1>
        <p class="ds-subtitle">Seus documentos foram recebidos com sucesso.</p>

        <div class="proposal-form">
          <div v-for="doc in docs" :key="doc.key" class="ds-doc-card">
            <div class="ds-doc-card__check" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="ds-doc-card__body">
              <p class="ds-doc-card__name" v-html="doc.label.replace(/\n/g, '<br/>')" :aria-label="doc.ariaLabel"></p>
              <p class="ds-doc-card__status">Documento Enviado</p>
            </div>
            <button type="button" class="ds-doc-card__more" :aria-label="`Anexar mais arquivos — ${doc.ariaLabel}`">
              + Anexar mais
            </button>
          </div>

          <div class="dp-actions">
            <button type="button" class="dp-btn-back" @click="emit('voltar')">Anterior</button>
            <button type="button" class="proposal-submit" @click="emit('continuar')">Próximo</button>
          </div>

          <p class="proposal-safe"><span aria-hidden="true">✓</span>Documentos protegidos com criptografia SSL</p>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
.ds-screen { min-height: 100vh; background: #fafcfc; display: flex; flex-direction: column; }
.proposal-header { position: sticky; top: 0; z-index: 10; background: #fafcfc; border-bottom: 1px solid #e3edec; }
.proposal-header__inner { max-width: 1024px; margin: 0 auto; padding: 0 20px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
.proposal-header__logo { height: 24px; width: auto; }
.proposal-header__back { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border: 1.5px solid #e3edec; border-radius: 999px; background: transparent; color: #0b2528; font-family: 'Instrument Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
.proposal-header__back:hover { background: #f0f7f7; }
.proposal-main { flex: 1; padding: 32px 20px 64px; }
.proposal-main__inner { max-width: 680px; margin: 0 auto; }
.proposal-steps { list-style: none; margin: 0 0 40px; padding: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; }
.proposal-steps__item { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; padding-top: 2px; }
.proposal-steps__item:not(:last-child)::after { content: ''; position: absolute; top: 14px; left: calc(50% + 18px); right: calc(-50% + 18px); height: 1.5px; background: #e3edec; }
.proposal-steps__item.is-done::after { background: #063b3e; }
.proposal-steps__mark { width: 28px; height: 28px; border-radius: 999px; border: 1.5px solid #d5e4e2; background: #ffffff; color: #8aa0a0; display: inline-flex; align-items: center; justify-content: center; font-family: 'Bricolage Grotesque', sans-serif; font-size: 12px; font-weight: 700; position: relative; z-index: 1; }
.proposal-steps__item.is-done  .proposal-steps__mark { background: #063b3e; border-color: #063b3e; color: #ffffff; }
.proposal-steps__item.is-active .proposal-steps__mark { border-color: #063b3e; color: #063b3e; background: #ffffff; box-shadow: 0 0 0 3px #dff3f1; }
.proposal-steps__label { font-family: 'Bricolage Grotesque', sans-serif; font-size: 9px; font-weight: 600; color: #8aa0a0; text-align: center; line-height: 1.2; letter-spacing: 0.03em; }
.proposal-steps__item.is-active .proposal-steps__label { color: #0b2528; }
.proposal-steps__item.is-done  .proposal-steps__label { color: #5b6b6c; }
.ds-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: 28px; font-weight: 700; color: #0b2528; margin: 0 0 6px; }
.ds-subtitle { font-family: 'Instrument Sans', sans-serif; font-size: 15px; color: #5b6b6c; margin: 0 0 28px; }
.proposal-form { background: #ffffff; border: 1px solid #e3edec; border-radius: 20px; box-shadow: 0 8px 32px rgba(6,59,62,0.06); padding: 28px 24px; display: flex; flex-direction: column; gap: 14px; }
.ds-doc-card { display: flex; align-items: center; gap: 14px; background: #f5fafa; border: 1px solid #e3edec; border-radius: 14px; padding: 16px 18px; }
.ds-doc-card__check { width: 44px; height: 44px; border-radius: 50%; background: #063b3e; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ds-doc-card__body { flex: 1; min-width: 0; }
.ds-doc-card__name { font-family: 'Bricolage Grotesque', sans-serif; font-size: 13px; font-weight: 700; color: #0b2528; margin: 0 0 3px; line-height: 1.3; }
.ds-doc-card__status { font-family: 'Instrument Sans', sans-serif; font-size: 12px; color: #00a87a; font-weight: 600; margin: 0; }
.ds-doc-card__more { margin-left: auto; flex-shrink: 0; background: none; border: 1.5px solid #d5e4e2; border-radius: 999px; padding: 6px 14px; font-family: 'Instrument Sans', sans-serif; font-size: 12px; font-weight: 600; color: #063b3e; cursor: pointer; white-space: nowrap; }
.ds-doc-card__more:hover { background: #dff3f1; }
.dp-actions { display: flex; gap: 12px; margin-top: 8px; }
.dp-btn-back { flex: 0 0 140px; height: 52px; border: 1.5px solid #e3edec; border-radius: 999px; background: transparent; color: #0b2528; font-family: 'Bricolage Grotesque', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.dp-btn-back:hover { background: #f0f7f7; }
.proposal-submit { flex: 1; height: 52px; border: none; border-radius: 999px; background: #00d8d8; color: #042a2c; font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.proposal-submit:hover { background: #0fc5c5; }
.proposal-safe { display: flex; align-items: center; justify-content: center; gap: 6px; font-family: 'Instrument Sans', sans-serif; font-size: 11px; color: #8aa0a0; margin: 4px 0 0; }
@media (max-width: 639px) { .dp-actions { flex-direction: column-reverse; } .dp-btn-back { flex: none; width: 100%; } .proposal-submit { flex: none; width: 100%; min-height: 52px; } .ds-doc-card__more { font-size: 11px; padding: 5px 10px; } }
@media (min-width: 640px) { .proposal-header__inner { height: 72px; } .proposal-header__logo { height: 26px; } .proposal-main { padding: 40px 32px 80px; } .proposal-steps { margin-bottom: 48px; } .proposal-steps__label { font-size: 10px; } .ds-title { font-size: 32px; } .proposal-form { padding: 36px 40px; border-radius: 24px; } }
</style>
