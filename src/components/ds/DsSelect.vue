<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ChevronDown as IconChevronDown, Check as IconCheck, X as IconX } from '@lucide/vue'

export interface SelectOption {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}

interface Props {
  modelValue: string | number | null
  options: SelectOption[]
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  searchable?: boolean
  clearable?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Selecione',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const id = `ds-select-${Math.random().toString(36).slice(2, 7)}`
const open = ref(false)
const search = ref('')
const activeIndex = ref(-1)
const listboxRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)

const selected = computed(() => props.options.find((o) => o.value === props.modelValue) ?? null)

const filtered = computed(() => {
  if (!props.searchable || !search.value) return props.options
  const q = search.value.toLowerCase()
  return props.options.filter((o) => o.label.toLowerCase().includes(q))
})

const openMenu = async () => {
  if (props.disabled) return
  open.value = true
  activeIndex.value = filtered.value.findIndex((o) => o.value === props.modelValue)
  await nextTick()
  if (props.searchable) searchRef.value?.focus()
}

const closeMenu = () => {
  open.value = false
  search.value = ''
  activeIndex.value = -1
  triggerRef.value?.focus()
}

const select = (option: SelectOption) => {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  closeMenu()
}

const clear = (event: MouseEvent) => {
  event.stopPropagation()
  emit('update:modelValue', null)
}

const onKey = (event: KeyboardEvent) => {
  if (!open.value && ['Enter', ' ', 'ArrowDown'].includes(event.key)) {
    event.preventDefault()
    openMenu()
    return
  }
  if (!open.value) return

  const max = filtered.value.length - 1
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = activeIndex.value >= max ? 0 : activeIndex.value + 1
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = activeIndex.value <= 0 ? max : activeIndex.value - 1
  } else if (event.key === 'Enter') {
    event.preventDefault()
    const opt = filtered.value[activeIndex.value]
    if (opt) select(opt)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu()
  } else if (event.key === 'Home') {
    event.preventDefault()
    activeIndex.value = 0
  } else if (event.key === 'End') {
    event.preventDefault()
    activeIndex.value = max
  }
}

watch(activeIndex, async (i) => {
  await nextTick()
  const el = listboxRef.value?.querySelectorAll('[role="option"]')[i] as HTMLElement
  el?.scrollIntoView({ block: 'nearest' })
})

const onBlur = (event: FocusEvent) => {
  const related = event.relatedTarget as HTMLElement | null
  if (!related || !menuRef.value?.contains(related)) closeMenu()
}
</script>

<template>
  <div
    class="ds-select"
    :class="[`ds-select--${size}`, { 'ds-select--error': error, 'ds-select--disabled': disabled }]"
  >
    <label v-if="label" :for="id" class="ds-select__label">
      {{ label }}
      <span v-if="required" class="ds-select__required" aria-hidden="true">*</span>
    </label>

    <div class="ds-select__wrap">
      <button
        :id="id"
        ref="triggerRef"
        type="button"
        class="ds-select__trigger"
        :disabled="disabled"
        :aria-haspopup="searchable ? 'listbox' : undefined"
        :aria-expanded="open"
        :aria-controls="`${id}-listbox`"
        :aria-describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined"
        :aria-invalid="!!error"
        :aria-required="required"
        @click="open ? closeMenu() : openMenu()"
        @keydown="onKey"
        @blur="onBlur"
      >
        <span v-if="selected" class="ds-select__value">{{ selected.label }}</span>
        <span v-else class="ds-select__placeholder">{{ placeholder }}</span>

        <span class="ds-select__icons">
          <button
            v-if="clearable && selected && !disabled"
            type="button"
            class="ds-select__clear"
            aria-label="Limpar seleção"
            @click="clear"
          >
            <IconX :size="14" :stroke-width="1.5" aria-hidden="true" />
          </button>
          <IconChevronDown
            :size="16"
            :stroke-width="1.5"
            :class="['ds-select__chevron', { 'ds-select__chevron--open': open }]"
            aria-hidden="true"
          />
        </span>
      </button>

      <Transition name="ds-select">
        <div v-if="open" ref="menuRef" class="ds-select__menu" tabindex="-1">
          <div v-if="searchable" class="ds-select__search">
            <input
              ref="searchRef"
              v-model="search"
              type="text"
              placeholder="Buscar..."
              aria-label="Buscar opções"
              class="ds-select__search-input"
              :aria-controls="`${id}-listbox`"
              @keydown="onKey"
              @blur="onBlur"
            />
          </div>

          <ul
            :id="`${id}-listbox`"
            ref="listboxRef"
            role="listbox"
            tabindex="-1"
            :aria-label="label || 'Opções'"
            class="ds-select__listbox"
            @keydown="onKey"
          >
            <li
              v-for="(option, index) in filtered"
              :id="`${id}-opt-${index}`"
              :key="option.value"
              role="option"
              :aria-selected="option.value === modelValue"
              :aria-disabled="option.disabled"
              :class="[
                'ds-select__option',
                {
                  'ds-select__option--active': index === activeIndex,
                  'ds-select__option--selected': option.value === modelValue,
                  'ds-select__option--disabled': option.disabled,
                },
              ]"
              tabindex="-1"
              @mousedown.prevent="select(option)"
              @focus="activeIndex = index"
              @keydown.enter.prevent="select(option)"
              @keydown.space.prevent="select(option)"
              @mouseenter="activeIndex = index"
            >
              <span class="ds-select__option-content">
                <span class="ds-select__option-label">{{ option.label }}</span>
                <span v-if="option.description" class="ds-select__option-description">
                  {{ option.description }}
                </span>
              </span>
              <IconCheck
                v-if="option.value === modelValue"
                :size="16"
                :stroke-width="2"
                class="ds-select__option-check"
                aria-hidden="true"
              />
            </li>
            <li v-if="filtered.length === 0" class="ds-select__empty">
              Nenhum resultado encontrado
            </li>
          </ul>
        </div>
      </Transition>
    </div>

    <p v-if="hint && !error" :id="`${id}-hint`" class="ds-select__hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" class="ds-select__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.ds-select {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  position: relative;
}
.ds-select__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}
.ds-select__required {
  color: var(--color-danger-500);
  margin-left: 2px;
}
.ds-select__wrap {
  position: relative;
}

.ds-select__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
  background: var(--color-bg-surface);
  border: 0.5px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: 0 var(--spacing-3);
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: var(--font-size-base);
  text-align: left;
  cursor: pointer;
  transition:
    border-color var(--duration-fast),
    box-shadow var(--duration-fast);
}
.ds-select--sm .ds-select__trigger {
  height: 30px;
  font-size: var(--font-size-sm);
}
.ds-select--md .ds-select__trigger {
  height: 38px;
}
.ds-select--lg .ds-select__trigger {
  height: 46px;
}
.ds-select--sm .ds-select__trigger {
  min-height: var(--size-touch-min);
  font-size: var(--font-size-sm);
}
.ds-select--md .ds-select__trigger {
  min-height: var(--size-touch-min);
}
.ds-select--lg .ds-select__trigger {
  min-height: 46px;
}

.ds-select__trigger:hover:not(:disabled) {
  border-color: var(--color-border-strong);
}
.ds-select__trigger:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
  border-color: var(--color-primary-500);
}
.ds-select__trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ds-select--error .ds-select__trigger {
  border-color: var(--color-danger-500);
}
.ds-select--error .ds-select__trigger:focus-visible {
  box-shadow: var(--focus-ring-danger);
}

.ds-select__placeholder {
  color: var(--color-text-disabled);
}
.ds-select__icons {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  flex-shrink: 0;
}
.ds-select__clear {
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  color: var(--color-text-disabled);
  border-radius: var(--radius-sm);
  display: flex;
}
.ds-select__clear:hover {
  color: var(--color-text-primary);
}
.ds-select__chevron {
  color: var(--color-text-disabled);
  transition: transform var(--duration-fast);
}
.ds-select__chevron--open {
  transform: rotate(180deg);
}

.ds-select__menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--color-bg-elevated);
  border: 0.5px solid var(--color-border-default);
  border-radius: var(--radius-md);
  z-index: var(--z-dropdown);
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
.ds-select__search {
  padding: var(--spacing-2);
  border-bottom: 0.5px solid var(--color-border-subtle);
}
.ds-select__search-input {
  width: 100%;
  height: 32px;
  padding: 0 var(--spacing-2);
  background: var(--color-bg-page);
  border: 0.5px solid var(--color-border-subtle);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}
.ds-select__search-input:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.ds-select__listbox {
  list-style: none;
  margin: 0;
  padding: var(--spacing-1);
  max-height: 280px;
  overflow-y: auto;
}
.ds-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
}
.ds-select__option--active {
  background: var(--color-bg-page);
}
.ds-select__option--selected {
  color: var(--color-primary-600);
  font-weight: var(--font-weight-medium);
}
.ds-select__option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.ds-select__option-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ds-select__option-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
.ds-select__option-check {
  color: var(--color-primary-500);
}
.ds-select__empty {
  padding: var(--spacing-3);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  text-align: center;
}

.ds-select__hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
.ds-select__error {
  font-size: var(--font-size-sm);
  color: var(--color-danger-text);
}

.ds-select-enter-active,
.ds-select-leave-active {
  transition:
    opacity var(--duration-fast),
    transform var(--duration-fast);
}
.ds-select-enter-from,
.ds-select-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
