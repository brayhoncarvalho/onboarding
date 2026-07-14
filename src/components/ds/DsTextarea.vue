<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

interface Props {
  modelValue: string
  label?: string
  hint?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  rows?: number
  maxLength?: number
  autoResize?: boolean
}

const props = withDefaults(defineProps<Props>(), { rows: 4 })
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const id = `ds-textarea-${Math.random().toString(36).slice(2, 7)}`
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const resize = async () => {
  if (!props.autoResize || !textareaRef.value) return
  await nextTick()
  textareaRef.value.style.height = 'auto'
  textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
}

watch(() => props.modelValue, resize, { immediate: true })

const count = computed(() => props.modelValue.length)
</script>

<template>
  <div class="ds-textarea" :class="{ 'ds-textarea--error': error, 'ds-textarea--disabled': disabled }">
    <label v-if="label" :for="id" class="ds-textarea__label">
      {{ label }}
      <span v-if="required" class="ds-textarea__required" aria-hidden="true">*</span>
    </label>

    <textarea
      :id="id"
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxLength"
      :aria-describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined"
      :aria-invalid="!!error"
      :aria-required="required"
      class="ds-textarea__field"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>

    <div class="ds-textarea__footer">
      <p v-if="hint && !error" :id="`${id}-hint`" class="ds-textarea__hint">{{ hint }}</p>
      <p v-if="error" :id="`${id}-error`" class="ds-textarea__error" role="alert">{{ error }}</p>
      <span v-if="maxLength" class="ds-textarea__counter" aria-live="polite">
        {{ count }}/{{ maxLength }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.ds-textarea { display: flex; flex-direction: column; gap: var(--spacing-1); }
.ds-textarea__label { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--color-text-secondary); }
.ds-textarea__required { color: var(--color-danger-500); margin-left: 2px; }
.ds-textarea__field {
  width: 100%; min-height: 80px;
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--color-bg-surface);
  border: 0.5px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-family: inherit; font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  resize: vertical;
  transition: border-color var(--duration-fast), box-shadow var(--duration-fast);
}
.ds-textarea__field:hover:not(:disabled) { border-color: var(--color-border-strong); }
.ds-textarea__field:focus-visible { outline: none; box-shadow: var(--focus-ring); border-color: var(--color-primary-500); }
.ds-textarea__field:disabled { opacity: 0.5; cursor: not-allowed; }
.ds-textarea--error .ds-textarea__field { border-color: var(--color-danger-500); }
.ds-textarea--error .ds-textarea__field:focus-visible { box-shadow: var(--focus-ring-danger); }
.ds-textarea__footer { display: flex; justify-content: space-between; gap: var(--spacing-2); }
.ds-textarea__hint { font-size: var(--font-size-sm); color: var(--color-text-secondary); flex: 1; }
.ds-textarea__error { font-size: var(--font-size-sm); color: var(--color-danger-text); flex: 1; }
.ds-textarea__counter { font-size: var(--font-size-xs); color: var(--color-text-disabled); font-variant-numeric: tabular-nums; }
</style>
