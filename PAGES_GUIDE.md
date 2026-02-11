# Pages Directory Guide

## 📁 Where Pages Go: `app/` Directory

In Next.js 16 (App Router), **all pages go in the `app/` directory**. Each folder represents a route, and `page.tsx` files are the actual page components.

## 📐 Page Structure Examples

### Basic Pages

```
app/
├── page.tsx                    → Home page (/)
├── about/
│   └── page.tsx                → About page (/about)
└── contact/
    └── page.tsx                → Contact page (/contact)
```

### Route Groups (Organization Only)

Route groups `(folderName)` organize routes without affecting URLs:

```
app/
├── (auth)/                     # Route group - doesn't appear in URL
│   ├── login/
│   │   └── page.tsx            → /login
│   └── register/
│       └── page.tsx            → /register
│
└── (dashboard)/                # Route group - doesn't appear in URL
    ├── chat/
    │   └── page.tsx            → /chat
    └── settings/
        └── page.tsx            → /settings
```

### Dynamic Routes

Use `[param]` for dynamic segments:

```
app/
├── chat/
│   ├── [id]/
│   │   └── page.tsx            → /chat/123, /chat/abc, etc.
│   └── page.tsx                → /chat
│
└── user/
    └── [userId]/
        └── page.tsx            → /user/123, /user/john, etc.
```

### Nested Dynamic Routes

```
app/
└── chat/
    └── [id]/
        └── message/
            └── [messageId]/
                └── page.tsx    → /chat/123/message/456
```

## 📝 Page File Structure

Each page is a `page.tsx` file that exports a default React component:

```typescript
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page</p>
    </div>
  );
}
```

## 🎯 Special Files in `app/` Directory

These special files have specific purposes:

```
app/
├── layout.tsx          → Root layout (wraps all pages)
├── page.tsx            → Home page (/)
├── loading.tsx         → Loading UI (shown during loading)
├── error.tsx           → Error boundary (catches errors)
├── not-found.tsx       → 404 page
└── template.tsx        → Template (re-renders on navigation)
```

## 📋 Complete Example Structure

Here's a complete example for your AI Chatbot:

```
app/
├── layout.tsx                    # Root layout
├── page.tsx                      # Home page (/)
├── loading.tsx                   # Global loading
├── error.tsx                     # Global error
├── not-found.tsx                 # 404 page
│
├── (auth)/                       # Auth route group
│   ├── login/
│   │   └── page.tsx              # /login
│   └── register/
│       └── page.tsx              # /register
│
├── (dashboard)/                  # Dashboard route group
│   ├── chat/
│   │   ├── page.tsx              # /chat (chat list)
│   │   └── [id]/
│   │       └── page.tsx          # /chat/123 (specific chat)
│   ├── history/
│   │   └── page.tsx              # /history
│   └── settings/
│       └── page.tsx              # /settings
│
└── api/                          # API routes (not pages)
    ├── chat/
    │   └── route.ts              # API endpoint
    └── auth/
        └── route.ts              # API endpoint
```

## 🔑 Key Points

1. **Pages = `app/` directory**: All pages go here, not in a separate `pages/` folder
2. **Folders = Routes**: Each folder becomes a URL segment
3. **`page.tsx` = Page Component**: Must be named exactly `page.tsx`
4. **Route Groups**: Use `(folderName)` to organize without affecting URLs
5. **Dynamic Routes**: Use `[param]` for dynamic segments
6. **Special Files**: `layout.tsx`, `loading.tsx`, `error.tsx` have special meanings

## 🚫 What NOT to Do

- ❌ Don't create a `pages/` folder (that's for Pages Router, not App Router)
- ❌ Don't name page files anything other than `page.tsx`
- ❌ Don't put page components in `components/` (those are reusable components)

## ✅ Quick Reference

| Location | Purpose | Example |
|----------|---------|---------|
| `app/page.tsx` | Home page | `/` |
| `app/about/page.tsx` | About page | `/about` |
| `app/chat/[id]/page.tsx` | Dynamic chat page | `/chat/123` |
| `app/(auth)/login/page.tsx` | Login page (grouped) | `/login` |
| `components/` | Reusable components | Not pages! |

## 📚 Next Steps

1. Create your pages in `app/` directory
2. Use route groups `(folderName)` to organize related pages
3. Use `[param]` for dynamic routes
4. Keep reusable components in `components/` directory
