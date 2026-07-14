<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { maskCPF, maskCurrencyBRL, onlyDigits } from '../utils/masks'
import { validateCPF, validateDate } from '../utils/validators'

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'continuar'): void
}>()

const cpf = ref('')
const nome = ref('')
const dataNascimento = ref<Date | undefined>(undefined)
const dataNascimentoInput = ref('')
const valorEmprestimo = ref('')
const motivoEmprestimo = ref('')
const rendaBruta = ref('')
const aceitouTermos1 = ref(false)
const aceitouTermos2 = ref(false)
const submitted = ref(false)

const motivoOptions = [
  { label: 'Pagamento de dívidas', value: 'pagamento-dividas' },
  { label: 'Reforma', value: 'reforma' },
  { label: 'Investimento', value: 'investimento' },
  { label: 'Educação', value: 'educacao' },
  { label: 'Saúde', value: 'saude' },
  { label: 'Outros', value: 'outros' },
]

const touched = ref({ cpf: false, nome: false, dataNascimento: false, valorEmprestimo: false, motivoEmprestimo: false, rendaBruta: false })

const cpfError = computed(() => {
  if (!submitted.value && !touched.value.cpf) return undefined
  return validateCPF(cpf.value) || undefined
})
const nomeError = computed(() => {
  if (!submitted.value && !touched.value.nome) return undefined
  if (!nome.value.trim() || nome.value.trim().length < 3) return 'Nome é obrigatório (mín. 3 caracteres).'
  return undefined
})
const dataNascimentoError = computed(() => {
  if (!submitted.value && !touched.value.dataNascimento) return undefined
  if (!dataNascimento.value) return 'Data de Nascimento é obrigatória.'
  const fmt = `${String(dataNascimento.value.getDate()).padStart(2,'0')}/${String(dataNascimento.value.getMonth()+1).padStart(2,'0')}/${dataNascimento.value.getFullYear()}`
  return validateDate(fmt) || undefined
})
const valorEmprestimoError = computed(() => {
  if (!submitted.value && !touched.value.valorEmprestimo) return undefined
  const centavos = parseInt(onlyDigits(valorEmprestimo.value), 10)
  if (!centavos) return 'Valor do empréstimo é obrigatório.'
  if (centavos < 100000) return 'Valor mínimo: R$ 1.000,00.'
  if (centavos > 20000000) return 'Valor máximo: R$ 200.000,00.'
  return undefined
})
const motivoError = computed(() => {
  if (!submitted.value && !touched.value.motivoEmprestimo) return undefined
  if (!motivoEmprestimo.value) return 'Motivo do empréstimo é obrigatório.'
  return undefined
})
const rendaError = computed(() => {
  if (!submitted.value && !touched.value.rendaBruta) return undefined
  const num = parseInt(onlyDigits(rendaBruta.value), 10)
  if (!num || num <= 0) return 'Renda bruta é obrigatória.'
  return undefined
})
const termosError = computed(() => {
  if (!submitted.value) return undefined
  if (!aceitouTermos1.value || !aceitouTermos2.value) return 'Você precisa aceitar os termos para continuar.'
  return undefined
})
const hasErrors = computed(() => !!(cpfError.value || nomeError.value || dataNascimentoError.value || valorEmprestimoError.value || motivoError.value || rendaError.value || termosError.value))

function onCpfInput(e: Event) {
  const input = e.target as HTMLInputElement
  cpf.value = maskCPF(input.value)
  nextTick(() => { input.value = cpf.value })
}
function onValorInput(e: Event) {
  const input = e.target as HTMLInputElement
  valorEmprestimo.value = maskCurrencyBRL(input.value)
  nextTick(() => { input.value = valorEmprestimo.value })
}
function onRendaInput(e: Event) {
  const input = e.target as HTMLInputElement
  rendaBruta.value = maskCurrencyBRL(input.value)
  nextTick(() => { input.value = rendaBruta.value })
}
function onDataInput(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.value) dataNascimento.value = new Date(input.value + 'T00:00:00')
  else dataNascimento.value = undefined
  dataNascimentoInput.value = input.value
}
function handleSubmit() {
  submitted.value = true
  if (hasErrors.value) {
    nextTick(() => {
      const el = document.querySelector('[data-error-testid]')
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    return
  }
  emit('continuar')
}
</script>

<template>
  <div class="cad-screen">
    <header class="proposal-header">
      <div class="proposal-header__inner">
        <img src="/assets/dock-logo-color.png" alt="Dock" class="proposal-header__logo" />
        <button type="button" class="proposal-header__back" @click="emit('voltar')" aria-label="Voltar">
          <span aria-hidden="true">←</span> Voltar
        </button>
      </div>
    </header>
    <main class="proposal-main">
      <div class="proposal-main__inner">
        <h1 class="cad-title">Solicite uma proposta<br>sem compromisso</h1>
        <form class="proposal-form" @submit.prevent="handleSubmit" novalidate>
          <!-- CPF -->
          <div class="proposal-field">
            <label for="cad-cpf">CPF</label>
            <input id="cad-cpf" :value="cpf" type="text" inputmode="numeric" placeholder="000.000.000-00" maxlength="14" autocomplete="off" class="proposal-input" :class="{ 'is-error': !!cpfError }" :aria-invalid="!!cpfError" :aria-describedby="cpfError ? 'cad-cpf-err' : undefined" @input="onCpfInput" @blur="touched.cpf = true" />
            <p v-if="cpfError" id="cad-cpf-err" class="proposal-field-error" role="alert" data-error-testid>{{ cpfError }}</p>
          </div>
          <!-- Nome -->
          <div class="proposal-field">
            <label for="cad-nome">Nome completo</label>
            <input id="cad-nome" v-model="nome" type="text" placeholder="Digite seu nome completo" autocomplete="name" class="proposal-input" :class="{ 'is-error': !!nomeError }" :aria-invalid="!!nomeError" :aria-describedby="nomeError ? 'cad-nome-err' : undefined" @blur="touched.nome = true" />
            <p v-if="nomeError" id="cad-nome-err" class="proposal-field-error" role="alert" data-error-testid>{{ nomeError }}</p>
          </div>
          <!-- Data nascimento -->
          <div class="proposal-field">
            <label for="cad-nascimento">Data de Nascimento</label>
            <input id="cad-nascimento" :value="dataNascimentoInput" type="date" class="proposal-input" :class="{ 'is-error': !!dataNascimentoError }" :aria-invalid="!!dataNascimentoError" :aria-describedby="dataNascimentoError ? 'cad-nasc-err' : undefined" @input="onDataInput" @blur="touched.dataNascimento = true" />
            <p v-if="dataNascimentoError" id="cad-nasc-err" class="proposal-field-error" role="alert" data-error-testid>{{ dataNascimentoError }}</p>
          </div>
          <!-- Valor empréstimo -->
          <div class="proposal-field">
            <label for="cad-valor">Valor do Empréstimo</label>
            <input id="cad-valor" :value="valorEmprestimo" type="text" inputmode="numeric" placeholder="R$ 0,00" class="proposal-input" :class="{ 'is-error': !!valorEmprestimoError }" :aria-invalid="!!valorEmprestimoError" :aria-describedby="valorEmprestimoError ? 'cad-valor-err' : undefined" @input="onValorInput" @blur="touched.valorEmprestimo = true" />
            <p v-if="valorEmprestimoError" id="cad-valor-err" class="proposal-field-error" role="alert" data-error-testid>{{ valorEmprestimoError }}</p>
          </div>
          <!-- Motivo -->
          <div class="proposal-field">
            <label for="cad-motivo">Motivo do Empréstimo</label>
            <div class="cad-select-wrap">
              <select id="cad-motivo" v-model="motivoEmprestimo" class="proposal-input cad-select" :class="{ 'is-error': !!motivoError }" :aria-invalid="!!motivoError" :aria-describedby="motivoError ? 'cad-motivo-err' : undefined" @blur="touched.motivoEmprestimo = true">
                <option value="" disabled>Selecione o motivo</option>
                <option v-for="opt in motivoOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <span class="cad-chevron" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5b6b6c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
            </div>
            <p v-if="motivoError" id="cad-motivo-err" class="proposal-field-error" role="alert" data-error-testid>{{ motivoError }}</p>
          </div>
          <!-- Renda bruta -->
          <div class="proposal-field">
            <label for="cad-renda">Renda Bruta</label>
            <input id="cad-renda" :value="rendaBruta" type="text" inputmode="numeric" placeholder="R$ 0,00" class="proposal-input" :class="{ 'is-error': !!rendaError }" :aria-invalid="!!rendaError" :aria-describedby="rendaError ? 'cad-renda-err' : undefined" @input="onRendaInput" @blur="touched.rendaBruta = true" />
            <p v-if="rendaError" id="cad-renda-err" class="proposal-field-error" role="alert" data-error-testid>{{ rendaError }}</p>
          </div>
          <!-- Termos -->
          <fieldset class="cad-fieldset">
            <legend class="cad-legend">Termos e condições</legend>
            <label class="cad-check-row">
              <input v-model="aceitouTermos1" type="checkbox" style="accent-color:#00d8d8;" :aria-invalid="submitted && !aceitouTermos1" />
              <span class="cad-check-text">Li e aceito a <a href="#" class="cad-link">Política de Privacidade</a> e os <a href="#" class="cad-link">Termos de Uso</a>.</span>
            </label>
            <label class="cad-check-row">
              <input v-model="aceitouTermos2" type="checkbox" style="accent-color:#00d8d8;" :aria-invalid="submitted && !aceitouTermos2" />
              <span class="cad-check-text">Autorizo a consulta ao meu CPF e histórico de crédito.</span>
            </label>
            <p v-if="termosError" class="proposal-field-error" role="alert" data-error-testid>{{ termosError }}</p>
          </fieldset>
          <button type="submit" class="proposal-submit">Continuar</button>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.cad-screen { min-height: 100vh; background: #fafcfc; display: flex; flex-direction: column; }
.proposal-header { position: sticky; top: 0; z-index: 10; background: #fafcfc; border-bottom: 1px solid #e3edec; }
.proposal-header__inner { max-width: 1024px; margin: 0 auto; padding: 0 20px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
.proposal-header__logo { height: 24px; width: auto; }
.proposal-header__back { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border: 1.5px solid #e3edec; border-radius: 999px; background: transparent; color: #0b2528; font-family: "Instrument Sans", sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
.proposal-header__back:hover { background: #f0f7f7; }
.proposal-main { flex: 1; padding: 32px 20px 64px; }
.proposal-main__inner { max-width: 560px; margin: 0 auto; }
.cad-title { font-family: "Bricolage Grotesque", sans-serif; font-size: 28px; font-weight: 700; color: #0b2528; margin: 0 0 28px; line-height: 1.2; text-align: center; }
.proposal-form { background: #ffffff; border: 1px solid #e3edec; border-radius: 20px; box-shadow: 0 8px 32px rgba(6,59,62,0.06); padding: 28px 24px; display: flex; flex-direction: column; gap: 16px; }
.proposal-field { display: flex; flex-direction: column; gap: 6px; }
.proposal-field label { font-family: "Instrument Sans", sans-serif; font-size: 13px; font-weight: 500; color: #0b2528; }
.proposal-input { height: 50px; border: 1.5px solid #d5e4e2; border-radius: 12px; padding: 0 14px; font-family: "Instrument Sans", sans-serif; font-size: 15px; color: #0b2528; background: #ffffff; outline: none; transition: border-color 0.15s; width: 100%; box-sizing: border-box; }
.proposal-input:focus { border-color: #063b3e; }
.proposal-input.is-error { border-color: #dc3545; }
.proposal-field-error { font-family: "Instrument Sans", sans-serif; font-size: 12px; color: #dc3545; margin: 0; }
.cad-select-wrap { position: relative; }
.cad-select { appearance: none; cursor: pointer; }
.cad-chevron { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; display: flex; align-items: center; }
.cad-fieldset { border: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.cad-legend { font-family: "Instrument Sans", sans-serif; font-size: 13px; font-weight: 500; color: #0b2528; margin-bottom: 4px; }
.cad-check-row { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-family: "Instrument Sans", sans-serif; font-size: 14px; color: #5b6b6c; line-height: 1.4; }
.cad-check-text { flex: 1; }
.cad-link { color: #00d8d8; text-decoration: underline; }
.proposal-submit { width: 100%; height: 52px; border: none; border-radius: 999px; background: #00d8d8; color: #042a2c; font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.15s; margin-top: 8px; }
.proposal-submit:hover { background: #0fc5c5; }
@media (min-width: 640px) { .proposal-header__inner { height: 72px; } .proposal-header__logo { height: 26px; } .proposal-main { padding: 40px 32px 80px; } .cad-title { font-size: 34px; } .proposal-form { padding: 36px 40px; border-radius: 24px; } }
</style>