<script setup lang="ts">
import { spinner, type Tone } from '@manthan/base';
withDefaults(defineProps<{ size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; tone?: Tone | 'current'; label?: string }>(), { label: 'Loading' });
</script>

<template>
  <span role="status" :aria-label="label" :class="spinner({ size, tone })" />
</template>
