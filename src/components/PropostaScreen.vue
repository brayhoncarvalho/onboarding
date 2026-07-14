<script setup lang="ts">
import { ref, reactive, nextTick, withDefaults, defineProps } from 'vue'
import { maskCPF, maskCurrencyBRL, onlyDigits } from '../utils/masks'
import { validateCPF, validateDate, validateName } from '../utils/validators'

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'continuar'): void
}>()

const props = withDefaults(
  defineProps<{ valorInicial?: number }>(),
  { valorInicial: 0 }
)

const IS_DEV_PREFILL = true

// Pré-preencher valor com o da simulação, se informado; caso contrário, usar mock de dev
const valorInicialFormatado = props.valorInicial > 0
  ? props.valorInicial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  : (IS_DEV_PREFILL ? 'R$ 3.500,00' : '')

// Campos do formulário
const nome = ref(IS_DEV_PREFILL ? 'Brayhon Oliveira Carvalho' : '')
const cpf = ref(IS_DEV_PREFILL ? '412.456.508-90' : '')
const dataNascimentoDisplay = ref(IS_DEV_PREFILL ? '29/05/2000' : '')
const dataNascimentoISO = ref(IS_DEV_PREFILL ? '2000-05-29' : '')
const valorEmprestimo = ref(valorInicialFormatado)
const motivoEmprestimo = ref(IS_DEV_PREFILL ? 'pagamento-dividas' : '')
const rendaBruta = ref(IS_DEV_PREFILL ? 'R$ 8.500,00' : '')
const aceitouTermos1 = ref(IS_DEV_PREFILL)
const aceitouTermos2 = ref(IS_DEV_PREFILL)

// Estado de validação
const errors = reactive({
  nome: '',
  cpf: '',
  dataNascimento: '',
  valorEmprestimo: '',
  motivoEmprestimo: '',
  rendaBruta: '',
  checkboxes: '',
})

const touched = reactive({
  nome: false,
  cpf: false,
  dataNascimento: false,
  valorEmprestimo: false,
  motivoEmprestimo: false,
  rendaBruta: false,
})

// Opções de motivo
const motivoOptions = [
  { label: 'Pagamento de dívidas', value: 'pagamento-dividas' },
  { label: 'Reforma', value: 'reforma' },
  { label: 'Investimento', value: 'investimento' },
  { label: 'Educação', value: 'educacao' },
  { label: 'Saúde', value: 'saude' },
  { label: 'Outros', value: 'outros' },
]

// Handlers de máscara
function onNomeInput(e: Event) {
  nome.value = (e.target as HTMLInputElement).value
}

function onCpfInput(e: Event) {
  const input = e.target as HTMLInputElement
  cpf.value = maskCPF(input.value)
  nextTick(() => { input.value = cpf.value })
}

function onDataInput(e: Event) {
  const input = e.target as HTMLInputElement
  const val = input.value // YYYY-MM-DD
  if (val) {
    const [year, month, day] = val.split('-')
    dataNascimentoDisplay.value = `${day}/${month}/${year}`
    dataNascimentoISO.value = val
  } else {
    dataNascimentoDisplay.value = ''
    dataNascimentoISO.value = ''
  }
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

// Validação individual
function validateField(field: keyof typeof errors) {
  if (field === 'nome') {
    touched.nome = true
    errors.nome = validateName(nome.value)
  } else if (field === 'cpf') {
    touched.cpf = true
    errors.cpf = validateCPF(cpf.value)
  } else if (field === 'dataNascimento') {
    touched.dataNascimento = true
    errors.dataNascimento = dataNascimentoDisplay.value ? validateDate(dataNascimentoDisplay.value) : 'Data de Nascimento é obrigatória.'
  } else if (field === 'valorEmprestimo') {
    touched.valorEmprestimo = true
    const centavos = parseInt(onlyDigits(valorEmprestimo.value), 10)
    if (!centavos) errors.valorEmprestimo = 'Valor do empréstimo é obrigatório.'
    else if (centavos < 25000) errors.valorEmprestimo = 'Valor mínimo: R$ 250,00.'
    else if (centavos > 20000000) errors.valorEmprestimo = 'Valor máximo: R$ 200.000,00.'
    else errors.valorEmprestimo = ''
  } else if (field === 'motivoEmprestimo') {
    touched.motivoEmprestimo = true
    errors.motivoEmprestimo = !motivoEmprestimo.value ? 'Motivo do empréstimo é obrigatório.' : ''
  } else if (field === 'rendaBruta') {
    touched.rendaBruta = true
    errors.rendaBruta = parseInt(onlyDigits(rendaBruta.value), 10) <= 0 ? 'Renda bruta é obrigatória.' : ''
  }
}

function validateAll() {
  // Validate all fields
  const fields: Array<keyof typeof errors> = ['nome', 'cpf', 'dataNascimento', 'valorEmprestimo', 'motivoEmprestimo', 'rendaBruta']
  fields.forEach(f => validateField(f))
  // Checkboxes
  if (!aceitouTermos1.value || !aceitouTermos2.value) {
    errors.checkboxes = 'Você precisa aceitar os termos para continuar.'
  } else {
    errors.checkboxes = ''
  }
  return !Object.values(errors).some(e => e !== '')
}

function handleSubmit() {
  if (!validateAll()) {
    nextTick(() => {
      const errorEl = document.querySelector('.field-error')
      if (errorEl) errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    return
  }
  emit('continuar')
}
</script>

<template>
  <div class="proposal-screen">
    <header class="proposal-header">
      <div class="proposal-header__inner">
        <img src="/assets/dock-logo-color.png" alt="Dock" class="proposal-header__logo" />
        <button type="button" class="proposal-header__back" @click="emit('voltar')" aria-label="Voltar para a landing">
          <span aria-hidden="true">←</span>
          Voltar
        </button>
      </div>
    </header>

    <main class="proposal-main">
      <div class="proposal-main__inner">
        <ol class="proposal-steps" aria-label="Progresso da proposta">
          <li class="proposal-steps__item is-active">
            <span class="proposal-steps__mark" aria-hidden="true">1</span>
            <span class="proposal-steps__label">DADOS INICIAIS</span>
          </li>
          <li class="proposal-steps__item">
            <span class="proposal-steps__mark" aria-hidden="true">2</span>
            <span class="proposal-steps__label">PROPOSTA</span>
          </li>
          <li class="proposal-steps__item">
            <span class="proposal-steps__mark" aria-hidden="true">3</span>
            <span class="proposal-steps__label">DADOS COMPLEMENTARES</span>
          </li>
          <li class="proposal-steps__item">
            <span class="proposal-steps__mark" aria-hidden="true">4</span>
            <span class="proposal-steps__label">DOCUMENTOS</span>
          </li>
          <li class="proposal-steps__item">
            <span class="proposal-steps__mark" aria-hidden="true">5</span>
            <span class="proposal-steps__label">CONCLUSÃO</span>
          </li>
        </ol>

        <section class="proposal-content" aria-labelledby="proposal-title">
          <h1 id="proposal-title" class="proposal-title">Solicite uma proposta</h1>
          <p class="proposal-subtitle">Leva menos de 2 minutos. Sem compromisso e sem afetar o seu score.</p>

          <form @submit.prevent="handleSubmit" class="proposal-form" novalidate>
            <div class="proposal-field proposal-field--full">
              <label for="prop-nome">Nome completo</label>
              <input
                id="prop-nome"
                :value="nome"
                type="text"
                placeholder="Como está no seu documento"
                autocomplete="name"
                :class="['proposal-input', touched.nome && errors.nome ? 'is-error' : '']"
                :aria-invalid="!!(touched.nome && errors.nome)"
                :aria-describedby="touched.nome && errors.nome ? 'prop-nome-error' : undefined"
                @input="onNomeInput"
                @blur="validateField('nome')"
              />
              <p v-if="touched.nome && errors.nome" id="prop-nome-error" class="field-error" role="alert">{{ errors.nome }}</p>
            </div>

            <div class="proposal-field-grid">
              <div class="proposal-field">
                <label for="prop-cpf">CPF</label>
                <input
                  id="prop-cpf"
                  :value="cpf"
                  type="text"
                  inputmode="numeric"
                  placeholder="000.000.000-00"
                  maxlength="14"
                  autocomplete="off"
                  :class="['proposal-input', touched.cpf && errors.cpf ? 'is-error' : '']"
                  :aria-invalid="!!(touched.cpf && errors.cpf)"
                  :aria-describedby="touched.cpf && errors.cpf ? 'prop-cpf-error' : undefined"
                  @input="onCpfInput"
                  @blur="validateField('cpf')"
                />
                <p v-if="touched.cpf && errors.cpf" id="prop-cpf-error" class="field-error" role="alert">{{ errors.cpf }}</p>
              </div>

              <div class="proposal-field">
                <label for="prop-data-nasc">Data de nascimento</label>
                <input
                  id="prop-data-nasc"
                  :value="dataNascimentoISO"
                  type="date"
                  :class="['proposal-input', touched.dataNascimento && errors.dataNascimento ? 'is-error' : '']"
                  :aria-invalid="!!(touched.dataNascimento && errors.dataNascimento)"
                  :aria-describedby="touched.dataNascimento && errors.dataNascimento ? 'prop-data-error' : undefined"
                  @input="onDataInput"
                  @blur="validateField('dataNascimento')"
                />
                <p v-if="touched.dataNascimento && errors.dataNascimento" id="prop-data-error" class="field-error" role="alert">{{ errors.dataNascimento }}</p>
              </div>
            </div>

            <div class="proposal-field-grid">
              <div class="proposal-field">
                <label for="prop-valor">Valor do emprestimo</label>
                <input
                  id="prop-valor"
                  :value="valorEmprestimo"
                  type="text"
                  inputmode="numeric"
                  placeholder="R$ 0,00"
                  :class="['proposal-input', touched.valorEmprestimo && errors.valorEmprestimo ? 'is-error' : '']"
                  :aria-invalid="!!(touched.valorEmprestimo && errors.valorEmprestimo)"
                  :aria-describedby="touched.valorEmprestimo && errors.valorEmprestimo ? 'prop-valor-error' : undefined"
                  @input="onValorInput"
                  @blur="validateField('valorEmprestimo')"
                />
                <p v-if="touched.valorEmprestimo && errors.valorEmprestimo" id="prop-valor-error" class="field-error" role="alert">{{ errors.valorEmprestimo }}</p>
              </div>

              <div class="proposal-field">
                <label for="prop-renda">Renda bruta mensal</label>
                <input
                  id="prop-renda"
                  :value="rendaBruta"
                  type="text"
                  inputmode="numeric"
                  placeholder="R$ 0,00"
                  :class="['proposal-input', touched.rendaBruta && errors.rendaBruta ? 'is-error' : '']"
                  :aria-invalid="!!(touched.rendaBruta && errors.rendaBruta)"
                  :aria-describedby="touched.rendaBruta && errors.rendaBruta ? 'prop-renda-error' : undefined"
                  @input="onRendaInput"
                  @blur="validateField('rendaBruta')"
                />
                <p v-if="touched.rendaBruta && errors.rendaBruta" id="prop-renda-error" class="field-error" role="alert">{{ errors.rendaBruta }}</p>
              </div>
            </div>

            <div class="proposal-field proposal-field--full">
              <label for="motivo-emprestimo">Motivo do empréstimo</label>
              <select
                id="motivo-emprestimo"
                v-model="motivoEmprestimo"
                :class="['proposal-input', touched.motivoEmprestimo && errors.motivoEmprestimo ? 'is-error' : '']"
                :aria-invalid="!!(touched.motivoEmprestimo && errors.motivoEmprestimo)"
                @blur="validateField('motivoEmprestimo')"
                @change="validateField('motivoEmprestimo')"
              >
                <option value="" disabled>Selecione o motivo</option>
                <option v-for="opt in motivoOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <p v-if="touched.motivoEmprestimo && errors.motivoEmprestimo" class="field-error" role="alert">{{ errors.motivoEmprestimo }}</p>
            </div>

            <fieldset class="proposal-checks">
              <legend class="sr-only">Termos e condições</legend>

              <label class="proposal-check">
                <input v-model="aceitouTermos1" type="checkbox" />
                <span>
                  Autorizo o <strong>compartilhamento</strong> dos meus dados cadastrais com o Banco BM,
                  bem como a consulta prévia de minhas informações cadastrais nos órgãos de proteção ao crédito
                  (Boavista, Serasa, SPC Brasil, por exemplo) e no Sistema de informações de Crédito do Banco Central
                  do Brasil (SCR), com o objetivo de possibilitar uma análise de crédito adequada.
                </span>
              </label>

              <!-- Oculta checkbox
              <label class="proposal-check">
                <input v-model="aceitouTermos2" type="checkbox" />
                <span>
                  Autorizo o débito mensal diretamente na conta bancária cadastradas nessa proposta, 
                  para pagamento das parcelas do empréstimo
                  contratado junto a Dock. Os valores e datas de vencimento dependerao dos termos
                  contratados e serão confirmados junto ao cliente antes da conclusão do empréstimo.
                </span>
              </label> -->

              <p v-if="errors.checkboxes" class="field-error" role="alert">{{ errors.checkboxes }}</p>
            </fieldset>

            <button type="submit" class="proposal-submit">Ver minha proposta</button>
          </form>
          <!-- Oculto
          <p class="proposal-safe"><span aria-hidden="true">✓</span>Dados protegidos pela LGPD — instituição regulada pelo Bacen</p> -->
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.proposal-screen {
  min-height: 100vh;
  background: #fafcfc;
}

.proposal-header {
  width: 100%;
  background: #fafcfc;
  border-bottom: 1px solid #e3edec;
  position: sticky;
  top: 0;
  z-index: 20;
}

.proposal-header__inner {
  max-width: 1024px;
  margin: 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.proposal-header__logo {
  height: 24px;
  width: auto;
}

.proposal-header__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border: 1.5px solid #e3edec;
  border-radius: 999px;
  background: #ffffff;
  color: #3c4c4d;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.proposal-header__back:hover {
  background: #f2f8f8;
}

.proposal-main {
  padding: 24px 20px 56px;
}

.proposal-main__inner {
  max-width: 640px;
  margin: 0 auto;
}

.proposal-steps {
  list-style: none;
  margin: 0 0 32px;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
}

.proposal-steps__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  position: relative;
}

/* Linha conectora — aparece em todos exceto o último */
.proposal-steps__item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 14px; /* metade do círculo (28px / 2) */
  left: calc(50% + 18px); /* começa após o círculo */
  right: calc(-50% + 18px); /* termina antes do próximo círculo */
  height: 1.5px;
  background: #e3edec;
}

.proposal-steps__item.is-done:not(:last-child)::after,
.proposal-steps__item.is-active:not(:last-child)::after {
  background: #063b3e;
}

.proposal-steps__mark {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid #d5e4e2;
  background: #ffffff;
  color: #8aa0a0;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.proposal-steps__label {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #9aabac;
  line-height: 1.3;
}

.proposal-steps__item.is-active .proposal-steps__mark {
  background: #063b3e;
  border-color: #063b3e;
  color: #ffffff;
}

.proposal-steps__item.is-active .proposal-steps__label {
  color: #063b3e;
}

.proposal-title {
  margin: 0 0 8px;
  color: #0b2528;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.08;
}

.proposal-subtitle {
  margin: 0 0 24px;
  color: #5b6b6c;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 15px;
  line-height: 1.55;
}

.proposal-content {
  width: 100%;
}

.proposal-form {
  background: #ffffff;
  border: 1px solid #e3edec;
  border-radius: 20px;
  padding: 22px 18px;
  box-shadow: 0 12px 40px rgba(6, 59, 62, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.proposal-field {
  display: flex;
  flex-direction: column;
}

.proposal-field label {
  margin-bottom: 6px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #0b2528;
}

.proposal-field-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.proposal-input {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  height: 50px;
  border: 1.5px solid #d5e4e2;
  border-radius: 12px;
  padding: 0 14px;
  outline: none;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 15px;
  color: #0b2528;
  background: #ffffff;
}

.proposal-input:focus-visible {
  border-color: #063b3e;
}

.proposal-input.is-error {
  border-color: #dc3545;
}

.field-error {
  margin: 6px 0 0;
  color: #dc3545;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 12px;
  line-height: 1.4;
}

.proposal-required {
  margin: -4px 0 0;
  color: #8aa0a0;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
}

.proposal-checks {
  border: 0;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.proposal-check {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
}

.proposal-check input {
  margin-top: 3px;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  accent-color: #063b3e;
}

.proposal-check span {
  color: #5b6b6c;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 13px;
  line-height: 1.55;
}

.proposal-check strong {
  color: #0b2528;
}

.proposal-submit {
  width: 100%;
  height: 54px;
  border: none;
  border-radius: 999px;
  background: #00d8d8;
  color: #042a2c;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 6px;
}

.proposal-submit:hover {
  background: #0fc5c5;
}

.proposal-submit:focus-visible {
  outline: 2px solid #063b3e;
  outline-offset: 3px;
}

.proposal-safe {
  margin: 14px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #8aa0a0;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 12px;
  text-align: center;
}

.proposal-safe span {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #dff3f1;
  color: #0fa3a3;
  font-size: 10px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .proposal-header__inner {
    height: 72px;
    padding: 0 32px;
  }

  .proposal-header__logo {
    height: 26px;
  }

  .proposal-header__back {
    height: 42px;
    padding: 0 18px;
    font-size: 14px;
  }

  .proposal-main {
    padding: 44px 32px 72px;
  }

  .proposal-steps {
    margin-bottom: 40px;
    gap: 12px;
  }

  .proposal-steps__mark {
    width: 30px;
    height: 30px;
    font-size: 13px;
  }

  .proposal-steps__label {
    font-size: 10px;
  }

  .proposal-title {
    font-size: 34px;
  }

  .proposal-subtitle {
    font-size: 16px;
    margin-bottom: 32px;
  }

  .proposal-form {
    border-radius: 24px;
    padding: 36px 40px;
    gap: 20px;
  }

  .proposal-field-grid {
    grid-template-columns: 1fr 1fr;
  }

  .proposal-submit {
    height: 56px;
    font-size: 17px;
  }
}
</style>
