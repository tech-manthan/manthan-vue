import { h, ref } from 'vue';
import Button from '../src/components/Button.vue';
import Input from '../src/components/Input.vue';
import Dialog from '../src/components/Dialog.vue';
import DataTable from '../src/components/DataTable.vue';
import Chart from '../src/components/Chart.vue';

const rows = [
  { id: 'INV-1001', customer: 'Ada Lovelace', status: 'Paid' },
  { id: 'INV-1002', customer: 'Alan Turing', status: 'Pending' },
  { id: 'INV-1003', customer: 'Grace Hopper', status: 'Overdue' },
];
const columns = [
  { key: 'id', header: 'Invoice' },
  { key: 'customer', header: 'Customer' },
  { key: 'status', header: 'Status' },
];
const chartData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => ({ month, revenue: 30 + i * 3 }));
const chartSeries = [{ key: 'revenue', label: 'Revenue' }];

export const demos: Record<string, () => ReturnType<typeof h>> = {
  button: () => h(Button, { variant: 'soft', tone: 'primary' }, () => 'Click me'),
  input: () => {
    const value = ref('');
    return h(Input, { modelValue: value.value, 'onUpdate:modelValue': (v: string | number) => (value.value = v), placeholder: 'you@example.com' });
  },
  dialog: () =>
    h(
      Dialog,
      { title: 'Delete project?', description: 'This permanently deletes the project.' },
      {
        trigger: ({ open }: { open: () => void }) => h(Button, { onClick: open }, () => 'Open'),
        default: () => 'Are you sure?',
      },
    ),
  'data-table': () => h(DataTable, { columns, rows, pageSize: 3 }),
  chart: () => h(Chart, { type: 'area', data: chartData, x: 'month', series: chartSeries, height: 200 }),
};
