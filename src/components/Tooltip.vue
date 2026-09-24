<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { tooltip, type Placement } from '@manthan/base';
import { createTooltip, type TooltipController } from '@manthan/base/dom';

const props = defineProps<{ content?: string; placement?: Placement; openDelay?: number; closeDelay?: number }>();
const wrap = ref<HTMLElement>();
const tip = ref<HTMLElement>();
let controller: TooltipController | undefined;

onMounted(() => {
  const trigger = wrap.value?.firstElementChild as HTMLElement | null;
  if (!trigger) return;
  controller = createTooltip({
    trigger,
    content: tip.value!,
    placement: props.placement,
    openDelay: props.openDelay,
    closeDelay: props.closeDelay,
  });
});
onBeforeUnmount(() => controller?.destroy());
</script>

<template>
  <span ref="wrap" style="display: contents"><slot /></span>
  <div ref="tip" popover="manual" role="tooltip" :class="tooltip()">
    <slot name="content">{{ content }}</slot>
  </div>
</template>
