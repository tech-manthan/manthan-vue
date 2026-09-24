<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { createTabs, type TabsController } from '@manthan/base/dom';
import { TabsKey } from '../context';

const ctx = inject(TabsKey)!;
const el = ref<HTMLElement>();
let controller: TabsController | undefined;
const init = () => {
  controller?.destroy();
  controller = createTabs(el.value!, { orientation: ctx.orientation.value, activation: ctx.activation.value });
};
onMounted(init);
watch([ctx.orientation, ctx.activation], init);
onBeforeUnmount(() => controller?.destroy());
</script>

<template>
  <div ref="el" role="tablist" :aria-orientation="ctx.orientation.value" :class="ctx.slots.value.list()"><slot /></div>
</template>
