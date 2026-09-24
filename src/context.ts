import { inject, type ComputedRef, type InjectionKey, type Ref } from 'vue';
import type { accordion, card, menu, table, tabs, Tone } from '@manthan/base';

export interface FieldContext {
  id: string;
  describedBy: ComputedRef<string | undefined>;
  invalid: ComputedRef<boolean>;
  required: ComputedRef<boolean | undefined>;
  disabled: ComputedRef<boolean | undefined>;
}
export const FieldKey: InjectionKey<FieldContext> = Symbol('mn-field');

/** Attributes a control should take from the enclosing <Field>. */
export function useFieldAttrs(own: { id?: string; disabled?: boolean; required?: boolean }) {
  const field = inject(FieldKey, null);
  return () =>
    field
      ? {
          id: own.id ?? field.id,
          disabled: own.disabled ?? field.disabled.value,
          required: own.required ?? field.required.value,
          'aria-describedby': field.describedBy.value,
          'aria-invalid': field.invalid.value || undefined,
        }
      : { id: own.id, disabled: own.disabled, required: own.required };
}

export const CardKey: InjectionKey<ComputedRef<ReturnType<typeof card>>> = Symbol('mn-card');
export const TableKey: InjectionKey<ComputedRef<ReturnType<typeof table>>> = Symbol('mn-table');
export const MenuKey: InjectionKey<ReturnType<typeof menu>> = Symbol('mn-menu');
export const AccordionKey: InjectionKey<{ slots: ComputedRef<ReturnType<typeof accordion>>; name?: string }> = Symbol('mn-accordion');

export interface TabsContext {
  value: Ref<string | undefined>;
  select: (value: string) => void;
  baseId: string;
  slots: ComputedRef<ReturnType<typeof tabs>>;
  orientation: ComputedRef<'horizontal' | 'vertical'>;
  activation: ComputedRef<'automatic' | 'manual'>;
}
export const TabsKey: InjectionKey<TabsContext> = Symbol('mn-tabs');

export interface RadioGroupContext {
  name: string;
  value: Ref<string | undefined>;
  select: (value: string) => void;
  size: ComputedRef<'sm' | 'md' | 'lg' | undefined>;
  tone: ComputedRef<Tone | undefined>;
  disabled: ComputedRef<boolean | undefined>;
}
export const RadioGroupKey: InjectionKey<RadioGroupContext> = Symbol('mn-radio-group');
