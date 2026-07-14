<script setup lang="ts">
interface Props {
  modelValue: boolean
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const switchId = props.id ?? `ds-switch-${Math.random().toString(36).slice(2, 7)}`

const toggle = () => {
  if (!props.disabled) emit('update:modelValue', !props.modelValue)
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    toggle()
  }
}
</script>

<template>
  <div :class="['ds-switch-wrapper', { 'ds-switch-wrapper--disabled': disabled }]">
    <div class="ds-switch-track-area">
      <button
        :id="switchId"
        type="button"
        role="switch"
        :aria-checked="modelValue"
        :aria-labelledby="label ? `${switchId}-label` : undefined"
        :aria-describedby="description ? `${switchId}-desc` : undefined"
        :disabled="disabled"
        :class="[
          'ds-switch-track',
          `ds-switch-track--${size}`,
          { 'ds-switch-track--on': modelValue },
        ]"
        @click="toggle"
        @keydown="onKeydown"
      >
        <span
          :class="[
            'ds-switch-thumb',
            `ds-switch-thumb--${size}`,
            { 'ds-switch-thumb--on': modelValue },
          ]"
        ></span>
        <span class="sr-only">{{ modelValue ? 'Ativado' : 'Desativado' }}</span>
      </button>
    </div>
    <div v-if="label || description" class="ds-switch-labels">
      <label v-if="label" :id="`${switchId}-label`" :for="switchId" class="ds-switch-label">
        {{ label }}
      </label>
      <p v-if="description" :id="`${switchId}-desc`" class="ds-switch-description">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.ds-switch-wrapper {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
}
.ds-switch-wrapper--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ds-switch-track {
  position: relative;
  border: none;
  border-radius: var(--radius-full);
  background: var(--color-border-default);
  cursor: pointer;
  transition: background var(--duration-base) var(--easing-default);
  flex-shrink: 0;
  padding: 0;
}
.ds-switch-track--sm {
  width: 32px;
  height: 18px;
}
.ds-switch-track--md {
  width: 40px;
  height: 22px;
}

.ds-switch-track--on {
  background: var(--color-primary-500);
}
.ds-switch-track:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}
.ds-switch-track:disabled {
  cursor: not-allowed;
}

.ds-switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  background: var(--color-white);
  border-radius: var(--radius-full);
  transition: transform var(--duration-base) var(--easing-default);
}
.ds-switch-thumb--sm {
  width: 14px;
  height: 14px;
}
.ds-switch-thumb--md {
  width: 18px;
  height: 18px;
}

.ds-switch-thumb--sm.ds-switch-thumb--on {
  transform: translateX(14px);
}
.ds-switch-thumb--md.ds-switch-thumb--on {
  transform: translateX(18px);
}

.ds-switch-labels {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ds-switch-label {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  cursor: pointer;
}
.ds-switch-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
</style>
