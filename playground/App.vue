<script setup lang="ts">
import { ref, watchEffect } from 'vue';
const trend = [31, 33, 32, 36, 35, 38, 41, 40, 43, 44, 46, 48];
const finance = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => ({ month, revenue: 30 + i * 3 + (i % 2) * 2, costs: 22 + i }));
const financeSeries = [{ key: 'revenue', label: 'Revenue' }, { key: 'costs', label: 'Costs' }];
import { Mail, Settings, Trash, User, LogOut } from '@manthan/icons';
import {
  Accordion, AccordionItem, Alert, Avatar, Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Calendar, Chart, Stat, Checkbox, Combobox, CommandDialog, DatePicker, Dialog, designStyles, Field, Heading, Icon, Input, Menu, MenuItem, MenuLabel, MenuSeparator, Pagination, Popover,
  Progress, ProgressCircle, Radio, RadioGroup, Select, Slider, Switch, Tabs, TabsContent, TabsList, TabsTrigger, toast, Toaster, ToggleGroup, ToggleGroupItem, Tooltip,
} from '../src/index';

const params = new URLSearchParams(location.search);
const style = ref(params.get('style') ?? 'default');
const dark = ref(params.get('theme') === 'dark');
const volume = ref(40);
const plan = ref('pro');
const agree = ref(true);
const page = ref(4);
const framework = ref<string | null>('vue');
const due = ref<string | null>(null);
const range = ref<string | null | string[]>('week');
const commands = [
  { value: 'profile', label: 'Profile', group: 'Settings', shortcut: 'mod+p' },
  { value: 'glass', label: 'Switch to Glassmorphism', group: 'Styles' },
];
watchEffect(() => {
  document.documentElement.dataset.mnStyle = style.value;
  document.documentElement.dataset.mnTheme = dark.value ? 'dark' : 'light';
});
</script>

<template>
  <main class="mx-auto flex max-w-5xl flex-col gap-8 p-6">
    <header class="flex flex-wrap items-center gap-3">
      <Heading :level="1" :size="3" class="me-auto">@manthan/vue</Heading>
      <div class="w-44"><Select v-model="style" aria-label="Style" size="sm" :options="designStyles.map((s) => ({ value: s.id, label: s.label }))" /></div>
      <Switch v-model="dark" label="Dark" />
    </header>
    <div class="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>v-model everywhere, native elements underneath.</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <Field label="Email" description="We never share it." required>
            <Input type="email" placeholder="you@example.com"><template #start><Icon :icon="Mail" /></template></Input>
          </Field>
          <RadioGroup v-model="plan" orientation="horizontal">
            <Radio value="hobby" label="Hobby" /><Radio value="pro" label="Pro" /><Radio value="team" label="Team" />
          </RadioGroup>
          <Checkbox v-model="agree" label="I agree to the terms" />
          <Field :label="`Volume: ${volume}`"><Slider v-model="volume" /></Field>
        </CardContent>
        <CardFooter>
          <Button @click="toast.success({ title: 'Account created', description: `Plan: ${plan}` })">Sign up</Button>
          <Button variant="ghost" tone="neutral">Cancel</Button>
        </CardFooter>
      </Card>
      <div class="flex flex-col gap-6">
        <Card>
          <div class="flex flex-wrap items-center gap-3">
            <Dialog title="Delete project?" description="This permanently deletes the project.">
              <template #trigger="{ open }"><Button tone="danger" variant="soft" @click="open"><Icon :icon="Trash" /> Delete</Button></template>
              <template #footer="{ close }">
                <Button variant="surface" tone="neutral" @click="close">Cancel</Button>
                <Button tone="danger" @click="close(); toast.error('Project deleted')">Delete</Button>
              </template>
            </Dialog>
            <Menu>
              <template #trigger><Button variant="surface" tone="neutral"><Icon :icon="User" /> Account</Button></template>
              <MenuLabel>ada@example.com</MenuLabel>
              <MenuItem shortcut="⇧⌘P"><template #icon><Icon :icon="User" /></template>Profile</MenuItem>
              <MenuItem @select="toast.info('Settings')"><template #icon><Icon :icon="Settings" /></template>Settings</MenuItem>
              <MenuSeparator />
              <MenuItem tone="danger"><template #icon><Icon :icon="LogOut" /></template>Log out</MenuItem>
            </Menu>
            <Popover title="Dimensions" description="Anchored with flip & shift.">
              <template #trigger><Button variant="outline">Popover</Button></template>
              <Input size="sm" model-value="100%" aria-label="Width" class="mt-3" />
            </Popover>
            <Tooltip content="Settings"><Button icon-only variant="ghost" aria-label="Settings"><Icon :icon="Settings" /></Button></Tooltip>
          </div>
        </Card>
        <Tabs default-value="overview" variant="segmented">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" class="flex items-center gap-4">
            <ProgressCircle :value="72" size="lg" tone="success" />
            <div class="flex flex-1 flex-col gap-2"><Progress :value="volume" /><Progress indeterminate tone="info" size="sm" /></div>
          </TabsContent>
          <TabsContent value="analytics">Analytics panel</TabsContent>
        </Tabs>
        <Alert tone="success" title="Deployed">Your site is live.</Alert>
        <div class="flex items-center gap-2"><Avatar alt="Grace Hopper" /><Avatar alt="Alan Turing" tone="success" /><Badge>New</Badge></div>
      </div>
    </div>
    <div class="grid gap-6 md:grid-cols-2">
      <Card>
        <Field label="Framework">
          <Combobox v-model="framework" placeholder="Search…" :options="[{ value: 'react', label: 'React', group: 'UI' }, { value: 'vue', label: 'Vue', group: 'UI' }, { value: 'svelte', label: 'Svelte', group: 'UI' }, { value: 'nuxt', label: 'Nuxt', group: 'Meta' }]" />
        </Field>
        <Field label="Due date"><DatePicker v-model="due" name="due" /></Field>
        <ToggleGroup v-model="range" aria-label="Range">
          <ToggleGroupItem value="day">Day</ToggleGroupItem><ToggleGroupItem value="week">Week</ToggleGroupItem><ToggleGroupItem value="month">Month</ToggleGroupItem>
        </ToggleGroup>
        <p class="text-sm text-fg-muted">Selected: {{ framework }} · {{ due ?? 'no date' }} · {{ range }}</p>
      </Card>
      <Card><Calendar v-model="due" /></Card>
    </div>
    <CommandDialog :options="commands" @select="(v) => (v === 'glass' ? (style = 'glass') : toast.info(v))" />
    <Accordion>
      <AccordionItem title="Is it accessible?" default-open>Yes: native elements and WAI-ARIA patterns.</AccordionItem>
      <AccordionItem title="Can I theme it?">Eleven styles plus your own tokens.</AccordionItem>
    </Accordion>
    <Pagination v-model:page="page" :total="12" />
    <Toaster />
    <div class="grid gap-6 md:grid-cols-3">
      <Card><Stat label="Revenue" value="$48.2K" delta="+12.4%" sentiment="positive" caption="vs last month" :trend="trend" /></Card>
      <Card class="md:col-span-2"><Chart type="area" title="Revenue vs costs" :data="finance" x="month" :series="financeSeries" /></Card>
    </div>
  </main>
</template>
