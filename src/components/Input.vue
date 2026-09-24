<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue';
import { input, inputGroup } from '@manthan/base';
import { useFieldAttrs } from '../context';

defineOptions({ inheritAttrs: false });
const props = defineProps<{ size?: 'sm' | 'md' | 'lg'; id?: string; disabled?: boolean; required?: boolean }>();
const model = defineModel<string | number>();
const attrs = useAttrs();
const slots = useSlots();
const fieldAttrs = useFieldAttrs(props);
const grouped = computed(() => !!(slots.start || slots.end));
const g = inputGroup();
const controlAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return { ...rest, ...fieldAttrs() };
});
</script>

<template>
  <div v-if="grouped" :class="g.root(attrs.class as string)" :style="attrs.style as string">
    <span v-if="$slots.start" :class="g.start()"><slot name="start" /></span>
    <input v-model="model" v-bind="controlAttrs" :class="input({ size, withStart: !!$slots.start, withEnd: !!$slots.end })" />
    <span v-if="$slots.end" :class="g.end()"><slot name="end" /></span>
  </div>
  <input v-else v-model="model" v-bind="{ ...controlAttrs, style: attrs.style }" :class="input({ size, class: attrs.class as string })" />
</template>
