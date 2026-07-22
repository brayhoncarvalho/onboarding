<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import {
  Calendar as IconCalendar,
  ChevronLeft as IconChevronLeft,
  ChevronRight as IconChevronRight,
} from '@lucide/vue'
import { useI18n } from '../composables/useI18n'
import { useFocusTrap } from '../composables/useFocusTrap'

interface Props {
  modelValue: Date | string | null
  label?: string
  hint?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  min?: Date | string
  max?: Date | string
  /** Dias da semana desabilitados — 0=domingo */
  disabledWeekdays?: number[]
  /** Função custom para desabilitar datas específicas */
  disabledDate?: (date: Date) => boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), { size: 'md' })
const emit = defineEmits<{ 'update:modelValue': [value: Date | null] }>()

const { config, t } = useI18n()
const id = `ds-datepicker-${Math.random().toString(36).slice(2, 7)}`

// ── Helpers ──────────────────────────────────────────────
const toDate = (v: Date | string | null | undefined): Date | null => {
  if (!v) return null
  return v instanceof Date ? v : new Date(v)
}

const isSameDay = (a: Date | null, b: Date | null) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)

const today = computed(() => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
})
const selectedDate = computed(() => toDate(props.modelValue))

// ── Display formatting ───────────────────────────────────
const displayValue = computed(() => {
  if (!selectedDate.value) return ''
  return config.value.formatDate(selectedDate.value, 'short')
})

// ── State do popover ─────────────────────────────────────
const open = ref(false)
const view = ref(startOfMonth(selectedDate.value ?? today.value))
const focusedDate = ref<Date | null>(null)
const popoverRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)

const { activate, deactivate } = useFocusTrap(popoverRef, { autofocus: false })

watch(open, async (v) => {
  if (v) {
    view.value = startOfMonth(selectedDate.value ?? today.value)
    focusedDate.value = selectedDate.value ?? today.value
    await nextTick()
    activate()
    // foco no dia ativo (sobrescreve o autofocus do useFocusTrap)
    const el = popoverRef.value?.querySelector<HTMLElement>('[data-focused="true"]')
    el?.focus()
  } else {
    deactivate()
  }
})

// ── Geração da grade do mês ──────────────────────────────
interface DayCell {
  date: Date
  inMonth: boolean
  isToday: boolean
  isSelected: boolean
  disabled: boolean
}

const minDate = computed(() => toDate(props.min))
const maxDate = computed(() => toDate(props.max))

const isDisabled = (date: Date): boolean => {
  if (minDate.value && date < minDate.value) return true
  if (maxDate.value && date > maxDate.value) return true
  if (props.disabledWeekdays?.includes(date.getDay())) return true
  if (props.disabledDate?.(date)) return true
  return false
}

const grid = computed<DayCell[]>(() => {
  const first = startOfMonth(view.value)
  // começa no domingo da semana do primeiro dia
  const startGrid = new Date(first)
  startGrid.setDate(startGrid.getDate() - startGrid.getDay())

  const cells: DayCell[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(startGrid)
    d.setDate(d.getDate() + i)
    cells.push({
      date: d,
      inMonth: d.getMonth() === view.value.getMonth(),
      isToday: isSameDay(d, today.value),
      isSelected: isSameDay(d, selectedDate.value),
      disabled: isDisabled(d),
    })
  }
  return cells
})

// ── Labels localizados ───────────────────────────────────
const monthLabel = computed(() =>
  new Intl.DateTimeFormat(config.value.code, { month: 'long', year: 'numeric' }).format(view.value)
)

const weekdays = computed(() => {
  // domingo=0; abreviado 2 letras
  const fmt = new Intl.DateTimeFormat(config.value.code, { weekday: 'short' })
  return [0, 1, 2, 3, 4, 5, 6].map((d) => {
    const date = new Date(2024, 0, 7 + d) // domingo conhecido
    return fmt.format(date).slice(0, 2).toUpperCase()
  })
})

// ── Interação ────────────────────────────────────────────
const select = (date: Date) => {
  if (isDisabled(date)) return
  emit('update:modelValue', date)
  open.value = false
  triggerRef.value?.focus()
}

const onKey = (event: KeyboardEvent) => {
  if (!open.value) return
  const current = focusedDate.value ?? today.value
  const next = new Date(current)
  let handled = true
  switch (event.key) {
    case 'ArrowLeft':
      next.setDate(current.getDate() - 1)
      break
    case 'ArrowRight':
      next.setDate(current.getDate() + 1)
      break
    case 'ArrowUp':
      next.setDate(current.getDate() - 7)
      break
    case 'ArrowDown':
      next.setDate(current.getDate() + 7)
      break
    case 'PageUp':
      next.setMonth(current.getMonth() - 1)
      break
    case 'PageDown':
      next.setMonth(current.getMonth() + 1)
      break
    case 'Home':
      next.setDate(current.getDate() - current.getDay())
      break
    case 'End':
      next.setDate(current.getDate() + (6 - current.getDay()))
      break
    case 'Enter':
    case ' ':
      if (focusedDate.value) select(focusedDate.value)
      handled = true
      break
    case 'Escape':
      open.value = false
      triggerRef.value?.focus()
      break
    default:
      handled = false
  }
  if (handled) {
    event.preventDefault()
    if (
      [
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'PageUp',
        'PageDown',
        'Home',
        'End',
      ].includes(event.key)
    ) {
      focusedDate.value = next
      if (next.getMonth() !== view.value.getMonth()) view.value = startOfMonth(next)
      nextTick(() => {
        const el = popoverRef.value?.querySelector<HTMLElement>('[data-focused="true"]')
        el?.focus()
      })
    }
  }
}

const clear = () => emit('update:modelValue', null)
</script>

<template>
  <div
    :class="[
      'ds-datepicker',
      `ds-datepicker--${size}`,
      { 'ds-datepicker--error': error, 'ds-datepicker--disabled': disabled },
    ]"
  >
    <label v-if="label" :for="id" class="ds-datepicker__label">
      {{ label }}
      <span v-if="required" class="ds-datepicker__required" aria-hidden="true">*</span>
    </label>

    <div class="ds-datepicker__wrap">
      <button
        :id="id"
        ref="triggerRef"
        type="button"
        class="ds-datepicker__trigger"
        :disabled="disabled"
        :aria-haspopup="'dialog'"
        :aria-expanded="open"
        :aria-describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined"
        :aria-invalid="!!error"
        :aria-required="required"
        @click="open = !open"
      >
        <IconCalendar
          :size="16"
          :stroke-width="1.5"
          class="ds-datepicker__icon"
          aria-hidden="true"
        />
        <span v-if="displayValue" class="ds-datepicker__value">{{ displayValue }}</span>
        <span v-else class="ds-datepicker__placeholder">
          {{ placeholder ?? config.personalId.placeholder.replace(/\d/g, 'D').slice(0, 10) }}
        </span>
      </button>

      <Transition name="ds-datepicker">
        <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
        <div
          v-if="open"
          ref="popoverRef"
          role="dialog"
          aria-modal="true"
          :aria-label="label || t.search"
          class="ds-datepicker__popover"
          tabindex="-1"
          @keydown="onKey"
          @blur.capture="
            (e) => {
              const next = e.relatedTarget
              if (!next || !popoverRef?.contains(next as Node)) open = false
            }
          "
        >
          <header class="ds-datepicker__header">
            <button
              type="button"
              class="ds-datepicker__nav"
              :aria-label="t.pagination.previous"
              @click="view = addMonths(view, -1)"
            >
              <IconChevronLeft :size="16" :stroke-width="1.5" aria-hidden="true" />
            </button>
            <span class="ds-datepicker__title" aria-live="polite">{{ monthLabel }}</span>
            <button
              type="button"
              class="ds-datepicker__nav"
              :aria-label="t.pagination.next"
              @click="view = addMonths(view, 1)"
            >
              <IconChevronRight :size="16" :stroke-width="1.5" aria-hidden="true" />
            </button>
          </header>

          <div role="grid" class="ds-datepicker__grid" :aria-label="monthLabel">
            <div role="row" class="ds-datepicker__weekdays">
              <span
                v-for="wd in weekdays"
                :key="wd"
                role="columnheader"
                class="ds-datepicker__weekday"
              >
                {{ wd }}
              </span>
            </div>

            <div role="row" class="ds-datepicker__days">
              <button
                v-for="(cell, i) in grid"
                :key="i"
                type="button"
                role="gridcell"
                :aria-selected="cell.isSelected"
                :aria-disabled="cell.disabled"
                :tabindex="
                  cell.isSelected ||
                  (focusedDate && cell.date.toDateString() === focusedDate.toDateString())
                    ? 0
                    : -1
                "
                :data-focused="
                  focusedDate && cell.date.toDateString() === focusedDate.toDateString()
                "
                :class="[
                  'ds-datepicker__day',
                  {
                    'ds-datepicker__day--out': !cell.inMonth,
                    'ds-datepicker__day--today': cell.isToday,
                    'ds-datepicker__day--selected': cell.isSelected,
                    'ds-datepicker__day--disabled': cell.disabled,
                  },
                ]"
                @click="select(cell.date)"
                @focus="focusedDate = cell.date"
              >
                {{ cell.date.getDate() }}
              </button>
            </div>
          </div>

          <footer v-if="modelValue" class="ds-datepicker__footer">
            <button type="button" class="ds-datepicker__clear" @click="clear">
              {{ t.remove }}
            </button>
          </footer>
        </div>
      </Transition>
    </div>

    <p v-if="hint && !error" :id="`${id}-hint`" class="ds-datepicker__hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" class="ds-datepicker__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.ds-datepicker {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  position: relative;
}
.ds-datepicker__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}
.ds-datepicker__required {
  color: var(--color-danger-500);
  margin-left: 2px;
}
.ds-datepicker__wrap {
  position: relative;
}

.ds-datepicker__trigger {
  width: 100%;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  background: var(--color-bg-surface);
  border: 0.5px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: 0 var(--spacing-3);
  font-family: inherit;
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  text-align: left;
  cursor: pointer;
  transition:
    border-color var(--duration-fast),
    box-shadow var(--duration-fast);
}
.ds-datepicker--sm .ds-datepicker__trigger {
  height: 30px;
  font-size: var(--font-size-sm);
}
.ds-datepicker--md .ds-datepicker__trigger {
  height: 38px;
}
.ds-datepicker--lg .ds-datepicker__trigger {
  height: 46px;
}
.ds-datepicker--sm .ds-datepicker__trigger {
  min-height: var(--size-touch-min);
  font-size: var(--font-size-sm);
}
.ds-datepicker--md .ds-datepicker__trigger {
  min-height: var(--size-touch-min);
}
.ds-datepicker--lg .ds-datepicker__trigger {
  min-height: 46px;
}

.ds-datepicker__trigger:hover:not(:disabled) {
  border-color: var(--color-border-strong);
}
.ds-datepicker__trigger:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
  border-color: var(--color-primary-500);
}
.ds-datepicker__trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.ds-datepicker--error .ds-datepicker__trigger {
  border-color: var(--color-danger-500);
}

.ds-datepicker__icon {
  color: var(--color-text-disabled);
  flex-shrink: 0;
}
.ds-datepicker__placeholder {
  color: var(--color-text-disabled);
}

.ds-datepicker__popover {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: var(--z-dropdown);
  background: var(--color-bg-elevated);
  border: 0.5px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: var(--spacing-3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  min-width: 280px;
}

.ds-datepicker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-2);
}
.ds-datepicker__title {
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  text-transform: capitalize;
}
.ds-datepicker__nav {
  background: none;
  border: none;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
}
.ds-datepicker__nav:hover {
  background: var(--color-bg-page);
  color: var(--color-text-primary);
}
.ds-datepicker__nav:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.ds-datepicker__grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}
.ds-datepicker__weekdays,
.ds-datepicker__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.ds-datepicker__weekday {
  font-size: 0.6875rem;
  color: var(--color-text-disabled);
  text-align: center;
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-1) 0;
}
.ds-datepicker__day {
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}
.ds-datepicker__day:hover:not([aria-disabled='true']) {
  background: var(--color-primary-50);
}
.ds-datepicker__day:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}
.ds-datepicker__day--out {
  color: var(--color-text-disabled);
}
.ds-datepicker__day--today {
  box-shadow: inset 0 0 0 1px var(--color-primary-300);
}
.ds-datepicker__day--selected {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-color);
  font-weight: var(--font-weight-medium);
}
.ds-datepicker__day--selected:hover {
  background: var(--btn-primary-bg-hover);
}
.ds-datepicker__day--disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
  text-decoration: line-through;
}

.ds-datepicker__footer {
  margin-top: var(--spacing-2);
  padding-top: var(--spacing-2);
  border-top: 0.5px solid var(--color-border-subtle);
  display: flex;
  justify-content: flex-end;
}
.ds-datepicker__clear {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
}
.ds-datepicker__clear:hover {
  background: var(--color-bg-page);
  color: var(--color-text-primary);
}

.ds-datepicker__hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
.ds-datepicker__error {
  font-size: var(--font-size-sm);
  color: var(--color-danger-text);
}

.ds-datepicker-enter-active,
.ds-datepicker-leave-active {
  transition:
    opacity var(--duration-fast),
    transform var(--duration-fast);
}
.ds-datepicker-enter-from,
.ds-datepicker-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
