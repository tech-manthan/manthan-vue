<script setup lang="ts">
import { computed } from 'vue';
import { ArrowDownRight, ArrowUpRight } from '@manthan/icons';
import { deltaDirection, stat, type ChartSeries } from '@manthan/base';
import Chart from './Chart.vue';
import Icon from './Icon.vue';

/** Stat tile: label, headline value, delta and an optional sparkline. */
const props = withDefaults(
  defineProps<{
    label: string;
    value: string | number;
    /** Signed change, e.g. "+12.4%". Its sign picks the arrow. */
    delta?: string | number;
    /** Whether the change is good; colours the delta. */
    sentiment?: 'positive' | 'negative' | 'neutral';
    /** Comparison period, e.g. "vs last month". */
    caption?: string;
    /** Recent values, drawn as a sparkline. */
    trend?: number[];
  }>(),
  { sentiment: 'neutral' },
);
const s = computed(() => stat({ sentiment: props.sentiment }));
const direction = computed(() => deltaDirection(props.delta));
const points = computed(() => props.trend?.map((v, i) => ({ i, v })) ?? []);
const sparkSeries: ChartSeries[] = [{ key: 'v', color: 'accent' }];
</script>

<template>
  <div :class="s.root()">
    <span :class="s.label()"><slot name="label">{{ label }}</slot></span>
    <span :class="s.value()"><slot>{{ value }}</slot></span>
    <span v-if="delta !== undefined || caption" :class="s.footer()">
      <span v-if="delta !== undefined" :class="s.delta()">
        <Icon v-if="direction !== 'flat'" :icon="direction === 'up' ? ArrowUpRight : ArrowDownRight" aria-hidden="true" />{{ delta }}
      </span>
      {{ caption }}
    </span>
    <Chart
      v-if="points.length > 1"
      :class="s.trend()"
      type="area"
      sparkline
      :height="40"
      x="i"
      :title="`${label} trend`"
      :data="points"
      :series="sparkSeries"
    />
  </div>
</template>
