<script setup lang="ts">
import DsStepper from './ds/DsStepper.vue'
import type { Step } from './ds/DsStepper.vue'

defineProps<{
  steps: Step[]
  current: number
}>()
</script>

<template>
  <div class="flow-stepper-shell">
    <DsStepper
      :steps="steps"
      :current="current"
      orientation="horizontal"
      variant="numbered"
      label-position="below"
      show-label="active"
    />
  </div>
</template>

<style scoped>
.flow-stepper-shell {
  background: var(--color-gray-100);
  border-bottom: 0.5px solid var(--color-border-default);
  padding: var(--spacing-3) var(--spacing-4);
  width: 100%;
}
</style>
