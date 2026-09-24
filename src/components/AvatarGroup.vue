<script setup lang="ts">
import { avatarGroup } from '@manthan/base';
</script>

<template>
  <div :class="avatarGroup()"><slot /></div>
</template>
