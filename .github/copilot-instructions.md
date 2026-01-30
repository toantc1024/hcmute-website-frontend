# HCMUTE Website Frontend - AI Coding Guide

## Project Overview

Next.js 15+ App Router university CMS frontend. Multi-tenant architecture with public pages, content management dashboard (`/manage`), and Keycloak OAuth2 authentication.

### UI GUIDELINE

Modern structured

## Tech Stack

- **Framework:** Next.js 15+ (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui (new-york style), Magic UI components
- **Animation:** Framer Motion (`motion/react` import)
- **State:** Zustand with persist middleware for auth
- **API:** Axios with interceptors for auth tokens and tenant headers
- **Icons:** Lucide React

## Architecture

### Route Groups

```
app/
├── (public)/          # Public pages: landing, /tin-tuc (news)
├── manage/            # Admin dashboard (protected)
├── auth/              # Auth callback handlers
└── protected/         # User account pages
```

### Feature-Based Organization

```
features/
├── auth/              # Keycloak OAuth2 PKCE flow, useAuth hook (Zustand)
├── posts/             # Post CRUD, types, components, API
└── user/              # User profile management

lib/
├── api-client/        # Axios instances, endpoint modules, types
└── i18n/              # Internationalization (vi-VN primary)
```

## Critical Patterns

### API Client Usage

Two axios instances in `lib/api-client/`:

- `apiClient` - Authenticated requests (auto-attaches Bearer token + X-Tenant-ID)
- `publicApiClient` - Public endpoints (no auth required)

```tsx
// Feature API pattern (features/posts/api/posts-api.ts)
import { apiClient } from "@/lib/api-client";
const response = await apiClient.get<ApiResponse<PostDetailView>>(
  `/api/v1/admin/posts/${postId}`,
);
```

### Enum Values Must Match Backend

PostStatus, ReviewLevel, etc. use integer values that MUST match Java backend enums:

```tsx
// features/posts/types/index.ts
export enum PostStatus {
  DRAFT = 0,
  PENDING = 1,
  PUBLISHED = 9,
  REJECTED = 10, // Match backend exactly!
}
```

### Safe Optional Chaining for API Data

API responses may have undefined arrays. Always use optional chaining:

```tsx
// ✓ Correct
{
  post.categories?.[0]?.name;
}
// ✗ Wrong - will crash
{
  post.categories[0].name;
}
```

### Image Hosts Configuration

External image hosts must be in `next.config.ts`:

```ts
images: {
  remotePatterns: [
    { protocol: "http", hostname: "localhost", port: "9000" },
    { protocol: "https", hostname: "minio.hcmutertic.com" },
  ],
}
```

## Component Conventions

### Client Components

Add `"use client"` directive for components using hooks, state, or browser APIs.

### Imports Pattern

```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react"; // NOT "framer-motion"
import { postsApi, PostStatus, type PostDetailView } from "@/features/posts";
```

### shadcn/ui Components

Add via CLI: `pnpm dlx shadcn@latest add <component>`
Location: `components/ui/`

## Development Commands

```bash
pnpm dev                              # Start dev server (port 3000)
pnpm build                            # Production build
pnpm dlx shadcn@latest add button     # Add shadcn component
```

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_TENANT_ID=public
NEXT_PUBLIC_KEYCLOAK_URL=...
NEXT_PUBLIC_KEYCLOAK_REALM=...
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=...
```

## Key Files Reference

| File                               | Purpose                                     |
| ---------------------------------- | ------------------------------------------- |
| `features/posts/types/index.ts`    | Post enums, interfaces (sync with backend!) |
| `lib/api-client/axios-instance.ts` | API interceptors, auth token handling       |
| `features/auth/hooks/use-auth.ts`  | Zustand auth store with PKCE flow           |
| `components.json`                  | shadcn/ui configuration                     |
