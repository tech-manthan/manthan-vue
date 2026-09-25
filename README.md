# @manthan/vue

[Manthan UI](https://github.com/tech-manthan/manthan-base) for **Vue 3.5**: accessible components in **11 design styles**, styled with **Tailwind CSS v4**. Every input supports `v-model`.

```bash
npm i @manthan/vue @manthan/base @manthan/icons tailwindcss
```

```css
/* main.css */
@import 'tailwindcss';
@import '@manthan/vue/theme.css';
```

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Dialog, Field, Input, Icon, Toaster, toast } from '@manthan/vue';
import { Mail } from '@manthan/icons';
const email = ref('');
</script>

<template>
  <Field label="Email" :error="email ? undefined : 'Required'">
    <Input v-model="email" type="email"><template #start><Icon :icon="Mail" /></template></Input>
  </Field>

  <Dialog title="Delete project?">
    <template #trigger="{ open }"><Button tone="danger" @click="open">Delete</Button></template>
    This cannot be undone.
    <template #footer="{ close }"><Button @click="close">Cancel</Button></template>
  </Dialog>

  <Button @click="toast.success('Saved')">Save</Button>
  <Toaster />
</template>
```

Set the style on `<html data-mn-style="neu" data-mn-theme="dark">`: `default`, `glass`, `neu`, `brutal`, `material`, `fluent`, `clay`, `retro`, `neon`, `minimal`, `skeuo`.

## Components

| Group | Components |
| --- | --- |
| Actions | `Button`, `ButtonGroup` |
| Forms | `Field`, `Input` (`#start` / `#end`), `Textarea`, `Select`, `Checkbox`, `RadioGroup` + `Radio`, `Switch`, `Slider` |
| Display | `Card` (+ `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`), `Badge`, `Avatar`, `AvatarGroup`, `Table` (+ parts), `Kbd`, `Separator`, `Heading`, `Icon` |
| Navigation | `Tabs` (+ `TabsList`, `TabsTrigger`, `TabsContent`), `Accordion` + `AccordionItem`, `Breadcrumb`, `Pagination` (`v-model:page`) |
| Overlays | `Dialog` (`v-model:open`, `placement` for drawers), `Popover`, `Menu` (+ `MenuItem`, `MenuLabel`, `MenuSeparator`), `Tooltip`, `Toaster` + `toast()` |
| Feedback | `Alert`, `Progress`, `ProgressCircle`, `Spinner`, `Skeleton` |
| Advanced | `DataTable` (sort, search, `v-model:selected`, pagination, `#cell-<key>` slots), `Combobox` (`v-model`, filtering, groups), `Command` + `CommandDialog` (⌘K, `v-model:open`), `Calendar`, `DatePicker` (ISO `YYYY-MM-DD`, `name` for forms), `ToggleGroup` + `ToggleGroupItem` |

Overlay triggers are plain slot content: Manthan wires the first element in the `#trigger` slot (or the default slot for `Tooltip`) to the native Popover API. Recipes and helpers from `@manthan/base` are re-exported.

## Development

```bash
npm run dev        # playground (?style=glass&theme=dark)
npm test
npm run typecheck
npm run build      # vite library build + vue-tsc declarations
```

## License

MIT
