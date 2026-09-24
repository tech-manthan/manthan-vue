<script setup lang="ts">
import { badge, type Tone } from '@manthan/base';
defineProps<{ variant?: 'solid' | 'soft' | 'surface' | 'outline'; size?: 'sm' | 'md' | 'lg'; tone?: Tone }>();
</script>

<template>
  <span :class="badge({ variant, size, tone })"><slot /></span>
</template>
