# Professional Project Structure Guide

## Recommended Directory Structure

```
my-app/
├── app/                          # Next.js App Router directory
│   ├── (auth)/                   # Route group for authentication
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/              # Route group for authenticated routes
│   │   ├── chat/
│   │   │   ├── [id]/            # Dynamic route for chat sessions
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx          # Chat list/main page
│   │   ├── history/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── logout/
│   │   │       └── route.ts
│   │   ├── chat/
│   │   │   ├── route.ts          # POST: create new chat
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts      # GET/PUT/DELETE: chat operations
│   │   │   │   └── messages/
│   │   │   │       └── route.ts  # POST: send message
│   │   │   └── stream/
│   │   │       └── route.ts      # Streaming responses
│   │   └── health/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx                # Root layout
│   ├── loading.tsx               # Global loading UI
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page
│   └── page.tsx                  # Home page
│
├── components/                    # Reusable React components
│   ├── ui/                       # Base UI components (shadcn/ui style)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── toast.tsx
│   │   └── index.ts              # Barrel export
│   ├── chat/                     # Chat-specific components
│   │   ├── ChatContainer.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageItem.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ChatSidebar.tsx
│   │   └── TypingIndicator.tsx
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── auth/                     # Authentication components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   └── common/                   # Common/shared components
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── EmptyState.tsx
│
├── lib/                          # Utility libraries and configurations
│   ├── api/                      # API client functions
│   │   ├── client.ts             # Axios/fetch client setup
│   │   ├── chat.ts               # Chat API functions
│   │   ├── auth.ts               # Auth API functions
│   │   └── types.ts              # API response types
│   ├── utils/                    # Utility functions
│   │   ├── cn.ts                 # className utility (clsx/tailwind-merge)
│   │   ├── format.ts             # Formatting utilities
│   │   ├── validation.ts         # Validation schemas (Zod)
│   │   └── constants.ts          # App constants
│   ├── hooks/                    # Custom React hooks
│   │   ├── useChat.ts
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   ├── store/                    # State management (Zustand/Redux)
│   │   ├── chatStore.ts
│   │   ├── authStore.ts
│   │   └── index.ts
│   └── services/                 # Business logic services
│       ├── chatService.ts
│       ├── authService.ts
│       └── storageService.ts
│
├── types/                        # TypeScript type definitions
│   ├── index.ts                  # Main type exports
│   ├── chat.ts                   # Chat-related types
│   ├── auth.ts                   # Auth-related types
│   ├── api.ts                    # API types
│   └── common.ts                 # Common types
│
├── styles/                       # Additional styles
│   ├── components.css            # Component-specific styles
│   └── animations.css            # Animation definitions
│
├── public/                       # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   └── icons/
│   ├── fonts/                    # Custom fonts (if any)
│   └── favicon.ico
│
├── config/                       # Configuration files
│   ├── env.ts                    # Environment variable validation
│   └── site.ts                   # Site configuration
│
├── middleware.ts                 # Next.js middleware (auth, redirects)
│
├── .env.local                    # Local environment variables
├── .env.example                  # Example env file
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── package.json
├── tailwind.config.ts            # Tailwind configuration
├── eslint.config.mjs
├── README.md
└── PROJECT_STRUCTURE.md          # This file
```

## Directory Explanations

### `/app` - Next.js App Router
- **Route Groups** `(auth)`, `(dashboard)`: Organize routes without affecting URL structure
- **Dynamic Routes** `[id]`: Handle dynamic parameters
- **API Routes**: Server-side endpoints for backend operations
- **Special Files**: `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` for app-wide UI

### `/components` - React Components
- **`ui/`**: Base, reusable UI components (buttons, inputs, cards)
- **`chat/`**: Chat-specific components
- **`layout/`**: Layout-related components (header, sidebar, footer)
- **`auth/`**: Authentication components
- **`common/`**: Shared utility components

### `/lib` - Core Logic
- **`api/`**: API client setup and endpoint functions
- **`utils/`**: Pure utility functions (formatting, validation, helpers)
- **`hooks/`**: Custom React hooks for reusable logic
- **`store/`**: Global state management (Zustand recommended for simplicity)
- **`services/`**: Business logic and service layer

### `/types` - TypeScript Definitions
- Centralized type definitions for better type safety and reusability

### `/styles` - Additional Styles
- Component-specific CSS and animations (if needed beyond Tailwind)

### `/config` - Configuration
- Environment variable validation and site-wide configuration

## Best Practices

### 1. **File Naming Conventions**
- Components: `PascalCase.tsx` (e.g., `ChatContainer.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `camelCase.ts` (e.g., `chatTypes.ts`)
- Constants: `UPPER_SNAKE_CASE` for exported constants

### 2. **Component Organization**
- One component per file
- Co-locate related components in feature folders
- Use barrel exports (`index.ts`) for cleaner imports

### 3. **Type Safety**
- Define types in `/types` directory
- Use TypeScript strictly (already configured)
- Validate API responses with Zod schemas

### 4. **State Management**
- **Local State**: `useState` for component-specific state
- **Server State**: React Query/TanStack Query for API data
- **Global State**: Zustand for simple global state (auth, theme)
- **URL State**: Next.js router for shareable state

### 5. **API Organization**
- Use Next.js API routes for backend endpoints
- Separate client-side API functions in `/lib/api`
- Implement proper error handling and type safety

### 6. **Environment Variables**
- Use `.env.local` for local development
- Validate with Zod in `/config/env.ts`
- Never commit `.env.local` to git

### 7. **Code Splitting**
- Use dynamic imports for heavy components
- Lazy load routes when possible
- Optimize images with Next.js Image component

## Recommended Dependencies

### Core (Already Installed)
- ✅ Next.js 16
- ✅ React 19
- ✅ TypeScript
- ✅ Tailwind CSS

### Recommended Additions

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.x",      // Server state management
    "zustand": "^4.x",                    // Global state management
    "zod": "^3.x",                        // Schema validation
    "axios": "^1.x",                      // HTTP client
    "clsx": "^2.x",                       // className utility
    "tailwind-merge": "^2.x",             // Merge Tailwind classes
    "date-fns": "^3.x",                   // Date formatting
    "react-hook-form": "^7.x",            // Form handling
    "@hookform/resolvers": "^3.x"         // Zod resolver for forms
  },
  "devDependencies": {
    "@types/node": "^20",
    "prettier": "^3.x",                   // Code formatting
    "prettier-plugin-tailwindcss": "^0.x" // Tailwind class sorting
  }
}
```

## Next Steps

1. **Create the directory structure** as outlined above
2. **Set up environment variables** in `.env.local`
3. **Install recommended dependencies**
4. **Configure path aliases** in `tsconfig.json` (already has `@/*`)
5. **Set up API client** in `/lib/api/client.ts`
6. **Create base UI components** in `/components/ui`
7. **Implement authentication flow**
8. **Build chat interface components**

## Example Import Paths

With the current `tsconfig.json` path alias (`@/*`), you can import like:

```typescript
// Instead of: import { Button } from '../../../components/ui/button'
import { Button } from '@/components/ui/button'
import { useChat } from '@/lib/hooks/useChat'
import { ChatMessage } from '@/types/chat'
import { cn } from '@/lib/utils/cn'
```

This structure provides:
- ✅ Clear separation of concerns
- ✅ Scalability for growth
- ✅ Type safety throughout
- ✅ Easy navigation and maintenance
- ✅ Industry best practices
- ✅ Ready for team collaboration
