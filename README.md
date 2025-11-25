# Nabung Emas Frontend

A beautiful gold savings tracking application built with **Nuxt 4**, **Vue 3**, **TypeScript**, and **Tailwind CSS**.

## 🚀 Features

- 📊 **Portfolio Dashboard** - Track your total gold portfolio value with real-time profit/loss
- 💰 **Multiple Pockets** - Organize your gold savings into different pockets (Emergency Fund, Investment, etc.)
- 📝 **Transaction Management** - Record and track all your gold purchases
- 📈 **Analytics** - Visualize your gold accumulation over time
- 🌍 **i18n Support** - English and Indonesian language support
- 🎨 **Premium UI** - Modern, responsive design with dark mode support

## 🛠️ Tech Stack

- **Framework**: Nuxt 4 (Vue 3)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Form Validation**: VeeValidate + Yup
- **Icons**: @nuxt/icon (Lucide icons)
- **Utilities**: VueUse
- **Date Formatting**: date-fns

## 📁 Project Structure

```
nabung-emas-frontend/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css          # Tailwind + theme variables
│   ├── components/
│   │   ├── dashboard/            # Dashboard-specific components
│   │   ├── transactions/         # Transaction components
│   │   └── ui/                   # Reusable UI components
│   ├── composables/              # Vue composables (auto-imported)
│   │   ├── useApiHeader.ts
│   │   └── useI18n.ts
│   ├── layouts/
│   │   └── default.vue           # Default layout with bottom nav
│   ├── pages/
│   │   └── index.vue             # Dashboard page
│   ├── plugins/
│   │   └── api.ts                # API wrapper ($api, $publicApi)
│   ├── stores/                   # Pinia stores
│   ├── types/
│   │   └── gold.ts               # TypeScript interfaces (I prefix)
│   └── utils/
│       ├── cn.ts                 # Class name utility
│       ├── gold.ts               # Gold-related utilities & mock data
│       └── translations.ts       # i18n translations
├── .github/
│   ├── copilot-instructions.md   # Nuxt 4 coding guidelines
│   └── prompts/
│       └── api.prompt.md         # API wrapper guidelines
├── nuxt.config.ts                # Nuxt configuration
├── tailwind.config.ts            # Tailwind configuration
└── package.json
```

## 🎯 Coding Conventions

### Interface Naming
All TypeScript interfaces use the `I` prefix:
```typescript
export interface IPocket {
  id: string
  name: string
  // ...
}
```

### Component Organization
- **Base Components**: Reusable UI components in `app/components/ui/`
- **Feature Components**: Feature-specific components in `app/components/[feature]/`
- **Auto-imports**: Components in `app/components/` are auto-imported

### API Usage
Following the guidelines in `.github/prompts/api.prompt.md`:
- Use `$api` for authenticated requests
- Use `$publicApi` for public endpoints
- API wrappers are configured in `app/plugins/api.ts`

### State Management
- Use Pinia stores in `app/stores/` for global state
- Use composables in `app/composables/` for reusable logic
- Use `useLocalStorage` from VueUse for persistent state

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🎨 Theming

The app uses a custom theme with CSS variables defined in `app/assets/css/main.css`:
- **Primary**: Deep Blue
- **Accent**: Gold
- **Success**: Green
- **Destructive**: Red
- **Dark Mode**: Fully supported

## 🌐 Internationalization

The app supports English and Indonesian:
- Translations are defined in `app/utils/translations.ts`
- Use the `useI18n()` composable to access translations
- Language preference is stored in localStorage

## 📝 Environment Variables

Create a `.env` file in the root:

```env
NUXT_PUBLIC_RETAIL_BASE_API=http://localhost:3000/api
```

## 🔧 Configuration

### Nuxt Config
- **SSR**: Disabled (SPA mode)
- **Modules**: Pinia, Tailwind, VeeValidate, Nuxt Icon, VueUse
- **Auto-imports**: Enabled for components, composables, and utils

### Tailwind Config
- Custom color scheme using CSS variables
- Mobile-first responsive design
- Custom utilities for safe areas

## 📚 Additional Resources

- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🤝 Contributing

Please follow the coding guidelines in `.github/copilot-instructions.md` when contributing.

## 📄 License

Private project - All rights reserved
