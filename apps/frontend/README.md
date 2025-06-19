# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


## 🎨 Theme Overview: Dark & Gritty UI

This project uses a **dark and gritty Tailwind CSS theme** designed for immersive, high-impact user interfaces. Built entirely on Tailwind's default color palette, the design emphasizes contrast, legibility, and a brutalist aesthetic suitable for gaming, simulation, or narrative-heavy web apps.

### ✦ Design Principles

- **Dark base** for immersion and focus (`bg-zinc-950`, `bg-zinc-900`)
- **Gritty tone** with muted surfaces and hard edges
- **High-contrast text** for maximum readability in low-light environments
- **Bold action colors** like `rose-600` and `red-600` for buttons and alerts
- **Minimal decoration**, favoring simplicity, tension, and clarity

### ✦ Core Tokens

| Role        | Tailwind Class     | Purpose                   |
|-------------|--------------------|---------------------------|
| Background  | `bg-zinc-950`      | Full-page backdrop        |
| Surface     | `bg-zinc-900`      | Cards, forms, containers  |
| Border      | `border-zinc-800`  | Dividers and outlines     |
| Text        | `text-zinc-100`    | Main content text         |
| Muted Text  | `text-zinc-500`    | Secondary details         |
| Primary     | `bg-rose-600`      | Primary buttons, accents  |
| Danger      | `bg-red-600`       | Destructive actions       |

### ✦ Components Styled

- **Buttons**: Bold, shadowed, red-accented for aggressive calls to action
- **Inputs**: Monochrome, high-contrast, styled with focus rings
- **Cards/Surfaces**: Rounded, padded blocks for grouping UI elements
- **Danger Zones**: Clear red labels and spacing to isolate destructive actions
