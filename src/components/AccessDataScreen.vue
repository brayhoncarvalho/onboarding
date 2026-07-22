<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'
import { maskPhone } from '../utils/masks'
import { validateEmail, validatePhone } from '../utils/validators'

type AccessChannel = '' | 'email' | 'celular'

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'enviar', payload: { email: string; celular: string; canal: 'email' | 'celular' }): void
}>()

const IS_DEV_PREFILL = true

const email = ref(IS_DEV_PREFILL ? 'brayhon@gmail.com' : '')
const celular = ref(IS_DEV_PREFILL ? maskPhone('11954489531') : '')
const canal = ref<AccessChannel>(IS_DEV_PREFILL ? 'celular' : '')

const errors = reactive({
  email: '',
  celular: '',
  canal: '',
})

const touched = reactive({
  email: false,
  celular: false,
})

const onPhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  celular.value = maskPhone(input.value)
  nextTick(() => {
    input.value = celular.value
  })
}

const validateField = (field: 'email' | 'celular') => {
  touched[field] = true

  if (field === 'email') {
    errors.email = validateEmail(email.value)
    return
  }

  errors.celular = validatePhone(celular.value)
}

const validateChannel = () => {
  errors.canal = canal.value ? '' : 'Selecione como deseja receber as informações de acesso.'
}

const validateAll = () => {
  validateField('email')
  validateField('celular')
  validateChannel()

  return !errors.email && !errors.celular && !errors.canal
}

const handleEnviar = () => {
  if (!validateAll()) {
    nextTick(() => {
      const firstError = document.querySelector('.field-error')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
    return
  }

  emit('enviar', {
    email: email.value.trim(),
    celular: celular.value,
    canal: canal.value === 'email' ? 'email' : 'celular',
  })
  // Persiste e-mail/celular para o backoffice Mesa
  try {
    const existing = JSON.parse(localStorage.getItem('mesa_proposta_pendente') ?? '{}')
    localStorage.setItem('mesa_proposta_pendente', JSON.stringify({
      ...existing,
      email:   email.value.trim(),
      celular: celular.value,
    }))
  } catch { /* ignore */ }
}
</script>

<template>
  <div class="ad-screen">

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

        <!-- Stepper: passo 1 ativo -->
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

        <h1 class="ad-title">Informe seus dados de acesso</h1>
        <p class="ad-subtitle">Usaremos esses dados para enviar as informações do seu empréstimo.</p>

        <div class="proposal-form">
          <form @submit.prevent="handleEnviar" novalidate>

            <div class="proposal-field">
              <label for="access-email">E-mail</label>
              <input
                id="access-email"
                v-model="email"
                type="email"
                inputmode="email"
                autocomplete="email"
                placeholder="seu@email.com.br"
                :class="['proposal-input', touched.email && errors.email ? 'is-error' : '']"
                :aria-invalid="!!(touched.email && errors.email)"
                :aria-describedby="touched.email && errors.email ? 'access-email-error' : undefined"
                @blur="validateField('email')"
              />
              <p v-if="touched.email && errors.email" id="access-email-error" class="field-error" role="alert">
                {{ errors.email }}
              </p>
            </div>

            <div class="proposal-field">
              <label for="access-phone">Celular</label>
              <input
                id="access-phone"
                :value="celular"
                type="tel"
                inputmode="numeric"
                autocomplete="tel-national"
                maxlength="15"
                placeholder="(00) 00000-0000"
                :class="['proposal-input', touched.celular && errors.celular ? 'is-error' : '']"
                :aria-invalid="!!(touched.celular && errors.celular)"
                :aria-describedby="touched.celular && errors.celular ? 'access-phone-error' : undefined"
                @input="onPhoneInput"
                @blur="validateField('celular')"
              />
              <p v-if="touched.celular && errors.celular" id="access-phone-error" class="field-error" role="alert">
                {{ errors.celular }}
              </p>
            </div>

            <fieldset class="ad-channel-group">
              <legend class="ad-channel-legend">Onde deseja receber as informações de acesso?</legend>

              <label class="ad-channel-option">
                <input v-model="canal" type="radio" name="canal-acesso" value="email" class="ad-sr-only" @change="validateChannel" />
                <span class="ad-radio" :class="canal === 'email' ? 'ad-radio--on' : ''" aria-hidden="true">
                  <span v-if="canal === 'email'" class="ad-radio-dot"></span>
                </span>
                <span class="ad-channel-text">Receber via e-mail</span>
              </label>

              <label class="ad-channel-option">
                <input v-model="canal" type="radio" name="canal-acesso" value="celular" class="ad-sr-only" @change="validateChannel" />
                <span class="ad-radio" :class="canal === 'celular' ? 'ad-radio--on' : ''" aria-hidden="true">
                  <span v-if="canal === 'celular'" class="ad-radio-dot"></span>
                </span>
                <span class="ad-channel-text">Receber via celular (SMS)</span>
              </label>

              <p v-if="errors.canal" class="field-error" role="alert">{{ errors.canal }}</p>
            </fieldset>

            <button type="submit" class="proposal-submit">Continuar</button>
          </form>
          <!-- Oculto
          <p class="proposal-safe"><span aria-hidden="true">✓</span>Dados protegidos pela LGPD — instituição regulada pelo Bacen</p> -->
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
.ad-screen {
  min-height: 100vh;
  background: var(--color-gray-50);
  display: flex;
  flex-direction: column;
}

.proposal-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--color-gray-50);
  border-bottom: 1px solid var(--color-primary-100);
}

.proposal-header__inner {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.proposal-header__logo { height: 24px; width: auto; }

.proposal-header__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border: 1.5px solid var(--color-primary-100);
  border-radius: 999px;
  background: #ffffff;
  color: var(--color-navy-400);
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.proposal-header__back:hover { background: var(--color-primary-50); }

.proposal-main {
  flex: 1;
  padding: 32px 20px 64px;
}

.proposal-main__inner {
  max-width: 640px;
  margin: 0 auto;
}

/* Stepper */
.proposal-steps {
  list-style: none;
  margin: 0 0 40px;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 4px;
}

.proposal-steps__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  position: relative;
}

.proposal-steps__item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 14px;
  left: calc(50% + 18px);
  right: calc(-50% + 18px);
  height: 1.5px;
  background: var(--color-primary-100);
}

.proposal-steps__item.is-done:not(:last-child)::after { background: var(--btn-primary-bg); }

.proposal-steps__mark {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid var(--color-primary-200);
  background: #ffffff;
  color: var(--color-navy-400);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.proposal-steps__label {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--color-gray-400);
  line-height: 1.2;
  text-align: center;
}

.proposal-steps__item.is-done .proposal-steps__mark { background: var(--btn-primary-bg); border-color: var(--color-primary-500); color: var(--btn-primary-color); }
.proposal-steps__item.is-done .proposal-steps__label { color: var(--color-secondary-600); }
.proposal-steps__item.is-active .proposal-steps__mark { background: #ffffff; border: 1.5px solid var(--color-primary-500); color: var(--color-primary-500); box-shadow: 0 0 0 3px var(--color-primary-100); }
.proposal-steps__item.is-active .proposal-steps__label { color: var(--color-primary-500); }

/* Títulos */
.ad-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-navy-800);
  margin: 0 0 8px;
  line-height: 1.1;
}

.ad-subtitle {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: var(--color-navy-500);
  margin: 0 0 28px;
  line-height: 1.55;
}

/* Form card */
.proposal-form {
  background: #ffffff;
  border: 1px solid var(--color-primary-100);
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 8px 32px rgba(10, 22, 40, 0.06);
}

.proposal-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
}

.proposal-field label {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-navy-800);
}

.proposal-input {
  height: 50px;
  border: 1.5px solid var(--color-primary-200);
  border-radius: 12px;
  padding: 0 16px;
  font-size: 16px;
  font-family: 'Instrument Sans', sans-serif;
  color: var(--color-navy-800);
  background: #ffffff;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.proposal-input:focus { border-color: var(--color-primary-500); }
.proposal-input.is-error { border-color: #dc3545; }

.field-error {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: #dc3545;
  margin: 2px 0 0;
}

/* Canal */
.ad-channel-group { border: none; padding: 0; margin: 0 0 28px; }

.ad-channel-legend {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-navy-800);
  margin-bottom: 14px;
  display: block;
}

.ad-channel-option {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 14px 16px;
  border: 1.5px solid var(--color-primary-100);
  border-radius: 12px;
  margin-bottom: 10px;
  transition: border-color 0.15s, background 0.15s;
}

.ad-channel-option:has(input:checked) { border-color: var(--color-primary-500); background: var(--color-primary-100); }

.ad-radio {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--color-gray-300);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.ad-radio--on { border-color: var(--color-primary-500); }

.ad-radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--btn-primary-bg);
}

.ad-channel-text {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: var(--color-navy-400);
}

/* CTA */
.proposal-submit {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 999px;
  background: var(--btn-primary-bg);
  color: var(--btn-primary-color);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 16px;
}

.proposal-submit:hover { background: var(--btn-primary-bg-hover); color: #ffffff; }

.proposal-safe {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: var(--color-navy-400);
  margin: 0;
}

.proposal-safe span {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary-100);
  color: var(--color-secondary-600);
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ad-sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}

@media (min-width: 640px) {
  .proposal-header__inner { height: 72px; }
  .proposal-header__logo { height: 26px; }
  .proposal-main { padding: 40px 32px 80px; }
  .proposal-steps { margin-bottom: 48px; gap: 12px; }
  .proposal-steps__mark { width: 30px; height: 30px; }
  .proposal-steps__label { font-size: 13px; }
  .ad-title { font-size: 36px; }
  .proposal-form { padding: 36px 40px; border-radius: 24px; }
}
</style>
