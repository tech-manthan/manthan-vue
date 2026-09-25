<script setup lang="ts" generic="T extends Record<string, unknown> = Record<string, unknown>">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { chart, type ChartCurve, type ChartSeries, type ChartType } from '@manthan/base';
import { createChart, type ChartController, type ChartControllerOptions } from '@manthan/base/dom';

/**
 * Line, area, bar or donut chart drawn by the shared `@manthan/base` controller,
 * so it follows the active design style. `v-model:hidden` tracks toggled series.
 */
const props = withDefaults(
  defineProps<{
    type: ChartType;
    data: T[];
    x: string;
    series: ChartSeries[];
    title?: string;
    height?: number;
    stacked?: boolean;
    horizontal?: boolean;
    curve?: ChartCurve;
    markers?: boolean;
    sparkline?: boolean;
    grid?: boolean;
    directLabels?: boolean;
    yDomain?: [number | 'auto', number | 'auto'];
    xFormat?: (value: unknown, index: number) => string;
    yFormat?: (value: number) => string;
    valueFormat?: (value: number) => string;
    innerRadius?: number;
    maxBarSize?: number;
    legend?: boolean | 'auto';
    toggleable?: boolean;
    tooltip?: boolean;
    centerLabel?: string;
    xLabel?: string;
  }>(),
  { grid: true, directLabels: true, legend: 'auto', toggleable: true, tooltip: true },
);
const hidden = defineModel<string[]>('hidden', { default: () => [] });
const emit = defineEmits<{ activeChange: [index: number] }>();
const el = ref<HTMLElement>();
let controller: ChartController<T> | undefined;

const options = (): ChartControllerOptions<T> => ({ ...(props as ChartControllerOptions<T>), hidden: hidden.value });

onMounted(() => {
  controller = createChart<T>(el.value!, {
    ...options(),
    onHiddenChange: (next) => (hidden.value = next),
    onActiveChange: (index) => emit('activeChange', index),
  });
});
watch(
  () => [{ ...props }, hidden.value],
  () => controller?.update(options()),
  { deep: false },
);
onBeforeUnmount(() => controller?.destroy());
</script>

<template>
  <div ref="el" :class="chart().root()" />
</template>
