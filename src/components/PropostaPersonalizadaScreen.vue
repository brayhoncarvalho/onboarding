<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'continuar', offer: { installments: number; amount: number; rate: number; valor: number }): void
}>()

const props = withDefaults(
  defineProps<{ valorSolicitado?: number }>(),
  { valorSolicitado: 3500 }
)

const taxaPorPrazo: Record<number, number> = {
  12: 0.0249,
  16: 0.0265,
  18: 0.0275,
  24: 0.0299,
  36: 0.0349,
}

const calcPmt = (pv: number, n: number, i: number): number =>
  (pv * (i * Math.pow(1 + i, n))) / (Math.pow(1 + i, n) - 1)

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const fmtNoDecimals = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

// Valor editável pelo usuário
const loanAmount = ref(props.valorSolicitado)
const pendingAmount = ref(props.valorSolicitado)
const isEditing = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const focusInput = () => {
  inputRef.value?.focus()
  inputRef.value?.select()
}

const loanAmountFormatted = computed(() => fmtNoDecimals(loanAmount.value))

const onFocus = (e: FocusEvent) => {
  isEditing.value = true
  pendingAmount.value = loanAmount.value
  ;(e.target as HTMLInputElement).value = String(loanAmount.value)
  ;(e.target as HTMLInputElement).select()
}

const onBlur = (e: FocusEvent) => {
  // Salva o digitado em pendingAmount mas NÃO commita em loanAmount
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  const parsed = parseInt(raw, 10) || loanAmount.value
  const clamped = Math.min(Math.max(parsed, 250), 200000)
  pendingAmount.value = clamped
  // Exibe o valor pendente formatado no input enquanto botão Aplicar está visível
  ;(e.target as HTMLInputElement).value = fmtNoDecimals(clamped)
}

const applyAmount = () => {
  loanAmount.value = pendingAmount.value
  isEditing.value = false
}

const cancelEdit = () => {
  pendingAmount.value = loanAmount.value
  isEditing.value = false
  if (inputRef.value) inputRef.value.value = fmtNoDecimals(loanAmount.value)
}

const onLoanAmountInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  input.value = input.value.replace(/[^\d]/g, '')
  const parsed = parseInt(input.value, 10) || 0
  pendingAmount.value = Math.min(Math.max(parsed, 0), 200000)
}

const INSTALLMENT_OPTIONS = [12, 16, 18, 24, 36]
const selectedInstallments = ref(18)

const selectedRate = computed(() => taxaPorPrazo[selectedInstallments.value] ?? 0.0275)

const selectedRateFormatted = computed(() =>
  `${(selectedRate.value * 100).toFixed(2).replace('.', ',')}%`
)

const offers = computed(() =>
  INSTALLMENT_OPTIONS.map(n => ({
    n,
    label: `${n}x`,
    rate: taxaPorPrazo[n],
    rateLabel: `${(taxaPorPrazo[n] * 100).toFixed(2).replace('.', ',')}% juros a.m.`,
    amount: fmt(calcPmt(loanAmount.value, n, taxaPorPrazo[n])),
  }))
)

const selectedOffer = computed(
  () => offers.value.find(o => o.n === selectedInstallments.value) ?? offers.value[2]
)

const handleContinue = () => {
  emit('continuar', {
    installments: selectedInstallments.value,
    amount: calcPmt(loanAmount.value, selectedInstallments.value, selectedRate.value),
    rate: selectedRate.value,
    valor: loanAmount.value,
  })
}
</script>

<template>
  <div class="pp-screen">

    <!-- Header — mesmo padrão da PropostaScreen -->
    <header class="proposal-header">
      <div class="proposal-header__inner">
        <img src="/assets/dock-logo-color.png" alt="Dock" class="proposal-header__logo" />
        <button
          type="button"
          class="proposal-header__back"
          @click="emit('voltar')"
          aria-label="Voltar"
        >
          <span aria-hidden="true">←</span>
          Voltar
        </button>
      </div>
    </header>

    <main class="proposal-main">
      <div class="proposal-main__inner">

        <!-- Stepper: passo 1 concluído, passo 2 ativo -->
        <ol class="proposal-steps" aria-label="Progresso da proposta">
          <li class="proposal-steps__item is-done">
            <span class="proposal-steps__mark" aria-hidden="true">✓</span>
            <span class="proposal-steps__label">DADOS INICIAIS</span>
          </li>
          <li class="proposal-steps__item is-active">
            <span class="proposal-steps__mark" aria-hidden="true">2</span>
            <span class="proposal-steps__label">PROPOSTA</span>
          </li>
          <li class="proposal-steps__item">
            <span class="proposal-steps__mark" aria-hidden="true">3</span>
            <span class="proposal-steps__label">CADASTRO</span>
          </li>
          <li class="proposal-steps__item">
            <span class="proposal-steps__mark" aria-hidden="true">4</span>
            <span class="proposal-steps__label">DOCUMENTOS</span>
          </li>
          <li class="proposal-steps__item">
            <span class="proposal-steps__mark" aria-hidden="true">5</span>
            <span class="proposal-steps__label">CONCLUSÃO</span>
          </li>
        </ol>

        <h1 class="pp-title">Sua proposta personalizada</h1>
        <p class="pp-subtitle">Com base no seu perfil, preparamos estas condições para você.</p>

        <!-- Cards de resumo -->
        <div class="pp-summary-row" aria-label="Resumo do empréstimo">
          <!-- Card escuro — valor editável -->
          <div class="pp-summary pp-summary--dark">
            <p class="pp-summary__field-label">
              Valor do empréstimo
              <button type="button" class="pp-summary__badge" @click="focusInput" aria-label="Editar valor do empréstimo">✎ Editar</button>
            </p>
            <input
              ref="inputRef"
              class="pp-summary__input"
              type="text"
              inputmode="numeric"
              :value="isEditing ? String(loanAmount) : loanAmountFormatted"
              aria-label="Valor do empréstimo"
              @focus="onFocus"
              @blur="onBlur"
              @input="onLoanAmountInput"
            />
            <!-- Botão Aplicar — aparece quando há valor pendente diferente do atual -->
            <div v-if="isEditing" class="pp-summary__apply-row">
              <button type="button" class="pp-summary__apply-btn" @click="applyAmount" aria-label="Confirmar valor do empréstimo">
                Aplicar
              </button>
              <button type="button" class="pp-summary__cancel-btn" @click="cancelEdit" aria-label="Cancelar edição">
                Cancelar
              </button>
            </div>
            <p class="pp-summary__hint">Limite pré-aprovado: {{ fmtNoDecimals(props.valorSolicitado) }}</p>
          </div>
          <!-- Card branco — taxa de juros -->
          <div class="pp-summary pp-summary--light">
            <p class="pp-summary__field-label pp-summary__field-label--light">Taxa de juros</p>
            <p class="pp-summary__rate pp-summary__rate--light">
              {{ selectedRateFormatted }}
              <span class="pp-summary__rate-suffix pp-summary__rate-suffix--light">a.m.</span>
            </p>
          </div>
        </div>

        <!-- Opções de parcelamento -->
        <h2 class="pp-options-title">Como deseja parcelar?</h2>

        <div role="radiogroup" aria-label="Opções de parcelamento" class="pp-offers">
          <label v-for="offer in offers" :key="offer.n" class="pp-offer-label">
            <input
              type="radio"
              name="pp-parcelamento"
              :value="offer.n"
              v-model="selectedInstallments"
              class="pp-sr-only"
              :aria-label="`${offer.label} de ${offer.amount} — ${offer.rateLabel}`"
            />
            <div :class="['pp-offer', selectedInstallments === offer.n ? 'pp-offer--selected' : '']">
              <span
                class="pp-offer__radio"
                :class="selectedInstallments === offer.n ? 'pp-offer__radio--on' : ''"
                aria-hidden="true"
              >
                <span v-if="selectedInstallments === offer.n" class="pp-offer__radio-dot"></span>
              </span>
              <span class="pp-offer__installments">{{ offer.label }}</span>
              <span class="pp-offer__rate-label">{{ offer.rateLabel }}</span>
              <span class="pp-offer__amount">
                {{ offer.amount }}<span class="pp-offer__amount-suffix">/mês</span>
              </span>
            </div>
          </label>
        </div>

        <!-- CTA -->
        <button type="button" class="pp-submit" @click="handleContinue">
          Continuar com {{ selectedOffer.label }} de {{ selectedOffer.amount }}
        </button>

        <p class="pp-legal">
          As parcelas já incluem a Tarifa de Cadastro (R$ 0,00) e o IOF. Alguns prazos podem não
          estar disponíveis para o seu perfil. A proposta é avaliada continuamente pelo banco até
          a liberação do valor.
        </p>

      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Screen ── */
.pp-screen {
  min-height: 100vh;
  background: var(--color-gray-50);
  display: flex;
  flex-direction: column;
}

/* ── Header ── */
.proposal-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--color-gray-50);
  border-bottom: 1px solid var(--color-primary-100);
}

.proposal-header__inner {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.proposal-header__logo {
  height: 26px;
  width: auto;
  display: block;
}

.proposal-header__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border: 1.5px solid var(--color-primary-100);
  border-radius: 999px;
  background: transparent;
  color: var(--color-navy-800);
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.proposal-header__back:hover {
  background: var(--color-primary-50);
}

/* ── Main ── */
.proposal-main {
  flex: 1;
  padding: 32px 20px 64px;
}

.proposal-main__inner {
  max-width: 640px;
  margin: 0 auto;
}

/* ── Stepper ── */
.proposal-steps {
  list-style: none;
  margin: 0 0 40px;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 4px;
}

.proposal-steps__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  position: relative;
}

.proposal-steps__item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 14px;
  left: calc(50% + 18px);
  right: calc(-50% + 18px);
  height: 1.5px;
  background: var(--color-primary-100);
}

.proposal-steps__item.is-done:not(:last-child)::after {
  background: var(--btn-primary-bg);
}

.proposal-steps__mark {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid var(--color-primary-200);
  background: #ffffff;
  color: var(--color-navy-400);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.proposal-steps__label {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--color-gray-400);
  line-height: 1.2;
  text-align: center;
}

.proposal-steps__item.is-done .proposal-steps__mark {
  background: var(--btn-primary-bg);
  border-color: var(--color-primary-500);
  color: var(--btn-primary-color);
}

.proposal-steps__item.is-done .proposal-steps__label {
  color: var(--color-secondary-600);
}

.proposal-steps__item.is-active .proposal-steps__mark {
  background: #ffffff;
  border: 1.5px solid var(--color-primary-500);
  color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.proposal-steps__item.is-active .proposal-steps__label {
  color: var(--color-primary-500);
}

/* ── Conteúdo ── */
.pp-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-navy-800);
  margin: 0 0 8px;
  line-height: 1.1;
}

.pp-subtitle {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: var(--color-navy-500);
  margin: 0 0 28px;
  line-height: 1.55;
}

/* ── Cards de resumo ── */
.pp-summary-row {
  display: flex;
  gap: 16px;
  margin-bottom: 28px;
  align-items: stretch;
}

.pp-summary {
  border-radius: 20px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pp-summary--dark {
  background: var(--btn-primary-bg);
  flex: 1 1 0;
}

.pp-summary--light {
  background: #ffffff;
  border: 1px solid var(--color-primary-100);
  box-shadow: 0 4px 16px rgba(10, 22, 40, 0.06);
  flex: 0 0 auto;
  min-width: 160px;
  justify-content: center;
}

.pp-summary__field-label {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.pp-summary__field-label--light {
  color: var(--color-navy-400);
  margin-bottom: 8px;
}

.pp-summary__badge {
  font-size: 16px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  padding: 2px 10px;
  cursor: pointer;
  font-family: 'Instrument Sans', sans-serif;
  letter-spacing: 0;
  line-height: normal;
}

.pp-summary__badge:hover {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

.pp-summary__apply-row {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.pp-summary__apply-btn {
  flex: 1;
  height: 36px;
  border: none;
  border-radius: 999px;
  background: var(--btn-primary-bg);
  color: var(--btn-primary-color);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.pp-summary__apply-btn:hover {
  background: var(--btn-primary-bg-hover);
  color: #ffffff;
}

.pp-summary__cancel-btn {
  height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Instrument Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s;
}

.pp-summary__cancel-btn:hover {
  border-color: rgba(255, 255, 255, 0.6);
  color: #ffffff;
}

.pp-summary__input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1.5px dashed rgba(0, 216, 216, 0.5);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.02em;
  outline: none;
  padding: 0 0 4px;
}

.pp-summary__hint {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin: 8px 0 0;
}

.pp-summary__rate {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--color-primary-500);
  margin: 0;
  line-height: 1;
}

.pp-summary__rate--light {
  color: var(--color-primary-500);
}

.pp-summary__rate-suffix {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
}

.pp-summary__rate-suffix--light {
  color: var(--color-navy-400);
}

/* ── Título das opções ── */
.pp-options-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-navy-800);
  margin: 0 0 14px;
}

/* ── Lista de ofertas ── */
.pp-offers {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.pp-offer-label {
  display: block;
  cursor: pointer;
}

.pp-offer {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #ffffff;
  border: 1px solid var(--color-primary-100);
  border-radius: 14px;
  padding: 16px 20px;
  transition: border-color 0.15s, background 0.15s;
}

.pp-offer--selected {
  background: var(--color-primary-100);
  border: 2px solid var(--color-primary-500);
}

.pp-offer__radio {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--color-gray-300);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.pp-offer__radio--on {
  border-color: var(--color-primary-500);
}

.pp-offer__radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--btn-primary-bg);
}

.pp-offer__installments {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-navy-800);
  width: 36px;
  flex-shrink: 0;
}

.pp-offer__rate-label {
  flex: 1;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: var(--color-navy-500);
}

.pp-offer__amount {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary-500);
  white-space: nowrap;
}

.pp-offer__amount-suffix {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-navy-400);
}

/* ── CTA ── */
.pp-submit {
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 999px;
  background: var(--btn-primary-bg);
  color: var(--btn-primary-color);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 16px;
}

.pp-submit:hover {
  background: var(--btn-primary-bg-hover);
  color: #ffffff;
}

/* ── Legal ── */
.pp-legal {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-navy-400);
  text-align: center;
  margin: 0;
}

/* ── Acessibilidade ── */
.pp-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ── Desktop ── */
@media (min-width: 640px) {
  .proposal-main {
    padding: 40px 32px 80px;
  }

  .proposal-main__inner {
    max-width: 640px;
  }

  .proposal-header__inner { height: 72px; }

  .proposal-steps {
    margin-bottom: 48px;
    gap: 12px;
  }

  .proposal-steps__mark {
    width: 30px;
    height: 30px;
  }

  .proposal-steps__label {
    font-size: 13px;
  }

  .pp-title {
    font-size: 36px;
  }

  .pp-summary-row {
    gap: 20px;
  }

  .pp-summary {
    border-radius: 24px;
    padding: 28px 32px;
  }

  .pp-summary__input {
    font-size: 36px;
  }

  .pp-options-title {
    font-size: 18px;
  }

  .pp-offer {
    padding: 18px 24px;
  }

  .pp-submit {
    font-size: 18px;
  }
}
</style>
