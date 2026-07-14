<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: string
  label?: string
  hint?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  readonly?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), { type: 'text' })
defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = props.id ?? `ds-input-${Math.random().toString(36).slice(2, 7)}`
</script>

<template>
  <div :class="['ds-input-wrapper', { 'ds-input-wrapper--error': error, 'ds-input-wrapper--disabled': disabled }]">
    <label v-if="label" :for="inputId" class="ds-input-label">
      {{ label }}
      <span v-if="required" class="ds-input-required" aria-hidden="true">*</span>
    </label>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :aria-describedby="error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined"
      :aria-invalid="error ? 'true' : undefined"
      :aria-required="required || undefined"
      class="ds-input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />

    <p v-if="hint && !error" :id="`${inputId}-hint`" class="ds-input-hint">{{ hint }}</p>
    <p v-if="error" :id="`${inputId}-error`" class="ds-input-error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.ds-input-wrapper { display: flex; flex-direction: column; gap: var(--spacing-1); }
.ds-input-label { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--color-text-secondary); }
.ds-input-required { color: var(--color-danger-500); margin-left: 2px; }
.ds-input {
  width: 100%; min-height: var(--size-touch-min);
  padding: 0 var(--spacing-3);
  background: var(--color-bg-surface);
  border: 0.5px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-family: inherit; font-size: var(--font-size-base);
  color: var(--color-text-primary);
  transition: border-color var(--duration-fast), box-shadow var(--duration-fast);
}
.ds-input:hover:not(:disabled):not(:read-only) { border-color: var(--color-border-strong); }
.ds-input:focus-visible { outline: none; box-shadow: var(--focus-ring); border-color: var(--color-primary-500); }
.ds-input:disabled { opacity: 0.5; cursor: not-allowed; }
.ds-input-wrapper--error .ds-input { border-color: var(--color-danger-500); }
.ds-input-wrapper--error .ds-input:focus-visible { box-shadow: var(--focus-ring-danger); }
.ds-input-hint { font-size: var(--font-size-sm); color: var(--color-text-secondary); }
.ds-input-error { font-size: var(--font-size-sm); color: var(--color-danger-text); }
</style>
