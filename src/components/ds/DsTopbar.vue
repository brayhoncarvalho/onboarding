<script setup lang="ts">
import { Menu as IconMenu2 } from '@lucide/vue'

interface Props {
  /** Mostra botão de hamburger (mobile/sidebar toggle) */
  showMenuButton?: boolean
  title?: string
  /** Sticky no topo */
  sticky?: boolean
  /** Bordered (linha inferior) */
  bordered?: boolean
  /** Compacto (height menor) */
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  showMenuButton: false,
  sticky: true,
  bordered: true,
  compact: false,
})

const emit = defineEmits<{ 'menu-click': [] }>()
</script>

<template>
  <header
    :class="[
      'ds-topbar',
      {
        'ds-topbar--sticky': sticky,
        'ds-topbar--bordered': bordered,
        'ds-topbar--compact': compact,
      },
    ]"
  >
    <!-- Menu/hamburger button -->
    <button
      v-if="showMenuButton"
      type="button"
      class="ds-topbar__menu-btn"
      aria-label="Abrir menu"
      @click="emit('menu-click')"
    >
      <IconMenu2 :size="20" :stroke-width="1.5" aria-hidden="true" />
    </button>

    <!-- Left section (logo/title) -->
    <div class="ds-topbar__left">
      <slot name="logo"></slot>
      <h1 v-if="title && !$slots.logo" class="ds-topbar__title">{{ title }}</h1>
    </div>

    <!-- Center (busca, nav links) -->
    <div v-if="$slots.center" class="ds-topbar__center">
      <slot name="center"></slot>
    </div>

    <!-- Right (ações, user menu) -->
    <div class="ds-topbar__right">
      <slot name="right"></slot>
      <slot></slot>
    </div>
  </header>
</template>

<style scoped>
.ds-topbar {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: 0 var(--spacing-4);
  background: var(--color-bg-surface);
  min-height: 56px;
  width: 100%;
}
.ds-topbar--compact {
  min-height: 48px;
}
.ds-topbar--bordered {
  border-bottom: 0.5px solid var(--color-border-subtle);
}
.ds-topbar--sticky {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky, 100);
}

.ds-topbar__menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}
.ds-topbar__menu-btn:hover {
  background: var(--color-bg-page);
  color: var(--color-text-primary);
}
.ds-topbar__menu-btn:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.ds-topbar__left {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex-shrink: 0;
}
.ds-topbar__title {
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.ds-topbar__center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.ds-topbar__right {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-left: auto;
  flex-shrink: 0;
}
</style>
