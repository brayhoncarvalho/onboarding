<script setup lang="ts">
import { computed, ref } from 'vue'

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'continuar', offer: { installments: number; amount: number; rate: number }): void
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
const isEditing = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const focusInput = () => {
  inputRef.value?.focus()
  inputRef.value?.select()
}

const loanAmountFormatted = computed(() => fmtNoDecimals(loanAmount.value))

const onFocus = (e: FocusEvent) => {
  isEditing.value = true
  ;(e.target as HTMLInputElement).value = String(loanAmount.value)
  ;(e.target as HTMLInputElement).select()
}

const onBlur = (e: FocusEvent) => {
  isEditing.value = false
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  const parsed = parseInt(raw, 10) || 0
  const clamped = Math.min(Math.max(parsed, 250), 200000)
  loanAmount.value = clamped
  ;(e.target as HTMLInputElement).value = fmtNoDecimals(clamped)
}

const onLoanAmountInput = (e: Event) => {
  // Permite apenas dígitos durante a digitação
  const input = e.target as HTMLInputElement
  input.value = input.value.replace(/[^\d]/g, '')
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
            <span class="proposal-steps__label">DADOS COMPLEMENTARES</span>
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
  background: #fafcfc;
  display: flex;
  flex-direction: column;
}

/* ── Header ── */
.proposal-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fafcfc;
  border-bottom: 1px solid #e3edec;
}

.proposal-header__inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
  height: 72px;
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
  gap: 8px;
  height: 42px;
  padding: 0 18px;
  border: 1.5px solid #e3edec;
  border-radius: 999px;
  background: #ffffff;
  color: #3c4c4d;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.proposal-header__back:hover {
  background: #f4fbfa;
}

/* ── Main ── */
.proposal-main {
  flex: 1;
  padding: 36px 20px 72px;
}

.proposal-main__inner {
  max-width: 560px;
  margin: 0 auto;
}

/* ── Stepper ── */
.proposal-steps {
  list-style: none;
  margin: 0 0 40px;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
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
  background: #e3edec;
}

.proposal-steps__item.is-done:not(:last-child)::after {
  background: #063b3e;
}

.proposal-steps__mark {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid #d5e4e2;
  background: #ffffff;
  color: #8aa0a0;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.proposal-steps__label {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #9aabac;
  line-height: 1.3;
}

.proposal-steps__item.is-done .proposal-steps__mark {
  background: #063b3e;
  border-color: #063b3e;
  color: #ffffff;
}

.proposal-steps__item.is-done .proposal-steps__label {
  color: #0fa3a3;
}

.proposal-steps__item.is-active .proposal-steps__mark {
  background: #ffffff;
  border: 2px solid #063b3e;
  color: #063b3e;
}

.proposal-steps__item.is-active .proposal-steps__label {
  color: #063b3e;
}

/* ── Conteúdo ── */
.pp-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #0b2528;
  margin: 0 0 8px;
  line-height: 1.1;
}

.pp-subtitle {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 15px;
  color: #5b6b6c;
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
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pp-summary--dark {
  background: #063b3e;
  flex: 1 1 0;
}

.pp-summary--light {
  background: #ffffff;
  border: 1px solid #e3edec;
  box-shadow: 0 4px 16px rgba(6,59,62,0.06);
  flex: 0 0 auto;
  min-width: 160px;
  justify-content: center;
}

.pp-summary__field-label {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.pp-summary__field-label--light {
  color: #8aa0a0;
  margin-bottom: 8px;
}

.pp-summary__badge {
  font-size: 11px;
  font-weight: 700;
  color: #00d8d8;
  background: rgba(0, 216, 216, 0.1);
  border: 1px solid rgba(0, 216, 216, 0.35);
  border-radius: 999px;
  padding: 2px 10px;
  cursor: pointer;
  font-family: 'Instrument Sans', sans-serif;
  letter-spacing: 0;
  line-height: normal;
}

.pp-summary__badge:hover {
  background: rgba(0, 216, 216, 0.2);
}

.pp-summary__input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1.5px dashed rgba(0, 216, 216, 0.5);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 30px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.02em;
  outline: none;
  padding: 0 0 4px;
}

.pp-summary__hint {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 8px 0 0;
}

.pp-summary__rate {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 26px;
  font-weight: 600;
  color: #00d8d8;
  margin: 0;
  line-height: 1;
}

.pp-summary__rate--light {
  color: #063b3e;
}

.pp-summary__rate-suffix {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
}

.pp-summary__rate-suffix--light {
  color: #8aa0a0;
}

/* ── Título das opções ── */
.pp-options-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #0b2528;
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
  border: 1px solid #e3edec;
  border-radius: 14px;
  padding: 16px 20px;
  transition: border-color 0.15s, background 0.15s;
}

.pp-offer--selected {
  background: #f4fdfc;
  border: 2px solid #063b3e;
}

.pp-offer__radio {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #c8c8c8;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.pp-offer__radio--on {
  border-color: #063b3e;
}

.pp-offer__radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #063b3e;
}

.pp-offer__installments {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 17px;
  font-weight: 600;
  color: #0b2528;
  width: 36px;
  flex-shrink: 0;
}

.pp-offer__rate-label {
  flex: 1;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 13px;
  color: #5b6b6c;
}

.pp-offer__amount {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 17px;
  font-weight: 600;
  color: #063b3e;
  white-space: nowrap;
}

.pp-offer__amount-suffix {
  font-size: 12px;
  font-weight: 500;
  color: #8aa0a0;
}

/* ── CTA ── */
.pp-submit {
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 999px;
  background: #00d8d8;
  color: #042a2c;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 16px;
}

.pp-submit:hover {
  background: #0fc5c5;
}

/* ── Legal ── */
.pp-legal {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 12px;
  line-height: 1.6;
  color: #8aa0a0;
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
    padding: 44px 32px 72px;
  }

  .proposal-main__inner {
    max-width: 680px;
  }

  .proposal-steps__label {
    font-size: 10px;
  }

  .pp-title {
    font-size: 34px;
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
    font-size: 19px;
  }

  .pp-offer {
    padding: 18px 24px;
  }

  .pp-submit {
    font-size: 17px;
  }
}
</style>
