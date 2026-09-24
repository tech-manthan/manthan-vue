<script setup lang="ts">
import { inject } from 'vue';
import { card } from '@manthan/base';
import { CardKey } from '../context';

const slots = inject(CardKey, null);
</script>

<template>
  <div :class="(slots ?? card()).header()"><slot /></div>
</template>
