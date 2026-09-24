<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { popover, type Placement } from '@manthan/base';
import { createPopover, type PopoverController } from '@manthan/base/dom';

const props = defineProps<{ placement?: Placement; offset?: number; title?: string; description?: string }>();
const open = defineModel<boolean | undefined>('open');
const wrap = ref<HTMLElement>();
const content = ref<HTMLElement>();
const s = popover();
let controller: PopoverController | undefined;

onMounted(() => {
  const trigger = wrap.value?.firstElementChild as HTMLElement | null;
  if (!trigger) return;
  controller = createPopover({
    trigger,
    content: content.value!,
    placement: props.placement,
    offset: props.offset,
    onOpenChange: (next) => (open.value = next),
  });
});
watch(open, (next) => {
  if (next === undefined) return;
  if (next) controller?.open();
  else controller?.close();
});
onBeforeUnmount(() => controller?.destroy());
</script>

<template>
  <span ref="wrap" style="display: contents"><slot name="trigger" /></span>
  <div ref="content" popover="auto" :class="s.content()">
    <h3 v-if="title" :class="s.title()">{{ title }}</h3>
    <p v-if="description" :class="s.description()">{{ description }}</p>
    <slot />
  </div>
</template>
