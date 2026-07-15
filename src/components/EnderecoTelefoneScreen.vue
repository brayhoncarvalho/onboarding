<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { onlyDigits } from '../utils/masks'

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'continuar'): void
}>()

// Dados de endereço
const cep = ref('77001-000')
const endereco = ref('Rua das Palmeiras')
const numero = ref('452')
const complemento = ref('')
const bairro = ref('Plano Diretor Norte')
const cidade = ref('Palmas')
const estado = ref('TO')
const tipoResidencia = ref('Própria')

// Dados de telefone
const celularDDD = ref('63')
const celularNum = ref('95448-9531')
const canalContato = ref('WhatsApp')
const horario = ref('08h às 12h')
const residencialDDD = ref('')
const residencialNum = ref('')

// Estado de validação
const fields = ['cep','endereco','numero','bairro','cidade','estado','tipoResidencia',
  'celularDDD','celularNum','canalContato','horario'] as const
type Field = typeof fields[number]

const errors = reactive(Object.fromEntries(fields.map(f => [f, ''])) as Record<Field, string>)
const touched = reactive(Object.fromEntries(fields.map(f => [f, false])) as Record<Field, boolean>)

// Formatação de telefone/celular
function formatPhone(val: string) {
  const d = onlyDigits(val).slice(0, 9)
  if (d.length <= 4) return d
  if (d.length <= 8) return `${d.slice(0, 4)}-${d.slice(4)}`
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

function formatDDD(val: string) {
  return onlyDigits(val).slice(0, 2)
}

function onPhoneInput(fieldName: 'residencialNum' | 'celularNum', e: Event) {
  const input = e.target as HTMLInputElement
  const fieldRefs = { residencialNum, celularNum }
  fieldRefs[fieldName].value = formatPhone(input.value)
  nextTick(() => { input.value = fieldRefs[fieldName].value })
}

function onDDDInput(fieldName: 'residencialDDD' | 'celularDDD', e: Event) {
  const input = e.target as HTMLInputElement
  const fieldRefs = { residencialDDD, celularDDD }
  fieldRefs[fieldName].value = formatDDD(input.value)
  nextTick(() => { input.value = fieldRefs[fieldName].value })
}

function onCepInput(e: Event) {
  const input = e.target as HTMLInputElement
  const d = onlyDigits(input.value).slice(0, 8)
  cep.value = d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
  nextTick(() => { input.value = cep.value })
}

// Validação individual
function validate(field: Field) {
  touched[field] = true
  const validations: Record<Field, () => string> = {
    cep: () => onlyDigits(cep.value).length < 8 ? 'CEP inválido.' : '',
    endereco: () => !endereco.value.trim() ? 'Endereço é obrigatório.' : '',
    numero: () => !numero.value.trim() ? 'Número é obrigatório.' : '',
    bairro: () => !bairro.value.trim() ? 'Bairro é obrigatório.' : '',
    cidade: () => !cidade.value.trim() ? 'Cidade é obrigatória.' : '',
    estado: () => !estado.value ? 'Estado é obrigatório.' : '',
    tipoResidencia: () => !tipoResidencia.value ? 'Tipo de Residência é obrigatório.' : '',
    celularDDD: () => onlyDigits(celularDDD.value).length < 2 ? 'DDD inválido.' : '',
    celularNum: () => onlyDigits(celularNum.value).length < 8 ? 'Celular inválido.' : '',
    canalContato: () => !canalContato.value ? 'Canal de Contato é obrigatório.' : '',
    horario: () => !horario.value ? 'Horário é obrigatório.' : '',
  }
  errors[field] = validations[field]()
}

function validateAll() {
  fields.forEach(f => validate(f))
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

const estadosBrasil = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
]

const tiposResidencia = ['Própria', 'Alugada', 'Financiada', 'Cedida', 'Funcional', 'Outra']
const canaisContato = ['Telefone', 'E-mail', 'WhatsApp']
const horariosContato = ['08h às 12h', '12h às 18h', '18h às 21h']
</script>

<template>
  <div class="et-screen">

    <!-- Header -->
    <header class="proposal-header">
      <div class="proposal-header__inner">
        <img src="/assets/dock-logo-color.png" alt="Dock" class="proposal-header__logo" />
        <button type="button" class="proposal-header__back" @click="emit('voltar')" aria-label="Voltar">
          <span aria-hidden="true">←</span>
          Voltar
        </button>
      </div>
    </header>

    <main class="proposal-main">
      <div class="proposal-main__inner">

        <!-- Stepper: passos 1 e 2 done, passo 3 ativo -->
        <ol class="proposal-steps" aria-label="Progresso da proposta">
          <li class="proposal-steps__item is-done">
            <span class="proposal-steps__mark" aria-hidden="true">✓</span>
            <span class="proposal-steps__label">DADOS INICIAIS</span>
          </li>
          <li class="proposal-steps__item is-done">
            <span class="proposal-steps__mark" aria-hidden="true">✓</span>
            <span class="proposal-steps__label">PROPOSTA</span>
          </li>
          <li class="proposal-steps__item is-active">
            <span class="proposal-steps__mark" aria-hidden="true">3</span>
            <span class="proposal-steps__label">CADASTRO</span>
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

        <h1 class="et-title">Endereço e Telefone</h1>
        <p class="et-subtitle">Informe seu endereço e dados de contato para continuar.</p>

        <div class="proposal-form">
          <form @submit.prevent="handleSubmit" novalidate>

            <!-- ── Seção 1: Endereço ── -->
            <div class="dp-section-title">Endereço</div>

            <div class="dp-fields-grid">
              <!-- CEP (largura dupla para acomodar hint) -->
              <div class="proposal-field et-full-width">
                <label for="et-cep">CEP</label>
                <input id="et-cep" :value="cep" type="text" inputmode="numeric"
                  placeholder="00000-000" maxlength="9"
                  :class="['proposal-input et-cep-input', errors.cep && touched.cep ? 'is-error' : '']"
                  @input="onCepInput" @blur="validate('cep')" />
                <p class="et-cep-hint">Não sabe o CEP? <a href="https://buscacepinter.correios.com.br" target="_blank" rel="noopener noreferrer" class="et-cep-link">Consulte aqui</a>.</p>
                <p v-if="errors.cep && touched.cep" class="field-error" role="alert">{{ errors.cep }}</p>
              </div>

              <!-- Logradouro (full width) -->
              <div class="proposal-field et-full-width">
                <label for="et-endereco">Logradouro</label>
                <input id="et-endereco" v-model="endereco" type="text" placeholder="Rua, Avenida, Travessa..."
                  :class="['proposal-input', errors.endereco && touched.endereco ? 'is-error' : '']"
                  @blur="validate('endereco')" />
                <p v-if="errors.endereco && touched.endereco" class="field-error" role="alert">{{ errors.endereco }}</p>
              </div>

              <!-- Número -->
              <div class="proposal-field">
                <label for="et-numero">Número</label>
                <input id="et-numero" v-model="numero" type="text" placeholder="Nº"
                  :class="['proposal-input', errors.numero && touched.numero ? 'is-error' : '']"
                  @blur="validate('numero')" />
                <p v-if="errors.numero && touched.numero" class="field-error" role="alert">{{ errors.numero }}</p>
              </div>

              <!-- Complemento -->
              <div class="proposal-field">
                <label for="et-complemento">Complemento <span class="et-optional">(opcional)</span></label>
                <input id="et-complemento" v-model="complemento" type="text" placeholder="Apto, Bloco..."
                  class="proposal-input" />
              </div>

              <!-- Bairro -->
              <div class="proposal-field">
                <label for="et-bairro">Bairro</label>
                <input id="et-bairro" v-model="bairro" type="text" placeholder="Seu bairro"
                  :class="['proposal-input', errors.bairro && touched.bairro ? 'is-error' : '']"
                  @blur="validate('bairro')" />
                <p v-if="errors.bairro && touched.bairro" class="field-error" role="alert">{{ errors.bairro }}</p>
              </div>

              <!-- Cidade -->
              <div class="proposal-field">
                <label for="et-cidade">Cidade</label>
                <input id="et-cidade" v-model="cidade" type="text" placeholder="Sua cidade"
                  :class="['proposal-input', errors.cidade && touched.cidade ? 'is-error' : '']"
                  @blur="validate('cidade')" />
                <p v-if="errors.cidade && touched.cidade" class="field-error" role="alert">{{ errors.cidade }}</p>
              </div>

              <!-- Estado -->
              <div class="proposal-field">
                <label for="et-estado">Estado (UF)</label>
                <div class="dp-select-wrap">
                  <select id="et-estado" v-model="estado"
                    :class="['proposal-select', errors.estado && touched.estado ? 'is-error' : '']"
                    @blur="validate('estado')">
                    <option value="" disabled>Selecione</option>
                    <option v-for="uf in estadosBrasil" :key="uf" :value="uf">{{ uf }}</option>
                  </select>
                  <svg class="dp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <p v-if="errors.estado && touched.estado" class="field-error" role="alert">{{ errors.estado }}</p>
              </div>

              <!-- Tipo de Residência -->
              <div class="proposal-field">
                <label for="et-tipo-res">Tipo de Residência</label>
                <div class="dp-select-wrap">
                  <select id="et-tipo-res" v-model="tipoResidencia"
                    :class="['proposal-select', errors.tipoResidencia && touched.tipoResidencia ? 'is-error' : '']"
                    @blur="validate('tipoResidencia')">
                    <option value="" disabled>Selecione</option>
                    <option v-for="tipo in tiposResidencia" :key="tipo" :value="tipo">{{ tipo }}</option>
                  </select>
                  <svg class="dp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <p v-if="errors.tipoResidencia && touched.tipoResidencia" class="field-error" role="alert">{{ errors.tipoResidencia }}</p>
              </div>
            </div>

            <!-- ── Seção 2: Contato ── -->
            <div class="dp-section-title dp-section-title--mt">Dados de Contato</div>

            <!-- ── Oculto ── 
            <div class="et-alert" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Precisamos do seu celular para analisar sua proposta. Sem um número válido, não é possível continuar.
            </div>-->

            <div class="dp-fields-grid">
              <!-- Celular -->
              <div class="proposal-field et-full-width">
                <label>Celular</label>
                <div class="et-phone-wrap">
                  <div class="et-ddd-wrap">
                    <input :value="celularDDD" type="text" inputmode="numeric" placeholder="(00)" maxlength="2"
                      aria-label="DDD do celular"
                      :class="['et-ddd', errors.celularDDD && touched.celularDDD ? 'is-error' : '']"
                      @input="onDDDInput('celularDDD', $event)" @blur="validate('celularDDD')" />
                  </div>
                  <input :value="celularNum" type="text" inputmode="numeric" placeholder="00000-0000" maxlength="10"
                    aria-label="Número do celular"
                    :class="['proposal-input et-phone-num', errors.celularNum && touched.celularNum ? 'is-error' : '']"
                    @input="onPhoneInput('celularNum', $event)" @blur="validate('celularNum')" />
                </div>
                <p v-if="(errors.celularDDD && touched.celularDDD) || (errors.celularNum && touched.celularNum)" class="field-error" role="alert">
                  {{ errors.celularDDD || errors.celularNum }}
                </p>
              </div>

              <!-- Canal de Contato -->
              <div class="proposal-field">
                <label for="et-canal">Canal de Contato Preferido</label>
                <div class="dp-select-wrap">
                  <select id="et-canal" v-model="canalContato"
                    :class="['proposal-select', errors.canalContato && touched.canalContato ? 'is-error' : '']"
                    @blur="validate('canalContato')">
                    <option value="" disabled>Selecione</option>
                    <option v-for="c in canaisContato" :key="c" :value="c">{{ c }}</option>
                  </select>
                  <svg class="dp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <p v-if="errors.canalContato && touched.canalContato" class="field-error" role="alert">{{ errors.canalContato }}</p>
              </div>

              <!-- Horário de Contato -->
              <div class="proposal-field">
                <label for="et-horario">Horário Preferido</label>
                <div class="dp-select-wrap">
                  <select id="et-horario" v-model="horario"
                    :class="['proposal-select', errors.horario && touched.horario ? 'is-error' : '']"
                    @blur="validate('horario')">
                    <option value="" disabled>Selecione</option>
                    <option v-for="h in horariosContato" :key="h" :value="h">{{ h }}</option>
                  </select>
                  <svg class="dp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <p v-if="errors.horario && touched.horario" class="field-error" role="alert">{{ errors.horario }}</p>
              </div>

              <!-- Telefone Residencial (opcional) — última posição -->
              <div class="proposal-field et-full-width">
                <label>Telefone Residencial <span class="et-optional">(opcional)</span></label>
                <div class="et-phone-wrap">
                  <div class="et-ddd-wrap">
                    <input :value="residencialDDD" type="text" inputmode="numeric" placeholder="(00)" maxlength="2"
                      aria-label="DDD do telefone residencial" class="et-ddd"
                      @input="onDDDInput('residencialDDD', $event)" />
                  </div>
                  <input :value="residencialNum" type="text" inputmode="numeric" placeholder="0000-0000" maxlength="9"
                    aria-label="Número do telefone residencial" class="proposal-input et-phone-num"
                    @input="onPhoneInput('residencialNum', $event)" />
                </div>
              </div>
            </div>

            <!-- CTAs -->
            <div class="dp-actions">
              <button type="button" class="dp-btn-back" @click="emit('voltar')">Anterior</button>
              <button type="submit" class="proposal-submit">Próximo</button>
            </div>

          </form>
          <!-- Oculto
          <p class="proposal-safe"><span aria-hidden="true">✓</span>Dados protegidos pela LGPD — instituição regulada pelo Bacen</p> -->
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
.et-screen { min-height: 100vh; background: #fafcfc; display: flex; flex-direction: column; }

/* ── Header ── */
.proposal-header { position: sticky; top: 0; z-index: 10; background: #fafcfc; border-bottom: 1px solid #e3edec; }
.proposal-header__inner { max-width: 1024px; margin: 0 auto; padding: 0 20px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
.proposal-header__logo { height: 24px; width: auto; }
.proposal-header__back { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border: 1.5px solid #e3edec; border-radius: 999px; background: transparent; color: #0b2528; font-family: 'Instrument Sans', sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
.proposal-header__back:hover { background: #f0f7f7; }

/* ── Main ── */
.proposal-main { flex: 1; padding: 32px 20px 64px; }
.proposal-main__inner { max-width: 640px; margin: 0 auto; }

/* ── Stepper ── */
.proposal-steps { list-style: none; margin: 0 0 40px; padding: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; }
.proposal-steps__item { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; padding-top: 2px; }
.proposal-steps__item:not(:last-child)::after { content: ''; position: absolute; top: 14px; left: calc(50% + 18px); right: calc(-50% + 18px); height: 1.5px; background: #e3edec; }
.proposal-steps__item.is-done::after { background: #063b3e; }
.proposal-steps__mark { width: 28px; height: 28px; border-radius: 999px; border: 1.5px solid #d5e4e2; background: #ffffff; color: #607374; display: inline-flex; align-items: center; justify-content: center; font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 700; position: relative; z-index: 1; }
.proposal-steps__item.is-done  .proposal-steps__mark { background: #063b3e; border-color: #063b3e; color: #ffffff; }
.proposal-steps__item.is-active .proposal-steps__mark { border-color: #063b3e; color: #063b3e; background: #ffffff; box-shadow: 0 0 0 3px #dff3f1; }
.proposal-steps__label { font-family: 'Bricolage Grotesque', sans-serif; font-size: 11px; font-weight: 600; color: #607374; text-align: center; line-height: 1.2; letter-spacing: 0.03em; }
.proposal-steps__item.is-active .proposal-steps__label { color: #0b2528; }
.proposal-steps__item.is-done  .proposal-steps__label { color: #5b6b6c; }

/* ── Titles ── */
.et-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: 28px; font-weight: 700; color: #0b2528; margin: 0 0 6px; }
.et-subtitle { font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: #5b6b6c; margin: 0 0 28px; line-height: 1.5; }

/* ── Form card ── */
.proposal-form { background: #ffffff; border: 1px solid #e3edec; border-radius: 20px; box-shadow: 0 8px 32px rgba(6,59,62,0.06); padding: 28px 24px; }
.dp-section-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 700; color: #0b2528; letter-spacing: 0.06em; text-transform: uppercase; padding-bottom: 10px; border-bottom: 1.5px solid #e3edec; margin-bottom: 20px; }
.dp-section-title--mt { margin-top: 32px; }

/* ── Fields ── */
.dp-fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px; }
.et-full-width { grid-column: 1 / -1; }
.proposal-field { display: flex; flex-direction: column; gap: 6px; }
.proposal-field label { font-family: 'Instrument Sans', sans-serif; font-size: 16px; font-weight: 500; color: #0b2528; }
.et-optional { font-weight: 400; color: #607374; font-size: 16px; }
.et-cep-input { max-width: 260px; }
.proposal-input { height: 50px; border: 1.5px solid #d5e4e2; border-radius: 12px; padding: 0 14px; font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: #0b2528; background: #ffffff; outline: none; transition: border-color 0.15s; }
.proposal-input:focus { border-color: #063b3e; }
.proposal-input.is-error { border-color: #dc3545; }

/* ── Select ── */
.dp-select-wrap { position: relative; }
.proposal-select { width: 100%; height: 50px; border: 1.5px solid #d5e4e2; border-radius: 12px; padding: 0 36px 0 14px; font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: #0b2528; background: #ffffff; outline: none; appearance: none; transition: border-color 0.15s; cursor: pointer; }
.proposal-select:focus { border-color: #063b3e; }
.proposal-select.is-error { border-color: #dc3545; }
.dp-chevron { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; pointer-events: none; color: #5b6b6c; }

/* ── CEP hint ── */
.et-cep-hint { font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: #5b6b6c; margin: 0; }
.et-cep-link { color: #00d8d8; text-decoration: underline; }

/* ── Alert ── */
.et-alert { display: flex; align-items: flex-start; gap: 8px; background: #fffbeb; border: 1px solid #f9e08a; border-radius: 12px; padding: 12px 14px; font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: #92610a; margin-bottom: 20px; line-height: 1.5; }

/* ── Phone inputs ── */
.et-phone-wrap { display: flex; align-items: center; gap: 8px; }
.et-ddd-wrap { display: flex; align-items: center; flex-shrink: 0; }
.et-paren { font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: #5b6b6c; padding: 0 2px; line-height: 50px; }
.et-ddd { width: 64px; height: 50px; border: 1.5px solid #d5e4e2; border-radius: 12px; padding: 0 8px; font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: #0b2528; background: #ffffff; outline: none; text-align: center; transition: border-color 0.15s; }
.et-ddd:focus { border-color: #063b3e; }
.et-ddd.is-error { border-color: #dc3545; }
.et-phone-num { flex: 1; border-radius: 12px !important; }

/* ── Error ── */
.field-error { font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: #dc3545; margin: 0; }

/* ── Actions ── */
.dp-actions { display: flex; gap: 12px; margin-top: 32px; }
.dp-btn-back { flex: 0 0 140px; height: 52px; border: 1.5px solid #e3edec; border-radius: 999px; background: transparent; color: #0b2528; font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.dp-btn-back:hover { background: #f0f7f7; }
.proposal-submit { flex: 1; height: 52px; border: none; border-radius: 999px; background: #00d8d8; color: #042a2c; font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.proposal-submit:hover { background: #0fc5c5; }

/* ── Safe note ── */
.proposal-safe { display: flex; align-items: center; justify-content: center; gap: 6px; font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: #607374; margin: 16px 0 0; }

/* ── Responsive ── */
@media (max-width: 639px) { .dp-fields-grid { grid-template-columns: 1fr; } .dp-actions { flex-direction: column-reverse; } .dp-btn-back { flex: none; width: 100%; } .proposal-submit { flex: none; width: 100%; min-height: 52px; } }
@media (min-width: 640px) { .proposal-header__inner { height: 72px; } .proposal-header__logo { height: 26px; } .proposal-main { padding: 40px 32px 80px; } .proposal-steps { margin-bottom: 48px; gap: 12px; } .proposal-steps__mark { width: 30px; height: 30px; } .proposal-steps__label { font-size: 13px; } .et-title { font-size: 32px; } .proposal-form { padding: 36px 40px; border-radius: 24px; } }
</style>
