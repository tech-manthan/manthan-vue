<script setup lang="ts">
import { textarea } from '@manthan/base';
import { useFieldAttrs } from '../context';

const props = defineProps<{ resize?: 'none' | 'vertical' | 'auto'; id?: string; disabled?: boolean; required?: boolean }>();
const model = defineModel<string>();
const fieldAttrs = useFieldAttrs(props);
</script>

<template>
  <textarea v-model="model" v-bind="fieldAttrs()" :class="textarea({ resize })" />
</template>
