import { fireEvent, render, screen, cleanup } from '@testing-library/vue';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import {
  Alert,
  Button,
  Checkbox,
  createToaster,
  Dialog,
  Field,
  Input,
  Pagination,
  Radio,
  RadioGroup,
  Slider,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
} from '../src/index';

afterEach(cleanup);

describe('@manthan/vue', () => {
  it('renders buttons from the shared recipe', () => {
    render(Button, { props: { variant: 'soft', tone: 'danger', loading: true }, slots: { default: 'Delete' } });
    const btn = screen.getByRole('button', { name: 'Delete' });
    expect(btn.className).toContain('mn-btn-soft');
    expect(btn.className).toContain('tone-danger');
    expect(btn.getAttribute('aria-busy')).toBe('true');
  });

  it('wires Field to its control and supports v-model', async () => {
    const value = ref('');
    render(
      defineComponent(() => () =>
        h(Field, { label: 'Email', error: 'Required', required: true }, () =>
          h(Input, { type: 'email', modelValue: value.value, 'onUpdate:modelValue': (v: unknown) => (value.value = v as string) }),
        ),
      ),
    );
    const input = screen.getByLabelText('Email');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toContain('error');
    await fireEvent.update(input, 'ada@example.com');
    expect(value.value).toBe('ada@example.com');
  });

  it('handles checkbox, radio and slider models', async () => {
    const checked = ref(false);
    const plan = ref('a');
    const volume = ref(20);
    render(
      defineComponent(() => () => [
        h(Checkbox, { label: 'Accept', modelValue: checked.value, 'onUpdate:modelValue': (v: boolean) => (checked.value = v) }),
        h(RadioGroup, { modelValue: plan.value, 'onUpdate:modelValue': (v: unknown) => (plan.value = v as string) }, () => [
          h(Radio, { value: 'a', label: 'A' }),
          h(Radio, { value: 'b', label: 'B' }),
        ]),
        h(Slider, { 'aria-label': 'Volume', max: 200, modelValue: volume.value, 'onUpdate:modelValue': (v: number) => (volume.value = v) }),
      ]),
    );
    await fireEvent.click(screen.getByLabelText('Accept'));
    expect(checked.value).toBe(true);
    await fireEvent.click(screen.getByLabelText('B'));
    expect(plan.value).toBe('b');
    const slider = screen.getByLabelText('Volume') as HTMLInputElement;
    expect(slider.style.getPropertyValue('--mn-fill')).toBe('10%');
  });

  it('switches tabs with arrow keys', async () => {
    render(
      defineComponent(() => () =>
        h(Tabs, { defaultValue: 'one' }, () => [
          h(TabsList, () => [h(TabsTrigger, { value: 'one' }, () => 'One'), h(TabsTrigger, { value: 'two' }, () => 'Two')]),
          h(TabsContent, { value: 'one' }, () => 'First'),
          h(TabsContent, { value: 'two' }, () => 'Second'),
        ]),
      ),
    );
    expect(screen.getByRole('tab', { name: 'One' }).getAttribute('aria-selected')).toBe('true');
    const one = screen.getByRole('tab', { name: 'One' });
    one.focus();
    await fireEvent.keyDown(one, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Two' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('Second').hidden).toBe(false);
  });

  it('opens a dialog through its trigger slot', async () => {
    render(Dialog, {
      props: { title: 'Edit' },
      slots: { trigger: '<template #trigger="{ open }"><button @click="open">Open</button></template>', default: 'Body' },
    });
    await fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    await nextTick();
    expect((document.querySelector('dialog') as HTMLDialogElement).open).toBe(true);
  });

  it('paginates with v-model:page', async () => {
    const page = ref(5);
    render(defineComponent(() => () => h(Pagination, { total: 10, page: page.value, 'onUpdate:page': (p: number) => (page.value = p) })));
    expect(screen.getByRole('button', { name: 'Page 5' }).getAttribute('aria-current')).toBe('page');
    await fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(page.value).toBe(6);
  });

  it('renders toasts and alerts', async () => {
    const store = createToaster();
    render(defineComponent(() => () => [h(Toaster, { toaster: store }), h(Alert, { tone: 'warning', title: 'Careful' }, () => 'Details')]));
    store.success({ title: 'Saved', description: 'All good' });
    await nextTick();
    expect(screen.getByRole('status').textContent).toContain('All good');
    expect(screen.getByRole('alert').textContent).toContain('Careful');
  });
});
