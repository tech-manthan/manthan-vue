<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue';
import { Check, ChevronsUpDown } from '@manthan/icons';
import { combobox, filterOptions, groupOptions, input as inputRecipe, normalizeOption, type OptionInput, type Placement } from '@manthan/base';
import { createCombobox, type ComboboxController } from '@manthan/base/dom';
import { useFieldAttrs } from '../context';
import Icon from './Icon.vue';

const props = withDefaults(
  defineProps<{
    options: OptionInput[];
    size?: 'sm' | 'md' | 'lg';
    placeholder?: string;
    emptyText?: string;
    /** Open the list on focus. */
    openOnFocus?: boolean;
    placement?: Placement;
    id?: string;
    disabled?: boolean;
    required?: boolean;
  }>(),
  { emptyText: 'No results', openOnFocus: true },
);
const model = defineModel<string | null>({ default: null });
const fieldAttrs = useFieldAttrs(props);
const s = combobox();
const listId = useId();
const root = ref<HTMLElement>();
const input = ref<HTMLInputElement>();
const listbox = ref<HTMLElement>();
const query = ref<string | null>(null);
const normalized = computed(() => props.options.map(normalizeOption));
const selectedLabel = computed(() => normalized.value.find((o) => o.value === model.value)?.label ?? '');
const visible = computed(() => (query.value ? filterOptions(normalized.value, query.value) : normalized.value));
let controller: ComboboxController | undefined;

onMounted(() => {
  controller = createCombobox({
    input: input.value!,
    listbox: listbox.value!,
    anchor: root.value!,
    openOnFocus: props.openOnFocus,
    placement: props.placement,
    onSelect: (value) => {
      model.value = value;
      query.value = null;
    },
    onOpenChange: (open) => {
      if (!open) query.value = null;
    },
  });
});
onBeforeUnmount(() => controller?.destroy());
</script>

<template>
  <div ref="root" :class="s.root()">
    <input
      ref="input"
      v-bind="fieldAttrs()"
      :placeholder="placeholder"
      :class="inputRecipe({ size, withEnd: true })"
      :value="query ?? selectedLabel"
      @input="query = ($event.target as HTMLInputElement).value"
    />
    <span :class="s.trigger('pointer-events-none')" aria-hidden="true"><Icon :icon="ChevronsUpDown" /></span>
    <div ref="listbox" :id="listId" popover="manual" :class="s.listbox()">
      <div
        v-for="g in groupOptions(visible)"
        :key="g.group"
        :role="g.group ? 'group' : undefined"
        :aria-label="g.group || undefined"
        :class="s.group()"
      >
        <div v-if="g.group" :class="s.groupLabel()" aria-hidden="true">{{ g.group }}</div>
        <div
          v-for="o in g.options"
          :key="o.value"
          role="option"
          :data-value="o.value"
          :aria-selected="o.value === model"
          :aria-disabled="o.disabled || undefined"
          :class="s.option()"
        >
          {{ o.label }}
          <Icon :icon="Check" :class="s.check()" />
        </div>
      </div>
      <div v-if="visible.length === 0" :class="s.empty()">{{ emptyText }}</div>
    </div>
  </div>
</template>
