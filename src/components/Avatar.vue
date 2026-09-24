<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { avatar, type Tone } from '@manthan/base';

const props = withDefaults(
  defineProps<{
    src?: string;
    alt?: string;
    /** Shown when there is no image; defaults to the initials of `alt`. */
    fallback?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    shape?: 'circle' | 'square';
    tone?: Tone;
  }>(),
  { alt: '' },
);
const failed = ref(false);
watch(() => props.src, () => (failed.value = false));
const s = computed(() => avatar({ size: props.size, shape: props.shape, tone: props.tone }));
const initials = computed(() =>
  props.alt
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join(''),
);
</script>

<template>
  <span :class="s.root()">
    <img v-if="src && !failed" :src="src" :alt="alt" :class="s.image()" @error="failed = true" />
    <span v-else :class="s.fallback()" :role="alt ? 'img' : undefined" :aria-label="alt || undefined">
      <slot>{{ fallback ?? initials }}</slot>
    </span>
  </span>
</template>
