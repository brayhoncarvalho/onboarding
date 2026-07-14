<script setup lang="ts" generic="T extends Record<string, unknown>">
import { provide, computed, ref } from 'vue'
import { useFormValidation, type FormSchema } from '../../composables/useFormValidation'

export interface Props {
  /** Schema declarativo — DsForm cria a instância internamente */
  schema?: FormSchema
  /** Instância pré-criada de useFormValidation (compartilhamento entre steps) */
  form?: ReturnType<typeof useFormValidation>
  /** Desabilita o form inteiro (durante submit) */
  disabled?: boolean
  /** Reset automático após submit success */
  resetOnSubmit?: boolean
  /** ID do form — usado em label/aria */
  id?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [values: T]
  invalid: [errors: Record<string, string | null>]
  reset: []
}>()

// Aceita schema ou instância já criada
const instance = props.form ?? useFormValidation<T>(props.schema ?? {})

const submitting = ref(false)

const onSubmit = async (event: Event) => {
  event.preventDefault()
  if (submitting.value || props.disabled) return

  if (!instance.validate()) {
    emit('invalid', instance.errors as Record<string, string | null>)
    // foca primeiro campo com erro
    requestAnimationFrame(() => {
      const firstError = (event.target as HTMLFormElement)?.querySelector<HTMLElement>(
        '[aria-invalid="true"]'
      )
      firstError?.focus()
    })
    return
  }

  submitting.value = true
  try {
    emit('submit', instance.values as T)
    if (props.resetOnSubmit) instance.reset()
  } finally {
    submitting.value = false
  }
}

const onReset = () => {
  instance.reset()
  emit('reset')
}

// Disponibiliza form a todos os DsFormField descendentes
provide('ds-form', instance)
provide(
  'ds-form-disabled',
  computed(() => props.disabled ?? false)
)

// Expor instance para refs externos
defineExpose({
  values: instance.values,
  errors: instance.errors,
  touched: instance.touched,
  isValid: instance.isValid,
  setValue: instance.setValue,
  setError: instance.setError,
  validate: instance.validate,
  reset: instance.reset,
  submitting,
})
</script>

<template>
  <form
    :id="id"
    class="ds-form"
    novalidate
    :aria-busy="submitting"
    @submit="onSubmit"
    @reset="onReset"
  >
    <slot
      :values="instance.values"
      :errors="instance.errors"
      :touched="instance.touched"
      :is-valid="instance.isValid.value"
      :submitting="submitting"
      :reset="onReset"
    ></slot>
  </form>
</template>

<style scoped>
.ds-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}
.ds-form[aria-busy='true'] {
  opacity: 0.7;
  pointer-events: none;
}
</style>
