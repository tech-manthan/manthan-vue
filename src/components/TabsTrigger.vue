<script setup lang="ts">
import { computed, inject } from 'vue';
import { TabsKey } from '../context';

const props = defineProps<{ value: string; disabled?: boolean }>();
const ctx = inject(TabsKey)!;
const selected = computed(() => ctx.value.value === props.value);
</script>

<template>
  <button
    type="button"
    role="tab"
    :id="`${ctx.baseId}-tab-${value}`"
    :aria-controls="`${ctx.baseId}-panel-${value}`"
    :aria-selected="selected"
    :tabindex="selected ? 0 : -1"
    :disabled="disabled"
    :class="ctx.slots.value.trigger()"
    @click="ctx.select(value)"
  >
    <slot />
  </button>
</template>
