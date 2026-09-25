import { cleanup, fireEvent, render, screen } from '@testing-library/vue';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { Chart, Stat } from '../src/index';

afterEach(cleanup);
const data = [
  { m: 'Jan', a: 3, b: 1 },
  { m: 'Feb', a: 5, b: 2 },
];
const series = [
  { key: 'a', label: 'Alpha' },
  { key: 'b', label: 'Beta' },
];

describe('Chart', () => {
  it('renders, toggles series with v-model:hidden and reacts to props', async () => {
    const hidden = ref<string[]>([]);
    const type = ref<'bar' | 'line'>('bar');
    const { container } = render(
      defineComponent(() => () =>
        h(Chart, { type: type.value, title: 'Sales', data, x: 'm', series, hidden: hidden.value, 'onUpdate:hidden': (v: string[]) => (hidden.value = v) }),
      ),
    );
    expect(screen.getByRole('img', { name: 'Sales' })).toBeTruthy();
    expect(container.querySelectorAll('.mn-chart-bar')).toHaveLength(4);
    await fireEvent.click(screen.getByRole('button', { name: 'Beta' }));
    expect(hidden.value).toEqual(['b']);
    expect(container.querySelectorAll('.mn-chart-bar')).toHaveLength(2);
    type.value = 'line';
    await nextTick();
    expect(container.querySelectorAll('.mn-chart-line')).toHaveLength(1);
  });

  it('renders a stat tile with a sparkline', () => {
    const { container } = render(Stat, { props: { label: 'Revenue', value: '$4.2K', delta: '-3%', sentiment: 'negative', caption: 'vs last week', trend: [1, 3, 2] } });
    expect(screen.getByText('$4.2K')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Revenue trend' })).toBeTruthy();
    expect(container.querySelector('.mn-chart-area')).toBeTruthy();
  });
});
