<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { ChevronDown } from '@manthan/icons';
import { select } from '@manthan/base';
import { useFieldAttrs } from '../context';
import Icon from './Icon.vue';

export type SelectOption = string | { value: string; label?: string; disabled?: boolean };

defineOptions({ inheritAttrs: false });
const props = defineProps<{
  size?: 'sm' | 'md' | 'lg';
  options?: SelectOption[];
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
}>();
const model = defineModel<string>({ default: '' });
const attrs = useAttrs();
const fieldAttrs = useFieldAttrs(props);
const s = computed(() => select({ size: props.size }));
const normalized = computed(() => (props.options ?? []).map((o) => (typeof o === 'string' ? { value: o, label: o } : o)));
const controlAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return { ...rest, ...fieldAttrs() };
});
</script>

<template>
  <div :class="s.root(attrs.class as string)" :style="attrs.style as string">
    <select v-model="model" v-bind="controlAttrs" :class="s.select()">
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="o in normalized" :key="o.value" :value="o.value" :disabled="o.disabled">{{ o.label ?? o.value }}</option>
      <slot />
    </select>
    <Icon :icon="ChevronDown" :class="s.icon()" />
  </div>
</template>
