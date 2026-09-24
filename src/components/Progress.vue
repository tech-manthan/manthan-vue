<script setup lang="ts">
import { computed } from 'vue';
import { progress, valueToPercent, type Tone } from '@manthan/base';

const props = withDefaults(
  defineProps<{ value?: number; max?: number; indeterminate?: boolean; size?: 'sm' | 'md' | 'lg'; tone?: Tone }>(),
  { value: 0, max: 100 },
);
const s = computed(() => progress({ size: props.size, tone: props.tone, indeterminate: props.indeterminate }));
const percent = computed(() => valueToPercent(props.value, 0, props.max));
</script>

<template>
  <div role="progressbar" aria-valuemin="0" :aria-valuemax="max" :aria-valuenow="indeterminate ? undefined : value" :class="s.root()">
    <div :class="s.indicator()" :style="indeterminate ? undefined : { translate: `-${100 - percent}% 0` }" />
  </div>
</template>
