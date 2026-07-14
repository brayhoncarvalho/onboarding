<template>
  <section class="hero" id="simulador">
    <div class="hero__body">
      <div class="hero__media">
        <img src="/assets/landing-hero.png" alt="Pessoa usando tablet" class="hero__image" />
      </div>

      <div class="hero__content">
        <h1 class="hero__title">Crédito na conta, sem enrolação.</h1>
        <p class="hero__subtitle">
          Simule em poucos minutos, contrate 100% online e acompanhe seu pedido com transparência, do início ao fim.
          Sem letras miúdas, sem surpresas.
        </p>

        <div class="hero__cta-row">
          <button type="button" class="hero__cta" @click="emit('simular')">Começar simulação</button>
          <p class="hero__trust"><span aria-hidden="true">✓</span>Sem burocracia</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'simular'): void }>()
</script>

<style scoped>
.hero {
  position: relative;
  background: #fafcfc;
}

.hero__body {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  min-height: 520px;
  width: 100%;
  max-width: 680px;
}

.hero__content {
  position: relative;
  z-index: 2;
  padding: 24px 20px;
  max-width: 640px;
}

.hero__title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 36px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.08;
  color: #0b2528;
  margin: 0 0 16px;
}

.hero__subtitle {
  margin: 0 0 24px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #33484a;
}

.hero__cta-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: 0 30px;
  border: none;
  border-radius: 999px;
  background: #063b3e;
  color: #ffffff;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.hero__cta:hover {
  background: #052c2f;
}

.hero__trust {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #2e4446;
}

.hero__trust span {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #dff3f1;
  color: #0fa3a3;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.hero__media {
  position: relative;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  background: #e6efee;
}

.hero__media::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(250, 252, 252, 0.72) 0%, rgba(250, 252, 252, 0.86) 100%),
    linear-gradient(90deg, rgba(250, 252, 252, 0.88) 0%, rgba(250, 252, 252, 0.55) 58%, rgba(250, 252, 252, 0.78) 100%);
  pointer-events: none;
}

.hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  object-position: center 28%;
  filter: saturate(0.45) contrast(0.78) brightness(0.95);
}

@media (min-width: 480px) {
  .hero__body { min-height: 560px; }
  .hero__content { padding: 28px 24px; }
  .hero__title { font-size: 44px; }
  .hero__subtitle { font-size: 17px; }
}

@media (min-width: 1024px) {
  .hero__body {
    max-width: 100%;
    min-height: var(--landing-column-height, 620px);
  }

  .hero__content { padding: 124px 42px; }

  .hero__title {
    font-size: 64px;
    margin-bottom: 28px;
    max-width: 700px;
  }

  .hero__subtitle {
    font-size: 20px;
    margin-bottom: 40px;
    max-width: 460px;
  }

  .hero__cta-row {
    margin-bottom: 56px;
    flex-direction: row;
    align-items: center;
    gap: 26px;
  }

  .hero__cta {
    height: 58px;
    padding: 0 36px;
    font-size: 17px;
  }

  .hero__media {
    background: #dde8e7;
  }

  .hero__image {
    object-fit: contain;
    object-position: center bottom;
    filter: saturate(0.38) contrast(0.75) brightness(0.96);
  }

  .hero__media::after {
    background:
      linear-gradient(180deg, rgba(250, 252, 252, 0.78) 0%, rgba(250, 252, 252, 0.90) 80%),
      linear-gradient(90deg, rgba(250, 252, 252, 0.92) 0%, rgba(250, 252, 252, 0.58) 58%, rgba(250, 252, 252, 0.82) 100%);
  }
}
</style>
