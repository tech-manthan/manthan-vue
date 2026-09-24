<script setup lang="ts">
import { computed } from 'vue';
import { switchRecipe, type Tone } from '@manthan/base';
import { useFieldAttrs } from '../context';

const props = defineProps<{
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: Tone;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
}>();
const model = defineModel<boolean>({ default: false });
const fieldAttrs = useFieldAttrs(props);
const s = computed(() => switchRecipe({ size: props.size, tone: props.tone }));
</script>

<template>
  <component :is="label || $slots.default ? 'label' : 'span'" :class="s.label()">
    <span :class="s.root()">
      <input v-model="model" type="checkbox" role="switch" :name="name" v-bind="fieldAttrs()" :class="s.input()" />
      <span :class="s.track()"><span :class="s.thumb()" /></span>
    </span>
    <slot>{{ label }}</slot>
  </component>
</template>
