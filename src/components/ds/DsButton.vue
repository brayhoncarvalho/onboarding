<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
})

const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <button
    :type="type"
    :disabled="isDisabled"
    :aria-disabled="isDisabled"
    :aria-busy="loading"
    :class="[
      'ds-button',
      `ds-button--${variant}`,
      `ds-button--${size}`,
      {
        'ds-button--loading': loading,
        'ds-button--full': fullWidth,
      },
    ]"
  >
    <span v-if="loading" class="ds-button__spinner" aria-hidden="true"></span>
    <slot v-else></slot>
  </button>
</template>

<style scoped>
.ds-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  min-width: var(--size-touch-min);
  border: 0.5px solid transparent;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition:
    background var(--duration-fast),
    border-color var(--duration-fast),
    box-shadow var(--duration-fast);
  position: relative;
}
.ds-button--sm { min-height: var(--size-button-sm); padding: 0 var(--spacing-3); font-size: var(--font-size-sm); }
.ds-button--md { min-height: var(--size-button-md); padding: 0 var(--spacing-4); font-size: var(--font-size-base); }
.ds-button--lg { min-height: var(--size-button-lg); padding: 0 var(--spacing-5); font-size: var(--font-size-base); }
.ds-button--full { width: 100%; }

.ds-button--primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-color);
}
.ds-button--primary:hover:not(:disabled) {
  background: var(--btn-primary-bg-hover);
  color: #ffffff;
}

.ds-button--secondary {
  background: var(--color-bg-surface);
  border-color: var(--color-border-default);
  color: var(--color-text-primary);
}
.ds-button--secondary:hover:not(:disabled) {
  border-color: var(--color-border-strong);
}

.ds-button--ghost {
  background: transparent;
  color: var(--color-text-primary);
}
.ds-button--ghost:hover:not(:disabled) {
  background: var(--color-bg-page);
}

.ds-button--danger {
  background: var(--color-danger-500);
  color: var(--color-white);
}
.ds-button--danger:hover:not(:disabled) {
  background: var(--color-danger-600);
}

.ds-button:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}
.ds-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ds-button__spinner {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: var(--radius-full);
  animation: ds-button-spin 0.7s linear infinite;
}
.ds-button__content--hidden {
  visibility: hidden;
}

@keyframes ds-button-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .ds-button__spinner {
    animation-duration: 2.5s;
  }
}
</style>
