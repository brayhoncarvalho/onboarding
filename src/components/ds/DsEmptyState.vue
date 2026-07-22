<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  icon?: Component | string
  title: string
  description?: string
  ctaLabel?: string
  secondaryLabel?: string
  animated?: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  cta: []
  secondary: []
}>()
</script>

<template>
  <div class="ds-empty-state" role="status">
    <div v-if="icon" class="ds-empty-state__icon" aria-hidden="true">
      <component
        :is="typeof icon === 'string' ? 'span' : icon"
        :size="36"
        :stroke-width="1.5"
        :class="{ 'ds-empty-state__icon--animated': animated }"
      />
    </div>

    <h3 class="ds-empty-state__title">{{ title }}</h3>

    <p v-if="description" class="ds-empty-state__description">
      {{ description }}
    </p>

    <div v-if="ctaLabel || secondaryLabel" class="ds-empty-state__actions">
      <button v-if="ctaLabel" type="button" class="ds-empty-state__cta" @click="emit('cta')">
        {{ ctaLabel }}
      </button>
      <button
        v-if="secondaryLabel"
        type="button"
        class="ds-empty-state__secondary"
        @click="emit('secondary')"
      >
        {{ secondaryLabel }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.ds-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-12) var(--spacing-6);
  gap: var(--spacing-3);
}

.ds-empty-state__icon {
  color: var(--color-text-disabled);
  margin-bottom: var(--spacing-1);
}
@keyframes ds-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
.ds-empty-state__icon--animated {
  animation: ds-pulse 2s ease-in-out infinite;
}

.ds-empty-state__title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.ds-empty-state__description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  max-width: 360px;
  line-height: var(--line-height-normal);
}

.ds-empty-state__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-2);
}

.ds-empty-state__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  min-height: var(--size-touch-min);
  padding: 0 var(--spacing-5);
  background: var(--btn-primary-bg);
  color: var(--btn-primary-color);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background var(--duration-fast);
}
.ds-empty-state__cta:hover {
  background: var(--btn-primary-bg-hover);
  color: #ffffff;
}
.ds-empty-state__cta:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}

.ds-empty-state__secondary {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.ds-empty-state__secondary:hover {
  color: var(--color-text-primary);
}
</style>
