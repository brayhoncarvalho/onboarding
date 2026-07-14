<script setup lang="ts">
interface Props {
  href?: string
  label?: string
}

withDefaults(defineProps<Props>(), {
  href: '#main-content',
  label: 'Pular para o conteúdo principal',
})
</script>

<template>
  <a :href="href" class="ds-skip-link">
    <slot>{{ label }}</slot>
  </a>
</template>

<style scoped>
.ds-skip-link {
  position: absolute;
  top: var(--spacing-3);
  left: var(--spacing-3);
  z-index: var(--z-tooltip);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--size-touch-min);
  padding: 0 var(--spacing-4);
  border-radius: var(--radius-md);
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  transform: translateY(calc(-100% - var(--spacing-3)));
  transition: transform var(--duration-fast), box-shadow var(--duration-fast);
}

.ds-skip-link:focus-visible {
  transform: translateY(0);
  box-shadow: var(--focus-ring);
  outline: none;
}
</style>