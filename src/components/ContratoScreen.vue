<script setup lang="ts">
import { ref, computed } from 'vue'
import AuthHeader from './AuthHeader.vue'

const emit = defineEmits<{
  (e: 'continuar'): void
  (e: 'voltar'): void
  (e: 'navigate', action: 'sair' | 'emprestimos' | 'meus-dados'): void
}>()

const props = withDefaults(
  defineProps<{
    valor?: string
    prazo?: number
    parcela?: string
    taxaNominalMensal?: string
    taxaNominalAnual?: string
  }>(),
  {
    valor: 'R$ 3.500,00',
    prazo: 18,
    parcela: 'R$ 209,32',
    taxaNominalMensal: '2,75%',
    taxaNominalAnual: '38,40%',
  }
)

const concordo = ref(false)

const primeiroVencimento = (() => {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d
})()

const primeiroVencimentoFormatado = primeiroVencimento.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

const installmentCount = computed(() => props.prazo)

const parcelas = computed(() =>
  Array.from({ length: installmentCount.value }, (_, i) => ({
    n: i + 1,
    vencimento: (() => {
      const d = new Date(primeiroVencimento)
      d.setMonth(d.getMonth() + i)
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    })(),
    valor: props.parcela,
  }))
)
</script>

<template>
  <div class="ct-screen">
    <AuthHeader @voltar="emit('voltar')" @navigate="(a) => emit('navigate', a)" />
    <main class="proposal-main">
      <div class="proposal-main__inner">
        <ol class="proposal-steps" aria-label="Progresso da proposta">
          <li class="proposal-steps__item is-done"><span class="proposal-steps__mark">&#x2713;</span><span class="proposal-steps__label">DADOS INICIAIS</span></li>
          <li class="proposal-steps__item is-done"><span class="proposal-steps__mark">&#x2713;</span><span class="proposal-steps__label">PROPOSTA</span></li>
          <li class="proposal-steps__item is-done"><span class="proposal-steps__mark">&#x2713;</span><span class="proposal-steps__label">CADASTRO</span></li>
          <li class="proposal-steps__item is-done"><span class="proposal-steps__mark">&#x2713;</span><span class="proposal-steps__label">DOCUMENTOS</span></li>
          <li class="proposal-steps__item is-active"><span class="proposal-steps__mark">5</span><span class="proposal-steps__label">CONCLUSÃO</span></li>
        </ol>

        <h1 class="ct-title">Contrato de Crédito Pessoal</h1>
        <p class="ct-subtitle">Leia atentamente antes de assinar.</p>

        <div class="ct-viewer">
          <div class="ct-doc-scroll" tabindex="0" aria-label="Contrato de Crédito Pessoal" role="document">
            <div class="ct-doc">
              <h2 class="ct-doc__title">CONTRATO DE CRÉDITO PESSOAL</h2>
              <p class="ct-doc__section-title">PARTES CONTRATANTES</p>
              <p class="ct-doc__text">CONTRATANTE: Brayhon Oliveira Carvalho, CPF 412.456.508-90, residente em Palmas – TO.</p>
              <p class="ct-doc__text">CONTRATADA: Dock Tech, CNPJ 14.379.835/0002-23, com sede em São Paulo – SP.</p>

              <p class="ct-doc__section-title">CONDIÇÕES FINANCEIRAS</p>
              <table class="ct-doc__table" aria-label="Resumo das condições financeiras">
                <tbody>
                  <tr><th scope="row">Valor liberado</th><td>{{ props.valor }}</td></tr>
                  <tr><th scope="row">Número de parcelas</th><td>{{ props.prazo }} meses</td></tr>
                  <tr><th scope="row">Valor da parcela</th><td>{{ props.parcela }}</td></tr>
                  <tr><th scope="row">Taxa nominal mensal</th><td>{{ props.taxaNominalMensal }}</td></tr>
                  <tr><th scope="row">Taxa nominal anual</th><td>{{ props.taxaNominalAnual }}</td></tr>
                  <tr><th scope="row">Primeiro vencimento</th><td>{{ primeiroVencimentoFormatado }}</td></tr>
                  <tr><th scope="row">TAC</th><td>R$ 0,00</td></tr>
                  <tr><th scope="row">IOF</th><td>Incluso nas parcelas</td></tr>
                </tbody>
              </table>

              <p class="ct-doc__section-title">TABELA DE PARCELAS</p>
              <table class="ct-doc__table ct-doc__table--full" aria-label="Tabela de parcelas">
                <thead><tr><th>#</th><th>Vencimento</th><th>Valor</th></tr></thead>
                <tbody>
                  <tr v-for="p in parcelas" :key="p.n">
                    <td>{{ p.n }}</td>
                    <td>{{ p.vencimento }}</td>
                    <td>{{ p.valor }}</td>
                  </tr>
                </tbody>
              </table>

              <p class="ct-doc__section-title">CLÁUSULAS</p>
              <p class="ct-doc__text">1. O CONTRATANTE declara ter lido e concordado com todas as condições estabelecidas neste instrumento.</p>
              <p class="ct-doc__text">2. O valor será depositado na conta indicada em até 1 (um) dia útil após a assinatura.</p>
              <p class="ct-doc__text">3. O não pagamento de parcela no vencimento acarretará multa de 2% e juros de mora de 1% ao mês.</p>
              <p class="ct-doc__text">4. O CONTRATANTE poderá quitar antecipadamente o contrato, com redução proporcional dos juros futuros.</p>
              <p class="ct-doc__text">5. Fica eleito o foro da comarca de domicílio do CONTRATANTE para dirimir eventuais controvérsias.</p>

              <p class="ct-doc__section-title">ASSINATURAS</p>
              <div class="ct-doc__sigs">
                <div class="ct-doc__sig"><div class="ct-doc__sig-line"></div><p>Contratante: Brayhon Oliveira Carvalho</p></div>
                <div class="ct-doc__sig"><div class="ct-doc__sig-line"></div><p>Contratada: Dock Inst. de Pagamentos</p></div>
              </div>
            </div>
          </div>
        </div>

        <div class="proposal-form ct-bottom">
          <label class="ct-check" for="ct-concordo">
            <input id="ct-concordo" type="checkbox" v-model="concordo" />
            <span>Li e concordo com todas as cláusulas do contrato.</span>
          </label>
          <button type="button" class="proposal-submit" :disabled="!concordo" @click="emit('continuar')">Assinar Contrato</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.ct-screen { min-height: 100vh; background: var(--color-gray-50); display: flex; flex-direction: column; }
.proposal-main { flex: 1; padding: 32px 20px 64px; }
.proposal-main__inner { max-width: 640px; margin: 0 auto; }
.proposal-steps { list-style: none; margin: 0 0 40px; padding: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; }
.proposal-steps__item { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; padding-top: 2px; }
.proposal-steps__item:not(:last-child)::after { content: ""; position: absolute; top: 14px; left: calc(50% + 18px); right: calc(-50% + 18px); height: 1.5px; background: var(--color-primary-100); }
.proposal-steps__item.is-done::after { background: var(--btn-primary-bg); }
.proposal-steps__mark { width: 28px; height: 28px; border-radius: 999px; border: 1.5px solid var(--color-primary-200); background: #ffffff; color: var(--color-navy-400); display: inline-flex; align-items: center; justify-content: center; font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 700; position: relative; z-index: 1; }
.proposal-steps__item.is-done .proposal-steps__mark { background: var(--btn-primary-bg); border-color: var(--color-primary-500); color: var(--btn-primary-color); }
.proposal-steps__item.is-active .proposal-steps__mark { border-color: var(--color-primary-500); color: var(--color-primary-500); background: #ffffff; box-shadow: 0 0 0 3px var(--color-primary-100); }
.proposal-steps__label { font-family: "Bricolage Grotesque", sans-serif; font-size: 11px; font-weight: 600; color: var(--color-navy-400); text-align: center; line-height: 1.2; letter-spacing: 0.03em; }
.proposal-steps__item.is-active .proposal-steps__label { color: var(--color-navy-800); }
.proposal-steps__item.is-done .proposal-steps__label { color: var(--color-navy-500); }
.ct-title { font-family: "Bricolage Grotesque", sans-serif; font-size: 28px; font-weight: 700; color: var(--color-navy-800); margin: 0 0 6px; }
.ct-subtitle { font-family: "Instrument Sans", sans-serif; font-size: 16px; color: var(--color-navy-500); margin: 0 0 24px; }
.ct-viewer { background: #ffffff; border: 1px solid var(--color-primary-100); border-radius: 20px; box-shadow: 0 8px 32px rgba(10, 22, 40, 0.06); overflow: hidden; margin-bottom: 24px; }
.ct-doc-scroll { max-height: 480px; overflow-y: auto; padding: 24px 24px 16px; }
.ct-doc-scroll:focus { outline: 2px solid #00d8d8; outline-offset: -2px; }
.ct-doc__title { font-family: "Bricolage Grotesque", sans-serif; font-size: 22px; font-weight: 700; color: var(--color-navy-800); text-align: center; margin: 0 0 20px; }
.ct-doc__section-title { font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 700; color: var(--color-primary-500); text-transform: uppercase; letter-spacing: 0.07em; margin: 20px 0 8px; }
.ct-doc__text { font-family: "Instrument Sans", sans-serif; font-size: 16px; color: var(--color-navy-700); line-height: 1.6; margin: 0 0 8px; }
.ct-doc__table { width: 100%; border-collapse: collapse; font-family: "Instrument Sans", sans-serif; font-size: 16px; margin-bottom: 8px; }
.ct-doc__table td, .ct-doc__table th { padding: 8px 12px; border: 1px solid var(--color-primary-100); color: var(--color-navy-700); }
.ct-doc__table th { background: var(--color-primary-50); font-weight: 600; color: var(--color-primary-500); }
.ct-doc__table--full { font-size: 16px; }
.ct-doc__sigs { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }
.ct-doc__sig-line { height: 1px; background: var(--color-gray-300); margin-bottom: 8px; }
.ct-doc__sig p { font-family: "Instrument Sans", sans-serif; font-size: 14px; color: var(--color-navy-500); margin: 0; }
.proposal-form { background: #ffffff; border: 1px solid var(--color-primary-100); border-radius: 20px; box-shadow: 0 8px 32px rgba(10, 22, 40, 0.06); padding: 28px 24px; }
.ct-bottom { display: flex; flex-direction: column; gap: 20px; }
.ct-check { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; font-family: "Instrument Sans", sans-serif; font-size: 16px; color: var(--color-navy-700); line-height: 1.5; }
.ct-check input[type="checkbox"] { width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px; accent-color: var(--color-primary-500); cursor: pointer; }
.proposal-submit { width: 100%; height: 52px; border: none; border-radius: 999px; background: var(--btn-primary-bg); color: var(--btn-primary-color); font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.proposal-submit:hover:not(:disabled) { background: var(--btn-primary-bg-hover); }
.proposal-submit:disabled { opacity: 0.45; cursor: not-allowed; }
@media (min-width: 640px) { .proposal-main { padding: 40px 32px 80px; } .proposal-steps { margin-bottom: 48px; gap: 12px; } .proposal-steps__mark { width: 30px; height: 30px; } .proposal-steps__label { font-size: 13px; } .ct-title { font-size: 32px; } .proposal-form { padding: 36px 40px; border-radius: 24px; } }
</style>