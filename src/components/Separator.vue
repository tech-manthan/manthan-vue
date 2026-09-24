<script setup lang="ts">
import { separator } from '@manthan/base';
withDefaults(defineProps<{ orientation?: 'horizontal' | 'vertical'; decorative?: boolean }>(), {
  orientation: 'horizontal',
  decorative: true,
});
</script>

<template>
  <div
    :role="decorative ? 'none' : 'separator'"
    :aria-orientation="decorative ? undefined : orientation"
    :class="separator({ orientation })"
  />
</template>
