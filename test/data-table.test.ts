import { cleanup, fireEvent, render, screen } from '@testing-library/vue';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import { DataTable } from '../src/index';

afterEach(cleanup);
const rows = Array.from({ length: 12 }, (_, i) => ({ id: String(i + 1), name: `User ${i + 1}`, score: (i * 7) % 10 }));

describe('DataTable', () => {
  it('sorts, searches, selects and pages', async () => {
    const selected = ref<string[]>([]);
    render(
      defineComponent(() => () =>
        h(
          DataTable,
          {
            rows,
            pageSize: 5,
            selectable: true,
            selected: selected.value,
            'onUpdate:selected': (v: string[]) => (selected.value = v),
            columns: [
              { key: 'name', header: 'Name' },
              { key: 'score', header: 'Score', align: 'end', searchable: false },
            ],
          },
          { 'cell-score': ({ value }: { value: string }) => h('strong', value) },
        ),
      ),
    );
    const body = () => screen.getAllByRole('row').slice(1);
    expect(body()).toHaveLength(5);
    expect(screen.getByText('1–5 of 12')).toBeTruthy();

    await fireEvent.click(screen.getByRole('button', { name: 'Score' }));
    expect(screen.getByRole('columnheader', { name: 'Score' }).getAttribute('aria-sort')).toBe('ascending');
    expect(body()[0]!.querySelector('strong')!.textContent).toBe('0');

    await fireEvent.update(screen.getByRole('searchbox', { name: 'Search table' }), 'user 1');
    expect(body()).toHaveLength(4);

    await fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows on this page' }));
    expect(selected.value.sort()).toEqual(['1', '10', '11', '12']);
    expect(screen.getByText('4 of 12 selected')).toBeTruthy();

    await fireEvent.update(screen.getByRole('searchbox', { name: 'Search table' }), '');
    await fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('6–10 of 12')).toBeTruthy();
  });
});
