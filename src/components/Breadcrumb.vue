<script setup lang="ts">
import { ChevronRight } from '@manthan/icons';
import { breadcrumb } from '@manthan/base';
import Icon from './Icon.vue';

defineProps<{ items: Array<{ label: string; href?: string }> }>();
const s = breadcrumb();
</script>

<template>
  <nav aria-label="Breadcrumb" :class="s.root()">
    <ol :class="s.list()">
      <li v-for="(item, i) in items" :key="i" :class="s.item()">
        <span v-if="i === items.length - 1 || !item.href" :aria-current="i === items.length - 1 ? 'page' : undefined" :class="i === items.length - 1 ? s.page() : undefined">{{ item.label }}</span>
        <a v-else :href="item.href" :class="s.link()">{{ item.label }}</a>
        <span v-if="i < items.length - 1" role="presentation" aria-hidden="true" :class="s.separator()">
          <slot name="separator"><Icon :icon="ChevronRight" /></slot>
        </span>
      </li>
    </ol>
  </nav>
</template>
