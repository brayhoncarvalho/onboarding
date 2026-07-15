<script setup lang="ts">
import { computed } from 'vue'
import AuthHeader from './AuthHeader.vue'

const emit = defineEmits<{
  (e: 'gerarContrato'): void
  (e: 'voltar'): void
  (e: 'navigate', action: 'sair' | 'emprestimos' | 'meus-dados'): void
}>()

const props = withDefaults(
  defineProps<{
    valor?: string
    prazo?: string
    parcela?: string
    taxaNominal?: string
    taxaEfetiva?: string
  }>(),
  {
    valor: 'R$ 3.500,00',
    prazo: '18 meses',
    parcela: 'R$ 209,32',
    taxaNominal: '2,75% a.m./ 38,40% a.a.',
    taxaEfetiva: '2,85% a.m./ 40,08% a.a.',
  }
)

const primeiroVencimento = (() => {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
})()

const campos = computed(() => [
  { label: 'Valor que será creditado:', value: props.valor },
  { label: 'Prazo de pagamento:', value: props.prazo },
  { label: 'Valor da Parcela:', value: props.parcela },
  { label: 'Primeiro vencimento:', value: primeiroVencimento },
  { label: 'TAC:', value: 'R$ 0,00' },
  { label: 'Taxa nominal:', value: props.taxaNominal },
  { label: 'Taxa efetiva:', value: props.taxaEfetiva },
])
</script>

<template>
  <div class="rv-screen">
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
        <h1 class="rv-title">Revisão de Contrato</h1>
        <p class="rv-subtitle">Revise os dados da sua proposta antes de gerar o contrato.</p>
        <div class="proposal-form">
          <div class="rv-fields">
            <div v-for="campo in campos" :key="campo.label" class="rv-field">
              <span class="rv-field__label">{{ campo.label }}</span>
              <span class="rv-field__value">{{ campo.value }}</span>
            </div>
          </div>
          <p class="rv-disclaimer">Sua proposta só terá validade após a aprovação e quando o valor for creditado em sua conta bancária.</p>
          <button type="button" class="proposal-submit" @click="emit('gerarContrato')">Iniciar Assinatura</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.rv-screen { min-height: 100vh; background: #fafcfc; display: flex; flex-direction: column; }
.proposal-main { flex: 1; padding: 32px 20px 64px; }
.proposal-main__inner { max-width: 560px; margin: 0 auto; }
.proposal-steps { list-style: none; margin: 0 0 40px; padding: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; }
.proposal-steps__item { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; padding-top: 2px; }
.proposal-steps__item:not(:last-child)::after { content: ""; position: absolute; top: 14px; left: calc(50% + 18px); right: calc(-50% + 18px); height: 1.5px; background: #e3edec; }
.proposal-steps__item.is-done::after { background: #063b3e; }
.proposal-steps__mark { width: 28px; height: 28px; border-radius: 999px; border: 1.5px solid #d5e4e2; background: #ffffff; color: #607374; display: inline-flex; align-items: center; justify-content: center; font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 700; position: relative; z-index: 1; }
.proposal-steps__item.is-done .proposal-steps__mark { background: #063b3e; border-color: #063b3e; color: #ffffff; }
.proposal-steps__item.is-active .proposal-steps__mark { border-color: #063b3e; color: #063b3e; background: #ffffff; box-shadow: 0 0 0 3px #dff3f1; }
.proposal-steps__label { font-family: "Bricolage Grotesque", sans-serif; font-size: 15px; font-weight: 600; color: #607374; text-align: center; line-height: 1.2; letter-spacing: 0.03em; }
.proposal-steps__item.is-active .proposal-steps__label { color: #0b2528; }
.proposal-steps__item.is-done .proposal-steps__label { color: #5b6b6c; }
.rv-title { font-family: "Bricolage Grotesque", sans-serif; font-size: 28px; font-weight: 700; color: #0b2528; margin: 0 0 6px; }
.rv-subtitle { font-family: "Instrument Sans", sans-serif; font-size: 16px; color: #5b6b6c; margin: 0 0 28px; }
.proposal-form { background: #ffffff; border: 1px solid #e3edec; border-radius: 20px; box-shadow: 0 8px 32px rgba(6,59,62,0.06); padding: 28px 24px; display: flex; flex-direction: column; gap: 20px; }
.rv-fields { display: flex; flex-direction: column; }
.rv-field { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border: 1px solid #e3edec; gap: 12px; margin-top: -1px; background: #ffffff; }
.rv-field:first-child { border-radius: 12px 12px 0 0; margin-top: 0; }
.rv-field:last-child { border-radius: 0 0 12px 12px; }
.rv-field__label { font-family: "Instrument Sans", sans-serif; font-size: 16px; font-weight: 500; color: #5b6b6c; flex-shrink: 0; }
.rv-field__value { font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 700; color: #063b3e; text-align: right; word-break: break-word; }
.rv-disclaimer { font-family: "Instrument Sans", sans-serif; font-size: 16px; color: #607374; line-height: 1.55; margin: 0; }
.proposal-submit { width: 100%; height: 52px; border: none; border-radius: 999px; background: #00d8d8; color: #042a2c; font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.proposal-submit:hover { background: #0fc5c5; }
@media (min-width: 640px) { .proposal-main { padding: 40px 32px 80px; } .rv-title { font-size: 32px; } .proposal-form { padding: 36px 40px; border-radius: 24px; } }
</style>