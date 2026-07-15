<template>
  <section class="como-funciona" id="como-funciona">
    <div class="como-funciona__container">

      <div class="como-funciona__intro">
        <h2 class="como-funciona__title">Contrate seu empréstimo em apenas três passos.</h2>
        <p class="como-funciona__intro-text">
          Todo o processo é digital. Você acompanha cada etapa e recebe o dinheiro direto na sua conta.
        </p>
      </div>

      <div class="como-funciona__grid" role="list" aria-label="Etapas da contratação">

        <article class="como-funciona__step" role="listitem">
          <div class="como-funciona__circle" aria-hidden="true">1</div>
          <div class="como-funciona__step-body">
            <p class="como-funciona__step-title">Preencha a proposta</p>
            <p class="como-funciona__step-desc">
              Contrate seu empréstimo 100% online. Fácil, rápido e seguro.
            </p>
          </div>
        </article>

        <article class="como-funciona__step" role="listitem">
          <div class="como-funciona__circle" aria-hidden="true">2</div>
          <div class="como-funciona__step-body">
            <p class="como-funciona__step-title">Aguarde a aprovação</p>
            <p class="como-funciona__step-desc">
              Após a análise rápida feita pelos consultores.
            </p>
          </div>
        </article>

        <article class="como-funciona__step" role="listitem">
          <div class="como-funciona__circle" aria-hidden="true">3</div>
          <div class="como-funciona__step-body">
            <p class="como-funciona__step-title">Receba o seu dinheiro!</p>
            <p class="como-funciona__step-desc">
              Leia os termos, assine o contrato e receba o seu dinheiro.
            </p>
          </div>
        </article>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.como-funciona {
  width: 100%;
  background: #fafcfc;
}

.como-funciona__container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 56px 20px;
  display: grid;
  gap: 32px;
}

.como-funciona__title {
  margin: 0 0 14px;
  color: #0b2528;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 36px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.como-funciona__intro-text {
  margin: 0;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #5b6b6c;
}

.como-funciona__grid {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e3edec;
}

.como-funciona__step {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 20px 0;
  border-top: 1px solid #e3edec;
}

.como-funciona__circle {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid #b9deda;
  color: #0fa3a3;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.como-funciona__step-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #0b2528;
  margin: 0 0 4px;
}

.como-funciona__step-desc {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: #5c5c5c;
  line-height: 1.55;
  margin: 0;
}

@media (min-width: 480px) {
  .como-funciona__container { padding: 72px 24px; }
}

@media (min-width: 1024px) {
  .como-funciona__container {
    padding: 104px 40px;
    grid-template-columns: 380px 1fr;
    gap: 80px;
    align-items: start;
  }

  .como-funciona__title { font-size: 44px; }
  .como-funciona__intro-text { font-size: 18px; }

  .como-funciona__step { gap: 28px; padding: 28px 0; }

  .como-funciona__circle { width: 48px; height: 48px; font-size: 18px; }
  .como-funciona__step-title { font-size: 22px; margin-bottom: 6px; }
  .como-funciona__step-desc { font-size: 16px; max-width: 540px; }
}
</style>
