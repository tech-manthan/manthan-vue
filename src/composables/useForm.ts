import { computed, onScopeDispose, shallowRef } from 'vue';
import { createForm, type FormOptions, type FormValues } from '@manthan/base';

/**
 * Form state + validation (Manthan's `createForm` store as Vue refs).
 *
 *   const form = useForm({ initialValues, rules, onSubmit });
 *   <form @submit="form.handleSubmit">
 *     <Field label="Email" :error="form.errors.value.email"><Input v-bind="form.register('email')" /></Field>
 */
export function useForm<V extends FormValues>(options: FormOptions<V>) {
  const store = createForm<V>(options);
  const state = shallowRef(store.getSnapshot());
  onScopeDispose(store.subscribe(() => (state.value = store.getSnapshot())));
  const errors = computed(() => {
    void state.value;
    return Object.fromEntries(Object.keys({ ...state.value.values, ...options.rules }).map((k) => [k, store.visibleError(k as keyof V)])) as {
      [K in keyof V]?: string;
    };
  });
  return {
    store,
    state,
    values: computed(() => state.value.values),
    /** Errors that should be shown now (field visited or form submitted). */
    errors,
    submitting: computed(() => state.value.submitting),
    dirty: computed(() => state.value.dirty),
    setValue: store.setValue,
    reset: store.reset,
    validate: store.validate,
    handleSubmit: (event?: Event) => void store.submit(event),
    /** Bindings for Input, Textarea, Select, Checkbox, Switch, Slider, Combobox… (`v-bind`). */
    register<K extends keyof V>(name: K) {
      return {
        name: String(name),
        modelValue: state.value.values[name],
        'onUpdate:modelValue': (value: unknown) => {
          store.setValue(name, value as V[K]);
          if (typeof value === 'boolean') store.blur(name);
        },
        onBlur: () => store.blur(name),
        'aria-invalid': store.visibleError(name) ? true : undefined,
      };
    },
  };
}
