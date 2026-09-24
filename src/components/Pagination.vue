<script setup lang="ts">
import { computed } from 'vue';
import { ChevronLeft, ChevronRight, MoreHorizontal } from '@manthan/icons';
import { getPaginationItems, pagination } from '@manthan/base';
import Icon from './Icon.vue';

const props = withDefaults(
  defineProps<{
    total: number;
    siblings?: number;
    boundaries?: number;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'ghost' | 'outline';
    getPageLabel?: (page: number) => string;
  }>(),
  { getPageLabel: (p: number) => `Page ${p}` },
);
const page = defineModel<number>('page', { default: 1 });
const s = computed(() => pagination({ size: props.size, variant: props.variant }));
const items = computed(() =>
  getPaginationItems({ page: page.value, total: props.total, siblings: props.siblings, boundaries: props.boundaries }),
);
</script>

<template>
  <nav aria-label="Pagination" :class="s.root()">
    <ul :class="s.list()">
      <li>
        <button type="button" :class="s.item()" :disabled="page <= 1" aria-label="Previous page" @click="page--"><Icon :icon="ChevronLeft" /></button>
      </li>
      <template v-for="item in items" :key="item">
        <li v-if="typeof item === 'number'">
          <button type="button" :class="s.item()" :aria-current="item === page ? 'page' : undefined" :aria-label="getPageLabel(item)" @click="page = item">{{ item }}</button>
        </li>
        <li v-else :class="s.ellipsis()" aria-hidden="true"><Icon :icon="MoreHorizontal" :size="16" /></li>
      </template>
      <li>
        <button type="button" :class="s.item()" :disabled="page >= total" aria-label="Next page" @click="page++"><Icon :icon="ChevronRight" /></button>
      </li>
    </ul>
  </nav>
</template>
