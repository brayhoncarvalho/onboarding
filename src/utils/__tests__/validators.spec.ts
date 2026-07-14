import { describe, it, expect } from 'vitest'
import { validateCPF, validateCNPJ, validateDate, validateBirthDate, validateCurrencyMin, validateCurrencyRange, validateEmail, validateName, validatePhone, validateRequired } from '../validators'

describe('validateCPF', () => {
  it('aceita CPF válido', () => {
    expect(validateCPF('412.456.508-90')).toBe('')
    expect(validateCPF('52998224725')).toBe('')
  })

  it('rejeita CPF com dígitos iguais', () => {
    expect(validateCPF('111.111.111-11')).toBe('CPF inválido.')
    expect(validateCPF('000.000.000-00')).toBe('CPF inválido.')
  })

  it('rejeita CPF com dígitos verificadores incorretos', () => {
    expect(validateCPF('412.456.508-91')).toBe('CPF inválido.')
    expect(validateCPF('123.456.789-00')).toBe('CPF inválido.')
  })

  it('rejeita CPF incompleto', () => {
    expect(validateCPF('412.456.50')).toBe('CPF deve ter 11 dígitos.')
  })

  it('rejeita CPF vazio', () => {
    expect(validateCPF('')).toBe('CPF é obrigatório.')
  })
})

describe('validateCNPJ', () => {
  it('aceita CNPJ válido', () => {
    expect(validateCNPJ('11.222.333/0001-81')).toBe('')
    expect(validateCNPJ('11222333000181')).toBe('')
  })

  it('rejeita CNPJ com dígitos iguais', () => {
    expect(validateCNPJ('11.111.111/1111-11')).toBe('CNPJ inválido.')
  })

  it('rejeita CNPJ com dígitos verificadores incorretos', () => {
    expect(validateCNPJ('11.222.333/0001-82')).toBe('CNPJ inválido.')
  })

  it('rejeita CNPJ incompleto', () => {
    expect(validateCNPJ('11.222.333/000')).toBe('CNPJ deve ter 14 dígitos.')
  })

  it('rejeita CNPJ vazio', () => {
    expect(validateCNPJ('')).toBe('CNPJ é obrigatório.')
  })
})

describe('validateDate', () => {
  it('aceita data válida', () => {
    expect(validateDate('29/05/2000')).toBe('')
    expect(validateDate('01/01/1990')).toBe('')
  })

  it('rejeita data inexistente (30/02)', () => {
    expect(validateDate('30/02/2000')).toBe('Data inválida.')
  })

  it('rejeita mês inválido', () => {
    expect(validateDate('01/13/2000')).toBe('Mês inválido.')
  })

  it('rejeita dia inválido', () => {
    expect(validateDate('32/01/2000')).toBe('Dia inválido.')
  })

  it('rejeita data incompleta', () => {
    expect(validateDate('29/05')).toBe('Data deve estar no formato DD/MM/AAAA.')
  })

  it('rejeita vazio', () => {
    expect(validateDate('')).toBe('Data é obrigatória.')
  })
})

describe('validateBirthDate', () => {
  it('aceita data com mais de 18 anos', () => {
    expect(validateBirthDate('01/01/1990')).toBe('')
  })

  it('rejeita menor de 18 anos', () => {
    const today = new Date()
    const recentYear = today.getFullYear() - 10
    const dateStr = `01/01/${recentYear}`
    expect(validateBirthDate(dateStr)).toBe('Você precisa ter pelo menos 18 anos.')
  })

  it('rejeita data futura', () => {
    const futureYear = new Date().getFullYear() + 1
    expect(validateBirthDate(`01/01/${futureYear}`)).toBe('Você precisa ter pelo menos 18 anos.')
  })

  it('propaga erros de formato', () => {
    expect(validateBirthDate('30/02/1990')).toBe('Data inválida.')
  })
})

describe('validateCurrencyMin', () => {
  it('aceita valor acima do mínimo', () => {
    expect(validateCurrencyMin(500000, 1000)).toBe('')
  })

  it('rejeita valor zero', () => {
    expect(validateCurrencyMin(0, 1000)).toBe('Valor deve ser maior que zero.')
  })

  it('rejeita valor abaixo do mínimo', () => {
    expect(validateCurrencyMin(50000, 1000)).toBe('Valor mínimo: R$ 1.000,00.')
  })
})

describe('validateCurrencyRange', () => {
  it('aceita valor dentro do range', () => {
    expect(validateCurrencyRange(5000000, 1000, 200000)).toBe('')
  })

  it('rejeita valor acima do máximo', () => {
    expect(validateCurrencyRange(30000000, 1000, 200000)).toBe('Valor máximo: R$ 200.000,00.')
  })

  it('rejeita valor abaixo do mínimo', () => {
    expect(validateCurrencyRange(50000, 1000, 200000)).toBe('Valor mínimo: R$ 1.000,00.')
  })
})

describe('validateName', () => {
  it('aceita nome válido', () => {
    expect(validateName('João Silva')).toBe('')
  })

  it('rejeita nome curto', () => {
    expect(validateName('Jo')).toBe('Nome deve ter pelo menos 3 caracteres.')
  })

  it('rejeita apenas espaços', () => {
    expect(validateName('   ')).toBe('Nome é obrigatório.')
  })

  it('rejeita vazio', () => {
    expect(validateName('')).toBe('Nome é obrigatório.')
  })
})

describe('validateEmail', () => {
  it('aceita e-mail válido', () => {
    expect(validateEmail('brayhon@gmail.com')).toBe('')
  })

  it('rejeita e-mail inválido', () => {
    expect(validateEmail('brayhon.carvalho')).toBe('E-mail inválido.')
  })

  it('rejeita vazio', () => {
    expect(validateEmail('')).toBe('E-mail é obrigatório.')
  })
})

describe('validatePhone', () => {
  it('aceita celular com 11 dígitos', () => {
    expect(validatePhone('(11) 95448-9531')).toBe('')
  })

  it('aceita telefone com 10 dígitos', () => {
    expect(validatePhone('(11) 5448-9531')).toBe('')
  })

  it('rejeita telefone curto', () => {
    expect(validatePhone('(11) 9544-953')).toBe('Celular inválido.')
  })

  it('rejeita vazio', () => {
    expect(validatePhone('')).toBe('Celular é obrigatório.')
  })
})

describe('validateRequired', () => {
  it('aceita valor preenchido', () => {
    expect(validateRequired('algo', 'Campo')).toBe('')
  })

  it('rejeita vazio', () => {
    expect(validateRequired('', 'Motivo')).toBe('Motivo é obrigatório.')
  })

  it('rejeita apenas espaços', () => {
    expect(validateRequired('   ', 'Campo')).toBe('Campo é obrigatório.')
  })
})
