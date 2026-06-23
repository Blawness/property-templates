# Shared UI Package — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `packages/ui/` — shared React components (shadcn base + 10 property components + layout) consumed by all 3 frontend apps.

**Architecture:** A TypeScript package exporting styled, data-driven components. shadcn/ui provides base primitives. Property components accept data via props and render with Tailwind classes that inherit CSS variables from the consuming app's theme. No internal data fetching — components are pure presentational.

**Tech Stack:** React 19, Tailwind v4, shadcn/ui, lucide-react, class-variance-authority

---

## File Structure

```
packages/ui/
├── package.json
├── tsconfig.json
├── components.json
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── lib/
│   │   └── utils.ts
│   └── components/
│       ├── ui/
│       │   ├── button.tsx
│       │   ├── card.tsx
│       │   ├── badge.tsx
│       │   ├── input.tsx
│       │   ├── select.tsx
│       │   ├── dialog.tsx
│       │   ├── label.tsx
│       │   ├── textarea.tsx
│       │   ├── separator.tsx
│       │   └── skeleton.tsx
│       ├── property/
│       │   ├── ListingCard.tsx
│       │   ├── ListingGrid.tsx
│       │   ├── SearchFilter.tsx
│       │   ├── PropertyGallery.tsx
│       │   ├── VirtualTourEmbed.tsx
│       │   ├── MortgageCalculator.tsx
│       │   ├── AgentCard.tsx
│       │   ├── TestimonialCard.tsx
│       │   ├── ContactForm.tsx
│       │   └── MapEmbed.tsx
│       └── layout/
│           ├── Navbar.tsx
│           └── Footer.tsx
```

---

## Phase 2: Shared UI Package

### Task 1: UI Package Scaffolding

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/components.json`
- Create: `packages/ui/src/lib/utils.ts`
- Create: `packages/ui/src/types.ts`
- Create: `packages/ui/src/index.ts`

- [ ] **Step 1: Create packages/ui/package.json**

```json
{
  "name": "@property/ui",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types.ts"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.511.0",
    "tailwind-merge": "^3.3.0"
  },
  "devDependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "tailwindcss": "^4.1.0",
    "typescript": "^5.8.0",
    "@types/react": "^19.2.0"
  },
  "peerDependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  }
}
```

- [ ] **Step 2: Create packages/ui/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create packages/ui/components.json**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@property/ui/components",
    "utils": "@property/ui/lib/utils",
    "ui": "@property/ui/components/ui",
    "lib": "@property/ui/lib",
    "hooks": "@property/ui/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 4: Create packages/ui/src/lib/utils.ts**

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number, currency = "IDR") {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}
```

- [ ] **Step 5: Create packages/ui/src/types.ts**

```ts
export interface Listing {
  id: number;
  slug: string;
  title: string;
  price: string;
  type: "sale" | "rent";
  category: "house" | "apartment" | "land" | "commercial" | "villa";
  city: string;
  bedrooms: number | null;
  bathrooms: number | null;
  landArea: number | null;
  buildingArea: number | null;
  images: string[];
  isFeatured: boolean;
  status: "available" | "sold" | "rented" | "draft";
  agent?: {
    id: number;
    name: string;
    photo: string | null;
  } | null;
}

export interface ListingDetail extends Listing {
  description: string | null;
  currency: string;
  address: string;
  province: string | null;
  latitude: string | null;
  longitude: string | null;
  features: string[];
  virtualTourUrl: string | null;
  agentId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: number;
  name: string;
  photo: string | null;
  phone: string;
  email: string;
  bio: string | null;
  specializations: string[];
  isActive: boolean;
}

export interface Testimonial {
  id: number;
  clientName: string;
  clientPhoto: string | null;
  content: string;
  rating: number;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  author?: { name: string } | null;
}

export interface SiteSettings {
  id: number;
  template: string;
  siteName: string;
  logoUrl: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroImage: string | null;
  aboutContent: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  contactAddress: string | null;
  mapEmbedUrl: string | null;
  socialLinks: Record<string, string>;
}

export interface SearchFilters {
  type?: string;
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  search?: string;
}
```

- [ ] **Step 6: Create packages/ui/src/index.ts (empty for now)**

```ts
export * from "./types.js";
export { cn, formatPrice, slugify } from "./lib/utils.js";
```

- [ ] **Step 7: Install dependencies**

```bash
pnpm install
```

- [ ] **Step 8: Commit**

```bash
git add . && git commit -m "feat(ui): scaffold shared UI package with types and utils"
```

---

### Task 2: shadcn Base UI Components

**Files:**
- Create: `packages/ui/src/components/ui/button.tsx`
- Create: `packages/ui/src/components/ui/card.tsx`
- Create: `packages/ui/src/components/ui/badge.tsx`
- Create: `packages/ui/src/components/ui/input.tsx`
- Create: `packages/ui/src/components/ui/select.tsx`
- Create: `packages/ui/src/components/ui/dialog.tsx`
- Create: `packages/ui/src/components/ui/label.tsx`
- Create: `packages/ui/src/components/ui/textarea.tsx`
- Create: `packages/ui/src/components/ui/separator.tsx`
- Create: `packages/ui/src/components/ui/skeleton.tsx`

- [ ] **Step 1: Create button.tsx**

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

- [ ] **Step 2: Create card.tsx**

```tsx
import * as React from "react";
import { cn } from "../../lib/utils.js";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 px-6", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

- [ ] **Step 3: Create badge.tsx**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof badgeVariants>) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
```

- [ ] **Step 4: Create input.tsx**

```tsx
import * as React from "react";
import { cn } from "../../lib/utils.js";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
```

- [ ] **Step 5: Create select.tsx**

```tsx
"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
```

- [ ] **Step 6: Create dialog.tsx**

```tsx
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
```

- [ ] **Step 7: Create label.tsx**

```tsx
"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "../../lib/utils.js";

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Label };
```

- [ ] **Step 8: Create textarea.tsx**

```tsx
import * as React from "react";
import { cn } from "../../lib/utils.js";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
```

- [ ] **Step 9: Create separator.tsx**

```tsx
"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "../../lib/utils.js";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
```

- [ ] **Step 10: Create skeleton.tsx**

```tsx
import * as React from "react";
import { cn } from "../../lib/utils.js";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
```

- [ ] **Step 11: Commit**

```bash
git add . && git commit -m "feat(ui): add shadcn base UI components"
```

---

### Task 3: Property Components — ListingCard, ListingGrid, SearchFilter

**Files:**
- Create: `packages/ui/src/components/property/ListingCard.tsx`
- Create: `packages/ui/src/components/property/ListingGrid.tsx`
- Create: `packages/ui/src/components/property/SearchFilter.tsx`

- [ ] **Step 1: Create ListingCard.tsx**

```tsx
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import { cn, formatPrice } from "../../lib/utils.js";
import type { Listing } from "../../types.js";
import { Card, CardContent } from "../ui/card.js";
import { Badge } from "../ui/badge.js";

interface ListingCardProps {
  listing: Listing;
  className?: string;
  basePath?: string;
}

export function ListingCard({ listing, className, basePath = "" }: ListingCardProps) {
  const imageUrl = listing.images[0] ?? "/placeholder-property.jpg";
  const typeLabel = listing.type === "sale" ? "Dijual" : "Disewa";

  return (
    <Link href={`${basePath}/listings/${listing.slug}`}>
      <Card className={cn("group overflow-hidden transition-shadow hover:shadow-lg", className)}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <Badge className="absolute top-3 left-3">{typeLabel}</Badge>
          {listing.isFeatured && (
            <Badge variant="secondary" className="absolute top-3 right-3">Featured</Badge>
          )}
        </div>
        <CardContent className="space-y-2 pt-4">
          <p className="text-lg font-bold">{formatPrice(listing.price)}</p>
          <h3 className="line-clamp-1 font-medium">{listing.title}</h3>
          <p className="text-muted-foreground flex items-center gap-1 text-sm">
            <MapPin className="size-3.5" />
            {listing.city}
          </p>
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            {listing.bedrooms != null && (
              <span className="flex items-center gap-1">
                <Bed className="size-3.5" /> {listing.bedrooms}
              </span>
            )}
            {listing.bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath className="size-3.5" /> {listing.bathrooms}
              </span>
            )}
            {listing.buildingArea != null && (
              <span className="flex items-center gap-1">
                <Maximize className="size-3.5" /> {listing.buildingArea}m²
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 2: Create ListingGrid.tsx**

```tsx
import { cn } from "../../lib/utils.js";
import type { Listing } from "../../types.js";
import { ListingCard } from "./ListingCard.js";

interface ListingGridProps {
  listings: Listing[];
  className?: string;
  basePath?: string;
  emptyMessage?: string;
}

export function ListingGrid({
  listings,
  className,
  basePath = "",
  emptyMessage = "Tidak ada properti ditemukan.",
}: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          basePath={basePath}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create SearchFilter.tsx**

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../lib/utils.js";
import type { SearchFilters } from "../../types.js";
import { Button } from "../ui/button.js";
import { Input } from "../ui/input.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.js";

interface SearchFilterProps {
  cities: string[];
  className?: string;
  basePath?: string;
}

export function SearchFilter({ cities, className, basePath = "" }: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilters = useCallback(
    (updates: Partial<SearchFilters>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }
      startTransition(() => {
        router.push(`${basePath}/listings?${params.toString()}`);
      });
    },
    [router, searchParams, basePath]
  );

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push(`${basePath}/listings`);
    });
  }, [router, basePath]);

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className={cn("flex flex-wrap items-end gap-3", className)}>
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Cari properti..."
            defaultValue={searchParams.get("search") ?? ""}
            className="pl-9"
            onChange={(e) => {
              const timer = setTimeout(() => updateFilters({ search: e.target.value }), 300);
              return () => clearTimeout(timer);
            }}
          />
        </div>
      </div>

      <Select
        defaultValue={searchParams.get("type") ?? "all"}
        onValueChange={(v) => updateFilters({ type: v })}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Tipe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Tipe</SelectItem>
          <SelectItem value="sale">Dijual</SelectItem>
          <SelectItem value="rent">Disewa</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("category") ?? "all"}
        onValueChange={(v) => updateFilters({ category: v })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          <SelectItem value="house">Rumah</SelectItem>
          <SelectItem value="apartment">Apartemen</SelectItem>
          <SelectItem value="villa">Villa</SelectItem>
          <SelectItem value="land">Tanah</SelectItem>
          <SelectItem value="commercial">Komersial</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("city") ?? "all"}
        onValueChange={(v) => updateFilters({ city: v })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Kota" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kota</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>{city}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("bedrooms") ?? "all"}
        onValueChange={(v) => updateFilters({ bedrooms: v === "all" ? undefined : Number(v) })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Kamar Tidur" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Kamar Tidur</SelectItem>
          <SelectItem value="1">1+</SelectItem>
          <SelectItem value="2">2+</SelectItem>
          <SelectItem value="3">3+</SelectItem>
          <SelectItem value="4">4+</SelectItem>
          <SelectItem value="5">5+</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} disabled={isPending}>
          <X className="size-3.5" /> Reset
        </Button>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat(ui): add ListingCard, ListingGrid, and SearchFilter components"
```

---

### Task 4: Property Components — Gallery, VirtualTour, MortgageCalculator

**Files:**
- Create: `packages/ui/src/components/property/PropertyGallery.tsx`
- Create: `packages/ui/src/components/property/VirtualTourEmbed.tsx`
- Create: `packages/ui/src/components/property/MortgageCalculator.tsx`

- [ ] **Step 1: Create PropertyGallery.tsx**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Button } from "../ui/button.js";
import { Dialog, DialogContent } from "../ui/dialog.js";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function PropertyGallery({ images, title, className }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className={cn("bg-muted flex aspect-video items-center justify-center rounded-lg", className)}>
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const goTo = (index: number) => {
    setSelectedIndex((index + images.length) % images.length);
  };

  return (
    <>
      <div className={cn("space-y-3", className)}>
        <div
          className="relative aspect-video cursor-pointer overflow-hidden rounded-lg"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[selectedIndex]}
            alt={`${title} - ${selectedIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 66vw"
            priority
          />
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={(e) => { e.stopPropagation(); goTo(selectedIndex - 1); }}
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={(e) => { e.stopPropagation(); goTo(selectedIndex + 1); }}
              >
                <ChevronRight className="size-5" />
              </Button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                  i === selectedIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <Image src={img} alt={`${title} thumbnail ${i + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="relative aspect-video">
            <Image
              src={images[selectedIndex]}
              alt={`${title} - ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => goTo(selectedIndex - 1)}
                >
                  <ChevronLeft className="size-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => goTo(selectedIndex + 1)}
                >
                  <ChevronRight className="size-6" />
                </Button>
              </>
            )}
          </div>
          <p className="text-muted-foreground p-3 text-center text-sm">
            {selectedIndex + 1} / {images.length}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

- [ ] **Step 2: Create VirtualTourEmbed.tsx**

```tsx
import { cn } from "../../lib/utils.js";

interface VirtualTourEmbedProps {
  url: string;
  className?: string;
}

export function VirtualTourEmbed({ url, className }: VirtualTourEmbedProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-lg font-semibold">Virtual Tour 360°</h3>
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <iframe
          src={url}
          title="Virtual Tour"
          className="absolute inset-0 h-full w-full"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create MortgageCalculator.tsx**

```tsx
"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";
import { cn, formatPrice } from "../../lib/utils.js";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.js";
import { Input } from "../ui/input.js";
import { Label } from "../ui/label.js";

interface MortgageCalculatorProps {
  propertyPrice: number | string;
  className?: string;
}

export function MortgageCalculator({ propertyPrice, className }: MortgageCalculatorProps) {
  const price = typeof propertyPrice === "string" ? parseFloat(propertyPrice) : propertyPrice;
  const [dpPercent, setDpPercent] = useState(20);
  const [tenor, setTenor] = useState(15);
  const [interestRate, setInterestRate] = useState(7.5);

  const result = useMemo(() => {
    const dp = price * (dpPercent / 100);
    const loan = price - dp;
    const monthlyRate = interestRate / 100 / 12;
    const months = tenor * 12;

    if (monthlyRate === 0) {
      return { dp, loan, monthlyPayment: loan / months, totalPayment: loan, totalInterest: 0 };
    }

    const monthlyPayment = loan * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - loan;

    return { dp, loan, monthlyPayment, totalPayment, totalInterest };
  }, [price, dpPercent, tenor, interestRate]);

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="size-5" />
          Kalkulator KPR
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label htmlFor="dp">DP (%)</Label>
            <Input
              id="dp"
              type="number"
              min={10}
              max={90}
              value={dpPercent}
              onChange={(e) => setDpPercent(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="tenor">Tenor (tahun)</Label>
            <Input
              id="tenor"
              type="number"
              min={1}
              max={30}
              value={tenor}
              onChange={(e) => setTenor(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="rate">Bunga (%/th)</Label>
            <Input
              id="rate"
              type="number"
              min={0}
              max={20}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="bg-muted space-y-2 rounded-lg p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Uang Muka (DP)</span>
            <span className="font-medium">{formatPrice(result.dp)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Jumlah Pinjaman</span>
            <span className="font-medium">{formatPrice(result.loan)}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="font-medium">Cicilan per Bulan</span>
              <span className="text-primary text-xl font-bold">{formatPrice(result.monthlyPayment)}</span>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Bunga</span>
            <span>{formatPrice(result.totalInterest)}</span>
          </div>
        </div>

        <p className="text-muted-foreground text-xs">
          *Perhitungan bersifat estimasi. Hubungi bank untuk informasi lebih lanjut.
        </p>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat(ui): add PropertyGallery, VirtualTourEmbed, and MortgageCalculator"
```

---

### Task 5: Property Components — AgentCard, TestimonialCard, ContactForm, MapEmbed

**Files:**
- Create: `packages/ui/src/components/property/AgentCard.tsx`
- Create: `packages/ui/src/components/property/TestimonialCard.tsx`
- Create: `packages/ui/src/components/property/ContactForm.tsx`
- Create: `packages/ui/src/components/property/MapEmbed.tsx`

- [ ] **Step 1: Create AgentCard.tsx**

```tsx
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { cn } from "../../lib/utils.js";
import type { Agent } from "../../types.js";
import { Card, CardContent } from "../ui/card.js";
import { Badge } from "../ui/badge.js";

interface AgentCardProps {
  agent: Agent;
  className?: string;
  basePath?: string;
  showContact?: boolean;
}

export function AgentCard({ agent, className, basePath = "", showContact = true }: AgentCardProps) {
  return (
    <Card className={cn("text-center", className)}>
      <CardContent className="space-y-3 pt-6">
        <div className="relative mx-auto size-24 overflow-hidden rounded-full">
          {agent.photo ? (
            <Image src={agent.photo} alt={agent.name} fill className="object-cover" sizes="96px" />
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center text-2xl font-bold">
              {agent.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <Link href={`${basePath}/agents/${agent.id}`} className="font-semibold hover:underline">
            {agent.name}
          </Link>
          {agent.specializations.length > 0 && (
            <div className="mt-1 flex flex-wrap justify-center gap-1">
              {agent.specializations.map((spec) => (
                <Badge key={spec} variant="secondary" className="text-xs">{spec}</Badge>
              ))}
            </div>
          )}
        </div>
        {showContact && (
          <div className="text-muted-foreground space-y-1 text-sm">
            <p className="flex items-center justify-center gap-1">
              <Phone className="size-3.5" /> {agent.phone}
            </p>
            <p className="flex items-center justify-center gap-1">
              <Mail className="size-3.5" /> {agent.email}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Create TestimonialCard.tsx**

```tsx
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "../../lib/utils.js";
import type { Testimonial } from "../../types.js";
import { Card, CardContent } from "../ui/card.js";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-center gap-3">
          <div className="relative size-12 overflow-hidden rounded-full">
            {testimonial.clientPhoto ? (
              <Image src={testimonial.clientPhoto} alt={testimonial.clientName} fill className="object-cover" sizes="48px" />
            ) : (
              <div className="bg-muted flex h-full w-full items-center justify-center font-bold">
                {testimonial.clientName.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="font-medium">{testimonial.clientName}</p>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn("size-3.5", i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-sm italic">&ldquo;{testimonial.content}&rdquo;</p>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Create ContactForm.tsx**

```tsx
"use client";

import { useState, useTransition } from "react";
import { Send, CheckCircle } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Button } from "../ui/button.js";
import { Input } from "../ui/input.js";
import { Textarea } from "../ui/textarea.js";
import { Label } from "../ui/label.js";

interface ContactFormProps {
  action: (data: FormData) => Promise<{ success: boolean; message: string }>;
  listingId?: number;
  template: string;
  className?: string;
}

export function ContactForm({ action, listingId, template, className }: ContactFormProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await action(formData);
      setResult(res);
    });
  };

  if (result?.success) {
    return (
      <div className={cn("flex flex-col items-center gap-3 py-8 text-center", className)}>
        <CheckCircle className="text-green-500 size-12" />
        <p className="font-medium">{result.message}</p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className={cn("space-y-4", className)}>
      <input type="hidden" name="template" value={template} />
      {listingId && <input type="hidden" name="listingId" value={listingId} />}

      <div className="space-y-1">
        <Label htmlFor="name">Nama</Label>
        <Input id="name" name="name" required placeholder="Nama lengkap" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="email@contoh.com" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone">Telepon</Label>
          <Input id="phone" name="phone" placeholder="+62..." />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="message">Pesan</Label>
        <Textarea id="message" name="message" required rows={4} placeholder="Saya tertarik dengan properti ini..." />
      </div>

      {result && !result.success && (
        <p className="text-destructive text-sm">{result.message}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          "Mengirim..."
        ) : (
          <>
            <Send className="size-4" /> Kirim Pesan
          </>
        )}
      </Button>
    </form>
  );
}
```

- [ ] **Step 4: Create MapEmbed.tsx**

```tsx
import { cn } from "../../lib/utils.js";

interface MapEmbedProps {
  embedUrl: string;
  className?: string;
}

export function MapEmbed({ embedUrl, className }: MapEmbedProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg", className)}>
      <iframe
        src={embedUrl}
        title="Location Map"
        className="h-[400px] w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(ui): add AgentCard, TestimonialCard, ContactForm, and MapEmbed"
```

---

### Task 6: Layout Components — Navbar, Footer

**Files:**
- Create: `packages/ui/src/components/layout/Navbar.tsx`
- Create: `packages/ui/src/components/layout/Footer.tsx`

- [ ] **Step 1: Create Navbar.tsx**

```tsx
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Button } from "../ui/button.js";

interface NavbarProps {
  siteName: string;
  logoUrl?: string | null;
  links: { label: string; href: string }[];
  className?: string;
}

export function Navbar({ siteName, logoUrl, links, className }: NavbarProps) {
  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image src={logoUrl} alt={siteName} width={120} height={40} className="h-8 w-auto" />
          ) : (
            <span className="text-xl font-bold">{siteName}</span>
          )}
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
          <Menu className="size-5" />
        </Button>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Create Footer.tsx**

```tsx
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Separator } from "../ui/separator.js";

interface FooterProps {
  siteName: string;
  links: { label: string; href: string }[];
  contactPhone?: string | null;
  contactEmail?: string | null;
  contactAddress?: string | null;
  socialLinks?: Record<string, string>;
  className?: string;
}

export function Footer({
  siteName,
  links,
  contactPhone,
  contactEmail,
  contactAddress,
  socialLinks = {},
  className,
}: FooterProps) {
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-lg font-bold">{siteName}</h3>
            {contactAddress && (
              <p className="text-muted-foreground flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 size-4 flex-shrink-0" />
                {contactAddress}
              </p>
            )}
            {contactPhone && (
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <Phone className="size-4" /> {contactPhone}
              </p>
            )}
            {contactEmail && (
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <Mail className="size-4" /> {contactEmail}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Menu</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {Object.keys(socialLinks).length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Sosial Media</h4>
              <ul className="space-y-2">
                {Object.entries(socialLinks).map(([platform, url]) => (
                  <li key={platform}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground text-sm capitalize transition-colors"
                    >
                      {platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Separator className="my-8" />

        <p className="text-muted-foreground text-center text-sm">
          &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Update index.ts to export all components**

Replace `packages/ui/src/index.ts` with:

```ts
export * from "./types.js";
export { cn, formatPrice, slugify } from "./lib/utils.js";

export { Button, buttonVariants } from "./components/ui/button.js";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./components/ui/card.js";
export { Badge, badgeVariants } from "./components/ui/badge.js";
export { Input } from "./components/ui/input.js";
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton } from "./components/ui/select.js";
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "./components/ui/dialog.js";
export { Label } from "./components/ui/label.js";
export { Textarea } from "./components/ui/textarea.js";
export { Separator } from "./components/ui/separator.js";
export { Skeleton } from "./components/ui/skeleton.js";

export { ListingCard } from "./components/property/ListingCard.js";
export { ListingGrid } from "./components/property/ListingGrid.js";
export { SearchFilter } from "./components/property/SearchFilter.js";
export { PropertyGallery } from "./components/property/PropertyGallery.js";
export { VirtualTourEmbed } from "./components/property/VirtualTourEmbed.js";
export { MortgageCalculator } from "./components/property/MortgageCalculator.js";
export { AgentCard } from "./components/property/AgentCard.js";
export { TestimonialCard } from "./components/property/TestimonialCard.js";
export { ContactForm } from "./components/property/ContactForm.js";
export { MapEmbed } from "./components/property/MapEmbed.js";

export { Navbar } from "./components/layout/Navbar.js";
export { Footer } from "./components/layout/Footer.js";
```

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat(ui): add Navbar, Footer, and finalize all component exports"
```
