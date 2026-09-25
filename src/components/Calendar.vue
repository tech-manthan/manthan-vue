<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { ChevronLeft, ChevronRight } from '@manthan/icons';
import {
  addMonths,
  calendar,
  clampToEnabled,
  compareISO,
  formatDate,
  formatMonthYear,
  getCalendarKeyTarget,
  getCalendarWeeks,
  getWeekdayNames,
  getWeekStart,
  isDateDisabled,
  startOfMonth,
  todayISO,
  type ISODate,
  type Tone,
} from '@manthan/base';
import Icon from './Icon.vue';

const props = defineProps<{
  min?: ISODate;
  max?: ISODate;
  isDateDisabled?: (date: ISODate) => boolean;
  locale?: string;
  /** 0 = Sunday … 6 = Saturday. Defaults to the locale's convention. */
  weekStartsOn?: number;
  size?: 'sm' | 'md' | 'lg';
  tone?: Tone;
  /** Focus the selected (or today's) day on mount. */
  autoFocus?: boolean;
}>();
const model = defineModel<ISODate | null>({ default: null });
const constraints = computed(() => ({ min: props.min, max: props.max, isDateDisabled: props.isDateDisabled }));
const focused = ref<ISODate>(model.value ?? clampToEnabled(todayISO(), 1, constraints.value) ?? todayISO());
const month = ref(startOfMonth(focused.value));
const grid = ref<HTMLTableElement>();
const weekStart = computed(() => props.weekStartsOn ?? getWeekStart(props.locale));
const s = computed(() => calendar({ size: props.size, tone: props.tone }));
const weeks = computed(() => getCalendarWeeks(month.value, { weekStartsOn: weekStart.value }));
const weekdays = computed(() => getWeekdayNames({ locale: props.locale, weekStartsOn: weekStart.value, format: 'narrow' }));
const prevDisabled = computed(() => !!props.min && compareISO(month.value, startOfMonth(props.min)) <= 0);
const nextDisabled = computed(() => !!props.max && compareISO(addMonths(month.value, 1), props.max) > 0);

const focusDay = async () => {
  await nextTick();
  grid.value?.querySelector<HTMLElement>(`[data-date="${focused.value}"]`)?.focus();
};
watch(model, (value) => {
  if (!value) return;
  focused.value = value;
  month.value = startOfMonth(value);
});
onMounted(() => props.autoFocus && focusDay());

const goMonth = (delta: number) => {
  month.value = addMonths(month.value, delta);
  focused.value = month.value;
};
const onKeydown = (event: KeyboardEvent) => {
  const date = (event.target as HTMLElement).dataset.date;
  if (!date) return;
  const dir = getComputedStyle(event.currentTarget as Element).direction === 'rtl' ? 'rtl' : 'ltr';
  const target = getCalendarKeyTarget(event.key, date, { weekStartsOn: weekStart.value, shiftKey: event.shiftKey, dir });
  if (!target) return;
  event.preventDefault();
  focused.value = clampToEnabled(target, compareISO(target, date) >= 0 ? 1 : -1, constraints.value) ?? date;
  month.value = startOfMonth(focused.value);
  focusDay();
};
const choose = (date: ISODate) => {
  model.value = date;
  focused.value = date;
};
</script>

<template>
  <div :class="s.root()">
    <div :class="s.header()">
      <button type="button" :class="s.nav()" aria-label="Previous month" :disabled="prevDisabled" @click="goMonth(-1)"><Icon :icon="ChevronLeft" /></button>
      <div :class="s.title()" aria-live="polite">{{ formatMonthYear(month, locale) }}</div>
      <button type="button" :class="s.nav()" aria-label="Next month" :disabled="nextDisabled" @click="goMonth(1)"><Icon :icon="ChevronRight" /></button>
    </div>
    <table ref="grid" role="grid" :aria-label="formatMonthYear(month, locale)" :class="s.grid()" @keydown="onKeydown">
      <thead>
        <tr>
          <th v-for="w in weekdays" :key="w.long" scope="col" :abbr="w.long" :class="s.weekday()">{{ w.short }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="week in weeks" :key="week[0]!.date">
          <td v-for="day in week" :key="day.date" :class="s.cell()" :aria-selected="day.date === model || undefined">
            <button
              type="button"
              :data-date="day.date"
              :data-outside="day.inMonth ? undefined : ''"
              :data-today="day.isToday ? '' : undefined"
              :aria-current="day.isToday ? 'date' : undefined"
              :data-selected="day.date === model ? '' : undefined"
              :aria-label="formatDate(day.date, locale, { dateStyle: 'full' })"
              :tabindex="day.date === focused ? 0 : -1"
              :disabled="isDateDisabled(day.date, constraints)"
              :class="s.day()"
              @click="choose(day.date)"
            >
              {{ day.day }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
