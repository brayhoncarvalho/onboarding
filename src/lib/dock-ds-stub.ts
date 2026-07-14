/**
 * Stub do @dock/console-uikit-vue para desenvolvimento local.
 * Renderiza estrutura HTML real sem depender do pacote publicado.
 * Quando o pacote real for instalado, remover o alias no vite.config.ts.
 */
import { defineComponent, h, resolveComponent } from 'vue'
import type { PropType } from 'vue'

// ── createConsoleDesignSystem ─────────────────────────────────────────────
export function createConsoleDesignSystem() {
  return { install() {} }
}

// ── Button ────────────────────────────────────────────────────────────────
export const Button = defineComponent({
  name: 'DsButton',
  props: {
    variant: { type: String as PropType<'primary' | 'secondary' | 'danger' | 'ghost'>, default: 'primary' },
  },
  setup(props, { slots, attrs }) {
    return () => {
      const styles: Record<string, string> = {
        primary:   'background:#00d8d8;color:#141a1a;',
        secondary: 'background:#141a1a;color:#ffffff;',
        danger:    'background:#fc2444;color:#ffffff;',
        ghost:     'background:transparent;color:#00d8d8;padding:0;border:none;',
      }
      const base = `
        display:inline-flex;align-items:center;justify-content:center;
        border:none;cursor:pointer;font-family:'Red Hat Display',sans-serif;
        font-weight:600;font-size:14px;padding:0 16px;height:38px;
      `
      return h('button', { style: base + (styles[props.variant] ?? styles.primary), ...attrs }, slots.default?.())
    }
  },
})

// ── Input ─────────────────────────────────────────────────────────────────
export const Input = defineComponent({
  name: 'DsInput',
  props: {
    label:       { type: String,  default: '' },
    modelValue:  { type: String,  default: '' },
    readonly:    { type: Boolean, default: false },
    placeholder: { type: String,  default: '' },
    type:        { type: String,  default: 'text' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () =>
      h('div', { style: 'display:flex;flex-direction:column;gap:6px;width:100%;' }, [
        props.label
          ? h('label', {
              style: "font-family:'Roboto',sans-serif;font-weight:400;font-size:13px;color:#141a1a;",
            }, props.label)
          : null,
        h('input', {
          type: props.type,
          value: props.modelValue,
          readonly: props.readonly,
          placeholder: props.placeholder,
          onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
          style: `height:32px;background:#ffffff;border:1px solid #777777;
                  font-family:'Roboto',sans-serif;font-size:13px;color:#141a1a;
                  padding:0 9px;width:100%;box-sizing:border-box;`,
          ...attrs,
        }),
      ])
  },
})

// ── Select ────────────────────────────────────────────────────────────────
interface SelectOption { label: string; value: string }

export const Select = defineComponent({
  name: 'DsSelect',
  props: {
    label:      { type: String, default: '' },
    modelValue: { type: String, default: '' },
    options:    { type: Array as PropType<SelectOption[]>, default: () => [] },
    readonly:   { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () =>
      h('div', { style: 'display:flex;flex-direction:column;gap:6px;width:100%;' }, [
        props.label
          ? h('label', {
              style: "font-family:'Roboto',sans-serif;font-weight:400;font-size:13px;color:#141a1a;",
            }, props.label)
          : null,
        h('select', {
          value: props.modelValue,
          disabled: props.readonly,
          onChange: (e: Event) => emit('update:modelValue', (e.target as HTMLSelectElement).value),
          style: `height:32px;background:#ffffff;border:1px solid #777777;
                  font-family:'Roboto',sans-serif;font-size:13px;color:#141a1a;
                  padding:0 9px;width:100%;box-sizing:border-box;`,
          ...attrs,
        }, props.options.map(opt =>
          h('option', { value: opt.value, selected: opt.value === props.modelValue || opt.label === props.modelValue }, opt.label)
        )),
      ])
  },
})

// ── Checkbox ──────────────────────────────────────────────────────────────
export const Checkbox = defineComponent({
  name: 'DsCheckbox',
  props: {
    label:      { type: String,  default: '' },
    modelValue: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('label', { style: 'display:inline-flex;align-items:center;gap:8px;cursor:pointer;' }, [
        h('input', {
          type: 'checkbox',
          checked: props.modelValue,
          onChange: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).checked),
        }),
        props.label
          ? h('span', {
              style: "font-family:'Roboto',sans-serif;font-size:13px;color:#141a1a;",
            }, props.label)
          : null,
      ])
  },
})

// ── Card ──────────────────────────────────────────────────────────────────
export const Card = defineComponent({
  name: 'DsCard',
  setup(_, { slots, attrs }) {
    return () => h('div', attrs, slots.default?.())
  },
})

// ── Typography ────────────────────────────────────────────────────────────
export const Typography = defineComponent({
  name: 'DsTypography',
  props: { tag: { type: String, default: 'span' }, variant: { type: String, default: '' } },
  setup(props, { slots, attrs }) {
    return () => h(props.tag, attrs, slots.default?.())
  },
})

// ── DatePicker ────────────────────────────────────────────────────────────
export const DatePicker = defineComponent({
  name: 'DsDatePicker',
  props: {
    label:      { type: String, default: '' },
    modelValue: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('div', { style: 'display:flex;flex-direction:column;gap:6px;' }, [
        props.label
          ? h('label', {
              style: "font-family:'Roboto',sans-serif;font-size:13px;color:#141a1a;",
            }, props.label)
          : null,
        h('input', {
          type: 'date',
          value: props.modelValue,
          onChange: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
          style: `height:32px;border:1px solid #777777;padding:0 9px;
                  font-family:'Roboto',sans-serif;font-size:13px;width:100%;box-sizing:border-box;`,
        }),
      ])
  },
})

// ── Stepper ───────────────────────────────────────────────────────────────
export const Stepper = defineComponent({
  name: 'DsStepper',
  props: {
    steps:      { type: Array as PropType<Array<string | { title?: string; label?: string }>>, default: () => [] },
    current:    { type: Number, default: 1 },
    modelValue: { type: Number, default: undefined },
    labelMode:  { type: String as PropType<'all' | 'active' | 'none'>, default: 'all' },
  },
  setup(props, { attrs }) {
    const resolveLabel = (step: string | { title?: string; label?: string }) => {
      if (typeof step === 'string') {
        return step
      }

      return step.label ?? step.title ?? ''
    }

    return () => {
      const currentStep = Math.max(1, props.modelValue ?? props.current)

      return h('div', {
        ...attrs,
        style: 'display:flex;align-items:flex-start;justify-content:center;gap:0;width:100%;overflow-x:auto;padding:4px 0;',
      }, props.steps.map((step, index) => {
        const stepNumber = index + 1
        const label = resolveLabel(step)
        const isCurrent = stepNumber === currentStep
        const isCompleted = stepNumber <= currentStep
        const showLabel = props.labelMode === 'all' || (props.labelMode === 'active' && isCurrent)

        return h('div', {
          style: 'display:flex;align-items:flex-start;gap:6px;flex:1 1 0;min-width:64px;justify-content:center;',
        }, [
          index > 0
            ? h('div', {
                'aria-hidden': 'true',
                style: 'display:flex;flex-direction:column;gap:2px;align-items:center;padding-top:10px;',
              }, [
                h('span', { style: 'display:block;width:4px;height:4px;border-radius:999px;background:#c8c8c8;' }),
                h('span', { style: 'display:block;width:4px;height:4px;border-radius:999px;background:#c8c8c8;' }),
                h('span', { style: 'display:block;width:4px;height:4px;border-radius:999px;background:#c8c8c8;' }),
              ])
            : null,
          h('div', {
            style: 'display:flex;flex-direction:column;align-items:center;min-width:28px;',
          }, [
            h('span', {
              style: `width:28px;height:28px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;font-family:Roboto,sans-serif;background:${isCompleted ? '#00d8d8' : '#b9b9b9'};color:#ffffff;`,
            }, String(stepNumber)),
            showLabel && label
              ? h('span', {
                  style: `margin-top:4px;font-family:Roboto,sans-serif;font-size:9px;font-weight:${isCurrent ? '600' : '500'};line-height:1.2;text-align:center;color:#666666;white-space:nowrap;`,
                }, label)
              : null,
          ]),
        ])
      }))
    }
  },
})

// ── Bars3Icon ─────────────────────────────────────────────────────────────
export const Bars3Icon = defineComponent({
  name: 'Bars3Icon',
  setup() {
    return () =>
      h('svg', {
        xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', 'stroke-width': '2', width: '24', height: '24',
      }, [
        h('path', { d: 'M3 6h18M3 12h18M3 18h18' }),
      ])
  },
})

export default {}
