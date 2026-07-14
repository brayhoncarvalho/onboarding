<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ComputedRef } from 'vue'
import DsInput from './DsInput.vue'
import DsCurrencyInput from './DsCurrencyInput.vue'
import DsTextarea from './DsTextarea.vue'
import DsSelect from './DsSelect.vue'
import DsCheckbox from './DsCheckbox.vue'
import DsSwitch from './DsSwitch.vue'
import DsRadioGroup from './DsRadioGroup.vue'
import DsDatePicker from './DsDatePicker.vue'
import DsSlider from './DsSlider.vue'

import type { UseFormValidationReturn } from '../../composables/useFormValidation'

type FieldComponent =
  | 'input'
  | 'currency'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'switch'
  | 'radio'
  | 'date'
  | 'slider'

interface Props {
  name: string
  component: FieldComponent
  label?: string
  hint?: string
  required?: boolean
  /** Props passadas direto para o componente subjacente */
  componentProps?: Record<string, unknown>
}

const props = withDefaults(defineProps<Props>(), { componentProps: () => ({}) })

const form = inject<UseFormValidationReturn<Record<string, unknown>>>('ds-form')
const formDisabled = inject<ComputedRef<boolean>>('ds-form-disabled')

if (!form) {
  throw new Error('[DsFormField] precisa estar dentro de <DsForm>')
}

const componentMap = {
  input: DsInput,
  currency: DsCurrencyInput,
  textarea: DsTextarea,
  select: DsSelect,
  checkbox: DsCheckbox,
  switch: DsSwitch,
  radio: DsRadioGroup,
  date: DsDatePicker,
  slider: DsSlider,
}

const resolved = computed(() => componentMap[props.component])

const value = computed({
  get: () => form.values[props.name],
  set: (v) => form.setValue(props.name, v),
})

const error = computed(() => form.errors[props.name] ?? undefined)
const touched = computed(() => form.touched[props.name])

const onBlur = () => form.touch(props.name)

const isDisabled = computed(() => {
  const fromForm = !!(formDisabled && formDisabled.value === true)
  const fromProps = props.componentProps?.disabled === true
  return fromForm || fromProps
})

const resolvedProps = computed<Record<string, unknown>>(() => ({
  ...props.componentProps,
  modelValue: value.value,
  label: props.label,
  hint: props.hint,
  error: touched.value ? error.value : undefined,
  required: props.required,
  disabled: isDisabled.value,
  onBlur,
  'onUpdate:modelValue': (nextValue: unknown) => {
    value.value = nextValue
  },
}))
</script>

<template>
  <component :is="resolved" v-bind="resolvedProps" />
</template>
