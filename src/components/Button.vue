<script setup lang="ts">
import { button, spinner, type Tone } from '@manthan/base';

withDefaults(
  defineProps<{
    variant?: 'solid' | 'soft' | 'surface' | 'outline' | 'ghost' | 'link';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    tone?: Tone;
    iconOnly?: boolean;
    fullWidth?: boolean;
    /** Shows a spinner, sets aria-busy and disables the button. */
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }>(),
  { type: 'button' },
);
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    :class="button({ variant, size, tone, iconOnly, fullWidth })"
  >
    <span v-if="loading" :class="spinner({ size: 'sm' })" aria-hidden="true" />
    <slot />
  </button>
</template>
