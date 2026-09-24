<script setup lang="ts">
import { inject } from 'vue';
import { menu } from '@manthan/base';
import { MenuKey } from '../context';
const s = inject(MenuKey, menu());
</script>

<template>
  <div :class="s.label()"><slot /></div>
</template>
