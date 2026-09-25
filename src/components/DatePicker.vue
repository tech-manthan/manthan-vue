<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Calendar as CalendarIcon } from '@manthan/icons';
import { datePicker, formatDate, type ISODate, type Placement } from '@manthan/base';
import { createPopover, type PopoverController } from '@manthan/base/dom';
import { useFieldAttrs } from '../context';
import Calendar from './Calendar.vue';
import Icon from './Icon.vue';

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    /** Form field name; a hidden input carries the ISO value. */
    name?: string;
    min?: ISODate;
    max?: ISODate;
    isDateDisabled?: (date: ISODate) => boolean;
    locale?: string;
    weekStartsOn?: number;
    format?: Intl.DateTimeFormatOptions;
    placement?: Placement;
    size?: 'sm' | 'md' | 'lg';
    id?: string;
    disabled?: boolean;
    required?: boolean;
  }>(),
  { placeholder: 'Pick a date', placement: 'bottom-start' },
);
const model = defineModel<ISODate | null>({ default: null });
const fieldAttrs = useFieldAttrs(props);
const s = computed(() => datePicker({ size: props.size }));
const trigger = ref<HTMLButtonElement>();
const content = ref<HTMLElement>();
const open = ref(false);
let controller: PopoverController | undefined;

onMounted(() => {
  controller = createPopover({
    trigger: trigger.value!,
    content: content.value!,
    placement: props.placement,
    autoFocus: false,
    onOpenChange: (next) => (open.value = next),
  });
});
onBeforeUnmount(() => controller?.destroy());
const choose = (value: ISODate | null) => {
  model.value = value;
  controller?.close();
};
</script>

<template>
  <button ref="trigger" type="button" v-bind="fieldAttrs()" :class="s.trigger()">
    <Icon :icon="CalendarIcon" />
    <span :class="model ? s.value() : s.placeholder()">{{ model ? formatDate(model, locale, format) : placeholder }}</span>
  </button>
  <div ref="content" popover="auto" aria-label="Choose date" :class="s.content()">
    <Calendar
      v-if="open"
      auto-focus
      :model-value="model"
      :min="min"
      :max="max"
      :is-date-disabled="isDateDisabled"
      :locale="locale"
      :week-starts-on="weekStartsOn"
      @update:model-value="choose"
    />
  </div>
  <input v-if="name" type="hidden" :name="name" :value="model ?? ''" />
</template>
