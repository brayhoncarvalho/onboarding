<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'continuar'): void
}>()

type CaptureState = 'guide' | 'detecting' | 'captured'

const state = ref<CaptureState>('guide')
let detectTimer: ReturnType<typeof setTimeout> | null = null

function startCapture() {
  state.value = 'detecting'
  detectTimer = setTimeout(() => {
    state.value = 'captured'
  }, 2400)
}

function retake() {
  if (detectTimer) { clearTimeout(detectTimer); detectTimer = null }
  state.value = 'guide'
}

function confirm() {
  emit('continuar')
}

onUnmounted(() => {
  if (detectTimer) clearTimeout(detectTimer)
})
</script>

<template>
  <div class="cs-screen">

    <!-- Header -->
    <header class="proposal-header">
      <div class="proposal-header__inner">
        <img src="/assets/dock-logo-color.png" alt="Dock" class="proposal-header__logo" />
        <button
          type="button"
          class="proposal-header__back"
          @click="state === 'captured' ? retake() : emit('voltar')"
          aria-label="Voltar"
        >
          <span aria-hidden="true">←</span> Voltar
        </button>
      </div>
    </header>

    <main class="proposal-main">
      <div class="proposal-main__inner">

        <!-- Stepper -->
        <ol class="proposal-steps" aria-label="Progresso da proposta">
          <li class="proposal-steps__item is-done">
            <span class="proposal-steps__mark" aria-hidden="true">✓</span>
            <span class="proposal-steps__label">DADOS INICIAIS</span>
          </li>
          <li class="proposal-steps__item is-done">
            <span class="proposal-steps__mark" aria-hidden="true">✓</span>
            <span class="proposal-steps__label">PROPOSTA</span>
          </li>
          <li class="proposal-steps__item is-done">
            <span class="proposal-steps__mark" aria-hidden="true">✓</span>
            <span class="proposal-steps__label">DADOS COMPLEMENTARES</span>
          </li>
          <li class="proposal-steps__item is-active">
            <span class="proposal-steps__mark" aria-hidden="true">4</span>
            <span class="proposal-steps__label">DOCUMENTOS</span>
          </li>
          <li class="proposal-steps__item">
            <span class="proposal-steps__mark" aria-hidden="true">5</span>
            <span class="proposal-steps__label">CONCLUSÃO</span>
          </li>
        </ol>

        <!-- Título -->
        <h1 class="cs-title">
          <template v-if="state !== 'captured'">Verificação por selfie</template>
          <template v-else>Selfie capturada!</template>
        </h1>
        <p class="cs-subtitle">
          <template v-if="state === 'guide'">
            Posicione seu rosto dentro do oval e clique em Capturar.
          </template>
          <template v-else-if="state === 'detecting'">
            Aguarde, estamos verificando sua identidade...
          </template>
          <template v-else>
            Identidade verificada com sucesso. Confirme para continuar.
          </template>
        </p>

        <!-- Viewfinder -->
        <div class="proposal-form cs-form">
        <div
          class="cs-viewer"
          :class="`cs-viewer--${state}`"
          role="region"
          :aria-label="state === 'captured' ? 'Selfie capturada' : 'Câmera de verificação'"
        >
          <!-- Camera background -->
          <div class="cs-viewer__cam">

            <!-- Overlay escuro nas laterais (destaca o oval) -->
            <div class="cs-viewer__overlay" aria-hidden="true"></div>

            <!-- Oval guia -->
            <div class="cs-viewer__oval" :class="`cs-viewer__oval--${state}`" aria-hidden="true">

              <!-- Guide: silhueta de rosto -->
              <div v-if="state === 'guide'" class="cs-viewer__face-guide">
                <svg viewBox="0 0 120 150" fill="none" aria-hidden="true">
                  <!-- Silhueta ombros -->
                  <ellipse cx="60" cy="175" rx="72" ry="45" fill="rgba(255,255,255,0.08)"/>
                  <!-- Pescoço -->
                  <rect x="47" y="118" width="26" height="30" rx="7" fill="rgba(255,255,255,0.1)"/>
                  <!-- Cabeça -->
                  <ellipse cx="60" cy="80" rx="42" ry="48" fill="rgba(255,255,255,0.1)"/>
                  <!-- Cabelo -->
                  <ellipse cx="60" cy="40" rx="44" ry="28" fill="rgba(255,255,255,0.12)"/>
                  <!-- Olhos -->
                  <ellipse cx="44" cy="76" rx="9" ry="6" fill="rgba(255,255,255,0.15)"/>
                  <ellipse cx="76" cy="76" rx="9" ry="6" fill="rgba(255,255,255,0.15)"/>
                  <!-- Nariz -->
                  <ellipse cx="60" cy="97" rx="5" ry="4" fill="rgba(255,255,255,0.1)"/>
                  <!-- Boca -->
                  <path d="M48 110 Q60 118 72 110" stroke="rgba(255,255,255,0.15)" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </div>

              <!-- Detecting: silhueta + scan line -->
              <div v-else-if="state === 'detecting'" class="cs-viewer__detecting" aria-live="polite">
                <div class="cs-viewer__scan-line"></div>
                <svg viewBox="0 0 120 150" fill="none" aria-hidden="true">
                  <ellipse cx="60" cy="175" rx="72" ry="45" fill="rgba(0,216,216,0.1)"/>
                  <rect x="47" y="118" width="26" height="30" rx="7" fill="rgba(0,216,216,0.12)"/>
                  <ellipse cx="60" cy="80" rx="42" ry="48" fill="rgba(0,216,216,0.12)"/>
                  <ellipse cx="60" cy="40" rx="44" ry="28" fill="rgba(0,216,216,0.14)"/>
                  <ellipse cx="44" cy="76" rx="9" ry="6" fill="rgba(0,216,216,0.2)"/>
                  <ellipse cx="76" cy="76" rx="9" ry="6" fill="rgba(0,216,216,0.2)"/>
                  <ellipse cx="60" cy="97" rx="5" ry="4" fill="rgba(0,216,216,0.15)"/>
                  <path d="M48 110 Q60 118 72 110" stroke="rgba(0,216,216,0.25)" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </div>

              <!-- Captured: ilustração do rosto fotografado -->
              <div v-else class="cs-viewer__photo" aria-label="Selfie capturada">
                <svg viewBox="0 0 240 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <defs>
                    <radialGradient id="bg-g" cx="50%" cy="38%" r="65%">
                      <stop offset="0%" stop-color="#c0d8d5"/>
                      <stop offset="100%" stop-color="#7aa6a4"/>
                    </radialGradient>
                    <radialGradient id="skin-g" cx="50%" cy="30%" r="65%">
                      <stop offset="0%" stop-color="#d8a87a"/>
                      <stop offset="100%" stop-color="#b8784c"/>
                    </radialGradient>
                  </defs>
                  <!-- Fundo foto -->
                  <rect width="240" height="300" fill="url(#bg-g)"/>
                  <!-- Ombros/corpo -->
                  <ellipse cx="120" cy="328" rx="135" ry="78" fill="#0e3035"/>
                  <!-- Pescoço -->
                  <rect x="96" y="238" width="48" height="55" rx="10" fill="#c48a62"/>
                  <!-- Cabeça -->
                  <ellipse cx="120" cy="148" rx="72" ry="80" fill="url(#skin-g)"/>
                  <!-- Cabelo - topo -->
                  <ellipse cx="120" cy="82" rx="74" ry="52" fill="#1c0e07"/>
                  <!-- Cabelo - laterais -->
                  <ellipse cx="50" cy="140" rx="20" ry="56" fill="#1c0e07"/>
                  <ellipse cx="190" cy="140" rx="20" ry="56" fill="#1c0e07"/>
                  <!-- Orelhas -->
                  <ellipse cx="49" cy="152" rx="11" ry="19" fill="#c07850"/>
                  <ellipse cx="191" cy="152" rx="11" ry="19" fill="#c07850"/>
                  <!-- Olho esquerdo (da perspectiva do espectador) -->
                  <ellipse cx="88" cy="142" rx="16" ry="11" fill="white"/>
                  <circle cx="88" cy="142" r="8" fill="#2e1a0c"/>
                  <circle cx="88" cy="142" r="4.5" fill="#0a0604"/>
                  <circle cx="92" cy="138" r="2.5" fill="white" opacity="0.9"/>
                  <path d="M72 139 Q88 131 104 139" stroke="#1c0e07" stroke-width="1.5" fill="none"/>
                  <path d="M72 145 Q88 151 104 145" stroke="#b07050" stroke-width="1" fill="none" opacity="0.5"/>
                  <!-- Olho direito -->
                  <ellipse cx="152" cy="142" rx="16" ry="11" fill="white"/>
                  <circle cx="152" cy="142" r="8" fill="#2e1a0c"/>
                  <circle cx="152" cy="142" r="4.5" fill="#0a0604"/>
                  <circle cx="156" cy="138" r="2.5" fill="white" opacity="0.9"/>
                  <path d="M136 139 Q152 131 168 139" stroke="#1c0e07" stroke-width="1.5" fill="none"/>
                  <path d="M136 145 Q152 151 168 145" stroke="#b07050" stroke-width="1" fill="none" opacity="0.5"/>
                  <!-- Sobrancelhas -->
                  <path d="M70 126 Q88 118 106 123" stroke="#1c0e07" stroke-width="4" fill="none" stroke-linecap="round"/>
                  <path d="M134 123 Q152 118 170 126" stroke="#1c0e07" stroke-width="4" fill="none" stroke-linecap="round"/>
                  <!-- Nariz -->
                  <path d="M120 155 Q112 175 108 184 Q120 188 132 184 Q128 175 120 155" fill="#a8683a" opacity="0.65"/>
                  <ellipse cx="111" cy="185" rx="8" ry="5.5" fill="#9a5e30" opacity="0.7"/>
                  <ellipse cx="129" cy="185" rx="8" ry="5.5" fill="#9a5e30" opacity="0.7"/>
                  <!-- Boca -->
                  <path d="M97 207 Q108 200 120 202 Q132 200 143 207" fill="#b06040"/>
                  <path d="M97 207 Q120 220 143 207" fill="#c07858"/>
                  <path d="M97 207 Q120 213 143 207" stroke="#8c3e1c" stroke-width="1.5" fill="none"/>
                  <!-- Bochecha highlight sutil -->
                  <ellipse cx="78" cy="168" rx="20" ry="14" fill="#e09070" opacity="0.18"/>
                  <ellipse cx="162" cy="168" rx="20" ry="14" fill="#e09070" opacity="0.18"/>
                </svg>
              </div>

            </div>

            <!-- Cantos estilo câmera (guide + detecting) -->
            <div v-if="state !== 'captured'" class="cs-viewer__corners" aria-hidden="true">
              <span class="cs-viewer__corner cs-viewer__corner--tl"></span>
              <span class="cs-viewer__corner cs-viewer__corner--tr"></span>
              <span class="cs-viewer__corner cs-viewer__corner--bl"></span>
              <span class="cs-viewer__corner cs-viewer__corner--br"></span>
            </div>

          </div>

          <!-- Status label abaixo do viewfinder -->
          <div class="cs-viewer__status" :class="`cs-viewer__status--${state}`" aria-live="polite">
            <template v-if="state === 'guide'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Encaixe seu rosto no oval e pressione Capturar
            </template>
            <template v-else-if="state === 'detecting'">
              <span class="cs-viewer__dot" aria-hidden="true"></span>
              Analisando imagem...
            </template>
            <template v-else>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="#00d8d8" opacity="0.15"/>
                <path d="M7 13l3 3 7-7" stroke="#063b3e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Identidade verificada
            </template>
          </div>
        </div>

        <!-- Checklist pós-captura -->
        <ul v-if="state === 'captured'" class="cs-checks" aria-label="Verificações de qualidade">
          <li class="cs-checks__item">
            <span class="cs-checks__icon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 13l3 3 7-7" stroke="#063b3e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            Iluminação adequada
          </li>
          <li class="cs-checks__item">
            <span class="cs-checks__icon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 13l3 3 7-7" stroke="#063b3e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            Rosto centralizado
          </li>
          <li class="cs-checks__item">
            <span class="cs-checks__icon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 13l3 3 7-7" stroke="#063b3e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            Imagem nítida e sem obstruções
          </li>
        </ul>

        <!-- Dicas (guide) -->
        <ul v-else-if="state === 'guide'" class="cs-tips" aria-label="Dicas para uma boa selfie">
          <li class="cs-tips__item">
            <span class="cs-tips__icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M17.66 6.34l-1.41 1.41M4.93 19.07l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </span>
            Ambiente bem iluminado — evite contraluz
          </li>
          <li class="cs-tips__item">
            <span class="cs-tips__icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
            </span>
            Olhe diretamente para a câmera
          </li>
          <li class="cs-tips__item">
            <span class="cs-tips__icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M22 11l-4 4-2-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            Retire óculos, bonés e acessórios
          </li>
        </ul>

        <!-- Ações -->
        <div class="cs-actions">
          <template v-if="state === 'guide'">
            <button type="button" class="proposal-submit cs-btn-capture" @click="startCapture">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="4" fill="currentColor"/>
              </svg>
              Capturar selfie
            </button>
          </template>

          <template v-else-if="state === 'detecting'">
            <button type="button" class="proposal-submit" disabled aria-busy="true">
              <span class="cs-spinner" aria-hidden="true"></span>
              Verificando...
            </button>
          </template>

          <template v-else>
            <div class="cs-captured-actions">
              <button type="button" class="cs-btn-retake" @click="retake">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 3v5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Refazer
              </button>
              <button type="button" class="proposal-submit cs-btn-confirm" @click="confirm">
                Confirmar identidade
              </button>
            </div>
          </template>
        </div>

        <p class="proposal-safe">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Seus dados são protegidos com criptografia de ponta a ponta
        </p>

        </div><!-- /proposal-form -->

      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Layout base ─────────────────────────────────────────────────── */
.cs-screen {
  min-height: 100vh;
  background: #fafcfc;
  display: flex;
  flex-direction: column;
}

/* ── Form card (padrão das demais telas) ─────────────────────────── */
.proposal-form {
  background: #ffffff;
  border: 1px solid #e3edec;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(6,59,62,0.06);
  padding: 28px 24px;
}

.cs-form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
}

/* ── Header ──────────────────────────────────────────────────────── */
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
  font-family: 'Instrument Sans', sans-serif; font-size: 16px; font-weight: 500;
  cursor: pointer; transition: background 0.15s;
}
.proposal-header__back:hover { background: #f0f7f7; }

/* ── Main ─────────────────────────────────────────────────────────── */
.proposal-main { flex: 1; padding: 32px 20px 64px; }
.proposal-main__inner { max-width: 640px; margin: 0 auto; }

/* ── Stepper ──────────────────────────────────────────────────────── */
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
.proposal-steps__item.is-done::after { background: #063b3e; }
.proposal-steps__mark {
  width: 28px; height: 28px; border-radius: 999px;
  border: 1.5px solid #d5e4e2; background: #ffffff; color: #607374;
  display: inline-flex; align-items: center; justify-content: center;
  font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 700;
  position: relative; z-index: 1;
}
.proposal-steps__item.is-done  .proposal-steps__mark { background: #063b3e; border-color: #063b3e; color: #ffffff; }
.proposal-steps__item.is-active .proposal-steps__mark { border-color: #063b3e; color: #063b3e; background: #ffffff; box-shadow: 0 0 0 3px #dff3f1; }
.proposal-steps__label {
  font-family: 'Bricolage Grotesque', sans-serif; font-size: 11px; font-weight: 600;
  color: #607374; text-align: center; line-height: 1.2; letter-spacing: 0.03em;
}
.proposal-steps__item.is-active .proposal-steps__label { color: #0b2528; }
.proposal-steps__item.is-done  .proposal-steps__label { color: #5b6b6c; }

/* ── Submit button ───────────────────────────────────────────────── */
.proposal-submit {
  width: 100%; height: 52px; border: none; border-radius: 999px;
  background: #00d8d8; color: #042a2c;
  font-family: 'Bricolage Grotesque', sans-serif; font-size: 16px; font-weight: 700;
  cursor: pointer; transition: background 0.15s;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
}
.proposal-submit:hover:not(:disabled) { background: #0fc5c5; }
.proposal-submit:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Safe note ───────────────────────────────────────────────────── */
.proposal-safe {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  font-family: 'Instrument Sans', sans-serif; font-size: 16px; color: #607374;
  margin: 16px 0 0;
}

/* ── Títulos ─────────────────────────────────────────────────────── */
.cs-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #0b2528;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
}

.cs-subtitle {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: #607374;
  margin: 0 0 28px;
  line-height: 1.5;
}

/* ── Viewfinder ──────────────────────────────────────────────────── */
.cs-viewer {
  margin: 0 auto 20px;
  width: 100%;
  max-width: 280px;
}

.cs-viewer__cam {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  background: linear-gradient(160deg, #0e2f32 0%, #0b2528 100%);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cs-viewer__cam::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 20%, rgba(0, 216, 216, 0.07) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
}

.cs-viewer__overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0, 0, 0, 0.45) 100%);
  pointer-events: none;
  z-index: 2;
}

/* ── Oval ────────────────────────────────────────────────────────── */
.cs-viewer__oval {
  position: relative;
  width: 62%;
  aspect-ratio: 3 / 4;
  border-radius: 50%;
  border: 2px dashed rgba(255, 255, 255, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 3;
  transition: border-color 0.35s, box-shadow 0.35s;
}

.cs-viewer__oval--detecting {
  border: 2.5px solid #00d8d8;
  box-shadow: 0 0 0 5px rgba(0, 216, 216, 0.14), 0 0 28px rgba(0, 216, 216, 0.22);
  animation: oval-glow 1.1s ease-in-out infinite;
}

.cs-viewer__oval--captured {
  border: 3px solid #00d8d8;
  box-shadow: 0 0 0 5px rgba(0, 216, 216, 0.18), 0 0 36px rgba(0, 216, 216, 0.28);
}

@keyframes oval-glow {
  0%, 100% { box-shadow: 0 0 0 4px rgba(0, 216, 216, 0.1), 0 0 18px rgba(0, 216, 216, 0.18); }
  50% { box-shadow: 0 0 0 8px rgba(0, 216, 216, 0.18), 0 0 38px rgba(0, 216, 216, 0.32); }
}

.cs-viewer__face-guide,
.cs-viewer__detecting {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cs-viewer__face-guide svg,
.cs-viewer__detecting svg {
  width: 80%;
  height: 80%;
}

.cs-viewer__scan-line {
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #00d8d8 30%, rgba(0, 216, 216, 0.8) 50%, #00d8d8 70%, transparent 100%);
  z-index: 4;
  animation: scan-sweep 1.6s ease-in-out infinite;
}

@keyframes scan-sweep {
  0% { top: 0; opacity: 0; }
  8% { opacity: 1; }
  92% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.cs-viewer__photo {
  width: 100%;
  height: 100%;
}

.cs-viewer__photo svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* ── Cantos câmera ───────────────────────────────────────────────── */
.cs-viewer__corners {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
}

.cs-viewer__corner {
  position: absolute;
  width: 22px;
  height: 22px;
}

.cs-viewer__corner--tl { top: 18px; left: 18px; border-top: 2.5px solid rgba(0, 216, 216, 0.75); border-left: 2.5px solid rgba(0, 216, 216, 0.75); border-radius: 3px 0 0 0; }
.cs-viewer__corner--tr { top: 18px; right: 18px; border-top: 2.5px solid rgba(0, 216, 216, 0.75); border-right: 2.5px solid rgba(0, 216, 216, 0.75); border-radius: 0 3px 0 0; }
.cs-viewer__corner--bl { bottom: 18px; left: 18px; border-bottom: 2.5px solid rgba(0, 216, 216, 0.75); border-left: 2.5px solid rgba(0, 216, 216, 0.75); border-radius: 0 0 0 3px; }
.cs-viewer__corner--br { bottom: 18px; right: 18px; border-bottom: 2.5px solid rgba(0, 216, 216, 0.75); border-right: 2.5px solid rgba(0, 216, 216, 0.75); border-radius: 0 0 3px 0; }

/* ── Status label ────────────────────────────────────────────────── */
.cs-viewer__status {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #607374;
}

.cs-viewer__status--detecting { color: #063b3e; }
.cs-viewer__status--captured { color: #063b3e; font-weight: 600; }

.cs-viewer__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00d8d8;
  animation: dot-pulse 0.9s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.75); }
}

/* ── Checklist ───────────────────────────────────────────────────── */
.cs-checks {
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cs-checks__item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: #0b2528;
}

.cs-checks__icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #dff3f1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── Dicas ───────────────────────────────────────────────────────── */
.cs-tips {
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cs-tips__item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  color: #607374;
  line-height: 1.4;
}

.cs-tips__icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #e3edec;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #063b3e;
}

/* ── Ações ───────────────────────────────────────────────────────── */
.cs-actions {
  margin-bottom: 16px;
}

.cs-btn-capture {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.cs-captured-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.cs-btn-retake {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  height: 52px;
  border: 1.5px solid #e3edec;
  border-radius: 14px;
  background: #fff;
  color: #607374;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  flex-shrink: 0;
  white-space: nowrap;
}

.cs-btn-retake:hover { background: #f0f5f5; border-color: #d5e4e2; }

.cs-btn-confirm { flex: 1; }

.cs-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Responsivo ──────────────────────────────────────────────────── */
@media (min-width: 480px) {
  .cs-viewer { max-width: 300px; }
  .cs-title { font-size: 30px; }
}

@media (min-width: 640px) {
  .proposal-header__inner { height: 72px; }
  .proposal-header__logo { height: 26px; }
  .proposal-main { padding: 40px 32px 80px; }
  .proposal-steps { margin-bottom: 48px; }
  .proposal-form { padding: 36px 40px; border-radius: 24px; }
  .proposal-steps__label { font-size: 13px; }
  .cs-viewer { max-width: 340px; }
  .cs-title { font-size: 32px; }
}
</style>
