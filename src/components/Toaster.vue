<script setup lang="ts">
import { onBeforeUnmount, shallowRef } from 'vue';
import { X } from '@manthan/icons';
import { button, closeButton, spinner, toast as defaultToaster, toastRecipe, type ToastStore } from '@manthan/base';
import { toastIcons } from '@manthan/base/dom';
import Icon from './Icon.vue';

const props = withDefaults(
  defineProps<{
    toaster?: ToastStore;
    placement?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    label?: string;
  }>(),
  { placement: 'bottom-right', label: 'Notifications' },
);
const store = props.toaster ?? defaultToaster;
const toasts = shallowRef(store.getSnapshot());
const unsubscribe = store.subscribe(() => (toasts.value = store.getSnapshot()));
onBeforeUnmount(unsubscribe);
</script>

<template>
  <section
    :aria-label="label"
    aria-live="polite"
    :class="toastRecipe({ placement }).region()"
    @pointerenter="store.pause()"
    @pointerleave="store.resume()"
  >
    <div
      v-for="t in toasts"
      :key="t.id"
      :role="t.tone === 'danger' ? 'alert' : 'status'"
      :data-state="t.state"
      :class="toastRecipe({ placement, tone: t.tone }).root()"
    >
      <span v-if="t.loading" :class="spinner({ size: 'sm', class: 'mt-0.5 text-accent-11' })" aria-hidden="true" />
      <Icon
        v-else-if="t.icon !== false && t.tone && toastIcons[t.tone]"
        :icon="toastIcons[t.tone]!"
        :class="toastRecipe({ placement, tone: t.tone }).icon()"
      />
      <div :class="toastRecipe().content()">
        <div v-if="t.title" :class="toastRecipe().title()">{{ t.title }}</div>
        <div v-if="t.description" :class="toastRecipe().description()">{{ t.description }}</div>
        <div v-if="t.action" :class="toastRecipe().actions()">
          <button
            type="button"
            :class="button({ size: 'xs', variant: 'soft' })"
            @click="
              t.action.onClick();
              store.dismiss(t.id);
            "
          >
            {{ t.action.label }}
          </button>
        </div>
      </div>
      <button type="button" aria-label="Dismiss notification" :class="closeButton({ class: toastRecipe().close() })" @click="store.dismiss(t.id)">
        <Icon :icon="X" />
      </button>
    </div>
  </section>
</template>
