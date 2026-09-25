<script setup lang="ts">
import { computed, useAttrs, ref, watchEffect } from 'vue';
import { Check, Minus } from '@manthan/icons';
import { checkbox, type Tone } from '@manthan/base';
import { useFieldAttrs } from '../context';
import Icon from './Icon.vue';

const props = defineProps<{
  label?: string;
  description?: string;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  tone?: Tone;
  value?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
}>();
const model = defineModel<boolean>({ default: false });
const el = ref<HTMLInputElement>();
watchEffect(() => {
  if (el.value) el.value.indeterminate = !!props.indeterminate;
});
defineOptions({ inheritAttrs: false });
const attrs = useAttrs();
/** Non-class attributes (aria-*, data-*, events) belong on the native input. */
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});
const fieldAttrs = useFieldAttrs(props);
const s = computed(() => checkbox({ size: props.size, tone: props.tone }));
</script>

<template>
  <component :is="label || description || $slots.default ? 'label' : 'span'" :class="s.label(attrs.class as string)" :style="attrs.style as string">
    <span :class="s.root()">
      <input
        ref="el"
        v-model="model"
        type="checkbox"
        :name="name"
        :value="value"
        v-bind="{ ...inputAttrs, ...fieldAttrs() }"
        :aria-checked="indeterminate ? 'mixed' : undefined"
        :class="s.input()"
      />
      <span :class="s.control()">
        <Icon :icon="Check" :stroke-width="3" :class="s.check()" />
        <Icon :icon="Minus" :stroke-width="3" :class="s.minus()" />
      </span>
    </span>
    <span v-if="label || description || $slots.default" :class="s.text()">
      <slot>{{ label }}</slot>
      <span v-if="description" :class="s.description()">{{ description }}</span>
    </span>
  </component>
</template>
