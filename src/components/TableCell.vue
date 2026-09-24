<script setup lang="ts">
import { inject } from 'vue';
import { table } from '@manthan/base';
import { TableKey } from '../context';

const slots = inject(TableKey, null);
</script>

<template>
  <td :class="(slots ?? table()).cell()"><slot /></td>
</template>
