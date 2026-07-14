<script setup lang="ts">
/**
 * DsCard — Card flexível com slots estruturados opcionais.
 *
 * Uso básico (compatível com versões anteriores):
 *   <DsCard>Conteúdo</DsCard>
 *
 * Uso avançado com slots nomeados (inspirado no PrimeVue Card):
 *   <DsCard>
 *     <template #header><img src="..." /></template>
 *     <template #title>Título do Card</template>
 *     <template #subtitle>Subtítulo</template>
 *     <template #content>Corpo do card...</template>
 *     <template #footer>
 *       <DsButton>Ação</DsButton>
 *     </template>
 *   </DsCard>
 */
interface Props {
  variant?: 'default' | 'surface' | 'highlight' | 'danger'
  tag?: string
  clickable?: boolean
  /** Adiciona padding interno na área de conteúdo quando se usa slots estruturados */
  padded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  tag: 'div',
  padded: true,
})

const onKeydown = (e: KeyboardEvent) => {
  if (!props.clickable) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).click()
  }
}
</script>

<template>
  <component
    :is="tag"
    :class="['ds-card', `ds-card--${variant}`, { 'ds-card--clickable': clickable }]"
    :role="clickable && tag !== 'button' && tag !== 'a' ? 'button' : undefined"
    :tabindex="clickable && tag !== 'button' && tag !== 'a' ? 0 : undefined"
    @keydown="onKeydown"
  >
    <!-- Slot de mídia/imagem (não tem padding) -->
    <div v-if="$slots.header" class="ds-card__header">
      <slot name="header"></slot>
    </div>

    <!-- Body: título, subtítulo e conteúdo -->
    <div
      v-if="$slots.title || $slots.subtitle || $slots.content || $slots.default"
      :class="['ds-card__body', { 'ds-card__body--padded': padded }]"
    >
      <div v-if="$slots.title" class="ds-card__title">
        <slot name="title"></slot>
      </div>
      <div v-if="$slots.subtitle" class="ds-card__subtitle">
        <slot name="subtitle"></slot>
      </div>
      <div v-if="$slots.content" class="ds-card__content">
        <slot name="content"></slot>
      </div>
      <!-- Slot default para compatibilidade reversa (sem slots nomeados) -->
      <slot v-if="!$slots.title && !$slots.subtitle && !$slots.content"></slot>
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="ds-card__footer">
      <slot name="footer"></slot>
    </div>
  </component>
</template>

<style scoped>
.ds-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition:
    border-color var(--duration-fast),
    background var(--duration-fast);
}

/* ── Variantes ───────────────────────────────────── */
.ds-card--surface {
  background: var(--color-bg-page);
}
.ds-card--highlight {
  background: var(--color-primary-50);
  border-color: var(--color-primary-200);
}
.ds-card--danger {
  background: var(--color-danger-50);
  border-color: var(--color-danger-200);
}

/* ── Clicável ────────────────────────────────────── */
.ds-card--clickable {
  cursor: pointer;
}
.ds-card--clickable:hover {
  border-color: var(--color-border-strong);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
.ds-card--clickable:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

/* ── Slots estruturados ──────────────────────────── */
.ds-card__header {
  /* Media/imagem ocupa a largura total sem padding */
  overflow: hidden;
}
.ds-card__header :deep(img) {
  display: block;
  width: 100%;
  object-fit: cover;
}

.ds-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}
.ds-card__body--padded {
  padding: var(--spacing-5) var(--spacing-5);
}

.ds-card__title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: var(--line-height-snug);
}

.ds-card__subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-1);
}

.ds-card__content {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin-top: var(--spacing-2);
}

.ds-card__footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4) var(--spacing-5);
  border-top: 1px solid var(--color-border-subtle);
}
</style>
