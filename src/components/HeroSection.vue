<template>
  <section class="hero" id="simulador" aria-labelledby="hero-title">
    <div class="hero__body">
      <div class="hero__content">
        <h1 id="hero-title" class="hero__title">Empréstimo Online, Rápido e Seguro.</h1>
        <p class="hero__subtitle">
          Faça sua simulação online e conheça as opções de crédito disponíveis para você.
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
}

.hero__body {
  position: relative;
  width: 100%;
  max-width: 680px;
}

.hero__content {
  position: relative;
  padding: 24px 20px;
  max-width: 640px;
}

.hero__title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 36px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.08;
  color: var(--color-navy-800);
  margin: 0 0 16px;
}

.hero__subtitle {
  margin: 0 0 24px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-navy-700);
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
  background: var(--btn-primary-bg);
  color: var(--btn-primary-color);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.hero__cta:hover {
  background: var(--color-navy-900);
}

.hero__trust {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-navy-800);
}

.hero__trust span {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary-100);
  color: var(--color-secondary-600);
  font-size: 16px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 480px) {
  .hero__body { min-height: 560px; }
  .hero__content { padding: 28px 24px; }
  .hero__title { font-size: 44px; }
  .hero__subtitle { font-size: 18px; }
}

@media (min-width: 1024px) {
  .hero__body {
    max-width: 100%;
    min-height: var(--landing-column-height, 620px);
  }

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
    font-size: 18px;
  }

  .hero__content { padding: 124px 42px; }
}
</style>
