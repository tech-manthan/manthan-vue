<script setup lang="ts">
import { inject } from 'vue';
import { card } from '@manthan/base';
import { CardKey } from '../context';

const slots = inject(CardKey, null);
</script>

<template>
  <h3 :class="(slots ?? card()).title()"><slot /></h3>
</template>
