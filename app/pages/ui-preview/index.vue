<script setup lang="ts">
import { toast } from "vue-sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from "@/components/ui/pagination";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

definePageMeta({ layout: false });
</script>

<template>
  <div class="min-h-screen p-8" style="background: var(--color-background)">
    <div class="max-w-5xl mx-auto space-y-12">
      <!-- Title -->
      <div>
        <h1 class="text-3xl font-bold mb-2">MyPartner UI Preview</h1>
        <p class="text-gray-500">
          Preview of all design system components and tokens.
        </p>
      </div>

      <!-- Section 1 — Colors & Typography -->
      <section class="space-y-6">
        <h2 class="text-2xl font-semibold border-b pb-2">
          1. Colors & Typography
        </h2>

        <div class="space-y-4">
          <h3 class="text-lg font-medium">Typography Scale</h3>
          <div class="space-y-4 bg-white p-6 rounded-xl shadow-sm">
            <div class="flex items-end gap-4 border-b pb-2">
              <span class="w-24 text-sm text-gray-500">Display</span>
              <span class="text-[24px] font-[700] leading-[1.3] text-gray-900"
                >Page titles, hero headings</span
              >
            </div>
            <div class="flex items-end gap-4 border-b pb-2">
              <span class="w-24 text-sm text-gray-500">Heading 1</span>
              <span class="text-[20px] font-[600] leading-[1.4] text-gray-900"
                >Section headings</span
              >
            </div>
            <div class="flex items-end gap-4 border-b pb-2">
              <span class="w-24 text-sm text-gray-500">Heading 2</span>
              <span class="text-[16px] font-[600] leading-[1.4] text-gray-900"
                >Card titles, modal titles</span
              >
            </div>
            <div class="flex items-end gap-4 border-b pb-2">
              <span class="w-24 text-sm text-gray-500">Body</span>
              <span class="text-[14px] font-[400] leading-[1.5] text-gray-900"
                >All body text (default)</span
              >
            </div>
            <div class="flex items-end gap-4 border-b pb-2">
              <span class="w-24 text-sm text-gray-500">Body Medium</span>
              <span class="text-[14px] font-[500] leading-[1.5] text-gray-900"
                >Labels, nav items</span
              >
            </div>
            <div class="flex items-end gap-4 border-b pb-2">
              <span class="w-24 text-sm text-gray-500">Small</span>
              <span class="text-[12px] font-[400] leading-[1.5] text-gray-900"
                >Captions, meta info</span
              >
            </div>
            <div class="flex items-end gap-4">
              <span class="w-24 text-sm text-gray-500">Mono</span>
              <span
                class="text-[13px] font-[400] leading-[1.5] text-gray-900 font-mono"
                >Codes, vault passwords</span
              >
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-medium">Color Swatches</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              class="p-4 rounded-lg shadow-sm border"
              style="background: var(--color-primary)"
            >
              <span class="text-white font-medium text-sm">Primary</span>
            </div>
            <div
              class="p-4 rounded-lg shadow-sm border"
              style="background: var(--color-primary-subtle)"
            >
              <span class="text-blue-900 font-medium text-sm"
                >Primary Subtle</span
              >
            </div>
            <div
              class="p-4 rounded-lg shadow-sm border"
              style="background: var(--color-sidebar-bg)"
            >
              <span class="text-white font-medium text-sm">Sidebar BG</span>
            </div>
            <div
              class="p-4 rounded-lg shadow-sm border"
              style="background: var(--color-background)"
            >
              <span class="text-gray-900 font-medium text-sm">Background</span>
            </div>
            <div
              class="p-4 rounded-lg shadow-sm border"
              style="background: var(--color-surface)"
            >
              <span class="text-gray-900 font-medium text-sm">Surface</span>
            </div>
            <div
              class="p-4 rounded-lg shadow-sm border"
              style="background: var(--color-surface-input)"
            >
              <span class="text-gray-900 font-medium text-sm"
                >Surface Input</span
              >
            </div>
            <div
              class="p-4 rounded-lg shadow-sm border"
              style="background: var(--color-hero-dark)"
            >
              <span class="text-white font-medium text-sm">Hero Dark</span>
            </div>
            <div
              class="p-4 rounded-lg shadow-sm border"
              style="background: var(--color-border-strong)"
            >
              <span class="text-gray-900 font-medium text-sm"
                >Border Strong</span
              >
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2 — Buttons -->
      <section class="space-y-6">
        <h2 class="text-2xl font-semibold border-b pb-2">2. Buttons</h2>
        <div class="flex flex-wrap gap-3 p-6 bg-white rounded-xl shadow-sm">
          <Button>Primary</Button>
          <Button variant="secondary"> Secondary </Button>
          <Button variant="outline"> Outline </Button>
          <Button variant="ghost"> Ghost </Button>
          <Button variant="destructive"> Destructive </Button>
          <Button disabled> Disabled </Button>
          <Button size="sm"> Small </Button>
          <Button size="lg"> Large </Button>
        </div>
      </section>

      <!-- Section 3 — Form Inputs -->
      <section class="space-y-6">
        <h2 class="text-2xl font-semibold border-b pb-2">3. Form Inputs</h2>
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white rounded-xl shadow-sm"
        >
          <div class="space-y-4">
            <div>
              <Label for="input-default">Default Input</Label>
              <Input
                id="input-default"
                placeholder="Type here..."
                class="mt-1"
              />
            </div>
            <div>
              <Label for="input-disabled">Disabled Input</Label>
              <Input
                id="input-disabled"
                placeholder="Disabled..."
                disabled
                class="mt-1"
              />
            </div>
            <div>
              <Label for="textarea">Textarea</Label>
              <Textarea
                id="textarea"
                placeholder="Type your message..."
                class="mt-1"
              />
            </div>
            <div class="flex items-center space-x-2">
              <Switch id="airplane-mode" />
              <Label for="airplane-mode">Airplane Mode</Label>
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <Label>Select / Combobox</Label>
              <Select>
                <SelectTrigger class="w-full mt-1">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="opt1"> Option 1 </SelectItem>
                    <SelectItem value="opt2"> Option 2 </SelectItem>
                    <SelectItem value="opt3"> Option 3 </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Checkboxes</Label>
              <div class="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  for="terms"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions
                </label>
              </div>
            </div>

            <div class="space-y-2">
              <Label>Radio Group</Label>
              <RadioGroup default-value="option-one">
                <div class="flex items-center space-x-2">
                  <RadioGroupItem id="option-one" value="option-one" />
                  <Label for="option-one">Option One</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem id="option-two" value="option-two" />
                  <Label for="option-two">Option Two</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 4 — Badges & Status Chips -->
      <section class="space-y-6">
        <h2 class="text-2xl font-semibold border-b pb-2">
          4. Badges & Status Chips
        </h2>
        <div class="flex flex-wrap gap-4 p-6 bg-white rounded-xl shadow-sm">
          <span class="badge-success">Aktif</span>
          <span class="badge-warning">Pending</span>
          <span class="badge-error">Nonaktif</span>
          <span class="badge-info">Baru</span>
        </div>
      </section>

      <!-- Section 5 — Cards -->
      <section class="space-y-6">
        <h2 class="text-2xl font-semibold border-b pb-2">5. Cards</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Stat Card -->
          <div
            class="bg-white rounded-xl p-6"
            style="box-shadow: var(--shadow-card)"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                style="background: var(--color-primary-subtle)"
              >
                <svg
                  class="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p
                  class="text-2xl font-bold"
                  style="color: var(--color-text-primary)"
                >
                  147
                </p>
                <p class="text-sm" style="color: var(--color-text-secondary)">
                  Total Klien
                </p>
              </div>
            </div>
          </div>

          <!-- Hero Dark Card -->
          <div
            class="rounded-3xl p-8"
            style="background: var(--color-hero-dark)"
          >
            <h1 class="text-white text-2xl font-bold mb-2">Hero Dark Card</h1>
            <p class="text-white/60 text-sm mb-6">
              Kelola operasional PT Partnership dari satu tempat.
            </p>
            <Button style="background: var(--color-primary)">
              Lihat Dashboard
            </Button>
          </div>
        </div>
      </section>

      <!-- Section 6 — Table -->
      <section class="space-y-6">
        <h2 class="text-2xl font-semibold border-b pb-2">6. Table</h2>
        <div
          class="bg-white rounded-xl overflow-hidden"
          style="box-shadow: var(--shadow-card)"
        >
          <Table>
            <TableHeader>
              <TableRow style="background: var(--color-background)">
                <TableHead>Nama</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Budi Santoso</TableCell>
                <TableCell><span class="badge-success">Aktif</span></TableCell>
                <TableCell>24 Jun 2026</TableCell>
                <TableCell>
                  <div class="flex gap-2">
                    <Button size="sm" variant="outline"> Edit </Button>
                    <Button size="sm" variant="destructive"> Hapus </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Citra Lestari</TableCell>
                <TableCell
                  ><span class="badge-warning">Pending</span></TableCell
                >
                <TableCell>23 Jun 2026</TableCell>
                <TableCell>
                  <div class="flex gap-2">
                    <Button size="sm" variant="outline"> Edit </Button>
                    <Button size="sm" variant="destructive"> Hapus </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <!-- Section 7 — Modals & Sheets -->
      <section class="space-y-6">
        <h2 class="text-2xl font-semibold border-b pb-2">7. Modals & Sheets</h2>
        <div class="flex gap-4 p-6 bg-white rounded-xl shadow-sm">
          <Dialog>
            <DialogTrigger as-child>
              <Button variant="outline"> Open Dialog </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="name" class="text-right">Name</Label>
                  <Input id="name" value="Pedro Duarte" class="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit"> Save changes </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger as-child>
              <Button variant="outline"> Open Sheet </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </SheetDescription>
              </SheetHeader>
              <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="name" class="text-right">Name</Label>
                  <Input id="name" value="Pedro Duarte" class="col-span-3" />
                </div>
              </div>
              <SheetFooter>
                <SheetClose as-child>
                  <Button type="submit"> Save changes </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="destructive"> Open Alert Dialog </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>

      <!-- Section 8 — Toast / Notifications -->
      <section class="space-y-6">
        <h2 class="text-2xl font-semibold border-b pb-2">
          8. Toast / Notifications
        </h2>
        <div class="flex gap-3 p-6 bg-white rounded-xl shadow-sm">
          <Button @click="toast.success('Berhasil disimpan.')">
            Success Toast
          </Button>
          <Button @click="toast.error('Terjadi kesalahan.')">
            Error Toast
          </Button>
          <Button @click="toast.warning('Periksa kembali data.')">
            Warning Toast
          </Button>
          <Button @click="toast.info('Fitur ini dalam pengembangan.')">
            Info Toast
          </Button>
        </div>
      </section>

      <!-- Section 9 — Tabs -->
      <section class="space-y-6">
        <h2 class="text-2xl font-semibold border-b pb-2">9. Tabs</h2>
        <div class="p-6 bg-white rounded-xl shadow-sm">
          <Tabs default-value="tab1">
            <TabsList>
              <TabsTrigger value="tab1"> Tab Pertama </TabsTrigger>
              <TabsTrigger value="tab2"> Tab Kedua </TabsTrigger>
              <TabsTrigger value="tab3" disabled> Disabled </TabsTrigger>
            </TabsList>
            <TabsContent
              value="tab1"
              class="p-4 border mt-2 rounded-lg bg-gray-50"
            >
              Konten tab pertama.
            </TabsContent>
            <TabsContent
              value="tab2"
              class="p-4 border mt-2 rounded-lg bg-gray-50"
            >
              Konten tab kedua.
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <!-- Section 10 — Pagination -->
      <section class="space-y-6">
        <h2 class="text-2xl font-semibold border-b pb-2">10. Pagination</h2>
        <div class="p-6 bg-white rounded-xl shadow-sm flex justify-center">
          <Pagination
            v-slot="{ page }"
            :total="50"
            :sibling-count="1"
            show-edges
            :default-page="2"
          >
            <PaginationList v-slot="{ items }" class="flex items-center gap-1">
              <PaginationFirst />
              <PaginationPrev />
              <template v-for="(item, index) in items">
                <PaginationListItem
                  v-if="item.type === 'page'"
                  :key="index"
                  :value="item.value"
                  as-child
                >
                  <Button
                    class="w-10 h-10 p-0"
                    :variant="item.value === page ? 'default' : 'outline'"
                  >
                    {{ item.value }}
                  </Button>
                </PaginationListItem>
                <PaginationEllipsis v-else :key="item.type" :index="index" />
              </template>
              <PaginationNext />
              <PaginationLast />
            </PaginationList>
          </Pagination>
        </div>
      </section>

      <!-- Section 11 — Skeleton Loaders -->
      <section class="space-y-6">
        <h2 class="text-2xl font-semibold border-b pb-2">
          11. Skeleton Loaders
        </h2>
        <div
          class="p-6 bg-white rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div class="flex items-center space-x-4">
            <Skeleton class="h-12 w-12 rounded-full" />
            <div class="space-y-2">
              <Skeleton class="h-4 w-[250px]" />
              <Skeleton class="h-4 w-[200px]" />
            </div>
          </div>

          <div class="space-y-3">
            <Skeleton class="h-[125px] w-full rounded-xl" />
            <div class="space-y-2">
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
