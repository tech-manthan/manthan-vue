<script setup lang="ts">
import { inject } from 'vue';
import { TabsKey } from '../context';

defineProps<{ value: string }>();
const ctx = inject(TabsKey)!;
</script>

<template>
  <div
    role="tabpanel"
    :id="`${ctx.baseId}-panel-${value}`"
    :aria-labelledby="`${ctx.baseId}-tab-${value}`"
    :hidden="ctx.value.value !== value"
    tabindex="0"
    :class="ctx.slots.value.panel()"
  >
    <slot />
  </div>
</template>
