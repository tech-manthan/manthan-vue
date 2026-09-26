<script setup lang="ts">
import { ref } from 'vue';
import Input from '../src/components/Input.vue';
const value = ref('');
</script>

<template>
  <Input v-model="value" placeholder="you@example.com" />
</template>
