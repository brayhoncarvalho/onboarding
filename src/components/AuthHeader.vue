<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  showBack?: boolean
  backLabel?: string
}>(), {
  showBack: true,
  backLabel: 'Voltar',
})

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'navigate', action: 'sair' | 'emprestimos' | 'meus-dados'): void
}>()

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function handleGlobalClick(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleGlobalClick))
onUnmounted(() => document.removeEventListener('mousedown', handleGlobalClick))

function handleAction(action: 'sair' | 'emprestimos' | 'meus-dados') {
  dropdownOpen.value = false
  emit('navigate', action)
}
</script>

<template>
  <header class="auth-header">
    <div class="auth-header__inner">
      <img src="/assets/dock-logo-color.png" alt="Dock" class="auth-header__logo" />
      <div class="auth-header__right">
        <button
          v-if="props.showBack"
          type="button"
          class="auth-header__back"
          :aria-label="props.backLabel"
          @click="emit('voltar')"
        >
          <span aria-hidden="true">←</span> {{ props.backLabel }}
        </button>

        <div ref="dropdownRef" class="auth-dd">
          <button
            type="button"
            class="auth-dd__trigger"
            :aria-expanded="String(dropdownOpen)"
            aria-haspopup="menu"
            aria-controls="user-menu"
            aria-label="Menu do usuário"
            @click="dropdownOpen = !dropdownOpen"
          >
            <span class="auth-dd__avatar" aria-hidden="true">BC</span>
            <span class="auth-dd__name">Brayhon Carvalho</span>
            <svg
              class="auth-dd__chevron"
              :class="{ 'is-open': dropdownOpen }"
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2"
              aria-hidden="true"
            ><path d="M6 9l6 6 6-6"/></svg>
          </button>

          <div v-if="dropdownOpen" id="user-menu" class="auth-dd__menu" role="menu">
            <button type="button" class="auth-dd__item" role="menuitem" @click="handleAction('emprestimos')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Meus Empréstimos
            </button>

            <button type="button" class="auth-dd__item auth-dd__item--soon" role="menuitem" @click="handleAction('meus-dados')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Meus Dados
            </button>

            <hr class="auth-dd__divider" />

            <button type="button" class="auth-dd__item auth-dd__item--exit" role="menuitem" @click="handleAction('sair')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.auth-header { position: sticky; top: 0; z-index: 20; background: var(--color-gray-50); border-bottom: 1px solid var(--color-primary-100); }
.auth-header__inner { max-width: 1024px; margin: 0 auto; padding: 0 20px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
.auth-header__logo { height: 24px; width: auto; }
.auth-header__right { display: flex; align-items: center; gap: 12px; }
.auth-header__back { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border: 1.5px solid var(--color-primary-100); border-radius: 999px; background: transparent; color: var(--color-navy-800); font-family: "Instrument Sans", sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
.auth-header__back:hover { background: var(--color-primary-50); }
/* ── Dropdown ── */
.auth-dd { position: relative; }
.auth-dd__trigger { display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px 6px 6px; border: 1.5px solid var(--color-primary-100); border-radius: 999px; background: #ffffff; cursor: pointer; transition: background 0.15s; }
.auth-dd__trigger:hover { background: var(--color-primary-50); }
.auth-dd__avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--btn-primary-bg); color: var(--btn-primary-color); font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; letter-spacing: 0.02em; }
.auth-dd__name { font-family: "Instrument Sans", sans-serif; font-size: 16px; font-weight: 500; color: var(--color-navy-800); }
.auth-dd__chevron { color: var(--color-navy-500); transition: transform 0.2s; flex-shrink: 0; }
.auth-dd__chevron.is-open { transform: rotate(180deg); }
.auth-dd__menu { position: absolute; top: calc(100% + 8px); right: 0; min-width: 220px; background: #ffffff; border: 1px solid var(--color-primary-100); border-radius: 14px; box-shadow: 0 8px 32px rgba(10, 22, 40, 0.10); padding: 6px; z-index: 100; }
.auth-dd__item { width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: none; background: transparent; border-radius: 10px; font-family: "Instrument Sans", sans-serif; font-size: 16px; font-weight: 500; color: var(--color-navy-800); cursor: pointer; text-align: left; transition: background 0.12s; }
.auth-dd__item:hover:not([disabled]) { background: var(--color-primary-50); }
.auth-dd__item--soon { color: var(--color-navy-800); }
.auth-dd__item--exit { color: #c0392b; }
.auth-dd__item--exit:hover { background: #fff5f5; }
.auth-dd__badge { margin-left: auto; font-size: 15px; font-weight: 600; color: var(--color-navy-400); background: var(--color-primary-50); border-radius: 999px; padding: 2px 8px; }
.auth-dd__divider { border: none; border-top: 1px solid var(--color-primary-100); margin: 4px 0; }
@media (max-width: 480px) { .auth-dd__name { display: none; } }
@media (min-width: 640px) { .auth-header__inner { height: 72px; } .auth-header__logo { height: 26px; } }
</style>
