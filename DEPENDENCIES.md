# Recommended Dependencies

## Required for Current Setup

The following packages are needed for the utility files I've created:

```bash
npm install clsx tailwind-merge
```

## Full Recommended Stack

For a complete professional setup, consider installing these packages:

### Core Utilities
```bash
npm install clsx tailwind-merge zod date-fns
```

### State Management
```bash
npm install @tanstack/react-query zustand
```

### HTTP Client
```bash
npm install axios
```

### Form Handling
```bash
npm install react-hook-form @hookform/resolvers
```

### Development Tools
```bash
npm install -D prettier prettier-plugin-tailwindcss
```

## Quick Install (All at Once)

```bash
npm install clsx tailwind-merge zod date-fns @tanstack/react-query zustand axios react-hook-form @hookform/resolvers

npm install -D prettier prettier-plugin-tailwindcss
```

## Package Descriptions

- **clsx**: Utility for constructing className strings conditionally
- **tailwind-merge**: Merge Tailwind CSS classes without conflicts
- **zod**: TypeScript-first schema validation
- **date-fns**: Modern JavaScript date utility library
- **@tanstack/react-query**: Powerful data synchronization for React
- **zustand**: Lightweight state management solution
- **axios**: Promise-based HTTP client
- **react-hook-form**: Performant forms with easy validation
- **@hookform/resolvers**: Validation resolvers for react-hook-form
- **prettier**: Code formatter
- **prettier-plugin-tailwindcss**: Sort Tailwind classes automatically

## Note

The `lib/utils/cn.ts` file requires `clsx` and `tailwind-merge` to work properly.
Install these first if you plan to use the utility functions.
