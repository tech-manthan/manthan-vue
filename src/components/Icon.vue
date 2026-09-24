<script setup lang="ts">
import { computed } from 'vue';
import type { IconNode } from '@manthan/icons';

const props = withDefaults(
  defineProps<{
    icon: IconNode;
    size?: number | string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
    /** Accessible label; unlabelled icons are hidden from assistive tech. */
    title?: string;
  }>(),
  { size: 24, strokeWidth: 2 },
);
const stroke = computed(() =>
  props.absoluteStrokeWidth ? (Number(props.strokeWidth) * 24) / Number.parseFloat(String(props.size)) : props.strokeWidth,
);
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="stroke"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-hidden="title ? undefined : 'true'"
    :role="title ? 'img' : undefined"
  >
    <title v-if="title">{{ title }}</title>
    <component :is="tag" v-for="([tag, attrs], i) in icon" :key="i" v-bind="attrs" />
  </svg>
</template>
