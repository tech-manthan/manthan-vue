import { h, ref } from 'vue';
import Button from '../src/components/Button.vue';
import Input from '../src/components/Input.vue';

export const demos: Record<string, () => ReturnType<typeof h>> = {
  button: () => h(Button, { variant: 'soft', tone: 'primary' }, () => 'Click me'),
  input: () => {
    const value = ref('');
    return h(Input, { modelValue: value.value, 'onUpdate:modelValue': (v: string | number) => (value.value = v), placeholder: 'you@example.com' });
  },
};
