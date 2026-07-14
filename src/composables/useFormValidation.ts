// ============================================================
// DOCK DESIGN SYSTEM — composables/useFormValidation.ts
// Composable de validação síncrona com mensagens pt-BR.
// Reutilizável em qualquer DsInput / DsSelect / DsCurrencyInput.
// ============================================================

import type { ComputedRef } from 'vue'
import { computed, reactive } from 'vue'

// ─── Tipos ──────────────────────────────────────────────────
export type ValidationResult = string | null // null = válido; string = mensagem de erro

export type Validator<T = unknown> = (
  value: T,
  context?: Record<string, unknown>
) => ValidationResult

export interface FieldSchema<T = unknown> {
  initial?: T
  validators?: Validator<T>[]
  validateOnInput?: boolean // se true, valida a cada update (default: false, só no blur)
}

export type FormSchema = Record<string, FieldSchema>

// ─── Mensagens pt-BR centralizadas ──────────────────────────
// Exportar separadamente para customização por produto.
export const validationMessages = {
  required: (label?: string) => (label ? `${label} é obrigatório` : 'Campo obrigatório'),
  email: () => 'Informe um e-mail válido',
  cpf: () => 'Informe um CPF válido com 11 dígitos',
  cnpj: () => 'Informe um CNPJ válido com 14 dígitos',
  phone: () => 'Informe um telefone válido com DDD',
  date: () => 'Informe uma data válida',
  minLength: (min: number) => `Mínimo de ${min} caracteres`,
  maxLength: (max: number) => `Máximo de ${max} caracteres`,
  min: (min: number, fmt = String) => `Valor mínimo é ${fmt(min)}`,
  max: (max: number, fmt = String) => `Valor máximo é ${fmt(max)}`,
  pattern: () => 'Formato inválido',
  match: (otherLabel: string) => `Não confere com ${otherLabel}`,
  oneOf: () => 'Selecione uma opção válida',
  number: () => 'Informe um número',
  positive: () => 'Valor deve ser maior que zero',
  age: (min: number) => `Idade mínima é ${min} anos`,
}

// ─── Validators reutilizáveis ───────────────────────────────
// Cada validator é uma factory que retorna a função Validator.
// Aceitam label opcional para personalizar a mensagem.

export const required =
  (label?: string): Validator =>
  (v) =>
    v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0)
      ? validationMessages.required(label)
      : null

export const email = (): Validator<string> => (v) =>
  !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : validationMessages.email()

// Validação completa de CPF — dígitos verificadores.
export const cpf = (): Validator<string> => (v) => {
  if (!v) return null
  const digits = v.replace(/\D/g, '')
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return validationMessages.cpf()
  const calcDigit = (slice: number) => {
    let sum = 0
    for (let i = 0; i < slice; i++) sum += parseInt(digits[i]) * (slice + 1 - i)
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }
  if (calcDigit(9) !== parseInt(digits[9])) return validationMessages.cpf()
  if (calcDigit(10) !== parseInt(digits[10])) return validationMessages.cpf()
  return null
}

// Validação completa de CNPJ.
export const cnpj = (): Validator<string> => (v) => {
  if (!v) return null
  const digits = v.replace(/\D/g, '')
  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) return validationMessages.cnpj()
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const calc = (slice: number, weights: number[]) => {
    let sum = 0
    for (let i = 0; i < slice; i++) sum += parseInt(digits[i]) * weights[i]
    const rest = sum % 11
    return rest < 2 ? 0 : 11 - rest
  }
  if (calc(12, weights1) !== parseInt(digits[12])) return validationMessages.cnpj()
  if (calc(13, weights2) !== parseInt(digits[13])) return validationMessages.cnpj()
  return null
}

// Telefone BR — aceita (11) 9XXXX-XXXX, fixo e celular
export const phone = (): Validator<string> => (v) => {
  if (!v) return null
  const digits = v.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 11 ? null : validationMessages.phone()
}

export const minLength =
  (min: number): Validator<string> =>
  (v) =>
    !v || v.length >= min ? null : validationMessages.minLength(min)

export const maxLength =
  (max: number): Validator<string> =>
  (v) =>
    !v || v.length <= max ? null : validationMessages.maxLength(max)

export const minValue =
  (min: number, format = String): Validator<number | null> =>
  (v) =>
    v === null || v === undefined || v >= min ? null : validationMessages.min(min, format)

export const maxValue =
  (max: number, format = String): Validator<number | null> =>
  (v) =>
    v === null || v === undefined || v <= max ? null : validationMessages.max(max, format)

export const pattern =
  (regex: RegExp, message?: string): Validator<string> =>
  (v) =>
    !v || regex.test(v) ? null : (message ?? validationMessages.pattern())

// Validation cruzada — útil para "confirmar senha", "confirmar e-mail"
export const matchField =
  (otherField: string, otherLabel: string): Validator =>
  (v, ctx) =>
    !v || !ctx || v === ctx[otherField] ? null : validationMessages.match(otherLabel)

export const oneOf =
  <T>(allowed: T[]): Validator<T> =>
  (v) =>
    v === null || v === undefined || allowed.includes(v) ? null : validationMessages.oneOf()

export const positive = (): Validator<number | null> => (v) =>
  v === null || v === undefined || v > 0 ? null : validationMessages.positive()

// Idade mínima a partir de Date string (ex: '1995-04-22')
export const minAge =
  (min: number): Validator<string | Date | null> =>
  (v) => {
    if (!v) return null
    const birth = v instanceof Date ? v : new Date(v)
    if (isNaN(birth.getTime())) return validationMessages.date()
    const ageMs = Date.now() - birth.getTime()
    const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000)
    return ageYears >= min ? null : validationMessages.age(min)
  }

// ─── Composable principal ───────────────────────────────────
export interface UseFormValidationReturn<T extends Record<string, unknown>> {
  values: T
  errors: Record<keyof T, string | null>
  touched: Record<keyof T, boolean>
  isValid: ComputedRef<boolean>
  setValue: <K extends keyof T>(field: K, value: T[K]) => void
  setError: <K extends keyof T>(field: K, error: string | null) => void
  validate: () => boolean
  validateField: <K extends keyof T>(field: K) => boolean
  touch: <K extends keyof T>(field: K) => void
  reset: () => void
}

export function useFormValidation<T extends Record<string, unknown>>(
  schema: FormSchema
): UseFormValidationReturn<T> {
  const keys = Object.keys(schema) as (keyof T)[]

  const values = reactive(
    Object.fromEntries(keys.map((k) => [k, schema[k as string].initial ?? null]))
  ) as T

  const errors = reactive(Object.fromEntries(keys.map((k) => [k, null]))) as Record<
    keyof T,
    string | null
  >

  const touched = reactive(Object.fromEntries(keys.map((k) => [k, false]))) as Record<
    keyof T,
    boolean
  >

  const validateField = <K extends keyof T>(field: K): boolean => {
    const validators = schema[field as string]?.validators ?? []
    for (const v of validators) {
      const err = v(values[field], values)
      if (err) {
        errors[field] = err
        return false
      }
    }
    errors[field] = null
    return true
  }

  const validate = (): boolean => {
    let ok = true
    for (const k of keys) {
      touched[k] = true
      if (!validateField(k)) ok = false
    }
    return ok
  }

  const setValue = <K extends keyof T>(field: K, value: T[K]) => {
    ;(values as Record<keyof T, T[keyof T]>)[field] = value
    if (schema[field as string]?.validateOnInput || touched[field]) {
      validateField(field)
    }
  }

  const setError = <K extends keyof T>(field: K, error: string | null) => {
    errors[field] = error
  }

  const touch = <K extends keyof T>(field: K) => {
    touched[field] = true
    validateField(field)
  }

  const reset = () => {
    for (const k of keys) {
      ;(values as Record<keyof T, T[keyof T]>)[k] = (schema[k as string].initial ??
        null) as T[keyof T]
      errors[k] = null
      touched[k] = false
    }
  }

  const isValid = computed(() =>
    keys.every((k) => {
      const validators = schema[k as string]?.validators ?? []
      return validators.every((v) => v(values[k], values) === null)
    })
  )

  return {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setError,
    validate,
    validateField,
    touch,
    reset,
  }
}
