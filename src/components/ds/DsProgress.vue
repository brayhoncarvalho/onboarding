<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  value: number
  total: number
  label?: string
  showAsStarted?: boolean  // goal gradient — inicia em ~12% se value=1
  showCount?: boolean
  size?: 'sm' | 'md'
  variant?: 'default' | 'success' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'default',
  showCount: true,
})

const percentage = computed(() => {
  const raw = (props.value / props.total) * 100
  // Goal gradient: se showAsStarted e estamos na etapa 1, mínimo 12%
  if (props.showAsStarted && props.value === 1 && raw < 12) return 12
  return Math.min(Math.round(raw), 100)
})

const ariaLabel = computed(() =>
  props.label
    ? `${props.label}: ${props.value} de ${props.total}`
    : `Progresso: ${props.value} de ${props.total}`
)
</script>

<template>
  <div class="ds-progress">
    <div v-if="label || showCount" class="ds-progress__header">
      <span v-if="label" class="ds-progress__label">{{ label }}</span>
      <span v-if="showCount" class="ds-progress__count">
        {{ value }} de {{ total }}
      </span>
    </div>

    <div
      class="ds-progress__track"
      :class="`ds-progress__track--${size}`"
      role="progressbar"
      :aria-valuenow="value"
      :aria-valuemin="0"
      :aria-valuemax="total"
      :aria-label="ariaLabel"
    >
      <div
        :class="['ds-progress__fill', `ds-progress__fill--${variant}`]"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.ds-progress { display: flex; flex-direction: column; gap: var(--spacing-2); }

.ds-progress__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ds-progress__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}
.ds-progress__count {
  font-size: var(--font-size-sm);
  color: var(--color-text-disabled);
}

.ds-progress__track {
  background: var(--color-bg-page);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.ds-progress__track--sm { height: 4px; }
.ds-progress__track--md { height: 6px; }

.ds-progress__fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--easing-default);
}
.ds-progress__fill--default { background: var(--btn-primary-bg); }
.ds-progress__fill--success { background: var(--color-success-500); }
.ds-progress__fill--danger  { background: var(--color-danger-500); }
</style>
