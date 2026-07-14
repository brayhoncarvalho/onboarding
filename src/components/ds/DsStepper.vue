<script setup lang="ts">
import { computed } from 'vue'
import { Check as IconCheck } from '@lucide/vue'

export interface Step {
  key: string
  label: string
  description?: string
}

interface Props {
  steps: Step[]
  current: number
  orientation?: 'horizontal' | 'vertical'
  variant?: 'numbered' | 'dotted'
  /**
   * Posição do label em modo horizontal:
   * - 'below' (padrão): label abaixo do indicador — ideal para 5+ etapas.
   *   A linha conectora fica entre os indicadores, longe dos nomes.
   * - 'side': label à direita do indicador — compacto, ideal para ≤ 4 etapas.
   *   A linha fica após o label, nunca atravessando o texto.
   */
  labelPosition?: 'below' | 'side'
  /**
   * Quais labels exibir:
   * - 'all' (padrão): todos os steps mostram seu label
   * - 'active': somente o step atual exibe seu label;
   *   os demais ficam invisíveis mas reservam espaço (indicadores alinhados)
   */
  showLabel?: 'all' | 'active'
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  variant: 'numbered',
  labelPosition: 'below',
  showLabel: 'all',
})

const isBelow = computed(
  () => props.orientation === 'horizontal' && props.labelPosition === 'below'
)
</script>

<template>
  <ol
    :class="[
      'ds-stepper',
      `ds-stepper--${orientation}`,
      `ds-stepper--${variant}`,
      orientation === 'horizontal'
        ? isBelow
          ? 'ds-stepper--label-below'
          : 'ds-stepper--label-side'
        : null,
    ]"
    :aria-label="`Etapa ${current + 1} de ${steps.length}`"
  >
    <li
      v-for="(step, index) in steps"
      :key="step.key"
      :class="[
        'ds-stepper__item',
        {
          'ds-stepper__item--complete': index < current,
          'ds-stepper__item--active': index === current,
        },
      ]"
      :aria-current="index === current ? 'step' : undefined"
    >
      <!-- Indicador (número, check ou dot) -->
      <span class="ds-stepper__indicator" aria-hidden="true">
        <IconCheck v-if="index < current" :size="14" :stroke-width="2.5" />
        <template v-else-if="variant === 'numbered'">{{ index + 1 }}</template>
      </span>

      <!-- Body: label + description -->
      <span
        class="ds-stepper__body"
        :class="{ 'ds-stepper__body--inactive': showLabel === 'active' && index !== current }"
      >
        <span class="ds-stepper__label">{{ step.label }}</span>
        <span v-if="step.description" class="ds-stepper__description">
          {{ step.description }}
        </span>
      </span>

      <!-- Conector para o próximo step (não renderiza no último) -->
      <span v-if="index < steps.length - 1" class="ds-stepper__separator" aria-hidden="true"></span>
    </li>
  </ol>
</template>

<style scoped>
/* ─── Estrutura base ──────────────────────────────────────── */
.ds-stepper {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

/* ─── Indicador ───────────────────────────────────────────── */
.ds-stepper__indicator {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  /* z-index > separador para que o indicador sobreponha a linha nos dois modos */
  position: relative;
  z-index: 1;
  transition:
    background var(--duration-fast),
    border-color var(--duration-fast),
    box-shadow var(--duration-fast);
}

.ds-stepper--dotted .ds-stepper__indicator {
  width: 12px;
  height: 12px;
}

.ds-stepper__item--complete .ds-stepper__indicator {
  background: var(--color-primary-500);
  border-color: var(--color-primary-500);
  color: var(--color-navy-900);
}

.ds-stepper__item--active .ds-stepper__indicator {
  border-color: var(--color-primary-500);
  color: var(--color-primary-600);
  box-shadow: 0 0 0 4px var(--color-primary-50);
}

/* ─── Body (label + description) ─────────────────────────── */
.ds-stepper__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

/* Oculta visualmente mas preserva o espaço — mantém indicadores alinhados */
.ds-stepper__body--inactive {
  visibility: hidden;
}

.ds-stepper__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

.ds-stepper__item--active .ds-stepper__label,
.ds-stepper__item--complete .ds-stepper__label {
  color: var(--color-text-primary);
}

.ds-stepper__description {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin-top: 1px;
}

/* ─── HORIZONTAL — Label Below ────────────────────────────── */
/*
  Layout:   [1]────────[2]────────[3]
           Etapa 1   Etapa 2   Etapa 3

  • Indicador centralizado no topo do item
  • Label centralizado abaixo — permite quebra de linha (n steps)
  • Separador absolutamente posicionado NO NÍVEL DO INDICADOR,
    nunca tocando no texto
  • Fórmula do separador:
      left:  calc(50% + 14px) → borda direita do indicador atual
      right: calc(14px - 50%) → para na borda esquerda do próximo indicador
*/
.ds-stepper--label-below {
  flex-direction: row;
  align-items: flex-start;
}

.ds-stepper--label-below .ds-stepper__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  flex: 1;
  min-width: 0;
  position: relative;
}

.ds-stepper--label-below .ds-stepper__body {
  align-items: center;
  text-align: center;
  width: 100%;
  padding: 0 var(--spacing-2);
}

.ds-stepper--label-below .ds-stepper__label {
  /* permite quebra — resolve o corte para 5+ steps */
  white-space: normal;
  text-align: center;
  overflow: visible;
}

/* Separador: do indicador atual até a borda esquerda do próximo indicador */
.ds-stepper--label-below .ds-stepper__separator {
  position: absolute;
  top: 14px; /* centro vertical do indicador (28px / 2) */
  left: calc(50% + 14px); /* borda direita do indicador */
  right: calc(14px - 50%); /* borda esquerda do próximo indicador */
  height: 1px;
  background: var(--color-border-default);
}

.ds-stepper--label-below .ds-stepper__item--complete .ds-stepper__separator {
  background: var(--color-primary-500);
}

/* Dotted: indicador 12px — ajusta posições */
.ds-stepper--label-below.ds-stepper--dotted .ds-stepper__separator {
  top: 6px;
  left: calc(50% + 6px);
  right: calc(6px - 50%);
}

/* ─── HORIZONTAL — Label Side ─────────────────────────────── */
/*
  Layout:  [1] Etapa 1 ─── [2] Etapa 2 ─── [3] Etapa 3

  • Item em flex-row: indicador → label → separador
  • Separador é filho flex (flex: 1) que ocupa o espaço restante
    APÓS o label — nunca atravessa o texto
  • gap: spacing-2 entre cada filho → garante respiração visual
*/
.ds-stepper--label-side {
  flex-direction: row;
  align-items: center;
  gap: 0; /* items tocam uns nos outros */
}

.ds-stepper--label-side .ds-stepper__item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-2);
  flex: 1;
  min-width: 0;
  position: relative;
}

.ds-stepper--label-side .ds-stepper__body {
  /* não cresce — permite que o separador ocupe o espaço restante */
  flex: 0 1 auto;
  min-width: 0;
  /* limita largura máxima do label para proteger o separador */
  max-width: 130px;
}

.ds-stepper--label-side .ds-stepper__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Separador em lado: filho flex que cresce após o label */
.ds-stepper--label-side .ds-stepper__separator {
  /* participante do flex-row, não absoluto */
  position: static;
  flex: 1;
  min-width: var(--spacing-3);
  height: 1px;
  background: var(--color-border-default);
  align-self: center;
}

.ds-stepper--label-side .ds-stepper__item--complete .ds-stepper__separator {
  background: var(--color-primary-500);
}

/* Último item sem separador — body pode crescer */
.ds-stepper--label-side .ds-stepper__item:last-child .ds-stepper__body {
  flex: 1;
}

/* ─── VERTICAL ────────────────────────────────────────────── */
.ds-stepper--vertical {
  flex-direction: column;
  align-items: stretch;
  gap: 0;
}

.ds-stepper--vertical .ds-stepper__item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--spacing-3);
  position: relative;
  padding-bottom: var(--spacing-5);
}

/* Remove padding do último item */
.ds-stepper--vertical .ds-stepper__item:last-child {
  padding-bottom: 0;
}

/* Alinha a primeira linha do label com o centro visual do indicador */
.ds-stepper--vertical .ds-stepper__body {
  padding-top: 4px;
}

/* Separador vertical: linha da base do indicador até o topo do próximo */
.ds-stepper--vertical .ds-stepper__separator {
  position: absolute;
  left: 13px; /* centro de 28px - 0.5px */
  top: 28px; /* logo abaixo do indicador */
  bottom: 0;
  width: 1px;
  height: auto;
  background: var(--color-border-default);
}

.ds-stepper--vertical .ds-stepper__item--complete .ds-stepper__separator {
  background: var(--color-primary-500);
}

.ds-stepper--vertical.ds-stepper--dotted .ds-stepper__separator {
  left: 5px; /* centro de 12px - 0.5px */
  top: 12px;
}

.ds-stepper--vertical.ds-stepper--dotted .ds-stepper__indicator {
  margin-top: 3px;
}
</style>
