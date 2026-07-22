<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: number | [number, number]
  min?: number
  max?: number
  step?: number
  label?: string
  formatLabel?: (value: number) => string
  disabled?: boolean
  showValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  showValue: true,
})
const emit = defineEmits<{ 'update:modelValue': [value: number | [number, number]] }>()

const id = `ds-slider-${Math.random().toString(36).slice(2, 7)}`
const isRange = computed(() => Array.isArray(props.modelValue))

const percent = (v: number) => ((v - props.min) / (props.max - props.min)) * 100

const labelOf = (v: number) => (props.formatLabel ? props.formatLabel(v) : String(v))

const onInput = (event: Event, idx?: 0 | 1) => {
  const v = Number((event.target as HTMLInputElement).value)
  if (isRange.value && idx !== undefined) {
    const cur = props.modelValue as [number, number]
    const next: [number, number] =
      idx === 0 ? [Math.min(v, cur[1]), cur[1]] : [cur[0], Math.max(v, cur[0])]
    emit('update:modelValue', next)
  } else {
    emit('update:modelValue', v)
  }
}

const left = computed(() =>
  isRange.value ? percent((props.modelValue as [number, number])[0]) : 0
)
const right = computed(() =>
  isRange.value
    ? percent((props.modelValue as [number, number])[1])
    : percent(props.modelValue as number)
)
</script>

<template>
  <div class="ds-slider" :class="{ 'ds-slider--disabled': disabled }">
    <div v-if="label || showValue" class="ds-slider__header">
      <label v-if="label" :for="`${id}-0`" class="ds-slider__label">{{ label }}</label>
      <span v-if="showValue" class="ds-slider__value" aria-live="polite">
        <template v-if="isRange">
          {{ labelOf((modelValue as [number, number])[0]) }} —
          {{ labelOf((modelValue as [number, number])[1]) }}
        </template>
        <template v-else>{{ labelOf(modelValue as number) }}</template>
      </span>
    </div>

    <div class="ds-slider__track">
      <span class="ds-slider__rail"></span>
      <span class="ds-slider__fill" :style="{ left: `${left}%`, right: `${100 - right}%` }"></span>
      <input
        :id="`${id}-0`"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="isRange ? (modelValue as [number, number])[0] : modelValue"
        :disabled="disabled"
        :aria-label="label || 'Valor'"
        :aria-valuemin="min"
        :aria-valuemax="max"
        class="ds-slider__input"
        @input="(e) => onInput(e, isRange ? 0 : undefined)"
      />
      <input
        v-if="isRange"
        :id="`${id}-1`"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="(modelValue as [number, number])[1]"
        :disabled="disabled"
        :aria-label="`${label || 'Valor'} máximo`"
        :aria-valuemin="min"
        :aria-valuemax="max"
        class="ds-slider__input"
        @input="(e) => onInput(e, 1)"
      />
    </div>
  </div>
</template>

<style scoped>
.ds-slider {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}
.ds-slider__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--spacing-3);
}
.ds-slider__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}
.ds-slider__value {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}
.ds-slider__track {
  position: relative;
  height: 24px;
  display: flex;
  align-items: center;
}
.ds-slider__rail {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 4px;
  transform: translateY(-50%);
  background: var(--color-gray-200);
  border-radius: var(--radius-full);
}
.ds-slider__fill {
  position: absolute;
  top: 50%;
  height: 4px;
  transform: translateY(-50%);
  background: var(--btn-primary-bg);
  border-radius: var(--radius-full);
  pointer-events: none;
}
.ds-slider__input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  appearance: none;
  background: transparent;
  pointer-events: none;
}
.ds-slider__input::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  background: var(--color-white);
  border: 2px solid var(--color-primary-500);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  pointer-events: all;
  cursor: grab;
}
.ds-slider__input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  background: var(--color-white);
  border: 2px solid var(--color-primary-500);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  pointer-events: all;
  cursor: grab;
}
.ds-slider__input:focus-visible::-webkit-slider-thumb {
  box-shadow: var(--focus-ring);
}
.ds-slider__input:focus-visible::-moz-range-thumb {
  box-shadow: var(--focus-ring);
}
.ds-slider--disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
