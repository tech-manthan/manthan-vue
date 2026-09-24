<script setup lang="ts">
import { buttonGroup } from '@manthan/base';
defineProps<{ attached?: boolean }>();
</script>

<template>
  <div role="group" :class="buttonGroup({ attached })"><slot /></div>
</template>
