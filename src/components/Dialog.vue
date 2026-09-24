<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, useId, watch } from 'vue';
import { X } from '@manthan/icons';
import { closeButton, dialog } from '@manthan/base';
import { createDialog, type DialogController } from '@manthan/base/dom';
import Icon from './Icon.vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    placement?: 'center' | 'left' | 'right' | 'top' | 'bottom';
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    showClose?: boolean;
  }>(),
  { closeOnBackdrop: true, closeOnEscape: true, showClose: true },
);
const open = defineModel<boolean>('open', { default: false });
const el = ref<HTMLDialogElement>();
const id = useId();
const s = computed(() => dialog({ placement: props.placement, size: props.size }));
let controller: DialogController | undefined;

const show = () => (open.value = true);
const close = () => (open.value = false);
provide('mn-dialog', { close });

onMounted(() => {
  controller = createDialog(el.value!, {
    closeOnBackdrop: props.closeOnBackdrop,
    closeOnEscape: props.closeOnEscape,
    onOpenChange: (next) => (open.value = next),
  });
  if (open.value) controller.open();
});
watch(open, (next) => (next ? controller?.open() : controller?.close()));
onBeforeUnmount(() => controller?.destroy());
</script>

<template>
  <slot name="trigger" :open="show" />
  <dialog
    ref="el"
    :aria-labelledby="title ? `${id}-title` : undefined"
    :aria-describedby="description ? `${id}-description` : undefined"
    :class="s.content()"
  >
    <div v-if="title || description" :class="s.header()">
      <h2 v-if="title" :id="`${id}-title`" :class="s.title()">{{ title }}</h2>
      <p v-if="description" :id="`${id}-description`" :class="s.description()">{{ description }}</p>
    </div>
    <div :class="s.body()"><slot :close="close" /></div>
    <div v-if="$slots.footer" :class="s.footer()"><slot name="footer" :close="close" /></div>
    <button v-if="showClose" type="button" aria-label="Close" :class="closeButton({ class: s.close() })" @click="close">
      <Icon :icon="X" />
    </button>
  </dialog>
</template>
