<template>
  <footer class="landing-footer">
    <div class="landing-footer__body" id="footer">
      <div class="landing-footer__body-inner">
        <div class="landing-footer__row">
          <div>
            <img src="/assets/dock-logo-color.png" alt="Dock" class="landing-footer__logo" />
            <p class="landing-footer__meta">Instituição de pagamento regulada pelo Banco Central do Brasil.</p>
          </div>

          <div class="landing-footer__navs" aria-label="Links do rodapé">
            <nav class="landing-footer__nav-group" aria-label="Produto">
              <p>PRODUTO</p>
              <a href="#simulador">Empréstimo pessoal</a>
              <a href="#beneficios">Taxas e prazos</a>
              <a href="#como-funciona">Como funciona</a>
            </nav>
            <nav class="landing-footer__nav-group" aria-label="Legal">
              <p>LEGAL</p>
              <a href="#footer">Política de privacidade</a>
              <a href="#footer">Termos de uso</a>
            </nav>
          </div>
        </div>

        <hr class="landing-footer__divider" />

        <p class="landing-footer__copyright">
          © 2026 DOCK INSTITUIÇÃO DE PAGAMENTO S.A. — CNPJ 13.370.835/0001-85 —
          Av. Tamboré, 267, Alphaville, Barueri - SP — CEP 06460-000
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.landing-footer__body {
  width: 100%;
  background: #ffffff;
  border-top: 1px solid #e3edec;
  padding: 40px 20px 24px;
}

.landing-footer__body-inner {
  max-width: 1240px;
  margin: 0 auto;
}

.landing-footer__row {
  display: grid;
  gap: 32px;
}

.landing-footer__logo {
  height: 26px;
  width: auto;
  display: block;
  margin-bottom: 16px;
}

.landing-footer__meta {
  margin: 0;
  max-width: 320px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #8aa0a0;
}

.landing-footer__divider {
  border: none;
  border-top: 1px solid #e3edec;
  margin: 32px 0 20px;
}

.landing-footer__navs {
  display: grid;
  gap: 18px;
}

.landing-footer__nav-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.landing-footer__nav-group p {
  margin: 0 0 2px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #0b2528;
  letter-spacing: 0.04em;
}

.landing-footer__nav-group a {
  text-decoration: none;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 14px;
  color: #5b6b6c;
}

.landing-footer__nav-group a:hover {
  color: #063b3e;
}

.landing-footer__copyright {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #8aa0a0;
  line-height: 1.7;
  margin: 0;
}

@media (min-width: 480px) {
  .landing-footer__body { padding: 48px 24px 28px; }
  .landing-footer__navs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .landing-footer__body { padding: 56px 40px 40px; }
  .landing-footer__row {
    grid-template-columns: 1fr auto;
    align-items: start;
    gap: 48px;
  }
  .landing-footer__navs {
    grid-template-columns: repeat(2, minmax(0, auto));
    gap: 64px;
  }
}
</style>
