<script setup lang="ts">
interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'inverted' | 'current'
  label?: string
}

withDefaults(defineProps<Props>(), { size: 'md', variant: 'primary', label: 'Carregando' })
</script>

<template>
  <span
    :class="['ds-spinner', `ds-spinner--${size}`, `ds-spinner--${variant}`]"
    role="status"
    :aria-label="label"
  >
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-dasharray="40 60"
      />
    </svg>
    <span class="ds-spinner__sr">{{ label }}</span>
  </span>
</template>

<style scoped>
.ds-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}
.ds-spinner svg {
  animation: ds-spin 0.8s linear infinite;
  width: 100%;
  height: 100%;
}
.ds-spinner--xs {
  width: 12px;
  height: 12px;
}
.ds-spinner--sm {
  width: 16px;
  height: 16px;
}
.ds-spinner--md {
  width: 20px;
  height: 20px;
}
.ds-spinner--lg {
  width: 28px;
  height: 28px;
}
.ds-spinner--primary {
  color: var(--color-primary-500);
}
.ds-spinner--inverted {
  color: var(--color-white);
}
.ds-spinner--current {
  color: currentColor;
}
.ds-spinner__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
@keyframes ds-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .ds-spinner svg {
    animation-duration: 2.5s;
  }
}
</style>
