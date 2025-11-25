# 💰 Gold Savings App - Nuxt 4 Mobile Web Application

A beautiful mobile-first web application for managing personal gold savings with multiple pockets, inspired by Jago Bank's UI/UX design.

## 🎯 Project Overview

Track your gold investments across multiple savings pockets, monitor weight and value, record transactions, and analyze your portfolio performance - all in a clean, intuitive mobile interface.

## ✨ Features

- 📊 **Portfolio Dashboard** - Real-time overview of total gold holdings and profit/loss
- 💼 **Multiple Pockets** - Organize savings by purpose (Emergency, Wedding, Investment, etc.)
- 💸 **Transaction Management** - Record and track all gold purchases with receipts
- 📈 **Analytics** - Visualize gold accumulation and investment performance
- 🎨 **Premium UI** - Jago Bank-inspired design with smooth animations
- 📱 **Mobile-First** - Optimized for 375px-428px viewports
- 🌙 **Dark Mode Ready** - (Coming soon)

## 🛠️ Tech Stack

### Frontend
- **Nuxt 4.2.1** - Vue.js meta-framework with auto-imports
- **Vue 3** - Composition API with TypeScript
- **Pinia** - State management (setup store pattern)
- **Tailwind CSS** - Utility-first styling
- **Nuxt Icon** - Heroicons integration
- **VueUse** - Composition utilities

### Backend (Planned)
- **Nitro** - Nuxt's server engine
- **PostgreSQL** - Database
- **Prisma/Drizzle** - ORM

## 📁 Project Structure

```
nabung-emas-frontend/
├── .github/
│   ├── copilot-instructions.md   # Nuxt 4 coding guidelines
│   └── prompts/
│       └── api.prompt.md         # API wrapper guidelines
├── app/
│   ├── assets/css/
│   │   └── main.css              # Tailwind + custom styles
│   ├── components/
│   │   ├── Base/                 # Reusable UI components
│   │   ├── Dashboard/            # Dashboard components
│   │   ├── Pocket/               # Pocket management
│   │   ├── Transaction/          # Transaction components
│   │   └── Analytics/            # Charts and analytics
│   ├── composables/              # Auto-imported composables
│   │   └── useGoldCalculator.ts
│   ├── layouts/
│   │   └── default.vue           # Main layout with bottom nav
│   ├── pages/
│   │   ├── index.vue             # Dashboard
│   │   ├── pockets/
│   │   ├── transactions/
│   │   └── analytics/
│   ├── plugins/
│   │   └── api.ts                # API wrapper ($api, $publicApi)
│   ├── stores/                   # Pinia stores
│   │   ├── pocket.ts
│   │   └── transaction.ts
│   ├── types/                    # TypeScript interfaces (I prefix)
│   │   ├── pocket.ts
│   │   ├── transaction.ts
│   │   ├── type-pocket.ts
│   │   └── api.ts
│   └── utils/
│       ├── constants.ts          # Business constants
│       ├── helpers.ts            # Pure functions
│       └── mockData.ts           # Development data
├── server/
│   ├── api/                      # Nitro API routes
│   │   ├── pockets/
│   │   ├── transactions/
│   │   └── analytics/
│   ├── middleware/
│   └── utils/
├── nuxt.config.ts
├── tailwind.config.ts
├── package.json
└── Init-project.md               # Full project specification
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Build the application
pnpm build

# Preview production build
pnpm preview
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#3B82F6` - Main actions and highlights
- **Gold Accent**: `#F59E0B` - Gold-related values
- **Success Green**: `#10B981` - Profit indicators
- **Error Red**: `#EF4444` - Loss indicators

### Mobile Breakpoints
```css
xs: 375px   /* iPhone SE, small phones */
sm: 390px   /* iPhone 12/13/14 */
md: 428px   /* iPhone Pro Max */
lg: 768px   /* Tablets */
xl: 1024px  /* Desktop (optional) */
```

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

## 📝 Coding Conventions

### Interface Naming
All TypeScript interfaces use the **I prefix**:

```typescript
export interface IPocket {
  id: string
  name: string
  // ...
}

export interface ITransaction {
  id: string
  pocketId: string
  // ...
}
```

### Component Organization
- **Base Components**: `app/components/Base/` - Reusable UI
- **Feature Components**: `app/components/[Feature]/` - Domain-specific
- **Auto-imports**: All components are auto-imported (PascalCase)

### API Usage
Following `.github/prompts/api.prompt.md`:

```typescript
// Client-side event-based requests
const { $api } = useNuxtApp()
await $api('/api/pockets', { method: 'POST', body: data })

// Initial data fetching
const { data } = await useAsyncData('pockets', () => $api('/api/pockets'))

// Composable wrapper
const { fetchPockets } = useGoldAPI()
```

### State Management
- **Pinia Stores**: Setup store pattern with composables
- **Persistence**: VueUse's `useLocalStorage` for client-side caching
- **Namespacing**: `gold.[domain].[key]` format

## 🗄️ Database Schema

### Type Pocket (Categories)
```typescript
interface ITypePocket {
  id: string
  name: string
  description: string
  icon: string
  color: string
  createdAt: Date
  updatedAt: Date
}
```

### Pocket (Savings Accounts)
```typescript
interface IPocket {
  id: string
  typePocketId: string
  name: string
  description: string
  aggregateTotalPrice: number
  aggregateTotalWeight: number
  targetWeight?: number
  createdAt: Date
  updatedAt: Date
}
```

### Transaction (Gold Purchases)
```typescript
interface ITransaction {
  id: string
  pocketId: string
  transactionDate: Date
  brand: string
  weight: number
  pricePerGram: number
  totalPrice: number
  description?: string
  receiptImage?: string
  createdAt: Date
  updatedAt: Date
}
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file:

```env
NUXT_PUBLIC_API_BASE_URL=/api
```

### Nuxt Config
- **SSR**: Disabled (SPA mode for mobile)
- **Auto-imports**: Enabled for components, composables, utils
- **Modules**: Pinia, Tailwind, Nuxt Icon, VueUse

## 📚 Documentation

- **Full Specification**: See `Init-project.md`
- **Coding Guidelines**: See `.github/copilot-instructions.md`
- **API Guidelines**: See `.github/prompts/api.prompt.md`

## 🎯 Development Roadmap

### Phase 1: MVP (Current)
- [x] Project setup with Nuxt 4
- [x] TypeScript interfaces with I prefix
- [x] Pinia stores (Pocket, Transaction)
- [x] Dashboard with portfolio overview
- [x] Mobile-first responsive layout
- [x] Bottom navigation
- [ ] Pocket management pages
- [ ] Transaction management pages
- [ ] Analytics dashboard

### Phase 2: Backend Integration
- [ ] Nitro API routes
- [ ] PostgreSQL database
- [ ] Prisma ORM setup
- [ ] Authentication
- [ ] File upload for receipts

### Phase 3: Advanced Features
- [ ] Charts and analytics
- [ ] Export functionality (PDF/Excel)
- [ ] Dark mode
- [ ] PWA support
- [ ] Push notifications

## 🤝 Contributing

Please follow the coding guidelines in `.github/copilot-instructions.md` when contributing.

## 📄 License

Private project - All rights reserved

---

**Made with ❤️ for gold investors**
