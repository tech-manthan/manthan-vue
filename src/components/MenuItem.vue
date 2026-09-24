<script setup lang="ts">
import { computed, inject } from 'vue';
import { menu, type Tone } from '@manthan/base';
import { MenuKey } from '../context';

const props = defineProps<{ tone?: Tone; shortcut?: string; disabled?: boolean; keepOpen?: boolean }>();
const emit = defineEmits<{ select: [] }>();
const inherited = inject(MenuKey, menu());
const s = computed(() => (props.tone ? menu({ tone: props.tone }) : inherited));
</script>

<template>
  <button
    type="button"
    role="menuitem"
    tabindex="-1"
    :aria-disabled="disabled || undefined"
    :data-keep-open="keepOpen || undefined"
    :class="s.item(tone ? 'text-accent-11' : undefined)"
    @click="!disabled && emit('select')"
  >
    <slot name="icon" />
    <slot />
    <span v-if="shortcut" :class="s.shortcut()">{{ shortcut }}</span>
  </button>
</template>
