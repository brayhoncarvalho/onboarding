/**
 * Funções puras de máscara para campos de formulário.
 * Cada função recebe uma string e retorna a string formatada.
 */

/** Remove tudo que não é dígito */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/** Máscara CPF: 000.000.000-00 */
export function maskCPF(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

/** Máscara CNPJ: 00.000.000/0000-00 */
export function maskCNPJ(value: string): string {
  const digits = onlyDigits(value).slice(0, 14)
  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

/** Máscara CPF/CNPJ automática — detecta pelo comprimento */
export function maskCPFCNPJ(value: string): string {
  const digits = onlyDigits(value)
  if (digits.length <= 11) return maskCPF(value)
  return maskCNPJ(value)
}

/** Máscara data: DD/MM/AAAA */
export function maskDate(value: string): string {
  const digits = onlyDigits(value).slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

/** Máscara valor monetário BRL: R$ 0.000,00 */
export function maskCurrencyBRL(value: string): string {
  const digits = onlyDigits(value)
  if (digits.length === 0) return ''

  const numericValue = parseInt(digits, 10)
  const reais = Math.floor(numericValue / 100)
  const centavos = numericValue % 100

  const reaisFormatted = reais.toLocaleString('pt-BR')
  const centavosFormatted = centavos.toString().padStart(2, '0')

  return `R$ ${reaisFormatted},${centavosFormatted}`
}

/** Extrai valor numérico em centavos de uma string BRL formatada */
export function unmaskCurrencyBRL(value: string): number {
  const digits = onlyDigits(value)
  return digits.length > 0 ? parseInt(digits, 10) : 0
}

/** Máscara valor monetário USD: $ 0,000.00 */
export function maskCurrencyUSD(value: string): string {
  const digits = onlyDigits(value)
  if (digits.length === 0) return ''

  const numericValue = parseInt(digits, 10)
  const dollars = Math.floor(numericValue / 100)
  const cents = numericValue % 100

  const dollarsFormatted = dollars.toLocaleString('en-US')
  const centsFormatted = cents.toString().padStart(2, '0')

  return `$ ${dollarsFormatted}.${centsFormatted}`
}

/** Máscara telefone: (00) 00000-0000 ou (00) 0000-0000 */
export function maskPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length <= 2) return digits.length > 0 ? `(${digits}` : ''
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

/** Máscara CEP: 00000-000 */
export function maskCEP(value: string): string {
  const digits = onlyDigits(value).slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

/** Máscara Agência bancária: até 4 dígitos + dígito verificador opcional (NNNN ou NNNN-D) */
export function maskAgencia(value: string): string {
  const digits = onlyDigits(value).slice(0, 5)
  if (digits.length <= 4) return digits
  return `${digits.slice(0, 4)}-${digits.slice(4)}`
}

/** Máscara Conta bancária: até 10 dígitos, último separado por traço (NNNNNNNNN-D) */
export function maskConta(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length <= 1) return digits
  return `${digits.slice(0, -1)}-${digits.slice(-1)}`
}
