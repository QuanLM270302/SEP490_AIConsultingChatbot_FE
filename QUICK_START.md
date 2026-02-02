# Quick Start Guide

## 🚀 Getting Started

### 1. Install Required Dependencies

First, install the essential utilities:

```bash
npm install clsx tailwind-merge
```

For the full recommended stack, see [DEPENDENCIES.md](./DEPENDENCIES.md)

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### 3. Project Structure Overview

The project follows a feature-based architecture:

```
app/          → Next.js App Router (routes, pages, API)
components/   → Reusable React components
lib/          → Utilities, hooks, services, API clients
types/        → TypeScript type definitions
config/       → Configuration files
```

### 4. Using Path Aliases

All imports use the `@/` alias configured in `tsconfig.json`:

```typescript
// ✅ Good
import { cn } from "@/lib/utils/cn";
import { ChatMessage } from "@/types/chat";
import { apiClient } from "@/lib/api/client";

// ❌ Avoid
import { cn } from "../../../lib/utils/cn";
```

### 5. Creating Your First Component

Example: Create a button component in `components/ui/button.tsx`:

```typescript
import { cn } from "@/lib/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-4 py-2 rounded-md font-medium transition-colors",
          variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
          variant === "secondary" && "bg-gray-200 text-gray-900 hover:bg-gray-300",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
```

Then export it in `components/ui/index.ts`:

```typescript
export { Button } from "./button";
```

### 6. Using the API Client

Example API call:

```typescript
import { apiClient } from "@/lib/api/client";
import type { ChatSession } from "@/types/chat";

// GET request
const response = await apiClient.get<ChatSession[]>("/api/chat");

if (response.success && response.data) {
  console.log(response.data);
}

// POST request
const createResponse = await apiClient.post<ChatSession>("/api/chat", {
  title: "New Chat",
  messages: [],
});
```

### 7. Creating Custom Hooks

Example hook in `lib/hooks/useChat.ts`:

```typescript
import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import type { ChatMessage, ChatSession } from "@/types/chat";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    setLoading(true);
    const response = await apiClient.post<ChatMessage>("/api/chat/messages", {
      content,
    });
    
    if (response.success && response.data) {
      setMessages((prev) => [...prev, response.data!]);
    }
    
    setLoading(false);
  }, []);

  return { messages, loading, sendMessage };
}
```

### 8. Next Steps

1. ✅ Review [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed structure
2. ✅ Install dependencies from [DEPENDENCIES.md](./DEPENDENCIES.md)
3. ✅ Set up your API routes in `app/api/`
4. ✅ Create UI components in `components/ui/`
5. ✅ Build chat components in `components/chat/`
6. ✅ Implement authentication flow
7. ✅ Set up state management (Zustand/React Query)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)

## 🎯 Best Practices

1. **Type Safety**: Always define types for props, API responses, and state
2. **Component Organization**: Keep components small and focused
3. **Code Reusability**: Extract common logic into hooks and utilities
4. **Error Handling**: Always handle errors in API calls and async operations
5. **Performance**: Use React.memo, useMemo, and useCallback when appropriate
6. **Accessibility**: Follow WCAG guidelines for accessible components

Happy coding! 🎉
