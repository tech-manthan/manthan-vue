<script setup lang="ts">
import Button from '../src/components/Button.vue';
import Dialog from '../src/components/Dialog.vue';
</script>

<template>
  <Dialog title="Delete project?" description="This permanently deletes the project.">
    <template #trigger="{ open }">
      <Button @click="open">Open</Button>
    </template>
    Are you sure?
  </Dialog>
</template>
