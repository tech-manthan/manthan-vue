import { cleanup, fireEvent, render, screen } from '@testing-library/vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { Button, Checkbox, Field, FileUpload, Input, rules, useForm } from '../src/index';

afterEach(cleanup);
const tick = () => new Promise((r) => setTimeout(r, 0));

describe('useForm', () => {
  it('validates on blur and submit, then submits valid values', async () => {
    const onSubmit = vi.fn();
    render(
      defineComponent(() => {
        const form = useForm({
          initialValues: { email: '', terms: false },
          rules: { email: [rules.required('Enter your email.'), rules.email()], terms: rules.required('Accept the terms.') },
          onSubmit,
        });
        return () =>
          h('form', { onSubmit: form.handleSubmit }, [
            h(Field, { label: 'Email', error: form.errors.value.email }, () => h(Input, form.register('email'))),
            h(Checkbox, { label: 'I agree', ...form.register('terms') }),
            form.errors.value.terms ? h('p', form.errors.value.terms) : null,
            h(Button, { type: 'submit' }, () => 'Send'),
          ]);
      }),
    );
    const email = screen.getByLabelText('Email');
    await fireEvent.update(email, 'nope');
    expect(screen.queryByText(/valid email/)).toBeNull();
    await fireEvent.blur(email);
    expect(screen.getByText(/valid email/)).toBeTruthy();
    expect(email.getAttribute('aria-invalid')).toBe('true');

    await fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    await tick();
    expect(screen.getByText('Accept the terms.')).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();

    await fireEvent.update(email, 'ada@example.com');
    await fireEvent.click(screen.getByLabelText('I agree'));
    await fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    await tick();
    expect(onSubmit).toHaveBeenCalledWith({ email: 'ada@example.com', terms: true });
  });
});

describe('FileUpload', () => {
  it('accepts, rejects and removes files', async () => {
    const changes: File[][] = [];
    render(FileUpload, { props: { multiple: true, accept: '.pdf', 'onUpdate:modelValue': (f: File[]) => changes.push(f) } });
    const zone = screen.getByRole('button', { name: /Drop files here/ });
    const drop = new Event('drop', { bubbles: true, cancelable: true }) as Event & { dataTransfer: unknown };
    drop.dataTransfer = { files: [new File(['1'], 'a.pdf', { type: 'application/pdf' }), new File(['2'], 'b.png', { type: 'image/png' })], types: ['Files'] };
    zone.dispatchEvent(drop);
    await nextTick();
    expect(changes.at(-1)!.map((f) => f.name)).toEqual(['a.pdf']);
    expect(screen.getByRole('alert').textContent).toContain("b.png: this file type isn't allowed.");
    await fireEvent.click(screen.getByRole('button', { name: 'Remove a.pdf' }));
    expect(changes.at(-1)).toEqual([]);
  });
});
