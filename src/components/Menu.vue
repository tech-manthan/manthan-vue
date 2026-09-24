<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref } from 'vue';
import { menu, type Placement } from '@manthan/base';
import { createMenu, type PopoverController } from '@manthan/base/dom';
import { MenuKey } from '../context';

const props = defineProps<{ placement?: Placement }>();
const emit = defineEmits<{ openChange: [open: boolean] }>();
const wrap = ref<HTMLElement>();
const content = ref<HTMLElement>();
const s = menu();
provide(MenuKey, s);
let controller: PopoverController | undefined;

onMounted(() => {
  const trigger = wrap.value?.firstElementChild as HTMLElement | null;
  if (!trigger) return;
  controller = createMenu({ trigger, content: content.value!, placement: props.placement, onOpenChange: (o) => emit('openChange', o) });
});
onBeforeUnmount(() => controller?.destroy());
</script>

<template>
  <span ref="wrap" style="display: contents"><slot name="trigger" /></span>
  <div ref="content" popover="auto" role="menu" tabindex="-1" :class="s.content()"><slot /></div>
</template>
