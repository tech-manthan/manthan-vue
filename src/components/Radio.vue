<script setup lang="ts">
import { computed, inject } from 'vue';
import { radio, type Tone } from '@manthan/base';
import { RadioGroupKey } from '../context';

const props = defineProps<{
  value: string;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: Tone;
  disabled?: boolean;
}>();
const group = inject(RadioGroupKey, null);
const s = computed(() => radio({ size: props.size ?? group?.size.value, tone: props.tone ?? group?.tone.value }));
</script>

<template>
  <label :class="s.label()">
    <span :class="s.root()">
      <input
        type="radio"
        :value="value"
        :name="group?.name"
        :checked="group ? group.value.value === value : undefined"
        :disabled="disabled ?? group?.disabled.value"
        :class="s.input()"
        @change="group?.select(value)"
      />
      <span :class="s.control()"><span :class="s.dot()" /></span>
    </span>
    <span v-if="label || description || $slots.default" :class="s.text()">
      <slot>{{ label }}</slot>
      <span v-if="description" :class="s.description()">{{ description }}</span>
    </span>
  </label>
</template>
