<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{ initialStep?: 'tipo' | 'upload' }>(),
  { initialStep: 'tipo' }
)

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'continuar'): void
}>()

// -- Estado dos uploads -------------------------------------
type DocStatus = 'idle' | 'selected' | 'uploading' | 'done' | 'error'

interface DocState {
  file: File | null
  status: DocStatus
  preview: string | null
  mockName: string
  error: string
}

const makeDoc = (mockName = ''): DocState => ({
  file: null,
  status: mockName ? 'done' : 'idle',
  preview: null,
  mockName,
  error: '',
})

const docFrente = ref<DocState>(makeDoc('rg_frente.jpg'))
const docVerso  = ref<DocState>(makeDoc('rg_verso.jpg'))

const handleFileSelect = (doc: ReturnType<typeof ref<DocState>>, e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  if (!file) return
  doc.value.file = file
  doc.value.mockName = file.name
  doc.value.status = 'done'
  doc.value.error = ''
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (ev) => { doc.value.preview = ev.target?.result as string }
    reader.readAsDataURL(file)
  } else {
    doc.value.preview = null
  }
  input.value = ''
}

const removeDoc = (doc: ReturnType<typeof ref<DocState>>) => {
  doc.value = makeDoc()
}

const errors = ref<Record<string, string>>({ docFrente: '' })
const submitted = ref(false)

// -- Etapa de seleção do tipo de documento ------------------
const step = ref<'tipo' | 'upload'>(props.initialStep)
const tipoDoc = ref<'ci' | 'cnh' | null>(null)
const tipoDocLabel = computed(() =>
  tipoDoc.value === 'cnh' ? 'Carteira Nacional de Habilitação' : 'Cédula de Identidade'
)
const tipoDocHint = computed(() =>
  tipoDoc.value === 'cnh'
    ? 'CNH aberta, frente e verso legíveis.'
    : 'RG — frente e verso obrigatórios.'
)
const proceedToUpload = () => { if (tipoDoc.value) step.value = 'upload' }

const validate = (): boolean => {
  errors.value.docFrente = docFrente.value.status === 'idle' ? 'Anexe a frente do documento.' : ''
  return !Object.values(errors.value).some(e => e !== '')
}

const handleProximo = () => {
  submitted.value = true
  if (!validate()) return
  emit('continuar')
}
</script>

<template>
  <div class="ed-screen">

    <header class="proposal-header">
      <div class="proposal-header__inner">
        <img src="/assets/dock-logo-color.png" alt="Dock" class="proposal-header__logo" />
        <button type="button" class="proposal-header__back" @click="step === 'upload' ? (step = 'tipo') : emit('voltar')" aria-label="Voltar">
          <span aria-hidden="true">←</span> Voltar
        </button>
      </div>
    </header>

    <main class="proposal-main">
      <div class="proposal-main__inner">

        <!-- Stepper: passos 1-3 done, passo 4 ativo -->
        <ol class="proposal-steps" aria-label="Progresso da proposta">
          <li class="proposal-steps__item is-done"><span class="proposal-steps__mark" aria-hidden="true">✓</span><span class="proposal-steps__label">DADOS INICIAIS</span></li>
          <li class="proposal-steps__item is-done"><span class="proposal-steps__mark" aria-hidden="true">✓</span><span class="proposal-steps__label">PROPOSTA</span></li>
          <li class="proposal-steps__item is-done"><span class="proposal-steps__mark" aria-hidden="true">✓</span><span class="proposal-steps__label">CADASTRO</span></li>
          <li class="proposal-steps__item is-active"><span class="proposal-steps__mark" aria-hidden="true">4</span><span class="proposal-steps__label">DOCUMENTOS</span></li>
          <li class="proposal-steps__item"><span class="proposal-steps__mark" aria-hidden="true">5</span><span class="proposal-steps__label">CONCLUSÃO</span></li>
        </ol>

        <h1 class="ed-title">Envio de Documentos</h1>
        <p class="ed-subtitle">Anexe os documentos necessários para análise da sua proposta.</p>

        <!-- Passo 1: Seleção do tipo de documento -->
        <div v-if="step === 'tipo'" class="proposal-form ed-tipo-form">
          <p class="ed-tipo-label">Selecione o tipo de documento de identificação que será enviado:</p>
          <div class="doc-type-options" role="radiogroup" aria-label="Tipo de documento">
            <label class="doc-type-option">
              <input type="radio" name="doc-tipo" value="ci" v-model="tipoDoc" class="doc-sr-only" />
              <div :class="['doc-type-card', tipoDoc === 'ci' ? 'doc-type-card--selected' : '']">
                <span class="doc-type-card__radio" :class="tipoDoc === 'ci' ? 'doc-type-card__radio--on' : ''" aria-hidden="true">
                  <span v-if="tipoDoc === 'ci'" class="doc-type-card__radio-dot"></span>
                </span>
                <div class="doc-type-card__text">
                  <p class="doc-type-card__title">Cédula de Identidade</p>
                  <p class="doc-type-card__hint">RG — frente e verso obrigatórios</p>
                </div>
              </div>
            </label>
            <label class="doc-type-option">
              <input type="radio" name="doc-tipo" value="cnh" v-model="tipoDoc" class="doc-sr-only" />
              <div :class="['doc-type-card', tipoDoc === 'cnh' ? 'doc-type-card--selected' : '']">
                <span class="doc-type-card__radio" :class="tipoDoc === 'cnh' ? 'doc-type-card__radio--on' : ''" aria-hidden="true">
                  <span v-if="tipoDoc === 'cnh'" class="doc-type-card__radio-dot"></span>
                </span>
                <div class="doc-type-card__text">
                  <p class="doc-type-card__title">Carteira Nacional de Habilitação</p>
                  <p class="doc-type-card__hint">CNH aberta, frente e verso legíveis</p>
                </div>
              </div>
            </label>
          </div>
          <button type="button" class="proposal-submit" :disabled="!tipoDoc" @click="proceedToUpload">Continuar</button>
        </div>

        <!-- Passo 2: Upload dos documentos -->
        <div v-if="step === 'upload'" class="proposal-form">

          <!-- Documento de identificação -->
          <div class="doc-card" :class="{ 'doc-card--error': submitted && errors.docFrente }">
            <div class="doc-card__header">
              <svg class="doc-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              <div>
                <p class="doc-card__name">{{ tipoDocLabel }}</p>
                <p class="doc-card__hint">{{ tipoDocHint }}</p>
              </div>
            </div>

            <p class="doc-card__sub-label">Frente</p>
            <div v-if="docFrente.status !== 'idle'" class="doc-card__preview-area">
              <img v-if="docFrente.preview" :src="docFrente.preview" alt="Frente do documento" class="doc-card__preview-img" />
              <div v-else class="doc-card__file-name">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d8d8" stroke-width="1.5" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span>{{ docFrente.file?.name ?? docFrente.mockName }}</span>
              </div>
              <button type="button" class="doc-card__remove" @click="removeDoc(docFrente)" aria-label="Remover frente">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <label v-if="docFrente.status === 'idle'" class="doc-card__btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
              Anexar frente
              <input type="file" accept="image/*,application/pdf" class="doc-sr-only" @change="handleFileSelect(docFrente, $event)" />
            </label>
            <label v-else class="doc-card__change-link">
              Trocar arquivo
              <input type="file" accept="image/*,application/pdf" class="doc-sr-only" @change="handleFileSelect(docFrente, $event)" />
            </label>

            <p class="doc-card__sub-label doc-card__sub-label--mt">Verso <span class="et-optional">(opcional)</span></p>
            <div v-if="docVerso.status !== 'idle'" class="doc-card__preview-area">
              <img v-if="docVerso.preview" :src="docVerso.preview" alt="Verso do documento" class="doc-card__preview-img" />
              <div v-else class="doc-card__file-name">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d8d8" stroke-width="1.5" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span>{{ docVerso.file?.name ?? docVerso.mockName }}</span>
              </div>
              <button type="button" class="doc-card__remove" @click="removeDoc(docVerso)" aria-label="Remover verso">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <label v-if="docVerso.status === 'idle'" class="doc-card__btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
              Anexar verso
              <input type="file" accept="image/*,application/pdf" class="doc-sr-only" @change="handleFileSelect(docVerso, $event)" />
            </label>
            <label v-else class="doc-card__change-link">
              Trocar arquivo
              <input type="file" accept="image/*,application/pdf" class="doc-sr-only" @change="handleFileSelect(docVerso, $event)" />
            </label>
            <p v-if="submitted && errors.docFrente" class="field-error" role="alert">{{ errors.docFrente }}</p>
          </div>

          <!-- CTAs -->
          <div class="dp-actions">
            <button type="button" class="dp-btn-back" @click="step = 'tipo'">Anterior</button>
            <button type="button" class="proposal-submit" @click="handleProximo">Próximo</button>
          </div>

          <p class="proposal-safe"><span aria-hidden="true">✓</span>Documentos protegidos com criptografia SSL</p>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
.ed-screen { min-height: 100vh; background: var(--color-gray-50); display: flex; flex-direction: column; }

.proposal-header { position: sticky; top: 0; z-index: 10; background: var(--color-gray-50); border-bottom: 1px solid var(--color-primary-100); }
.proposal-header__inner { max-width: 1024px; margin: 0 auto; padding: 0 20px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
.proposal-header__logo { height: 24px; width: auto; }
.proposal-header__back { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border: 1.5px solid var(--color-primary-100); border-radius: 999px; background: transparent; color: var(--color-navy-800); font-family: 'Instrument Sans', sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
.proposal-header__back:hover { background: var(--color-primary-50); }

.proposal-main { flex: 1; padding: 32px 20px 64px; }
.proposal-main__inner { max-width: 640px; margin: 0 auto; }

.proposal-steps { list-style: none; margin: 0 0 40px; padding: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; }
.proposal-steps__item { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; padding-top: 2px; }
.proposal-steps__item:not(:last-child)::after { content: ''; position: absolute; top: 14px; left: calc(50% + 18px); right: calc(-50% + 18px); height: 1.5px; background: var(--color-primary-100); }
.proposal-steps__item.is-done::after { background: var(--btn-primary-bg); }
.proposal-steps__mark { width: 28px; height: 28px; border-radius: 999px; border: 1.5px solid var(--color-primary-200); background: #ffffff; color: var(--color-navy-400); display: inline-flex; align-items: center; justify-content: center; font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 700; position: relative; z-index: 1; }
.proposal-steps__item.is-done  .proposal-steps__mark { background: var(--btn-primary-bg); border-color: var(--color-primary-500); color: var(--btn-primary-color); }
.proposal-steps__item.is-active .proposal-steps__mark { border-color: var(--color-primary-500); color: var(--color-primary-500); background: #ffffff; box-shadow: 0 0 0 3px var(--color-primary-100); }
.proposal-steps__label { font-family: 'Bricolage Grotesque', sans-serif; font-size: 11px; font-weight: 600; color: var(--color-navy-400); text-align: center; line-height: 1.2; letter-spacing: 0.03em; }
.proposal-steps__item.is-active .proposal-steps__label { color: var(--color-navy-800); }
.proposal-steps__item.is-done  .proposal-steps__label { color: var(--color-navy-500); }

.ed-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: 28px; font-weight: 700; color: var(--color-navy-800); margin: 0 0 6px; }
.ed-subtitle { font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: var(--color-navy-500); margin: 0 0 28px; line-height: 1.5; }

.proposal-form { background: #ffffff; border: 1px solid var(--color-primary-100); border-radius: 20px; box-shadow: 0 8px 32px rgba(10, 22, 40, 0.06); padding: 28px 24px; display: flex; flex-direction: column; gap: 16px; }

/* ── Doc card ── */
.doc-card { border: 1.5px solid var(--color-primary-100); border-radius: 16px; padding: 18px 20px; display: flex; flex-direction: column; gap: 10px; transition: border-color 0.15s; }
.doc-card--error { border-color: #dc3545; }
.doc-card__header { display: flex; align-items: flex-start; gap: 12px; }
.doc-card__icon { width: 28px; height: 28px; flex-shrink: 0; color: var(--color-primary-500); }
.doc-card__name { font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 700; color: var(--color-navy-800); margin: 0; }
.doc-card__hint { font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: var(--color-navy-500); margin: 3px 0 0; }
.doc-card__sub-label { font-family: 'Instrument Sans', sans-serif; font-size: 16px; font-weight: 600; color: var(--color-navy-500); margin: 0; }
.doc-card__sub-label--mt { margin-top: 8px; }
.et-optional { font-weight: 400; color: var(--color-navy-400); }

.doc-card__preview-area { display: flex; align-items: center; gap: 10px; background: var(--color-primary-50); border: 1px solid var(--color-primary-100); border-radius: 10px; padding: 10px 12px; }
.doc-card__preview-img { width: 56px; height: 56px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
.doc-card__file-name { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: var(--color-navy-800); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.doc-card__remove { margin-left: auto; flex-shrink: 0; background: transparent; border: none; cursor: pointer; color: #dc3545; padding: 4px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.doc-card__remove:hover { background: #fee2e2; }

.doc-card__btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border: 1.5px dashed var(--color-primary-200); border-radius: 10px; background: var(--color-primary-50); color: var(--color-primary-500); font-family: 'Instrument Sans', sans-serif; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.15s; align-self: flex-start; }
.doc-card__btn:hover { background: var(--color-primary-100); border-color: var(--color-primary-500); }

.doc-card__change-link { display: inline-flex; cursor: pointer; font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: var(--color-navy-500); text-decoration: underline; text-underline-offset: 2px; align-self: flex-start; }
.doc-card__change-link:hover { color: var(--color-primary-500); }
.doc-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

.field-error { font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: #dc3545; margin: 0; }

.dp-actions { display: flex; gap: 12px; margin-top: 8px; }
.dp-btn-back { flex: 0 0 140px; height: 52px; border: 1.5px solid var(--color-primary-100); border-radius: 999px; background: transparent; color: var(--color-navy-800); font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.dp-btn-back:hover { background: var(--color-primary-50); }
.proposal-submit { flex: 1; height: 52px; border: none; border-radius: 999px; background: var(--btn-primary-bg); color: var(--btn-primary-color); font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.proposal-submit:hover { background: var(--btn-primary-bg-hover); color: #ffffff; }
.proposal-submit:disabled { opacity: 0.45; cursor: not-allowed; }

/* -- Tipo de documento -- */
.ed-tipo-form { display: flex; flex-direction: column; gap: 20px; }
.ed-tipo-label { font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: var(--color-navy-500); margin: 0; }
.ed-tipo-form .proposal-submit { width: 100%; flex: none; }
.doc-type-options { display: flex; flex-direction: column; gap: 12px; }
.doc-type-option { display: block; cursor: pointer; }
.doc-type-card { display: flex; align-items: center; gap: 16px; background: #ffffff; border: 1.5px solid var(--color-primary-100); border-radius: 14px; padding: 18px 20px; transition: border-color 0.15s, background 0.15s; }
.doc-type-card--selected { background: var(--color-primary-100); border-color: var(--color-primary-500); border-width: 2px; }
.doc-type-card__radio { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--color-primary-200); background: #ffffff; display: inline-flex; align-items: center; justify-content: center; transition: border-color 0.15s; }
.doc-type-card--selected .doc-type-card__radio, .doc-type-card__radio--on { border-color: var(--color-primary-500); }
.doc-type-card__radio-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--btn-primary-bg); }
.doc-type-card__text { display: flex; flex-direction: column; gap: 2px; }
.doc-type-card__title { font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 600; color: var(--color-navy-800); margin: 0; }
.doc-type-card__hint { font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: var(--color-navy-400); margin: 0; }

.proposal-safe { display: flex; align-items: center; justify-content: center; gap: 6px; font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: var(--color-navy-400); margin: 4px 0 0; }

@media (max-width: 639px) { .dp-actions { flex-direction: column-reverse; } .dp-btn-back { flex: none; width: 100%; } .proposal-submit { flex: none; width: 100%; min-height: 52px; } }
@media (min-width: 640px) { .proposal-header__inner { height: 72px; } .proposal-header__logo { height: 26px; } .proposal-main { padding: 40px 32px 80px; } .proposal-steps { margin-bottom: 48px; } .proposal-steps__label { font-size: 13px; } .ed-title { font-size: 32px; } .proposal-form { padding: 36px 40px; border-radius: 24px; } }
</style>
