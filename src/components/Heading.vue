<script setup lang="ts">
import { heading } from '@manthan/base';
withDefaults(defineProps<{ level?: 1 | 2 | 3 | 4 | 5 | 6; size?: 1 | 2 | 3 | 4 | 5 | 6 }>(), { level: 2 });
</script>

<template>
  <component :is="`h${level}`" :class="heading({ size: size ?? level })"><slot /></component>
</template>
