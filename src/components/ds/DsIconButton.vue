<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  icon: Component
  label: string                              // obrigatório para a11y
  variant?: 'default' | 'ghost' | 'danger' | 'primary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), { variant: 'ghost', size: 'md', type: 'button' })
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-label="label"
    :aria-busy="loading"
    :class="[
      'ds-icon-button',
      `ds-icon-button--${variant}`,
      `ds-icon-button--${size}`,
      { 'ds-icon-button--loading': loading }
    ]"
  >
    <component
      :is="icon"
      :size="size === 'sm' ? 14 : size === 'lg' ? 20 : 16"
      :stroke-width="1.5"
      aria-hidden="true"
    />
  </button>
</template>

<style scoped>
.ds-icon-button {
  display: inline-flex; align-items: center; justify-content: center;
  background: transparent; border: 0.5px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer; transition: background var(--duration-fast), border-color var(--duration-fast);
  color: var(--color-text-primary);
}
.ds-icon-button--sm { width: var(--size-touch-min); height: var(--size-touch-min); }
.ds-icon-button--md { width: var(--size-touch-min); height: var(--size-touch-min); }
.ds-icon-button--lg { width: 46px; height: 46px; }

.ds-icon-button--ghost:hover { background: var(--color-bg-page); }
.ds-icon-button--default { border-color: var(--color-border-default); background: var(--color-bg-surface); }
.ds-icon-button--default:hover { border-color: var(--color-border-strong); }
.ds-icon-button--primary { background: var(--btn-primary-bg); color: var(--btn-primary-color); }
.ds-icon-button--primary:hover { background: var(--btn-primary-bg-hover); color: #ffffff; }
.ds-icon-button--danger { color: var(--color-danger-500); }
.ds-icon-button--danger:hover { background: var(--color-danger-50); }

.ds-icon-button:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.ds-icon-button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
