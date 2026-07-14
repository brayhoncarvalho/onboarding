<script setup lang="ts">
import { inject, computed } from 'vue'
import type { ComputedRef } from 'vue'
import DsButton from './DsButton.vue'
import type { UseFormValidationReturn } from '../../composables/useFormValidation'

interface Props {
  label?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  /** Bloqueia até form ser válido (default: true) */
  disableWhenInvalid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Enviar',
  variant: 'primary',
  size: 'md',
  disableWhenInvalid: true,
})

const form = inject<UseFormValidationReturn<Record<string, unknown>>>('ds-form')
const formDisabled = inject<ComputedRef<boolean>>('ds-form-disabled')

const disabled = computed(() => {
  if (formDisabled?.value) return true
  if (props.disableWhenInvalid && form && !form.isValid.value) return true
  return false
})
</script>

<template>
  <DsButton
    type="submit"
    :variant="variant"
    :size="size"
    :full-width="fullWidth"
    :disabled="disabled"
  >
    <slot>{{ label }}</slot>
  </DsButton>
</template>
