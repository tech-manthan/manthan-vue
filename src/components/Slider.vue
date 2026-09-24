<script setup lang="ts">
import { computed } from 'vue';
import { slider, valueToPercent, type Tone } from '@manthan/base';
import { useFieldAttrs } from '../context';

const props = withDefaults(
  defineProps<{
    min?: number;
    max?: number;
    step?: number;
    size?: 'sm' | 'md' | 'lg';
    tone?: Tone;
    id?: string;
    disabled?: boolean;
    required?: boolean;
  }>(),
  { min: 0, max: 100, step: 1 },
);
const model = defineModel<number>({ default: 50 });
const fieldAttrs = useFieldAttrs(props);
const fill = computed(() => `${valueToPercent(model.value, props.min, props.max)}%`);
</script>

<template>
  <input
    v-model.number="model"
    type="range"
    :min="min"
    :max="max"
    :step="step"
    v-bind="fieldAttrs()"
    :class="slider({ size, tone })"
    :style="{ '--mn-fill': fill }"
  />
</template>
