<script setup lang="ts">
import { ref } from 'vue'
import {
  CircleCheck as IconCircleCheck,
  AlertCircle as IconAlertCircle,
  AlertTriangle as IconAlertTriangle,
  Info as IconInfoCircle,
  X as IconX,
} from '@lucide/vue'

interface Props {
  variant?: 'success' | 'danger' | 'warning' | 'info'
  title?: string
  dismissible?: boolean
}

withDefaults(defineProps<Props>(), { variant: 'info' })
const emit = defineEmits<{ dismiss: [] }>()

const visible = ref(true)
const dismiss = () => {
  visible.value = false
  emit('dismiss')
}

const icons = {
  success: IconCircleCheck,
  danger: IconAlertCircle,
  warning: IconAlertTriangle,
  info: IconInfoCircle,
}
</script>

<template>
  <div v-if="visible" :class="['ds-alert', `ds-alert--${variant}`]" role="alert">
    <component
      :is="icons[variant]"
      :size="20"
      :stroke-width="1.5"
      class="ds-alert__icon"
      aria-hidden="true"
    />
    <div class="ds-alert__body">
      <p v-if="title" class="ds-alert__title">{{ title }}</p>
      <div class="ds-alert__message"><slot></slot></div>
      <div v-if="$slots.actions" class="ds-alert__actions"><slot name="actions"></slot></div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="ds-alert__close"
      aria-label="Fechar alerta"
      @click="dismiss"
    >
      <IconX :size="16" :stroke-width="1.5" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.ds-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  border: 0.5px solid;
}
.ds-alert--success {
  background: var(--color-success-50);
  border-color: var(--color-success-200);
  color: var(--color-success-text);
}
.ds-alert--danger {
  background: var(--color-danger-50);
  border-color: var(--color-danger-200);
  color: var(--color-danger-text);
}
.ds-alert--warning {
  background: var(--color-warning-50);
  border-color: var(--color-warning-200);
  color: var(--color-warning-text);
}
.ds-alert--info {
  background: var(--color-info-50);
  border-color: var(--color-info-200);
  color: var(--color-info-text);
}

.ds-alert__icon {
  flex-shrink: 0;
  margin-top: 2px;
}
.ds-alert__body {
  flex: 1;
  min-width: 0;
}
.ds-alert__title {
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-1);
}
.ds-alert__message {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
}
.ds-alert__actions {
  display: flex;
  gap: var(--spacing-2);
  margin-top: var(--spacing-3);
}
.ds-alert__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-1);
  border-radius: var(--radius-sm);
  color: inherit;
  opacity: 0.7;
  flex-shrink: 0;
}
.ds-alert__close:hover {
  opacity: 1;
}
.ds-alert__close:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}
</style>
