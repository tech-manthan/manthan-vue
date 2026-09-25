<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { commandDialog, type ListOption } from '@manthan/base';
import { createDialog, onHotkey, type DialogController } from '@manthan/base/dom';
import Command from './Command.vue';

const props = withDefaults(
  defineProps<{
    options: ListOption[];
    placeholder?: string;
    emptyText?: string;
    /** Global shortcut that opens the palette; `false` disables it. */
    hotkey?: string | false;
  }>(),
  { hotkey: 'mod+k' },
);
const emit = defineEmits<{ select: [value: string] }>();
const open = defineModel<boolean>('open', { default: false });
const el = ref<HTMLDialogElement>();
const cmd = ref<InstanceType<typeof Command>>();
let controller: DialogController | undefined;
let offHotkey: (() => void) | undefined;

onMounted(() => {
  controller = createDialog(el.value!, {
    onOpenChange: (next) => {
      open.value = next;
      if (!next) setTimeout(() => cmd.value?.reset(), 200);
    },
  });
  if (props.hotkey) offHotkey = onHotkey(props.hotkey, () => (open.value = true));
  if (open.value) controller.open();
});
watch(open, (next) => (next ? controller?.open() : controller?.close()));
onBeforeUnmount(() => {
  controller?.destroy();
  offHotkey?.();
});
const select = (value: string) => {
  open.value = false;
  emit('select', value);
};
</script>

<template>
  <dialog ref="el" aria-label="Command palette" :class="commandDialog()">
    <Command ref="cmd" :options="options" :placeholder="placeholder" :empty-text="emptyText" @select="select">
      <template #icon="slotProps"><slot name="icon" v-bind="slotProps" /></template>
    </Command>
  </dialog>
</template>
