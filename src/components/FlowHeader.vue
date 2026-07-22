<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'

withDefaults(defineProps<{
  /** Exibe o botão Voltar. Padrão: true. */
  showBack?: boolean
}>(), { showBack: true })

const emit = defineEmits<{
  (e: 'voltar'): void
}>()
</script>

<template>
  <header class="flow-header">
    <div class="flow-header__inner">
      <img src="/assets/dock-logo-color.png" alt="Dock" class="flow-header__logo" />
      <button
        v-if="showBack"
        type="button"
        class="flow-header__back-btn"
        aria-label="Voltar"
        @click="emit('voltar')"
      >
        <IconChevronLeft :size="20" :stroke-width="1.5" aria-hidden="true" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.flow-header {
  background: #ffffff;
  border-bottom: 1px solid #e6e6e6;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.flow-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 63px;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 20px;
}

.flow-header__logo {
  height: 32px;
  width: auto;
}

.flow-header__back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 8px;
  background: #f0f0f0;
  color: var(--color-gray-600);
  cursor: pointer;
  transition: background 0.1s ease;
}

.flow-header__back-btn:hover {
  background: #e0e0e0;
  color: #242424;
}

.flow-header__back-btn:focus-visible {
  outline: 2px solid #00d8d8;
  outline-offset: 2px;
}
</style>
