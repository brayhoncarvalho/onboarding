<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: number | null
  label?: string
  hint?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  currency?: string
  locale?: string
  min?: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'R$ 0,00',
  currency: 'BRL',
  locale: 'pt-BR',
})

const emit = defineEmits<{ 'update:modelValue': [value: number | null] }>()
const id = `ds-currency-${Math.random().toString(36).slice(2, 7)}`

const display = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return ''
  return new Intl.NumberFormat(props.locale, {
    style: 'currency',
    currency: props.currency,
    minimumFractionDigits: 2,
  }).format(props.modelValue)
})

const onInput = (event: Event) => {
  const raw = (event.target as HTMLInputElement).value
  const digits = raw.replace(/\D/g, '')
  if (!digits) { emit('update:modelValue', null); return }
  let cents = parseInt(digits, 10)
  if (props.max !== undefined && cents / 100 > props.max) cents = Math.round(props.max * 100)
  emit('update:modelValue', cents / 100)
}

const onBlur = () => {
  if (props.modelValue !== null && props.min !== undefined && props.modelValue < props.min) {
    emit('update:modelValue', props.min)
  }
}
</script>

<template>
  <div class="ds-currency" :class="{ 'ds-currency--error': error, 'ds-currency--disabled': disabled }">
    <label v-if="label" :for="id" class="ds-currency__label">
      {{ label }}
      <span v-if="required" class="ds-currency__required" aria-hidden="true">*</span>
    </label>

    <input
      :id="id"
      type="text"
      inputmode="numeric"
      :value="display"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined"
      :aria-invalid="!!error"
      :aria-required="required"
      class="ds-currency__field"
      @input="onInput"
      @blur="onBlur"
    />

    <p v-if="hint && !error" :id="`${id}-hint`" class="ds-currency__hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" class="ds-currency__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.ds-currency { display: flex; flex-direction: column; gap: var(--spacing-1); }
.ds-currency__label { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--color-text-secondary); }
.ds-currency__required { color: var(--color-danger-500); margin-left: 2px; }
.ds-currency__field {
  width: 100%; min-height: var(--size-touch-min);
  padding: 0 var(--spacing-3);
  background: var(--color-bg-surface);
  border: 0.5px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  text-align: right;
  transition: border-color var(--duration-fast), box-shadow var(--duration-fast);
}
.ds-currency__field:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
  border-color: var(--color-primary-500);
}
.ds-currency--error .ds-currency__field { border-color: var(--color-danger-500); }
.ds-currency--error .ds-currency__field:focus-visible { box-shadow: var(--focus-ring-danger); }
.ds-currency__field:disabled { opacity: 0.5; cursor: not-allowed; }
.ds-currency__hint { font-size: var(--font-size-sm); color: var(--color-text-secondary); }
.ds-currency__error { font-size: var(--font-size-sm); color: var(--color-danger-text); }
</style>
