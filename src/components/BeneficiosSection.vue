<template>
  <section class="beneficios" id="beneficios" aria-labelledby="beneficios-title">

    <!-- Cards de benefícios -->
    <div class="beneficios__container">
      <h2 id="beneficios-title" class="beneficios__title">Por que contratar com a gente</h2>

      <div class="beneficios__grid">

        <article class="beneficios__card">
          <div class="beneficios__icon-wrap" aria-hidden="true">
            <img src="/assets/landing-icon-computer.svg" alt="" class="beneficios__icon" />
          </div>
          <p class="beneficios__card-title">Fácil e rápido</p>
          <p class="beneficios__card-desc">Jornada 100% digital com poucos passos.</p>
        </article>

        <article class="beneficios__card">
          <div class="beneficios__icon-wrap" aria-hidden="true">
            <img src="/assets/landing-icon-calendar.svg" alt="" class="beneficios__icon" />
          </div>
          <p class="beneficios__card-title">Tempo para pagar</p>
          <p class="beneficios__card-desc">Escolha o prazo ideal para o seu bolso.</p>
        </article>

        <article class="beneficios__card">
          <div class="beneficios__icon-wrap" aria-hidden="true">
            <img src="/assets/landing-icon-money.svg" alt="" class="beneficios__icon" />
          </div>
          <p class="beneficios__card-title">Taxa transparente</p>
          <p class="beneficios__card-desc">Simulação clara e condições sem surpresa.</p>
        </article>

        <article class="beneficios__card">
          <div class="beneficios__icon-wrap" aria-hidden="true">
            <img src="/assets/landing-icon-wallet.svg" alt="" class="beneficios__icon" />
          </div>
          <p class="beneficios__card-title">Parcela sob medida</p>
          <p class="beneficios__card-desc">Ajuste o valor e veja tudo em tempo real.</p>
        </article>

      </div>
    </div>

    <!-- Segurança — fundo escuro full-width -->
    <div class="beneficios__seguranca" aria-labelledby="seguranca-title">
      <div class="beneficios__seguranca-inner">
        <div>
          <h3 id="seguranca-title" class="beneficios__seguranca-title">Segurança de banco, agilidade de fintech.</h3>
          <p class="beneficios__seguranca-text">
            Sua contratação é protegida de ponta a ponta.
          </p>
        </div>

        <div class="beneficios__seguranca-list" role="list" aria-label="Pilares de segurança">
          <article class="beneficios__seguranca-item" role="listitem">
            <span aria-hidden="true">✓</span>
            <div>
              <p>Regulação Bacen</p>
              <small>Operação supervisionada e aderente às normas.</small>
            </div>
          </article>
          <article class="beneficios__seguranca-item" role="listitem">
            <span aria-hidden="true">✓</span>
            <div>
              <p>Proteção de dados</p>
              <small>Processamento conforme LGPD e boas práticas de mercado.</small>
            </div>
          </article>
          <article class="beneficios__seguranca-item" role="listitem">
            <span aria-hidden="true">✓</span>
            <div>
              <p>Jornada transparente</p>
              <small>Custos e condições explicados antes da contratação.</small>
            </div>
          </article>
        </div>
      </div>
    </div>

    <!-- FAQ e CTA final -->
    <div class="beneficios__lower">
      <div class="beneficios__faq" aria-labelledby="faq-title">
        <div class="beneficios__faq-intro">
          <h3 id="faq-title">Ficou com alguma dúvida?</h3>
          <p>Separamos as perguntas mais comuns. Se precisar de mais ajuda, fale com a gente.</p>
        </div>

        <div class="beneficios__faq-list" role="list" aria-label="Perguntas frequentes">
          <article v-for="item in faq" :key="item.id" class="beneficios__faq-item" role="listitem">
            <button
              type="button"
              class="beneficios__faq-btn"
              :aria-expanded="openFaqId === item.id"
              :aria-controls="`faq-${item.id}`"
              @click="toggleFaq(item.id)"
            >
              <span>{{ item.q }}</span>
              <strong aria-hidden="true">{{ openFaqId === item.id ? '−' : '+' }}</strong>
            </button>
            <p v-if="openFaqId === item.id" :id="`faq-${item.id}`" class="beneficios__faq-answer">
              {{ item.a }}
            </p>
          </article>
        </div>
      </div>

      <div class="beneficios__cta-final" aria-label="Chamada final">
        <div>
          <h3>Pronto para simular?</h3>
          <p>Leva 1 minuto e não afeta o seu score de crédito.</p>
        </div>
        <a href="#simulador-card">Começar simulação</a>
      </div>

    </div><!-- /.beneficios__lower -->
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type FaqItem = {
  id: number
  q: string
  a: string
}

const faq: FaqItem[] = [
  {
    id: 1,
    q: 'Quem pode contratar o empréstimo?',
    a: 'Pessoas físicas maiores de 18 anos, com CPF regular e conta bancária no próprio nome. A aprovação depende da análise de crédito.',
  },
  {
    id: 2,
    q: 'Em quanto tempo recebo o dinheiro?',
    a: 'Depois da aprovação e da assinatura do contrato, a instituição financeira realiza a liberação do crédito. O prazo pode variar conforme a análise, a documentação e os horários bancários.',
  },
  {
    id: 3,
    q: 'Posso antecipar parcelas?',
    a: 'Sim. Você pode consultar condições de antecipação pelos nossos canais de atendimento.',
  },
  {
    id: 4,
    q: 'Quais documentos são necessários?',
    a: 'Normalmente documento com foto, dados cadastrais e comprovação solicitada durante o fluxo.',
  },
]

const openFaqId = ref<number>(1)

const toggleFaq = (id: number) => {
  openFaqId.value = openFaqId.value === id ? 0 : id
}
</script>

<style scoped>
.beneficios {
  width: 100%;
  background: var(--color-gray-50);
}

.beneficios__container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 24px 20px 56px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.beneficios__title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 36px;
  font-weight: 600;
  color: var(--color-navy-800);
  margin: 0 0 28px;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.beneficios__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.beneficios__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 220px;
  background: #ffffff;
  border: 1px solid var(--color-primary-100);
  border-radius: 20px;
  padding: 24px 20px;
}

.beneficios__icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(0, 136, 136, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-bottom: 22px;
}

.beneficios__icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  display: block;
  filter: brightness(0) saturate(100%) invert(35%) sepia(90%) saturate(600%) hue-rotate(150deg) brightness(90%);
}

.beneficios__card-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-navy-800);
  text-align: left;
  line-height: 1.2;
  margin: 0 0 8px;
}

.beneficios__card-desc {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: var(--color-navy-500);
  text-align: left;
  line-height: 1.6;
  margin: 0;
}

@media (min-width: 480px) {
  .beneficios__container { padding: 32px 24px 72px; }
  .beneficios__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .beneficios__container { padding: 0 40px 104px; }
  .beneficios__title {
    font-size: 44px;
    margin-bottom: 56px;
  }
  .beneficios__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
  .beneficios__card {
    min-height: 100%;
    border-radius: 24px;
    padding: 32px 28px;
  }
  .beneficios__icon-wrap {
    width: 52px;
    height: 52px;
  }
  .beneficios__icon {
    width: 28px;
    height: 28px;
  }
}

.beneficios__seguranca {
  width: 100%;
  background: var(--btn-primary-bg);
  padding: 56px 20px;
}

.beneficios__seguranca-inner {
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
}

.beneficios__seguranca-title {
  margin: 0 0 12px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.beneficios__seguranca-text {
  margin: 0;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.72);
}

.beneficios__seguranca-list {
  display: grid;
  gap: 12px;
}

.beneficios__seguranca-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.18);
}

.beneficios__seguranca-item span {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-secondary-700);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
}

.beneficios__seguranca-item p {
  margin: 0 0 2px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-navy-800);
}

.beneficios__seguranca-item small {
  margin: 0;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: var(--color-navy-600);
}

.beneficios__faq {
  padding: 56px 0 0;
  display: grid;
  gap: 28px;
}

.beneficios__faq-intro h3 {
  margin: 0 0 12px;
  color: var(--color-navy-800);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 36px;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.beneficios__faq-intro p {
  margin: 0;
  color: var(--color-navy-500);
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  line-height: 1.6;
}

.beneficios__faq-list {
  border-top: 1px solid var(--color-primary-100);
}

.beneficios__faq-item {
  border-bottom: 1px solid var(--color-primary-100);
}

.beneficios__faq-btn {
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 4px;
  cursor: pointer;
}

.beneficios__faq-btn span {
  color: var(--color-navy-800);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 18px;
  font-weight: 600;
}

.beneficios__faq-btn strong {
  width: 28px;
  text-align: center;
  color: var(--color-secondary-600);
  font-size: 22px;
  font-weight: 500;
}

.beneficios__faq-answer {
  margin: 0;
  padding: 0 40px 20px 4px;
  color: var(--color-navy-500);
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  line-height: 1.65;
}

.beneficios__cta-final {
  margin-top: 56px;
  margin-bottom: 30px;
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-navy-800) 100%);
  border-radius: 24px;
  padding: 32px 24px;
  display: grid;
  gap: 20px;
}

.beneficios__cta-final h3 {
  margin: 0 0 8px;
  color: #ffffff;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.beneficios__cta-final p {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
}

.beneficios__lower {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.beneficios__faq {
  padding: 56px 0 0;
  display: grid;
  gap: 28px;
}

.beneficios__cta-final a {
  justify-self: start;
  text-decoration: none;
  height: 52px;
  padding: 0 30px;
  border-radius: 999px;
  background: var(--btn-primary-bg);
  color: var(--btn-primary-color);
  display: inline-flex;
  align-items: center;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 700;
  transition: background 0.15s ease;
}

.beneficios__cta-final a:hover {
  background: var(--btn-primary-bg-hover);
  color: var(--btn-primary-color);
}

@media (min-width: 1024px) {
  .beneficios__seguranca {
    padding: 96px 40px;
  }

  .beneficios__seguranca-inner {
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    padding: 0 0;
  }

  .beneficios__lower {
    padding: 0 40px;
  }

  .beneficios__seguranca-title { font-size: 36px; }
  .beneficios__seguranca-text { font-size: 18px; }

  .beneficios__faq {
    padding: 104px 0 0;
    grid-template-columns: 380px 1fr;
    gap: 80px;
    align-items: start;
  }

  .beneficios__faq-intro h3 { font-size: 44px; }
  .beneficios__faq-intro p { font-size: 18px; }
  .beneficios__faq-btn { padding: 24px 4px; }
  .beneficios__faq-btn span { font-size: 18px; }
  .beneficios__faq-answer { font-size: 16px; padding-bottom: 24px; }

  .beneficios__cta-final {
    margin-top: 104px;
    border-radius: 32px;
    padding: 72px 64px;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 48px;
  }

  .beneficios__cta-final h3 { font-size: 40px; }
  .beneficios__cta-final p { font-size: 17px; }
  .beneficios__cta-final a {
    height: 60px;
    padding: 0 44px;
    font-size: 17px;
  }
}
</style>
