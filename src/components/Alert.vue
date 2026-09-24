<script setup lang="ts">
import { computed } from 'vue';
import type { IconNode } from '@manthan/icons';
import { alert, type Tone } from '@manthan/base';
import { toastIcons } from '@manthan/base/dom';
import Icon from './Icon.vue';

const props = withDefaults(
  defineProps<{
    tone?: Tone;
    variant?: 'soft' | 'surface' | 'outline' | 'solid';
    title?: string;
    /** Custom icon, or `false` to hide it. */
    icon?: IconNode | false;
  }>(),
  { tone: 'info', icon: undefined },
);
const s = computed(() => alert({ tone: props.tone, variant: props.variant }));
const node = computed(() => (props.icon === false ? undefined : (props.icon ?? toastIcons[props.tone])));
</script>

<template>
  <div role="alert" :class="s.root()">
    <Icon v-if="node" :icon="node" :class="s.icon()" />
    <div :class="s.content()">
      <div v-if="title || $slots.title" :class="s.title()"><slot name="title">{{ title }}</slot></div>
      <div v-if="$slots.default" :class="s.description()"><slot /></div>
    </div>
  </div>
</template>
