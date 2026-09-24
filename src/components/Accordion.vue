<script setup lang="ts">
import { computed, provide, useId } from 'vue';
import { accordion } from '@manthan/base';
import { AccordionKey } from '../context';

const props = withDefaults(
  defineProps<{
    /** `single` keeps at most one item open (native `<details name>`). */
    type?: 'single' | 'multiple';
    variant?: 'plain' | 'contained' | 'separated';
  }>(),
  { type: 'single' },
);
const slots = computed(() => accordion({ variant: props.variant }));
provide(AccordionKey, { slots, name: props.type === 'single' ? `accordion-${useId()}` : undefined });
</script>

<template>
  <div :class="slots.root()"><slot /></div>
</template>
