<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue';
import { toggleGroup, type Tone } from '@manthan/base';
import { createRovingFocus } from '@manthan/base/dom';
import { ToggleGroupKey } from '../context';

const props = withDefaults(
  defineProps<{
    type?: 'single' | 'multiple';
    variant?: 'segmented' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    tone?: Tone;
    orientation?: 'horizontal' | 'vertical';
    disabled?: boolean;
  }>(),
  { type: 'single', orientation: 'horizontal' },
);
/** `string | null` for single, `string[]` for multiple. */
const model = defineModel<string | null | string[]>({ default: null });
const el = ref<HTMLElement>();
const s = computed(() => toggleGroup({ variant: props.variant, size: props.size, tone: props.tone }));
const list = computed(() => (Array.isArray(model.value) ? model.value : model.value ? [model.value] : []));
let roving: { destroy(): void } | undefined;

provide(ToggleGroupKey, {
  isPressed: (v) => list.value.includes(v),
  toggle: (v) => {
    if (props.type === 'multiple') model.value = list.value.includes(v) ? list.value.filter((x) => x !== v) : [...list.value, v];
    else model.value = model.value === v ? null : v;
  },
  itemClass: computed(() => s.value.item()),
  disabled: computed(() => props.disabled),
});
onMounted(() => (roving = createRovingFocus(el.value!, { selector: 'button', orientation: props.orientation })));
onBeforeUnmount(() => roving?.destroy());
</script>

<template>
  <div ref="el" role="group" :data-orientation="orientation" :class="s.root()"><slot /></div>
</template>
