import { h, ref } from 'vue';
import Button from '../src/components/Button.vue';
import Input from '../src/components/Input.vue';
import Dialog from '../src/components/Dialog.vue';

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
};
