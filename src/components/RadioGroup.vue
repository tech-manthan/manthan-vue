<script setup lang="ts">
import { computed, provide, useId } from 'vue';
import { radioGroup, type Tone } from '@manthan/base';
import { RadioGroupKey } from '../context';

const props = defineProps<{
  name?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  tone?: Tone;
  disabled?: boolean;
}>();
const model = defineModel<string>();
provide(RadioGroupKey, {
  name: props.name ?? `radio-${useId()}`,
  value: model,
  select: (v) => (model.value = v),
  size: computed(() => props.size),
  tone: computed(() => props.tone),
  disabled: computed(() => props.disabled),
});
</script>

<template>
  <div role="radiogroup" :aria-orientation="orientation" :class="radioGroup({ orientation })"><slot /></div>
</template>
