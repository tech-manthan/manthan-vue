<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Search } from '@manthan/icons';
import { command, filterOptions, formatHotkey, groupOptions, type ListOption } from '@manthan/base';
import { createCombobox, type ComboboxController } from '@manthan/base/dom';
import Icon from './Icon.vue';

const props = withDefaults(
  defineProps<{
    options: ListOption[];
    placeholder?: string;
    emptyText?: string;
    /** Keyboard hints under the list. */
    footer?: boolean;
  }>(),
  { placeholder: 'Type a command or search…', emptyText: 'No results found.', footer: true },
);
const emit = defineEmits<{ select: [value: string] }>();
defineSlots<{ icon?(props: { option: ListOption }): unknown }>();
const s = command();
const query = ref('');
const input = ref<HTMLInputElement>();
const list = ref<HTMLElement>();
const visible = computed(() => filterOptions(props.options, query.value));
let controller: ComboboxController | undefined;

onMounted(() => {
  controller = createCombobox({ input: input.value!, listbox: list.value!, inline: true, onSelect: (v) => emit('select', v) });
});
onBeforeUnmount(() => controller?.destroy());
defineExpose({ reset: () => (query.value = '') });
</script>

<template>
  <div :class="s.root()">
    <div :class="s.inputWrap()">
      <Icon :icon="Search" />
      <input ref="input" v-model="query" :aria-label="placeholder" :placeholder="placeholder" :class="s.input()" />
    </div>
    <div ref="list" :class="s.list()">
      <div v-for="g in groupOptions(visible)" :key="g.group" :role="g.group ? 'group' : undefined" :aria-label="g.group || undefined">
        <div v-if="g.group" :class="s.groupLabel()" aria-hidden="true">{{ g.group }}</div>
        <div v-for="o in g.options" :key="o.value" role="option" :data-value="o.value" :aria-disabled="o.disabled || undefined" :class="s.item()">
          <slot name="icon" :option="o" />
          <span class="flex min-w-0 flex-col">
            {{ o.label }}
            <span v-if="o.description" :class="s.itemDescription()">{{ o.description }}</span>
          </span>
          <span v-if="o.shortcut" :class="s.shortcut()">{{ formatHotkey(o.shortcut) }}</span>
        </div>
      </div>
      <div v-if="visible.length === 0" :class="s.empty()">{{ emptyText }}</div>
    </div>
    <div v-if="footer" :class="s.footer()"><span>↑↓ navigate</span><span>↵ select</span><span>esc close</span></div>
  </div>
</template>
