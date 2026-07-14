<script setup lang="ts">
interface Props {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'navy'
  size?: 'sm' | 'md'
}

withDefaults(defineProps<Props>(), { variant: 'default', size: 'md' })
</script>

<template>
  <span :class="['ds-badge', `ds-badge--${variant}`, `ds-badge--${size}`]">
    <slot ></slot>
  </span>
</template>

<style scoped>
.ds-badge {
  display: inline-flex;
  align-items: center;
  font-family: inherit;
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
  border: 0.5px solid;
}
.ds-badge--sm { height: 18px; padding: 0 var(--spacing-2); font-size: 0.6875rem; }
.ds-badge--md { height: 22px; padding: 0 var(--spacing-2); font-size: var(--font-size-xs); }

.ds-badge--default { background: var(--color-gray-50);    border-color: var(--color-gray-200);    color: var(--color-text-primary); }
.ds-badge--success { background: var(--color-success-50); border-color: var(--color-success-200); color: var(--color-success-text); }
.ds-badge--danger  { background: var(--color-danger-50);  border-color: var(--color-danger-200);  color: var(--color-danger-text); }
.ds-badge--warning { background: var(--color-warning-50); border-color: var(--color-warning-200); color: var(--color-warning-text); }
.ds-badge--info    { background: var(--color-info-50);    border-color: var(--color-info-200);    color: var(--color-info-text); }
.ds-badge--navy    { background: var(--color-navy-50);    border-color: var(--color-navy-200);    color: var(--color-navy-700); }
</style>
