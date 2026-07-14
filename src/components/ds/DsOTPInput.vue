<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

interface Props {
  modelValue: string
  length?: number
  label?: string
  error?: string
  disabled?: boolean
  autoFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), { length: 6 })
const emit = defineEmits<{ 'update:modelValue': [value: string]; complete: [value: string] }>()

const id = `ds-otp-${Math.random().toString(36).slice(2, 7)}`
const refs = ref<HTMLInputElement[]>([])

const digits = computed(() =>
  Array.from({ length: props.length }, (_, i) => props.modelValue[i] ?? '')
)

const setDigit = (index: number, value: string) => {
  const sanitized = value.replace(/\D/g, '').slice(-1)
  const chars = props.modelValue.split('')
  chars[index] = sanitized
  const next = chars.join('').padEnd(0, '').slice(0, props.length)
  emit('update:modelValue', next)
  if (next.length === props.length && !next.includes(' ')) emit('complete', next)
}

const onInput = async (event: Event, index: number) => {
  const v = (event.target as HTMLInputElement).value
  setDigit(index, v)
  if (v && index < props.length - 1) {
    await nextTick()
    refs.value[index + 1]?.focus()
  }
}

const onKey = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    refs.value[index - 1]?.focus()
  }
  if (event.key === 'ArrowLeft' && index > 0) refs.value[index - 1]?.focus()
  if (event.key === 'ArrowRight' && index < props.length - 1) refs.value[index + 1]?.focus()
}

const onPaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const text = event.clipboardData?.getData('text') ?? ''
  const digits = text.replace(/\D/g, '').slice(0, props.length)
  emit('update:modelValue', digits)
  if (digits.length === props.length) emit('complete', digits)
  nextTick(() => refs.value[Math.min(digits.length, props.length - 1)]?.focus())
}
</script>

<template>
  <div class="ds-otp" :class="{ 'ds-otp--error': error }">
    <label v-if="label" :for="`${id}-0`" class="ds-otp__label">{{ label }}</label>
    <div class="ds-otp__group" role="group" :aria-label="label || 'Código de verificação'">
      <input
        v-for="(d, i) in digits"
        :id="`${id}-${i}`"
        :key="i"
        :ref="(el) => { if (el) refs[i] = el as HTMLInputElement }"
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        maxlength="1"
        :value="d"
        :disabled="disabled"
        :aria-label="`Dígito ${i + 1} de ${length}`"
        :aria-invalid="!!error"
        class="ds-otp__field"
        @input="(e) => onInput(e, i)"
        @keydown="(e) => onKey(e, i)"
        @paste="onPaste"
      />
    </div>
    <p v-if="error" class="ds-otp__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.ds-otp { display: flex; flex-direction: column; gap: var(--spacing-2); }
.ds-otp__label { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--color-text-secondary); }
.ds-otp__group { display: flex; gap: var(--spacing-2); }
.ds-otp__field {
  width: 44px; height: 52px;
  text-align: center;
  background: var(--color-bg-surface);
  border: 0.5px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  transition: border-color var(--duration-fast), box-shadow var(--duration-fast);
}
.ds-otp__field:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
  border-color: var(--color-primary-500);
}
.ds-otp--error .ds-otp__field { border-color: var(--color-danger-500); }
.ds-otp__error { font-size: var(--font-size-sm); color: var(--color-danger-text); }
</style>
