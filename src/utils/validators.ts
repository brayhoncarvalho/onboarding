/**
 * Funções de validação para campos de formulário.
 * Retornam string com mensagem de erro ou string vazia se válido.
 */

import { onlyDigits } from './masks'

/** Valida CPF com dígitos verificadores (módulo 11) */
export function validateCPF(value: string): string {
  const digits = onlyDigits(value)
  if (digits.length === 0) return 'CPF é obrigatório.'
  if (digits.length !== 11) return 'CPF deve ter 11 dígitos.'

  // Rejeitar CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(digits)) return 'CPF inválido.'

  // Cálculo do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== parseInt(digits[9])) return 'CPF inválido.'

  // Cálculo do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== parseInt(digits[10])) return 'CPF inválido.'

  return ''
}

/** Valida CNPJ com dígitos verificadores (módulo 11) */
export function validateCNPJ(value: string): string {
  const digits = onlyDigits(value)
  if (digits.length === 0) return 'CNPJ é obrigatório.'
  if (digits.length !== 14) return 'CNPJ deve ter 14 dígitos.'

  if (/^(\d)\1{13}$/.test(digits)) return 'CNPJ inválido.'

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * weights1[i]
  }
  let remainder = sum % 11
  const d1 = remainder < 2 ? 0 : 11 - remainder
  if (d1 !== parseInt(digits[12])) return 'CNPJ inválido.'

  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits[i]) * weights2[i]
  }
  remainder = sum % 11
  const d2 = remainder < 2 ? 0 : 11 - remainder
  if (d2 !== parseInt(digits[13])) return 'CNPJ inválido.'

  return ''
}

/** Valida data no formato DD/MM/AAAA */
export function validateDate(value: string): string {
  const digits = onlyDigits(value)
  if (digits.length === 0) return 'Data é obrigatória.'
  if (digits.length !== 8) return 'Data deve estar no formato DD/MM/AAAA.'

  const day = parseInt(digits.slice(0, 2), 10)
  const month = parseInt(digits.slice(2, 4), 10)
  const year = parseInt(digits.slice(4, 8), 10)

  if (month < 1 || month > 12) return 'Mês inválido.'
  if (day < 1 || day > 31) return 'Dia inválido.'

  // Verificar se a data existe
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return 'Data inválida.'
  }

  return ''
}

/** Valida data de nascimento (mínimo 18 anos) */
export function validateBirthDate(value: string): string {
  const baseError = validateDate(value)
  if (baseError) return baseError

  const digits = onlyDigits(value)
  const day = parseInt(digits.slice(0, 2), 10)
  const month = parseInt(digits.slice(2, 4), 10)
  const year = parseInt(digits.slice(4, 8), 10)

  const birthDate = new Date(year, month - 1, day)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  const dayDiff = today.getDate() - birthDate.getDate()

  const isUnder18 = age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))
  if (isUnder18) return 'Você precisa ter pelo menos 18 anos.'

  if (birthDate > today) return 'Data de nascimento não pode ser no futuro.'

  return ''
}

/** Valida valor monetário (em centavos) — maior que zero */
export function validateCurrencyMin(centavos: number, minReais: number): string {
  if (centavos <= 0) return 'Valor deve ser maior que zero.'
  if (centavos < minReais * 100) return `Valor mínimo: R$ ${minReais.toLocaleString('pt-BR')},00.`
  return ''
}

/** Valida valor monetário com máximo */
export function validateCurrencyRange(centavos: number, minReais: number, maxReais: number): string {
  const minError = validateCurrencyMin(centavos, minReais)
  if (minError) return minError
  if (centavos > maxReais * 100) return `Valor máximo: R$ ${maxReais.toLocaleString('pt-BR')},00.`
  return ''
}

/** Valida nome — mínimo 3 caracteres, não permitir apenas espaços */
export function validateName(value: string): string {
  const trimmed = value.trim()
  if (trimmed.length === 0) return 'Nome é obrigatório.'
  if (trimmed.length < 3) return 'Nome deve ter pelo menos 3 caracteres.'
  return ''
}

/** Valida e-mail */
export function validateEmail(value: string): string {
  const trimmed = value.trim()
  if (trimmed.length === 0) return 'E-mail é obrigatório.'

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(trimmed)) return 'E-mail inválido.'

  return ''
}

/** Valida telefone brasileiro com 10 ou 11 dígitos */
export function validatePhone(value: string): string {
  const digits = onlyDigits(value)
  if (digits.length === 0) return 'Celular é obrigatório.'
  if (digits.length < 10 || digits.length > 11) return 'Celular inválido.'

  return ''
}

/** Valida campo obrigatório genérico */
export function validateRequired(value: string, label: string): string {
  if (!value || value.trim().length === 0) return `${label} é obrigatório.`
  return ''
}
