import { h } from 'vue';
import Button from '../src/components/Button.vue';

export const demos: Record<string, () => ReturnType<typeof h>> = {
  button: () => h(Button, { variant: 'soft', tone: 'primary' }, () => 'Click me'),
};
