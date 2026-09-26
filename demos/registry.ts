import type { Component } from 'vue';
import ButtonDemo from './ButtonDemo.vue';
import InputDemo from './InputDemo.vue';
import DialogDemo from './DialogDemo.vue';
import DataTableDemo from './DataTableDemo.vue';
import ChartDemo from './ChartDemo.vue';

export const demos: Record<string, Component> = {
  button: ButtonDemo,
  input: InputDemo,
  dialog: DialogDemo,
  'data-table': DataTableDemo,
  chart: ChartDemo,
};
