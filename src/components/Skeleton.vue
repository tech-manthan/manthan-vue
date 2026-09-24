<script setup lang="ts">
import { skeleton } from '@manthan/base';
defineProps<{ shape?: 'text' | 'rect' | 'circle' }>();
</script>

<template>
  <span aria-hidden="true" :class="skeleton({ shape })" />
</template>
