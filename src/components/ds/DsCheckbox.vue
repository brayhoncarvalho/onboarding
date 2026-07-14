<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  modelValue: boolean | string[]
  value?: string
  label: string
  description?: string
  disabled?: boolean
  error?: string
  indeterminate?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<{ 'update:modelValue': [value: boolean | string[]] }>()

const checkId = props.id ?? `ds-checkbox-${Math.random().toString(36).slice(2, 7)}`

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.value ? props.modelValue.includes(props.value) : false
  }
  return props.modelValue
})

const onChange = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  if (Array.isArray(props.modelValue) && props.value) {
    const next = checked
      ? [...props.modelValue, props.value]
      : props.modelValue.filter(v => v !== props.value)
    emit('update:modelValue', next)
  } else {
    emit('update:modelValue', checked)
  }
}
</script>

<template>
  <div :class="['ds-checkbox-wrapper', { 'ds-checkbox-wrapper--disabled': disabled, 'ds-checkbox-wrapper--error': error }]">
    <div class="ds-checkbox-input-row">
      <input
        :id="checkId"
        type="checkbox"
        :checked="isChecked"
        :disabled="disabled"
        :indeterminate="indeterminate"
        :aria-describedby="error ? `${checkId}-error` : description ? `${checkId}-desc` : undefined"
        :aria-invalid="!!error"
        class="ds-checkbox-input"
        @change="onChange"
      />
      <label :for="checkId" class="ds-checkbox-label">
        {{ label }}
      </label>
    </div>
    <p v-if="description && !error" :id="`${checkId}-desc`" class="ds-checkbox-description">
      {{ description }}
    </p>
    <p v-if="error" :id="`${checkId}-error`" class="ds-checkbox-error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.ds-checkbox-wrapper { display: flex; flex-direction: column; gap: var(--spacing-1); }
.ds-checkbox-wrapper--disabled { opacity: 0.5; cursor: not-allowed; }

.ds-checkbox-input-row { display: flex; align-items: flex-start; gap: var(--spacing-2); }

.ds-checkbox-input {
  width: 18px;
  height: 18px;
  margin: 0;
  flex-shrink: 0;
  margin-top: 1px;
  accent-color: var(--color-primary-500);
  cursor: pointer;
  border-radius: var(--radius-sm);
}
.ds-checkbox-input:focus-visible { box-shadow: var(--focus-ring); outline: none; }
.ds-checkbox-input:disabled { cursor: not-allowed; }

.ds-checkbox-label {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  cursor: pointer;
  line-height: var(--line-height-normal);
}
.ds-checkbox-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  padding-left: 26px;
}
.ds-checkbox-error {
  font-size: var(--font-size-sm);
  color: var(--color-danger-text);
  padding-left: 26px;
}
.ds-checkbox-wrapper--error .ds-checkbox-label { color: var(--color-danger-text); }
</style>
