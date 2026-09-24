<script setup lang="ts">
import { computed, provide } from 'vue';
import { table } from '@manthan/base';
import { TableKey } from '../context';

defineOptions({ inheritAttrs: false });
const props = defineProps<{ striped?: boolean; size?: 'sm' | 'md'; containerClass?: string }>();
const slots = computed(() => table({ striped: props.striped, size: props.size }));
provide(TableKey, slots);
</script>

<template>
  <div :class="slots.root(containerClass)">
    <table v-bind="$attrs" :class="slots.table()"><slot /></table>
  </div>
</template>
