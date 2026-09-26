import './style.css';
import { createApp, h } from 'vue';
import { demos } from './registry';

const slug = new URLSearchParams(location.search).get('c');
const Demo = slug ? demos[slug] : undefined;

createApp({
  render: () => (Demo ? h(Demo) : h('p', `Demo not found for "${slug}".`)),
}).mount('#app');
