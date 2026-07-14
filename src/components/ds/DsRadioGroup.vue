<script setup lang="ts">
export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface Props {
  modelValue: string
  options: RadioOption[]
  name: string
  label?: string
  error?: string
  layout?: 'vertical' | 'horizontal' | 'card'
}

withDefaults(defineProps<Props>(), { layout: 'vertical' })
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const groupId = `ds-radio-${Math.random().toString(36).slice(2, 7)}`
</script>

<template>
  <fieldset class="ds-radio-group" :aria-describedby="error ? `${groupId}-error` : undefined">
    <legend v-if="label" class="ds-radio-group__legend">{{ label }}</legend>

    <div :class="['ds-radio-group__options', `ds-radio-group__options--${layout}`]">
      <label
        v-for="option in options"
        :key="option.value"
        :class="[
          'ds-radio-option',
          `ds-radio-option--${layout}`,
          {
            'ds-radio-option--selected': modelValue === option.value,
            'ds-radio-option--disabled': option.disabled,
          },
        ]"
      >
        <input
          type="radio"
          :name="name"
          :value="option.value"
          :checked="modelValue === option.value"
          :disabled="option.disabled"
          class="ds-radio-input"
          @change="emit('update:modelValue', option.value)"
        />
        <span
          class="ds-radio-dot"
          :class="{ 'ds-radio-dot--checked': modelValue === option.value }"
          aria-hidden="true"
        ></span>
        <span class="ds-radio-content">
          <span class="ds-radio-label">{{ option.label }}</span>
          <span v-if="option.description" class="ds-radio-description">
            {{ option.description }}
          </span>
        </span>
      </label>
    </div>

    <p v-if="error" :id="`${groupId}-error`" class="ds-radio-group__error" role="alert">
      {{ error }}
    </p>
  </fieldset>
</template>

<style scoped>
.ds-radio-group {
  border: none;
  padding: 0;
  margin: 0;
}
.ds-radio-group__legend {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2);
}

.ds-radio-group__options--vertical {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}
.ds-radio-group__options--horizontal {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--spacing-3);
}
.ds-radio-group__options--card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.ds-radio-option {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-2);
  cursor: pointer;
}
.ds-radio-option--card {
  padding: var(--spacing-3) var(--spacing-4);
  border: 0.5px solid var(--color-border-default);
  border-radius: var(--radius-md);
  transition:
    border-color var(--duration-fast),
    background var(--duration-fast);
}
.ds-radio-option--card.ds-radio-option--selected {
  border-color: var(--color-primary-500);
  background: var(--color-primary-50);
}
.ds-radio-option--card:hover:not(.ds-radio-option--disabled) {
  border-color: var(--color-border-strong);
}
.ds-radio-option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ds-radio-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.ds-radio-input:focus-visible + .ds-radio-dot {
  box-shadow: var(--focus-ring);
}

.ds-radio-dot {
  width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--color-border-strong);
  flex-shrink: 0;
  margin-top: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    border-color var(--duration-fast),
    background var(--duration-fast);
}
.ds-radio-dot--checked {
  border-color: var(--color-primary-500);
  background: var(--color-primary-500);
}
.ds-radio-dot--checked::after {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--color-white);
}

.ds-radio-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ds-radio-label {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  line-height: var(--line-height-snug);
}
.ds-radio-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
.ds-radio-group__error {
  font-size: var(--font-size-sm);
  color: var(--color-danger-text);
  margin-top: var(--spacing-1);
}
</style>
