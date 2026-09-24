<script setup lang="ts">
import { inject } from 'vue';
import { card } from '@manthan/base';
import { CardKey } from '../context';

const slots = inject(CardKey, null);
</script>

<template>
  <p :class="(slots ?? card()).description()"><slot /></p>
</template>
