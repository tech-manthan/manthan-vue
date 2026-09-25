<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { File as FileIcon, Upload, X } from '@manthan/icons';
import { closeButton, fileUpload, formatBytes, validateFiles, type FileRejection } from '@manthan/base';
import { createDropzone, setInputFiles } from '@manthan/base/dom';
import { useFieldAttrs } from '../context';
import Icon from './Icon.vue';

const props = withDefaults(
  defineProps<{
    /** Same syntax as `<input accept>`, e.g. `".pdf,image/*"`. */
    accept?: string;
    multiple?: boolean;
    /** Bytes. */
    maxSize?: number;
    maxFiles?: number;
    /** Posts the files with the surrounding form. */
    name?: string;
    label?: string;
    hint?: string;
    size?: 'sm' | 'md';
    id?: string;
    disabled?: boolean;
  }>(),
  { label: 'Drop files here, or click to browse' },
);
const emit = defineEmits<{ reject: [rejections: FileRejection<File>[]] }>();
const files = defineModel<File[]>({ default: () => [] });
const fieldAttrs = useFieldAttrs(props);
const s = computed(() => fileUpload({ size: props.size }));
const zone = ref<HTMLElement>();
const input = ref<HTMLInputElement>();
const errors = ref<string[]>([]);
let cleanup: (() => void) | undefined;

const add = (incoming: File[]) => {
  const { accepted, rejected } = validateFiles(incoming, {
    accept: props.accept,
    maxSize: props.maxSize,
    maxFiles: props.multiple ? props.maxFiles : 1,
    existing: props.multiple ? files.value.length : 0,
  });
  errors.value = rejected.map((r) => r.message);
  if (rejected.length) emit('reject', rejected);
  if (accepted.length) files.value = props.multiple ? [...files.value, ...accepted] : accepted;
};
onMounted(() => (cleanup = createDropzone({ zone: zone.value!, input: input.value!, onFiles: add })));
onBeforeUnmount(() => cleanup?.());
watch(files, (next) => input.value && setInputFiles(input.value, next));
</script>

<template>
  <div :class="s.root()">
    <div
      ref="zone"
      :id="fieldAttrs().id"
      :aria-label="label"
      :aria-describedby="fieldAttrs()['aria-describedby']"
      :aria-disabled="disabled || fieldAttrs().disabled || undefined"
      :aria-invalid="errors.length > 0 || fieldAttrs()['aria-invalid'] || undefined"
      :class="s.dropzone()"
    >
      <span :class="s.icon()"><Icon :icon="Upload" /></span>
      <p :class="s.title()">{{ label }}</p>
      <p v-if="hint" :class="s.hint()">{{ hint }}</p>
    </div>
    <input ref="input" type="file" class="sr-only" tabindex="-1" aria-hidden="true" :name="name" :accept="accept" :multiple="multiple" :disabled="disabled" />
    <div v-if="errors.length" role="alert" :class="s.errors()">
      <p v-for="e in errors" :key="e">{{ e }}</p>
    </div>
    <ul v-if="files.length" :class="s.list()">
      <li v-for="(file, i) in files" :key="`${file.name}-${i}`" :class="s.item()">
        <span :class="s.itemIcon()"><Icon :icon="FileIcon" /></span>
        <div :class="s.itemBody()">
          <span :class="s.itemName()">{{ file.name }}</span>
          <span :class="s.itemMeta()">{{ formatBytes(file.size) }}</span>
        </div>
        <button type="button" :aria-label="`Remove ${file.name}`" :class="closeButton()" @click="files = files.filter((_, j) => j !== i)">
          <Icon :icon="X" />
        </button>
      </li>
    </ul>
  </div>
</template>
