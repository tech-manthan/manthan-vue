<script setup lang="ts">
import { computed, inject } from 'vue';
import { ChevronDown } from '@manthan/icons';
import { accordion } from '@manthan/base';
import { AccordionKey } from '../context';
import Icon from './Icon.vue';

defineProps<{ title?: string; defaultOpen?: boolean }>();
const emit = defineEmits<{ 'update:open': [open: boolean] }>();
const ctx = inject(AccordionKey, null);
const s = computed(() => ctx?.slots.value ?? accordion());
</script>

<template>
  <details
    :name="ctx?.name"
    :open="defaultOpen || undefined"
    :class="s.item()"
    @toggle="emit('update:open', ($event.currentTarget as HTMLDetailsElement).open)"
  >
    <summary :class="s.trigger()">
      <slot name="title">{{ title }}</slot>
      <Icon :icon="ChevronDown" :class="s.icon()" />
    </summary>
    <div :class="s.content()"><slot /></div>
  </details>
</template>
