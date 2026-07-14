import { describe, it, expect } from 'vitest'
import { maskCPF, maskCNPJ, maskCPFCNPJ, maskDate, maskCurrencyBRL, maskCurrencyUSD, maskPhone, maskCEP, onlyDigits, unmaskCurrencyBRL } from '../masks'

describe('onlyDigits', () => {
  it('remove caracteres não numéricos', () => {
    expect(onlyDigits('abc123def456')).toBe('123456')
    expect(onlyDigits('412.456.508-90')).toBe('41245650890')
    expect(onlyDigits('')).toBe('')
  })
})

describe('maskCPF', () => {
  it('formata CPF completo', () => {
    expect(maskCPF('41245650890')).toBe('412.456.508-90')
  })

  it('formata CPF parcial progressivamente', () => {
    expect(maskCPF('4')).toBe('4')
    expect(maskCPF('412')).toBe('412')
    expect(maskCPF('4124')).toBe('412.4')
    expect(maskCPF('412456')).toBe('412.456')
    expect(maskCPF('4124565')).toBe('412.456.5')
    expect(maskCPF('412456508')).toBe('412.456.508')
    expect(maskCPF('4124565089')).toBe('412.456.508-9')
  })

  it('limita a 11 dígitos', () => {
    expect(maskCPF('412456508901234')).toBe('412.456.508-90')
  })

  it('lida com valor já formatado', () => {
    expect(maskCPF('412.456.508-90')).toBe('412.456.508-90')
  })

  it('campo vazio retorna vazio', () => {
    expect(maskCPF('')).toBe('')
  })
})

describe('maskCNPJ', () => {
  it('formata CNPJ completo', () => {
    expect(maskCNPJ('13370835000185')).toBe('13.370.835/0001-85')
  })

  it('formata CNPJ parcial progressivamente', () => {
    expect(maskCNPJ('13')).toBe('13')
    expect(maskCNPJ('133')).toBe('13.3')
    expect(maskCNPJ('13370')).toBe('13.370')
    expect(maskCNPJ('133708')).toBe('13.370.8')
    expect(maskCNPJ('13370835')).toBe('13.370.835')
    expect(maskCNPJ('133708350')).toBe('13.370.835/0')
    expect(maskCNPJ('1337083500')).toBe('13.370.835/00')
    expect(maskCNPJ('133708350001')).toBe('13.370.835/0001')
    expect(maskCNPJ('1337083500018')).toBe('13.370.835/0001-8')
  })

  it('limita a 14 dígitos', () => {
    expect(maskCNPJ('133708350001859999')).toBe('13.370.835/0001-85')
  })
})

describe('maskCPFCNPJ', () => {
  it('aplica máscara CPF para até 11 dígitos', () => {
    expect(maskCPFCNPJ('41245650890')).toBe('412.456.508-90')
  })

  it('aplica máscara CNPJ para mais de 11 dígitos', () => {
    expect(maskCPFCNPJ('13370835000185')).toBe('13.370.835/0001-85')
  })
})

describe('maskDate', () => {
  it('formata data completa', () => {
    expect(maskDate('29052000')).toBe('29/05/2000')
  })

  it('formata data parcialmente', () => {
    expect(maskDate('2')).toBe('2')
    expect(maskDate('29')).toBe('29')
    expect(maskDate('290')).toBe('29/0')
    expect(maskDate('2905')).toBe('29/05')
    expect(maskDate('29052')).toBe('29/05/2')
  })

  it('limita a 8 dígitos', () => {
    expect(maskDate('290520001234')).toBe('29/05/2000')
  })

  it('lida com entrada formatada', () => {
    expect(maskDate('29/05/2000')).toBe('29/05/2000')
  })
})

describe('maskCurrencyBRL', () => {
  it('formata valor em reais', () => {
    expect(maskCurrencyBRL('6900000')).toBe('R$ 69.000,00')
  })

  it('formata centavos', () => {
    expect(maskCurrencyBRL('150')).toBe('R$ 1,50')
  })

  it('formata apenas centavos', () => {
    expect(maskCurrencyBRL('50')).toBe('R$ 0,50')
  })

  it('campo vazio retorna vazio', () => {
    expect(maskCurrencyBRL('')).toBe('')
  })

  it('formata valor grande', () => {
    expect(maskCurrencyBRL('20000000')).toBe('R$ 200.000,00')
  })
})

describe('unmaskCurrencyBRL', () => {
  it('extrai centavos de valor formatado', () => {
    expect(unmaskCurrencyBRL('R$ 69.000,00')).toBe(6900000)
  })

  it('retorna 0 para vazio', () => {
    expect(unmaskCurrencyBRL('')).toBe(0)
  })
})

describe('maskCurrencyUSD', () => {
  it('formata valor em dólares', () => {
    expect(maskCurrencyUSD('6900000')).toBe('$ 69,000.00')
  })

  it('campo vazio retorna vazio', () => {
    expect(maskCurrencyUSD('')).toBe('')
  })
})

describe('maskPhone', () => {
  it('formata celular completo (11 dígitos)', () => {
    expect(maskPhone('63954489531')).toBe('(63) 95448-9531')
  })

  it('formata telefone fixo (10 dígitos)', () => {
    expect(maskPhone('6332134567')).toBe('(63) 3213-4567')
  })

  it('formata parcialmente', () => {
    expect(maskPhone('6')).toBe('(6')
    expect(maskPhone('63')).toBe('(63')
    expect(maskPhone('639')).toBe('(63) 9')
    expect(maskPhone('639544')).toBe('(63) 9544')
    expect(maskPhone('6395448')).toBe('(63) 9544-8')
  })

  it('limita a 11 dígitos', () => {
    expect(maskPhone('639544895319999')).toBe('(63) 95448-9531')
  })

  it('campo vazio retorna vazio', () => {
    expect(maskPhone('')).toBe('')
  })
})

describe('maskCEP', () => {
  it('formata CEP completo', () => {
    expect(maskCEP('06460000')).toBe('06460-000')
  })

  it('formata CEP parcial', () => {
    expect(maskCEP('064')).toBe('064')
    expect(maskCEP('06460')).toBe('06460')
    expect(maskCEP('064600')).toBe('06460-0')
  })

  it('limita a 8 dígitos', () => {
    expect(maskCEP('064600001234')).toBe('06460-000')
  })
})
