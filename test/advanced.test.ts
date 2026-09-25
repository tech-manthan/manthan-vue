import { cleanup, fireEvent, render, screen } from '@testing-library/vue';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { Calendar, Combobox, Command, CommandDialog, DatePicker, ToggleGroup, ToggleGroupItem } from '../src/index';

afterEach(cleanup);
const tick = () => new Promise((r) => setTimeout(r, 0));

describe('advanced components', () => {
  it('filters and selects in a Combobox (v-model)', async () => {
    const value = ref<string | null>(null);
    render(
      defineComponent(() => () =>
        h(Combobox, {
          'aria-label': 'Framework',
          options: [
            { value: 'react', label: 'React' },
            { value: 'svelte', label: 'Svelte' },
          ],
          modelValue: value.value,
          'onUpdate:modelValue': (v: unknown) => (value.value = v as string),
        }),
      ),
    );
    const input = screen.getByRole('combobox') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: 'sv' } });
    await tick();
    expect(screen.getAllByRole('option', { hidden: true }).map((o) => o.textContent?.trim())).toEqual(['Svelte']);
    await fireEvent.keyDown(input, { key: 'Enter' });
    await nextTick();
    expect(value.value).toBe('svelte');
    expect(input.value).toBe('Svelte');
  });

  it('emits select from a Command palette', async () => {
    const picked: string[] = [];
    render(defineComponent(() => () => h(Command, { options: [{ value: 'open', label: 'Open file' }, { value: 'save', label: 'Save all' }], onSelect: (v: string) => picked.push(v) })));
    const input = screen.getByRole('combobox');
    await fireEvent.update(input, 'save');
    await tick();
    await fireEvent.keyDown(input, { key: 'Enter' });
    expect(picked).toEqual(['save']);
  });

  it('opens a CommandDialog with its hotkey', async () => {
    render(CommandDialog, { props: { options: [{ value: 'a', label: 'Alpha' }] } });
    await fireEvent.keyDown(document, { key: 'k', metaKey: true });
    await fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    await nextTick();
    expect((document.querySelector('dialog') as HTMLDialogElement).open).toBe(true);
  });

  it('navigates and selects in a Calendar', async () => {
    const value = ref<string | null>('2026-09-25');
    render(defineComponent(() => () => h(Calendar, { locale: 'en-US', weekStartsOn: 1, modelValue: value.value, 'onUpdate:modelValue': (v: unknown) => (value.value = v as string) })));
    const day = screen.getByRole('button', { name: /September 25, 2026/ });
    day.focus();
    await fireEvent.keyDown(day, { key: 'PageDown' });
    await tick();
    expect(screen.getByText('October 2026')).toBeTruthy();
    await fireEvent.click(document.activeElement!);
    expect(value.value).toBe('2026-10-25');
  });

  it('renders a DatePicker value and hidden input', () => {
    const { container } = render(DatePicker, { props: { modelValue: '2026-09-25', locale: 'en-US', name: 'due' } });
    expect(screen.getByRole('button', { name: /Sep 25, 2026/ })).toBeTruthy();
    expect((container.querySelector('input[name=due]') as HTMLInputElement).value).toBe('2026-09-25');
  });

  it('toggles a multiple ToggleGroup', async () => {
    const value = ref<string[]>([]);
    render(
      defineComponent(() => () =>
        h(ToggleGroup, { type: 'multiple', modelValue: value.value, 'onUpdate:modelValue': (v: unknown) => (value.value = v as string[]) }, () => [
          h(ToggleGroupItem, { value: 'b' }, () => 'B'),
          h(ToggleGroupItem, { value: 'i' }, () => 'I'),
        ]),
      ),
    );
    await fireEvent.click(screen.getByRole('button', { name: 'B' }));
    await fireEvent.click(screen.getByRole('button', { name: 'I' }));
    expect(value.value).toEqual(['b', 'i']);
    expect(screen.getByRole('button', { name: 'B' }).getAttribute('aria-pressed')).toBe('true');
  });
});
