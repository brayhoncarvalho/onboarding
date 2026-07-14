<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { maskCurrencyBRL, unmaskCurrencyBRL, maskAgencia, maskConta } from '../utils/masks'
import { validateRequired } from '../utils/validators'

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'continuar'): void
}>()

const IS_DEV_PREFILL = true

const sexo            = ref(IS_DEV_PREFILL ? 'masculino'           : '')
const estadoCivil     = ref(IS_DEV_PREFILL ? 'solteiro'            : '')
const escolaridade    = ref(IS_DEV_PREFILL ? 'superior-completo'   : '')
const nacionalidade   = ref(IS_DEV_PREFILL ? 'brasileiro'          : '')
const estadoNascimento = ref(IS_DEV_PREFILL ? 'BA'                 : '')
const cidadeNascimento = ref(IS_DEV_PREFILL ? 'Poções'             : '')
const profissao       = ref(IS_DEV_PREFILL ? 'Analista de Sistemas': '')
const ocupacao        = ref(IS_DEV_PREFILL ? 'assalariado'         : '')
const tempoOcupacao   = ref(IS_DEV_PREFILL ? '3-5'                 : '')
const patrimonio      = ref(IS_DEV_PREFILL ? maskCurrencyBRL('100000000') : '')
const patrimonioExpanded = ref(false)

const banco           = ref(IS_DEV_PREFILL ? '341'       : '')
const tipoConta       = ref(IS_DEV_PREFILL ? 'corrente'  : '')
const agencia         = ref(IS_DEV_PREFILL ? '0001'      : '')
const conta           = ref(IS_DEV_PREFILL ? '12345-6'   : '')

const errors = reactive<Record<string, string>>({
  sexo: '', estadoCivil: '', escolaridade: '', nacionalidade: '',
  estadoNascimento: '', cidadeNascimento: '', profissao: '',
  ocupacao: '', tempoOcupacao: '', patrimonio: '',
  banco: '', tipoConta: '', agencia: '', conta: '',
})

const touched = reactive<Record<string, boolean>>({
  sexo: false, estadoCivil: false, escolaridade: false, nacionalidade: false,
  estadoNascimento: false, cidadeNascimento: false, profissao: false,
  ocupacao: false, tempoOcupacao: false, patrimonio: false,
  banco: false, tipoConta: false, agencia: false, conta: false,
})

const onPatrimonioInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  patrimonio.value = maskCurrencyBRL(input.value)
  nextTick(() => { input.value = patrimonio.value })
}

const validateField = (field: string) => {
  touched[field] = true
  const msgs: Record<string, () => string> = {
    sexo:              () => validateRequired(sexo.value, 'Sexo'),
    estadoCivil:       () => validateRequired(estadoCivil.value, 'Estado Civil'),
    escolaridade:      () => validateRequired(escolaridade.value, 'Escolaridade'),
    nacionalidade:     () => validateRequired(nacionalidade.value, 'Nacionalidade'),
    estadoNascimento:  () => validateRequired(estadoNascimento.value, 'Estado onde você nasceu'),
    cidadeNascimento:  () => validateRequired(cidadeNascimento.value, 'Cidade onde você nasceu'),
    profissao:         () => validateRequired(profissao.value, 'Profissão'),
    ocupacao:          () => validateRequired(ocupacao.value, 'Ocupação'),
    tempoOcupacao:     () => validateRequired(tempoOcupacao.value, 'Tempo da Ocupação Atual'),
    patrimonio:        () => unmaskCurrencyBRL(patrimonio.value) <= 0 ? 'Patrimônio ? obrigatório.' : '',
    banco:             () => validateRequired(banco.value, 'Banco'),
    tipoConta:         () => validateRequired(tipoConta.value, 'Tipo de Conta'),
    agencia:           () => agencia.value.replace(/\D/g, '').length < 4 ? 'Informe a agência com ao menos 4 dígitos.' : '',
    conta:             () => conta.value.replace(/\D/g, '').length < 4 ? 'Informe o número da conta.' : '',
  }
  if (msgs[field]) errors[field] = msgs[field]()
}

const validateAll = (): boolean => {
  Object.keys(errors).forEach(f => validateField(f))
  return !Object.values(errors).some(e => e !== '')
}

const handleProximo = () => {
  if (!validateAll()) {
    nextTick(() => {
      const el = document.querySelector('.field-error')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    return
  }
  emit('continuar')
}

</script>

<template>
  <div class="dp-screen">

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

    <!-- Stepper DS -->
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

        <h1 class="dp-title">Dados Pessoais</h1>
        <p class="dp-subtitle">Preencha as informações abaixo para prosseguir com sua proposta.</p>


        <div class="proposal-form">
          <form @submit.prevent="handleProximo" novalidate>

            <!-- ── Seção 1: Dados Pessoais ── -->
            <div class="dp-section-title">Dados Pessoais</div>

            <div class="dp-fields-grid">
              <!-- Sexo -->
              <div class="proposal-field">
                <label for="dp-sexo">Sexo</label>
                <div class="dp-select-wrap">
                  <select id="dp-sexo" v-model="sexo"
                    :class="['proposal-select', touched.sexo && errors.sexo ? 'is-error' : '']"
                    @blur="validateField('sexo')" @change="validateField('sexo')">
                    <option value="" disabled>Selecione</option>
                    <option value="feminino">Feminino</option>
                    <option value="masculino">Masculino</option>
                    <option value="outro">Outro</option>
                  </select>
                  <svg class="dp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <p v-if="touched.sexo && errors.sexo" class="field-error" role="alert">{{ errors.sexo }}</p>
              </div>

              <!-- Estado Civil -->
              <div class="proposal-field">
                <label for="dp-estado-civil">Estado Civil</label>
                <div class="dp-select-wrap">
                  <select id="dp-estado-civil" v-model="estadoCivil"
                    :class="['proposal-select', touched.estadoCivil && errors.estadoCivil ? 'is-error' : '']"
                    @blur="validateField('estadoCivil')" @change="validateField('estadoCivil')">
                    <option value="" disabled>Selecione</option>
                    <option value="solteiro">Solteiro(a)</option>
                    <option value="casado">Casado(a)</option>
                    <option value="divorciado">Divorciado(a)</option>
                    <option value="viuvo">Viúvo(a)</option>
                    <option value="uniao-estavel">União Estável</option>
                  </select>
                  <svg class="dp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <p v-if="touched.estadoCivil && errors.estadoCivil" class="field-error" role="alert">{{ errors.estadoCivil }}</p>
              </div>

              <!-- Escolaridade -->
              <div class="proposal-field">
                <label for="dp-escolaridade">Escolaridade</label>
                <div class="dp-select-wrap">
                  <select id="dp-escolaridade" v-model="escolaridade"
                    :class="['proposal-select', touched.escolaridade && errors.escolaridade ? 'is-error' : '']"
                    @blur="validateField('escolaridade')" @change="validateField('escolaridade')">
                    <option value="" disabled>Selecione</option>
                    <option value="fundamental-incompleto">Ensino Fundamental Incompleto</option>
                    <option value="fundamental-completo">Ensino Fundamental Completo</option>
                    <option value="medio-incompleto">Ensino Médio Incompleto</option>
                    <option value="medio-completo">Ensino Médio Completo</option>
                    <option value="superior-incompleto">Ensino Superior Incompleto</option>
                    <option value="superior-completo">Ensino Superior Completo</option>
                    <option value="pos-graduacao">Pós-Graduação</option>
                    <option value="mestrado">Mestrado</option>
                    <option value="doutorado">Doutorado</option>
                  </select>
                  <svg class="dp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <p v-if="touched.escolaridade && errors.escolaridade" class="field-error" role="alert">{{ errors.escolaridade }}</p>
              </div>

              <!-- Nacionalidade -->
              <div class="proposal-field">
                <label for="dp-nacionalidade">Nacionalidade</label>
                <div class="dp-select-wrap">
                  <select id="dp-nacionalidade" v-model="nacionalidade"
                    :class="['proposal-select', touched.nacionalidade && errors.nacionalidade ? 'is-error' : '']"
                    @blur="validateField('nacionalidade')" @change="validateField('nacionalidade')">
                    <option value="" disabled>Selecione</option>
                    <option value="brasileiro">Brasileiro(a)</option>
                    <option value="estrangeiro">Estrangeiro(a)</option>
                  </select>
                  <svg class="dp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <p v-if="touched.nacionalidade && errors.nacionalidade" class="field-error" role="alert">{{ errors.nacionalidade }}</p>
              </div>

              <!-- Estado de Nascimento -->
              <div class="proposal-field">
                <label for="dp-estado-nasc">Estado de nascimento</label>
                <div class="dp-select-wrap">
                  <select id="dp-estado-nasc" v-model="estadoNascimento"
                    :class="['proposal-select', touched.estadoNascimento && errors.estadoNascimento ? 'is-error' : '']"
                    @blur="validateField('estadoNascimento')" @change="validateField('estadoNascimento')">
                    <option value="" disabled>Selecione</option>
                    <option value="AC">Acre</option><option value="AL">Alagoas</option><option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option><option value="BA">Bahia</option><option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option><option value="ES">Espírito Santo</option><option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option><option value="MT">Mato Grosso</option><option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option><option value="PA">Pará</option><option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option><option value="PE">Pernambuco</option><option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option><option value="RN">Rio Grande do Norte</option><option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option><option value="RR">Roraima</option><option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option><option value="SE">Sergipe</option><option value="TO">Tocantins</option>
                  </select>
                  <svg class="dp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <p v-if="touched.estadoNascimento && errors.estadoNascimento" class="field-error" role="alert">{{ errors.estadoNascimento }}</p>
              </div>

              <!-- Cidade de Nascimento -->
              <div class="proposal-field">
                <label for="dp-cidade-nasc">Cidade de nascimento</label>
                <input id="dp-cidade-nasc" v-model="cidadeNascimento" type="text"
                  :class="['proposal-input', touched.cidadeNascimento && errors.cidadeNascimento ? 'is-error' : '']"
                  placeholder="Digite a cidade"
                  @blur="validateField('cidadeNascimento')" />
                <p v-if="touched.cidadeNascimento && errors.cidadeNascimento" class="field-error" role="alert">{{ errors.cidadeNascimento }}</p>
              </div>
            </div>

            <!-- ── Seção 2: Perfil Profissional e Financeiro ── -->
            <div class="dp-section-title dp-section-title--mt">Perfil Profissional e Financeiro</div>

            <div class="dp-fields-grid">
              <!-- Profissão -->
              <div class="proposal-field">
                <label for="dp-profissao">Profissão</label>
                <input id="dp-profissao" v-model="profissao" type="text"
                  :class="['proposal-input', touched.profissao && errors.profissao ? 'is-error' : '']"
                  placeholder="Digite sua profissão"
                  @blur="validateField('profissao')" />
                <p v-if="touched.profissao && errors.profissao" class="field-error" role="alert">{{ errors.profissao }}</p>
              </div>

              <!-- Ocupação -->
              <div class="proposal-field">
                <label for="dp-ocupacao">Ocupação</label>
                <div class="dp-select-wrap">
                  <select id="dp-ocupacao" v-model="ocupacao"
                    :class="['proposal-select', touched.ocupacao && errors.ocupacao ? 'is-error' : '']"
                    @blur="validateField('ocupacao')" @change="validateField('ocupacao')">
                    <option value="" disabled>Selecione</option>
                    <option value="assalariado">Assalariado</option>
                    <option value="autonomo">Autônomo</option>
                    <option value="empresario">Empresário</option>
                    <option value="funcionario-publico">Funcionário Público</option>
                    <option value="aposentado">Aposentado/Pensionista</option>
                    <option value="estudante">Estudante</option>
                    <option value="outros">Outros</option>
                  </select>
                  <svg class="dp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <p v-if="touched.ocupacao && errors.ocupacao" class="field-error" role="alert">{{ errors.ocupacao }}</p>
              </div>

              <!-- Tempo de Ocupação -->
              <div class="proposal-field">
                <label for="dp-tempo-ocup">Tempo na ocupação atual</label>
                <div class="dp-select-wrap">
                  <select id="dp-tempo-ocup" v-model="tempoOcupacao"
                    :class="['proposal-select', touched.tempoOcupacao && errors.tempoOcupacao ? 'is-error' : '']"
                    @blur="validateField('tempoOcupacao')" @change="validateField('tempoOcupacao')">
                    <option value="" disabled>Selecione</option>
                    <option value="menos-1">Menos de 1 ano</option>
                    <option value="1-3">Entre 1 e 3 anos</option>
                    <option value="3-5">Entre 3 e 5 anos</option>
                    <option value="5-10">Entre 5 e 10 anos</option>
                    <option value="mais-10">Mais de 10 anos</option>
                  </select>
                  <svg class="dp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <p v-if="touched.tempoOcupacao && errors.tempoOcupacao" class="field-error" role="alert">{{ errors.tempoOcupacao }}</p>
              </div>

              <!-- Patrimônio -->
              <div class="proposal-field">
                <label for="dp-patrimonio">Patrimônio <sup>1</sup></label>
                <input id="dp-patrimonio" :value="patrimonio" type="text" inputmode="numeric"
                  :class="['proposal-input', touched.patrimonio && errors.patrimonio ? 'is-error' : '']"
                  placeholder="R$ 0,00"
                  @input="onPatrimonioInput"
                  @blur="validateField('patrimonio')" />
                <p v-if="touched.patrimonio && errors.patrimonio" class="field-error" role="alert">{{ errors.patrimonio }}</p>
              </div>
            </div>

            <!-- Nota patrimônio -->
            <div class="dp-note">
              <p class="dp-note__text"><strong>1.</strong> Informe o valor em R$ de todos os bens e direitos que você possui. Essa informação é requerida pelo Banco Central de todos os bancos que realizem empréstimos a pessoas físicas.</p>
              <button type="button" class="dp-note__toggle" @click="patrimonioExpanded = !patrimonioExpanded" :aria-expanded="patrimonioExpanded">
                {{ patrimonioExpanded ? 'Mostrar menos' : 'Por que preciso informar?' }}
              </button>
              <p v-if="patrimonioExpanded" class="dp-note__expanded">
                Por força da circular 3.461 do Banco Central do Brasil, essa informação é requerida de todos os bancos que realizem qualquer empréstimo a pessoas físicas. Esse procedimento faz parte do esforço de toda a sociedade para prevenir e combater crimes de lavagem de dinheiro, alinhado com a Convenção Internacional para Supressão do Financiamento do Terrorismo, da ONU.
              </p>
            </div>

            <!-- ── Seção 3: Dados Bancários ── -->
            <div class="dp-section-title dp-section-title--mt">Dados Bancários</div>
            <p class="dp-section-desc">Informe os dados da conta em que deseja receber o crédito. A conta para recebimento deve estar no mesmo CPF do solicitante do crédito.</p>

            <div class="dp-fields-grid">
              <!-- Banco -->
              <div class="proposal-field">
                <label for="dp-banco">Banco</label>
                <div class="dp-select-wrap">
                  <select id="dp-banco" v-model="banco"
                    :class="['proposal-select', touched.banco && errors.banco ? 'is-error' : '']"
                    @blur="validateField('banco')" @change="validateField('banco')">
                    <option value="" disabled>Selecione o banco</option>
                    <option value="001">001 - Banco do Brasil</option>
                    <option value="033">033 - Santander</option>
                    <option value="077">077 - Banco Inter</option>
                    <option value="104">104 - Caixa Econômica Federal</option>
                    <option value="208">208 - BTG Pactual</option>
                    <option value="212">212 - Banco Original</option>
                    <option value="237">237 - Bradesco</option>
                    <option value="260">260 - Nubank</option>
                    <option value="290">290 - PagBank</option>
                    <option value="318">318 - BMG</option>
                    <option value="336">336 - C6 Bank</option>
                    <option value="341">341 - Itaú</option>
                    <option value="389">389 - Mercantil do Brasil</option>
                    <option value="422">422 - Safra</option>
                    <option value="623">623 - Pan</option>
                    <option value="655">655 - Votorantim</option>
                    <option value="748">748 - Sicredi</option>
                    <option value="756">756 - Sicoob</option>
                    <option value="outro">Outro</option>
                  </select>
                  <svg class="dp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <p v-if="touched.banco && errors.banco" class="field-error" role="alert">{{ errors.banco }}</p>
              </div>

              <!-- Tipo de Conta -->
              <div class="proposal-field">
                <label for="dp-tipo-conta">Tipo de Conta</label>
                <div class="dp-select-wrap">
                  <select id="dp-tipo-conta" v-model="tipoConta"
                    :class="['proposal-select', touched.tipoConta && errors.tipoConta ? 'is-error' : '']"
                    @blur="validateField('tipoConta')" @change="validateField('tipoConta')">
                    <option value="" disabled>Selecione</option>
                    <option value="corrente">Conta Corrente</option>
                    <option value="poupanca">Conta Poupança</option>
                  </select>
                  <svg class="dp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <p v-if="touched.tipoConta && errors.tipoConta" class="field-error" role="alert">{{ errors.tipoConta }}</p>
              </div>

              <!-- Agência -->
              <div class="proposal-field">
                <label for="dp-agencia">Agência</label>
                <input id="dp-agencia" :value="agencia" type="text" inputmode="numeric"
                  :class="['proposal-input', touched.agencia && errors.agencia ? 'is-error' : '']"
                  placeholder="0000 ou 0000-0"
                  @input="(e) => { const t = e.target as HTMLInputElement; agencia = maskAgencia(t.value); t.value = agencia }"
                  @blur="validateField('agencia')" />
                <p v-if="touched.agencia && errors.agencia" class="field-error" role="alert">{{ errors.agencia }}</p>
              </div>

              <!-- Conta com Dígito -->
              <div class="proposal-field">
                <label for="dp-conta">Conta com Dígito</label>
                <input id="dp-conta" :value="conta" type="text" inputmode="numeric"
                  :class="['proposal-input', touched.conta && errors.conta ? 'is-error' : '']"
                  placeholder="00000000-0"
                  @input="(e) => { const t = e.target as HTMLInputElement; conta = maskConta(t.value); t.value = conta }"
                  @blur="validateField('conta')" />
                <p v-if="touched.conta && errors.conta" class="field-error" role="alert">{{ errors.conta }}</p>
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
.dp-screen {
  min-height: 100vh;
  background: #fafcfc;
  display: flex;
  flex-direction: column;
}

/* ── Header ── */
.proposal-header {
  position: sticky; top: 0; z-index: 10;
  background: #fafcfc; border-bottom: 1px solid #e3edec;
}
.proposal-header__inner {
  max-width: 1024px; margin: 0 auto; padding: 0 20px;
  height: 64px; display: flex; align-items: center; justify-content: space-between;
}
.proposal-header__logo { height: 24px; width: auto; }
.proposal-header__back {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 18px; border: 1.5px solid #e3edec; border-radius: 999px;
  background: transparent; color: #0b2528;
  font-family: 'Instrument Sans', sans-serif; font-size: 14px; font-weight: 500;
  cursor: pointer; transition: background 0.15s;
}
.proposal-header__back:hover { background: #f0f7f7; }

/* ── Main ── */
.proposal-main { flex: 1; padding: 32px 20px 64px; }
.proposal-main__inner { max-width: 720px; margin: 0 auto; }

/* ── Stepper ── */
.proposal-steps {
  list-style: none; margin: 0 0 40px; padding: 0;
  display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px;
}
.proposal-steps__item {
  position: relative; display: flex; flex-direction: column;
  align-items: center; gap: 6px; padding-top: 2px;
}
.proposal-steps__item:not(:last-child)::after {
  content: ''; position: absolute; top: 14px;
  left: calc(50% + 18px); right: calc(-50% + 18px);
  height: 1.5px; background: #e3edec;
}
.proposal-steps__item.is-done::after  { background: #063b3e; }
.proposal-steps__mark {
  width: 28px; height: 28px; border-radius: 999px;
  border: 1.5px solid #d5e4e2; background: #ffffff; color: #8aa0a0;
  display: inline-flex; align-items: center; justify-content: center;
  font-family: 'Bricolage Grotesque', sans-serif; font-size: 12px; font-weight: 700;
  position: relative; z-index: 1;
}
.proposal-steps__item.is-done  .proposal-steps__mark { background: #063b3e; border-color: #063b3e; color: #ffffff; }
.proposal-steps__item.is-active .proposal-steps__mark { border-color: #063b3e; color: #063b3e; background: #ffffff; box-shadow: 0 0 0 3px #dff3f1; }
.proposal-steps__label {
  font-family: 'Bricolage Grotesque', sans-serif; font-size: 9px; font-weight: 600;
  color: #8aa0a0; text-align: center; line-height: 1.2; letter-spacing: 0.03em;
}
.proposal-steps__item.is-active .proposal-steps__label { color: #0b2528; }
.proposal-steps__item.is-done  .proposal-steps__label { color: #5b6b6c; }

/* ── Page title ── */
.dp-title {
  font-family: 'Bricolage Grotesque', sans-serif; font-size: 28px; font-weight: 700;
  color: #0b2528; margin: 0 0 6px;
}
.dp-subtitle {
  font-family: 'Instrument Sans', sans-serif; font-size: 15px; color: #5b6b6c;
  margin: 0 0 28px; line-height: 1.5;
}

/* ── Form card ── */
.proposal-form {
  background: #ffffff; border: 1px solid #e3edec; border-radius: 20px;
  box-shadow: 0 8px 32px rgba(6,59,62,0.06); padding: 28px 24px;
}

/* ── Section title ── */
.dp-section-title {
  font-family: 'Bricolage Grotesque', sans-serif; font-size: 14px; font-weight: 700;
  color: #0b2528; letter-spacing: 0.06em; text-transform: uppercase;
  padding-bottom: 10px; border-bottom: 1.5px solid #e3edec; margin-bottom: 20px;
}
.dp-section-title--mt { margin-top: 32px; }
.dp-section-desc {
  font-family: 'Instrument Sans', sans-serif; font-size: 13px; color: #5b6b6c;
  margin: -12px 0 16px;
}

/* ── Fields grid ── */
.dp-fields-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px;
}

/* ── Field ── */
.proposal-field { display: flex; flex-direction: column; gap: 6px; }
.proposal-field label {
  font-family: 'Instrument Sans', sans-serif; font-size: 13px; font-weight: 500; color: #0b2528;
}
.proposal-input {
  height: 50px; border: 1.5px solid #d5e4e2; border-radius: 12px;
  padding: 0 14px; font-family: 'Instrument Sans', sans-serif; font-size: 15px;
  color: #0b2528; background: #ffffff; outline: none; transition: border-color 0.15s;
}
.proposal-input:focus { border-color: #063b3e; }
.proposal-input.is-error { border-color: #dc3545; }

/* ── Select ── */
.dp-select-wrap { position: relative; }
.proposal-select {
  width: 100%; height: 50px; border: 1.5px solid #d5e4e2; border-radius: 12px;
  padding: 0 36px 0 14px; font-family: 'Instrument Sans', sans-serif; font-size: 15px;
  color: #0b2528; background: #ffffff; outline: none; appearance: none;
  transition: border-color 0.15s; cursor: pointer;
}
.proposal-select:focus { border-color: #063b3e; }
.proposal-select.is-error { border-color: #dc3545; }
.dp-chevron {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  width: 16px; height: 16px; pointer-events: none; color: #5b6b6c;
}

/* ── Error ── */
.field-error { font-family: 'Instrument Sans', sans-serif; font-size: 12px; color: #dc3545; margin: 0; }

/* ── Patrimônio note ── */
.dp-note {
  background: #f5fafa; border: 1px solid #e3edec; border-radius: 12px;
  padding: 14px 16px; margin-bottom: 4px;
}
.dp-note__text { font-family: 'Instrument Sans', sans-serif; font-size: 12px; color: #5b6b6c; margin: 0 0 6px; line-height: 1.55; }
.dp-note__toggle {
  background: none; border: none; padding: 0; cursor: pointer;
  font-family: 'Instrument Sans', sans-serif; font-size: 12px; font-weight: 600;
  color: #063b3e; text-decoration: underline; text-underline-offset: 2px;
}
.dp-note__expanded { font-family: 'Instrument Sans', sans-serif; font-size: 11px; color: #5b6b6c; margin: 10px 0 0; line-height: 1.6; text-align: justify; }

/* ── Actions ── */
.dp-actions { display: flex; gap: 12px; margin-top: 32px; }
.dp-btn-back {
  flex: 0 0 140px; height: 52px; border: 1.5px solid #e3edec; border-radius: 999px;
  background: transparent; color: #0b2528;
  font-family: 'Bricolage Grotesque', sans-serif; font-size: 15px; font-weight: 600;
  cursor: pointer; transition: background 0.15s;
}
.dp-btn-back:hover { background: #f0f7f7; }
.proposal-submit {
  flex: 1; height: 52px; border: none; border-radius: 999px;
  background: #00d8d8; color: #042a2c;
  font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 700;
  cursor: pointer; transition: background 0.15s;
}
.proposal-submit:hover { background: #0fc5c5; }

/* ── Safe note ── */
.proposal-safe {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  font-family: 'Instrument Sans', sans-serif; font-size: 11px; color: #8aa0a0;
  margin: 16px 0 0;
}

/* ── Responsive ── */
@media (max-width: 639px) {
  .dp-fields-grid { grid-template-columns: 1fr; }
  .dp-actions { flex-direction: column-reverse; }
  .dp-btn-back { flex: none; width: 100%; }
  .proposal-submit { flex: none; width: 100%; min-height: 52px; }
}
@media (min-width: 640px) {
  .proposal-header__inner { height: 72px; }
  .proposal-header__logo { height: 26px; }
  .proposal-main { padding: 40px 32px 80px; }
  .proposal-steps { margin-bottom: 48px; }
  .proposal-steps__label { font-size: 10px; }
  .dp-title { font-size: 32px; }
  .proposal-form { padding: 36px 40px; border-radius: 24px; }
}
</style>
