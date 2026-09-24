<script setup lang="ts">
import { computed, provide, useId, useSlots } from 'vue';
import { field } from '@manthan/base';
import { FieldKey } from '../context';

const props = defineProps<{
  label?: string;
  description?: string;
  /** Error message; also marks the control aria-invalid. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
}>();
const slots = useSlots();
const controlId = props.id ?? `field-${useId()}`;
const hasError = computed(() => !!(props.error || slots.error));
const hasDescription = computed(() => !!(props.description || slots.description));
provide(FieldKey, {
  id: controlId,
  describedBy: computed(
    () =>
      [hasDescription.value && `${controlId}-description`, hasError.value && `${controlId}-error`].filter(Boolean).join(' ') ||
      undefined,
  ),
  invalid: hasError,
  required: computed(() => props.required),
  disabled: computed(() => props.disabled),
});
const s = computed(() => field({ required: props.required, disabled: props.disabled }));
</script>

<template>
  <div :class="s.root()">
    <label v-if="label || $slots.label" :for="controlId" :class="s.label()"><slot name="label">{{ label }}</slot></label>
    <slot />
    <p v-if="hasDescription" :id="`${controlId}-description`" :class="s.description()">
      <slot name="description">{{ description }}</slot>
    </p>
    <p v-if="hasError" :id="`${controlId}-error`" :class="s.error()"><slot name="error">{{ error }}</slot></p>
  </div>
</template>
