<template>
  <section class="simulador" aria-labelledby="simulador-title">
    <div class="simulador__container" id="simulador-card">
      <div class="simulador__header">
        <h2 id="simulador-title" class="simulador__title">Simule agora</h2>
        <span class="simulador__badge">Grátis</span>
      </div>

      <p class="simulador__label">De quanto você precisa?</p>
      <div class="simulador__value-field" aria-live="polite" aria-atomic="true">
        <span class="simulador__value-text">{{ formatCurrency(valorEmprestimo) }}</span>
      </div>

      <div class="simulador__slider-row">
        <button
          class="simulador__ctrl"
          @click="decrementar"
          :disabled="sliderIndex === 0"
          :aria-label="'Diminuir para ' + formatCurrency(valorAnterior)"
        >−</button>
        <input
          type="range"
          :min="0"
          :max="valoresDisponiveis.length - 1"
          step="1"
          v-model.number="sliderIndex"
          aria-label="Valor do empréstimo"
          :aria-valuemin="0"
          :aria-valuemax="valoresDisponiveis.length - 1"
          :aria-valuenow="sliderIndex"
          :aria-valuetext="formatCurrency(valorEmprestimo)"
          class="simulador__range"
          :style="{ '--fill': sliderPercent + '%' }"
        />
        <button
          class="simulador__ctrl"
          @click="incrementar"
          :disabled="sliderIndex === valoresDisponiveis.length - 1"
          :aria-label="'Aumentar para ' + formatCurrency(valorProximo)"
        >+</button>
      </div>

      <div class="simulador__range-footer" aria-hidden="true">
        <span>R$ 250</span>
        <span>R$ 100.000</span>
      </div>

      <p class="simulador__label">Número de parcelas</p>
      <div class="simulador__parcelas-grid" role="group" aria-label="Selecione o número de parcelas">
        <button
          v-for="p in parcelas"
          :key="p"
          :class="['simulador__parcela-btn', { 'simulador__parcela-btn--selected': parcelasSelecionada === p }]"
          @click="parcelasSelecionada = p"
          :aria-pressed="parcelasSelecionada === p"
        >{{ p }}x</button>
      </div>

      <div class="simulador__result-wrap">
        <div class="simulador__result">
          <p class="simulador__result-label">Parcela mensal estimada*</p>
          <p class="simulador__result-value" aria-live="polite" aria-atomic="true">{{ formatCurrency(parcelaMensal) }}</p>
        </div>

        <div class="simulador__taxa">
          <p class="simulador__taxa-label">Taxa de juros*</p>
          <p class="simulador__taxa-value" aria-live="polite" aria-atomic="true">{{ taxaMensalFormatada }} / {{ taxaAnualFormatada }}</p>
        </div>
      </div>

      <button type="button" class="simulador__cta" @click="emit('solicitar', { valor: valorEmprestimo, parcelas: parcelasSelecionada })">
        Solicitar proposta
      </button>

      <p class="simulador__disclaimer">
        * Valores ilustrativos. As taxas reais são calculadas de acordo com seu perfil de crédito.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  (e: 'solicitar', data: { valor: number; parcelas: number }): void
}>()

// Array de valores disponíveis — step não-uniforme: menor para valores baixos, maior para altos
const valoresDisponiveis = [
    250,   500,   750,
  1_000, 1_500, 2_000, 2_500, 3_000, 3_500, 4_000, 4_500, 5_000,
  6_000, 7_000, 8_000, 9_000, 10_000,
  12_000, 14_000, 16_000, 18_000, 20_000,
  25_000, 30_000, 35_000, 40_000, 45_000, 50_000,
  55_000, 60_000, 65_000, 70_000, 75_000, 80_000, 85_000, 90_000, 95_000, 100_000,
]

// Índice padrão → R$ 3.500
const DEFAULT_INDEX = valoresDisponiveis.indexOf(3_500)
const sliderIndex = ref(DEFAULT_INDEX)

const valorEmprestimo = computed(() => valoresDisponiveis[sliderIndex.value])
const valorAnterior   = computed(() => valoresDisponiveis[Math.max(0, sliderIndex.value - 1)])
const valorProximo    = computed(() => valoresDisponiveis[Math.min(valoresDisponiveis.length - 1, sliderIndex.value + 1)])

const parcelasSelecionada = ref(18)
const parcelas = [6, 12, 16, 18, 24, 36]

// Taxas mensais reais — crédito pessoal não consignado (ref: BACEN 2026)
const taxaPorPrazo: Record<number, number> = {
   6: 0.0199,
  12: 0.0249,
  16: 0.0265,
  18: 0.0275,
  24: 0.0299,
  36: 0.0349,
}

// Tabela Price: PMT = PV × [i(1+i)^n] / [(1+i)^n - 1]
const calcPmt = (pv: number, i: number, n: number): number =>
  (pv * (i * Math.pow(1 + i, n))) / (Math.pow(1 + i, n) - 1)

const taxaAtual = computed(() => taxaPorPrazo[parcelasSelecionada.value] ?? 0.0275)

const parcelaMensal = computed(() =>
  calcPmt(valorEmprestimo.value, taxaAtual.value, parcelasSelecionada.value)
)

const taxaMensalFormatada = computed(() =>
  (taxaAtual.value * 100).toFixed(2).replace('.', ',') + '% a.m.'
)

const taxaAnualFormatada = computed(() => {
  const anual = (Math.pow(1 + taxaAtual.value, 12) - 1) * 100
  return anual.toFixed(2).replace('.', ',') + '% a.a.'
})

const formatCurrency = (value: number): string =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const sliderPercent = computed(() =>
  Math.round((sliderIndex.value / (valoresDisponiveis.length - 1)) * 100)
)

const incrementar = () => {
  sliderIndex.value = Math.min(sliderIndex.value + 1, valoresDisponiveis.length - 1)
}
const decrementar = () => {
  sliderIndex.value = Math.max(sliderIndex.value - 1, 0)
}
</script>

<style scoped>
.simulador {
  width: 100%;
  background: #fafcfc;
}

.simulador__container {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e3edec;
  border-radius: 24px;
  box-shadow: 0 16px 48px rgba(6, 59, 62, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.simulador__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.simulador__badge {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: #dff3f1;
  color: #0a7c7c;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 700;
}

.simulador__title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #0b2528;
  margin: 0;
}

.simulador__label {
  margin: 4px 0 0;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #5b6b6c;
}

.simulador__value-field {
  display: flex;
  align-items: baseline;
  margin-bottom: 2px;
}

.simulador__value-text {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 36px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #063b3e;
}

.simulador__slider-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.simulador__ctrl {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #d5e4e2;
  background: #ffffff;
  color: #063b3e;
  font-size: 18px;
  font-family: 'Instrument Sans', sans-serif;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  line-height: 1;
  transition: background 0.15s ease;
}

.simulador__ctrl:hover {
  background: #f3f9f8;
}

.simulador__ctrl:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.simulador__ctrl:focus-visible {
  outline: 2px solid #063b3e;
  outline-offset: 2px;
}

.simulador__range-footer {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.simulador__range-footer span {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: #607374;
}

.simulador__range {
  --fill: 0%;
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: linear-gradient(to right, #063b3e var(--fill), #e3edec var(--fill));
  outline: none;
  border-radius: 999px;
  cursor: pointer;
}

.simulador__range::-webkit-slider-runnable-track {
  height: 6px;
  background: transparent;
  border-radius: 999px;
}

.simulador__range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: #ffffff;
  border: 2px solid #063b3e;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(4, 42, 44, 0.2);
  margin-top: -7px;
}

.simulador__range::-moz-range-track {
  height: 6px;
  background: #e3edec;
  border-radius: 999px;
}

.simulador__range::-moz-range-progress {
  height: 6px;
  background: #063b3e;
  border-radius: 999px;
}

.simulador__range::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: #ffffff;
  border: 2px solid #063b3e;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(4, 42, 44, 0.2);
}

.simulador__range:focus-visible {
  outline: 2px solid #063b3e;
  outline-offset: 3px;
}

.simulador__parcelas-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.simulador__parcela-btn {
  height: 42px;
  border: 1.5px solid #d5e4e2;
  border-radius: 999px;
  background: #ffffff;
  color: #0b2528;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.1s ease, color 0.1s ease;
}

.simulador__parcela-btn--selected {
  background: #063b3e;
  color: #ffffff;
  border-color: #063b3e;
}

.simulador__parcela-btn:focus-visible {
  outline: 2px solid #063b3e;
  outline-offset: 2px;
}

.simulador__result-wrap {
  border-top: 1px dashed #d5e4e2;
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.simulador__result,
.simulador__taxa {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.simulador__result-label {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: #5b6b6c;
  margin: 0;
  white-space: nowrap;
}

.simulador__result-value {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #063b3e;
  margin: 0;
  white-space: nowrap;
}

.simulador__taxa-label {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: #5b6b6c;
  margin: 0;
  white-space: nowrap;
}

.simulador__taxa-value {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #0b2528;
  margin: 0;
  white-space: nowrap;
}

.simulador__cta {
  height: 52px;
  border: none;
  border-radius: 999px;
  background: #00d8d8;
  color: #042a2c;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  margin-bottom: 2px;
  transition: background 0.15s ease;
}

.simulador__cta:hover {
  background: #0fc5c5;
}

.simulador__cta:focus-visible {
  outline: 2px solid #063b3e;
  outline-offset: 3px;
}

.simulador__disclaimer {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #607374;
  text-align: center;
  line-height: 1.5;
  padding: 0;
  margin: 0;
}

@media (min-width: 480px) {
  .simulador__container {
    border-radius: 28px;
    padding: 28px;
  }

  .simulador__title { font-size: 28px; }
  .simulador__value-text { font-size: 36px; }
  .simulador__result-value { font-size: 22px; }
}

@media (min-width: 1024px) {
  .simulador {
    height: 100%;
  }

  .simulador__container {
    min-height: var(--landing-column-height, 620px);
    height: 100%;
    padding: 36px;
    box-shadow: 0 20px 60px rgba(6, 59, 62, 0.1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .simulador__ctrl,
  .simulador__cta,
  .simulador__parcela-btn {
    transition: none;
  }
}
</style>
