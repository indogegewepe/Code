# 🌀 Andita UI Template — Mantine + Next.js

A modern and scalable UI starter template built with [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing) and [Mantine](https://mantine.dev/), tailored for building high-quality web applications with a focus on performance, design consistency, and developer experience.

> 🔁 Looking for Pages Router support? Check out [next-pages-template](https://github.com/mantinedev/next-pages-template).

---

## 🚀 Features

This template comes preconfigured with powerful tools and best practices out of the box:

* ⚛️ **Next.js App Router** – Fast routing with file-based conventions.
* 🎨 **Mantine UI** – Beautiful and customizable components.
* 💅 **PostCSS** – Configured with [`mantine-postcss-preset`](https://mantine.dev/styles/postcss-preset).
* 🛠️ **TypeScript** – Type-safe development experience.
* 📖 **Storybook** – Isolated component development and documentation.
* 🧪 **Jest + React Testing Library** – For unit and integration testing.
* ✅ **ESLint + Prettier** – Enforced clean and consistent code.
* 🔍 **Bundle Analyzer** – Understand your app’s bundle size.

---

## 📦 Project Scripts

Easily manage your development lifecycle with the following npm scripts:

### 🧪 Testing & Quality

| Script           | Description                                            |
| ---------------- | ------------------------------------------------------ |
| `typecheck`      | Run TypeScript for type validation                     |
| `lint`           | Run ESLint with recommended rules                      |
| `prettier:check` | Check code formatting using Prettier                   |
| `jest`           | Run unit tests with Jest                               |
| `jest:watch`     | Run Jest in watch mode                                 |
| `test`           | Run all: `jest`, `lint`, `prettier:check`, `typecheck` |

### 💻 Development & Build

| Script    | Description                                  |
| --------- | -------------------------------------------- |
| `dev`     | Start local development server               |
| `build`   | Create an optimized production build         |
| `analyze` | Analyze bundle using `@next/bundle-analyzer` |

### 📚 Storybook

| Script            | Description                                 |
| ----------------- | ------------------------------------------- |
| `storybook`       | Start Storybook in development mode         |
| `storybook:build` | Generate static build in `storybook-static` |

### 🧹 Formatting

| Script           | Description                              |
| ---------------- | ---------------------------------------- |
| `prettier:write` | Format all supported files with Prettier |

---

## 📁 Folder Structure

```
.
├── app/                   # App router pages and layout
├── components/            # Reusable UI components
├── lib/                   # Utilities and helpers
├── public/                # Static assets
├── styles/                # Global and component styles
├── tests/                 # Test utilities and mocks
└── storybook/             # Storybook configuration
```

---

## 📄 License

This project is licensed under the **MIT License**.
© Andita Company, 2025.
