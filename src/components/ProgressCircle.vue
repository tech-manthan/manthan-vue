<script setup lang="ts">
import { computed } from 'vue';
import { progressCircle, valueToPercent, type Tone } from '@manthan/base';

const props = withDefaults(
  defineProps<{
    value?: number;
    max?: number;
    indeterminate?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    tone?: Tone;
    showValue?: boolean;
    thickness?: number;
  }>(),
  { value: 0, max: 100, size: 'md', thickness: 4, showValue: undefined },
);
const s = computed(() => progressCircle({ size: props.size, tone: props.tone, indeterminate: props.indeterminate }));
const r = computed(() => 20 - props.thickness / 2);
const c = computed(() => 2 * Math.PI * r.value);
const percent = computed(() => (props.indeterminate ? 25 : valueToPercent(props.value, 0, props.max)));
const show = computed(() => (props.showValue ?? props.size !== 'sm') && !props.indeterminate);
</script>

<template>
  <div role="progressbar" aria-valuemin="0" :aria-valuemax="max" :aria-valuenow="indeterminate ? undefined : value" :class="s.root()">
    <svg viewBox="0 0 40 40" :class="s.svg()" aria-hidden="true">
      <circle cx="20" cy="20" :r="r" :stroke-width="thickness" :class="s.track()" />
      <circle cx="20" cy="20" :r="r" :stroke-width="thickness" :stroke-dasharray="c" :stroke-dashoffset="c * (1 - percent / 100)" :class="s.indicator()" />
    </svg>
    <span v-if="show" :class="s.label()">{{ Math.round(percent) }}%</span>
  </div>
</template>
