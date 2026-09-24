<script setup lang="ts">
import { computed, provide } from 'vue';
import { card } from '@manthan/base';
import { CardKey } from '../context';

const props = defineProps<{ variant?: 'surface' | 'outline' | 'ghost'; size?: 'sm' | 'md' | 'lg'; interactive?: boolean }>();
const slots = computed(() => card({ variant: props.variant, size: props.size, interactive: props.interactive }));
provide(CardKey, slots);
</script>

<template>
  <div :class="slots.root()" :tabindex="interactive ? 0 : undefined"><slot /></div>
</template>
