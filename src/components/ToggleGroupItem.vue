<script setup lang="ts">
import { inject } from 'vue';
import { ToggleGroupKey } from '../context';

defineProps<{ value: string; disabled?: boolean }>();
const ctx = inject(ToggleGroupKey)!;
</script>

<template>
  <button
    type="button"
    :aria-pressed="ctx.isPressed(value)"
    :disabled="disabled ?? ctx.disabled.value"
    :class="ctx.itemClass.value"
    @click="ctx.toggle(value)"
  >
    <slot />
  </button>
</template>
