<script setup lang="ts">
import { computed, ref } from 'vue'

type AccessChannel = 'email' | 'celular'

const props = withDefaults(defineProps<{
  email?: string
  celular?: string
  canal?: AccessChannel
}>(), {
  email: '',
  celular: '',
  canal: 'celular',
})

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'continuar'): void
}>()

const senha = ref('1234')
const touched = ref(false)
const feedback = ref('')

const destinationText = computed(() => {
  if (props.canal === 'email' && props.email) {
    return `para o seu e-mail ${props.email}.`
  }

  if (props.celular) {
    return `para o seu celular ${props.celular}.`
  }

  return 'para o seu celular cadastrado.'
})

const instructionText = computed(() =>
  `Para sua segurança, digite abaixo a senha que enviamos ${destinationText.value}`
)

const errorMessage = computed(() => {
  if (!touched.value) {
    return ''
  }

  if (!senha.value.trim()) {
    return 'Digite a senha enviada para continuar.'
  }

  if (senha.value.trim().length < 4) {
    return 'A senha deve ter ao menos 4 caracteres.'
  }

  return ''
})

const onSenhaInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  senha.value = input.value.replace(/\s+/g, '').slice(0, 6)
  feedback.value = ''
}

const handleContinue = () => {
  touched.value = true
  feedback.value = ''

  if (errorMessage.value) {
    return
  }

  emit('continuar')
}

const handleResend = () => {
  feedback.value = props.canal === 'email'
    ? 'Uma nova senha foi reenviada para o seu e-mail.'
    : 'Uma nova senha foi reenviada por SMS.'
}
</script>

<template>
  <div class="senha-screen">

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

        <h1 class="ss-title">Confirmação de Cadastro</h1>
        <p class="ss-subtitle">{{ instructionText }}</p>

        <div class="proposal-form">
          <form @submit.prevent="handleContinue" novalidate>

            <div class="proposal-field">
              <label for="senha-confirmacao">Senha recebida</label>
              <input
                id="senha-confirmacao"
                :value="senha"
                type="password"
                inputmode="numeric"
                maxlength="6"
                autocomplete="one-time-code"
                placeholder="••••••"
                :class="['proposal-input proposal-input--center', errorMessage ? 'is-error' : '']"
                :aria-invalid="!!errorMessage"
                :aria-describedby="errorMessage ? 'senha-error' : undefined"
                @input="onSenhaInput"
                @blur="touched = true"
              />
              <p v-if="errorMessage" id="senha-error" class="field-error" role="alert">
                {{ errorMessage }}
              </p>
            </div>

            <button type="submit" class="proposal-submit">Continuar</button>
          </form>

          <div class="ss-resend">
            <button type="button" class="ss-resend__btn" @click="handleResend">
              Não recebi a senha — reenviar
            </button>
            <p v-if="feedback" role="status" class="ss-resend__feedback">{{ feedback }}</p>
          </div>
          <!-- Oculto
          <p class="proposal-safe"><span aria-hidden="true">✓</span>Dados protegidos pela LGPD — instituição regulada pelo Bacen</p> -->
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
.senha-screen {
  min-height: 100vh;
  background: var(--color-gray-50);
  display: flex;
  flex-direction: column;
}

/* ── Header ── */
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
  gap: 6px;
  padding: 8px 18px;
  border: 1.5px solid var(--color-primary-100);
  border-radius: 999px;
  background: transparent;
  color: var(--color-navy-800);
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.proposal-header__back:hover { background: var(--color-primary-50); }

/* ── Main ── */
.proposal-main {
  flex: 1;
  padding: 32px 20px 64px;
}
.proposal-main__inner {
  max-width: 640px;
  margin: 0 auto;
}

/* ── Stepper ── */
.proposal-steps {
  list-style: none;
  margin: 0 0 40px;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 4px;
}
.proposal-steps__item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-top: 2px;
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
.proposal-steps__item.is-done::after  { background: var(--btn-primary-bg); }
.proposal-steps__item.is-active::after { background: var(--color-primary-100); }
.proposal-steps__mark {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1.5px solid var(--color-primary-200);
  background: #ffffff;
  color: var(--color-navy-400);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  font-weight: 700;
  position: relative;
  z-index: 1;
}
.proposal-steps__item.is-done  .proposal-steps__mark { background: var(--btn-primary-bg); border-color: var(--color-primary-500); color: var(--btn-primary-color); }
.proposal-steps__item.is-active .proposal-steps__mark { border-color: var(--color-primary-500); color: var(--color-primary-500); background: #ffffff; box-shadow: 0 0 0 3px var(--color-primary-100); }
.proposal-steps__label {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-navy-400);
  text-align: center;
  line-height: 1.2;
  letter-spacing: 0.03em;
}
.proposal-steps__item.is-active .proposal-steps__label { color: var(--color-navy-800); }
.proposal-steps__item.is-done  .proposal-steps__label { color: var(--color-navy-500); }

/* ── Page title ── */
.ss-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-navy-800);
  margin: 0 0 8px;
}
.ss-subtitle {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: var(--color-navy-500);
  margin: 0 0 28px;
  line-height: 1.5;
}

/* ── Form card ── */
.proposal-form {
  background: #ffffff;
  border: 1px solid var(--color-primary-100);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(10, 22, 40, 0.06);
  padding: 28px 24px;
}

/* ── Field ── */
.proposal-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
}
.proposal-field label {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-navy-800);
}
.proposal-input {
  height: 50px;
  border: 1.5px solid var(--color-primary-200);
  border-radius: 12px;
  padding: 0 14px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: var(--color-navy-800);
  background: #ffffff;
  outline: none;
  transition: border-color 0.15s;
}
.proposal-input--center {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.35em;
}
.proposal-input:focus { border-color: var(--color-primary-500); }
.proposal-input.is-error { border-color: #dc3545; }
.field-error {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: #dc3545;
  margin: 0;
}

/* ── Submit ── */
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
  margin-top: 8px;
  transition: background 0.15s;
}
.proposal-submit:hover { background: var(--btn-primary-bg-hover); color: #ffffff; }

/* ── Resend ── */
.ss-resend {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 16px;
}
.ss-resend__btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-navy-800);
  text-decoration: underline;
  text-underline-offset: 2px;
  padding: 0;
}
.ss-resend__btn:hover { color: var(--color-primary-500); }
.ss-resend__feedback {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: var(--color-navy-500);
  margin: 8px 0 0;
  text-align: center;
}

/* ── Safe note ── */
.proposal-safe {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: var(--color-navy-400);
  margin: 0;
}

/* ── Responsive ── */
@media (min-width: 640px) {
  .proposal-header__inner { height: 72px; }
  .proposal-header__logo { height: 26px; }
  .proposal-main { padding: 40px 32px 80px; }
  .proposal-steps { margin-bottom: 48px; gap: 12px; }
  .proposal-steps__mark { width: 30px; height: 30px; }
  .proposal-steps__label { font-size: 13px; }
  .ss-title { font-size: 32px; }
  .proposal-form { padding: 36px 40px; border-radius: 24px; }
}
</style>
