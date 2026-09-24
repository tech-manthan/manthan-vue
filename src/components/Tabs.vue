<script setup lang="ts">
import { computed, provide, useId } from 'vue';
import { tabs } from '@manthan/base';
import { TabsKey } from '../context';

const props = withDefaults(
  defineProps<{
    variant?: 'line' | 'pills' | 'segmented';
    orientation?: 'horizontal' | 'vertical';
    size?: 'sm' | 'md' | 'lg';
    /** `automatic` selects on focus, `manual` on Enter/Space. */
    activation?: 'automatic' | 'manual';
    /** Initially selected tab when not using v-model. */
    defaultValue?: string;
  }>(),
  { orientation: 'horizontal', activation: 'automatic' },
);
const model = defineModel<string>();
if (model.value === undefined && props.defaultValue !== undefined) model.value = props.defaultValue;
const slots = computed(() => tabs({ variant: props.variant, orientation: props.orientation, size: props.size }));
provide(TabsKey, {
  value: model,
  select: (v) => (model.value = v),
  baseId: useId(),
  slots,
  orientation: computed(() => props.orientation),
  activation: computed(() => props.activation),
});
</script>

<template>
  <div :class="slots.root()" :data-orientation="orientation"><slot /></div>
</template>
