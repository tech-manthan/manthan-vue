<script setup lang="ts">
import { kbd } from '@manthan/base';
defineProps<{ size?: 'sm' | 'md' }>();
</script>

<template>
  <kbd :class="kbd({ size })"><slot /></kbd>
</template>
