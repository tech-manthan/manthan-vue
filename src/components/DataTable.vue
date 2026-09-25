<script setup lang="ts" generic="T">
import { computed, ref } from 'vue';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from '@manthan/icons';
import {
  ariaSort,
  cellAlign,
  dataTable,
  formatCell,
  getSelectionState,
  getTableView,
  nextSort,
  table,
  toggleAll,
  toggleId,
  type ColumnDef,
  type SortState,
} from '@manthan/base';
import Checkbox from './Checkbox.vue';
import Icon from './Icon.vue';
import Input from './Input.vue';
import Pagination from './Pagination.vue';

const props = withDefaults(
  defineProps<{
    columns: ColumnDef<T>[];
    rows: T[];
    getRowId?: (row: T, index: number) => string;
    /** 0 shows every row. */
    pageSize?: number;
    searchable?: boolean;
    searchPlaceholder?: string;
    selectable?: boolean;
    caption?: string;
    emptyText?: string;
    striped?: boolean;
    size?: 'sm' | 'md';
  }>(),
  {
    getRowId: (row: unknown, i: number) => String((row as { id?: unknown }).id ?? i),
    pageSize: 10,
    searchable: true,
    searchPlaceholder: 'Search…',
    emptyText: 'No results.',
  },
);
const selected = defineModel<string[]>('selected', { default: () => [] });
const sort = defineModel<SortState | null>('sort', { default: null });
defineSlots<Record<`cell-${string}`, (props: { row: T; value: string }) => unknown> & { toolbar?(): unknown }>();

const query = ref('');
const page = ref(1);
const s = dataTable();
const t = computed(() => table({ striped: props.striped, size: props.size }));
const ids = computed(() => new Map(props.rows.map((row, i) => [row, props.getRowId(row, i)])));
const view = computed(() => getTableView(props.rows, { columns: props.columns, sort: sort.value, query: query.value, page: page.value, pageSize: props.pageSize }));
const visibleIds = computed(() => view.value.rows.map((r) => ids.value.get(r)!));
const all = computed(() => getSelectionState(visibleIds.value, selected.value));
const summary = computed(() =>
  props.selectable && selected.value.length
    ? `${selected.value.length} of ${props.rows.length} selected`
    : `${view.value.total} ${view.value.total === 1 ? 'row' : 'rows'}`,
);
const onSearch = (value: string | number | undefined) => {
  query.value = String(value ?? '');
  page.value = 1;
};
</script>

<template>
  <div :class="s.root()">
    <div :class="s.toolbar()">
      <Input v-if="searchable" type="search" size="sm" aria-label="Search table" :placeholder="searchPlaceholder" :class="s.search()" :model-value="query" @update:model-value="onSearch">
        <template #start><Icon :icon="Search" /></template>
      </Input>
      <slot name="toolbar" />
      <div :class="s.summary()" aria-live="polite">{{ summary }}</div>
    </div>
    <div :class="t.root()">
      <table :class="t.table()">
        <caption v-if="caption" :class="t.caption()">{{ caption }}</caption>
        <thead :class="t.header()">
          <tr :class="t.row()">
            <th v-if="selectable" :class="t.head(s.selectCell())">
              <Checkbox
                size="sm"
                aria-label="Select all rows on this page"
                :model-value="all === 'all'"
                :indeterminate="all === 'some'"
                @update:model-value="selected = toggleAll(selected, visibleIds)"
              />
            </th>
            <th
              v-for="col in columns"
              :key="col.key"
              scope="col"
              :aria-sort="ariaSort(sort, col.key)"
              :style="col.width ? { width: col.width } : undefined"
              :class="t.head(cellAlign[col.align ?? 'start'])"
            >
              <template v-if="col.sortable === false">{{ col.header }}</template>
              <button v-else type="button" :class="s.sortButton()" @click="sort = nextSort(sort, col.key)">
                {{ col.header }}
                <Icon
                  :icon="sort?.key === col.key ? (sort.direction === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown"
                  :data-active="sort?.key === col.key ? '' : undefined"
                  :class="s.sortIcon()"
                />
              </button>
            </th>
          </tr>
        </thead>
        <tbody :class="t.body()">
          <tr v-if="view.rows.length === 0">
            <td :colspan="columns.length + (selectable ? 1 : 0)" :class="s.empty()">{{ emptyText }}</td>
          </tr>
          <tr v-for="row in view.rows" :key="ids.get(row)" :aria-selected="selectable ? selected.includes(ids.get(row)!) : undefined" :class="t.row()">
            <td v-if="selectable" :class="t.cell(s.selectCell())">
              <Checkbox
                size="sm"
                :aria-label="`Select row ${ids.get(row)}`"
                :model-value="selected.includes(ids.get(row)!)"
                @update:model-value="selected = toggleId(selected, ids.get(row)!)"
              />
            </td>
            <td v-for="col in columns" :key="col.key" :class="t.cell(cellAlign[col.align ?? 'start'])">
              <slot :name="`cell-${col.key}`" :row="row" :value="formatCell(row, col)">{{ formatCell(row, col) }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div :class="s.footer()">
      <span class="tabular-nums">{{ view.total ? `${view.start}–${view.end} of ${view.total}` : '0 results' }}</span>
      <Pagination v-if="view.pageCount > 1" size="sm" :total="view.pageCount" :page="view.page" @update:page="page = $event" />
    </div>
  </div>
</template>
