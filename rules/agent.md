# Agennr Rules

## Architecture First

This project uses:

* Next.js App Router
* TypeScript
* Prisma ORM
* Supabase PostgreSQL
* Vercel Deployment

All changes must follow the existing architecture.

Do not introduce additional frameworks unless explicitly required.

---

# Next.js Rules

## Prefer Server Components

Default to:

```tsx
Server Component
```

Use Client Components only when necessary.

Examples:

* useState
* useEffect
* browser APIs
* event handlers

Everything else should remain server-side.

---

## Minimize Client JavaScript

Do not convert entire pages into Client Components.

Move only interactive sections into Client Components.

---

## Prefer Server Actions

Before creating API routes ask:

Can this be solved using Server Actions?

Preferred order:

1. Server Component
2. Server Action
3. Route Handler

Avoid unnecessary API endpoints.

---

## Data Fetching

Always fetch data as close to the server as possible.

Avoid:

```tsx
useEffect(() => {
 fetch(...)
})
```

when Server Components can fetch directly.

---

# Prisma Rules

## Never Trust Schema Changes

After updating:

```prisma
schema.prisma
```

Always verify:

```bash
npx prisma validate
```

---

## Migration Required

Schema changes must generate migrations.

Required:

```bash
npx prisma migrate dev
```

Never manually edit production schema.

---

## Generate Client

After schema updates:

```bash
npx prisma generate
```

must be executed.

---

## Query Optimization

Avoid:

```ts
findMany()
```

without filtering.

Avoid:

```ts
include: true
```

on large relations.

Select only required fields.

Bad:

```ts
include: {
 posts: true
}
```

Better:

```ts
select: {
 id: true,
 title: true
}
```

---

## Prevent N+1 Queries

Always inspect:

* nested queries
* loops
* repeated database calls

Prefer batching.

---

# Supabase Rules

## Environment Separation

Never mix:

* local
* preview
* production

databases.

Verify environment before migration.

---

## RLS Awareness

If Row Level Security is enabled:

Verify policies before deployment.

Do not assume authenticated users can access data.

---

## Secret Handling

Never expose:

```env
SUPABASE_SERVICE_ROLE_KEY
```

to the browser.

Allowed only on server side.

---

## Client Usage

Browser:

```ts
createClient()
```

Server:

```ts
createServerClient()
```

Use appropriate client based on execution environment.

---

# Vercel Rules

## Build Validation

Every backend modification requires:

```bash
npm run build
```

Build success is mandatory.

---

## Environment Variables

Before deployment verify:

* DATABASE_URL
* DIRECT_URL
* NEXT_PUBLIC_SUPABASE_URL
* NEXT_PUBLIC_SUPABASE_ANON_KEY
* SUPABASE_SERVICE_ROLE_KEY

exist in Vercel.

---

## Deployment Safety

Never assume environment variables exist.

Verify before release.

---

## Preview First

Deploy to Preview before Production whenever possible.

Production should never be the testing environment.

---

# Backend Rules

## Validation Mandatory

All inputs must be validated.

Preferred:

```ts
zod
```

No exceptions.

---

## Error Handling

Every database operation must consider:

* connection failure
* invalid data
* missing records
* permission errors

---

## Transactions

When multiple database writes must succeed together:

Use:

```ts
prisma.$transaction()
```

Never rely on sequential writes.

---

# Security Rules

## Authorization First

Do not only check authentication.

Verify authorization.

Ask:

Can this user perform this action?

before executing mutations.

---

## Sensitive Data

Never return:

* password
* token
* secret
* internal metadata

through API responses.

---

# Performance Rules

## Avoid Overfetching

Request only required fields.

---

## Pagination Required

Lists expected to grow must implement:

* pagination
* cursor pagination
* infinite loading

Avoid loading entire tables.

---

## Caching

Use:

* Next.js Cache
* Revalidate
* Cache Tags

when appropriate.

Avoid unnecessary database requests.

---

# Testing Rules

After changing:

* Prisma schema
* Supabase integration
* API routes
* Server Actions
* Authentication

Verify:

1. Create
2. Read
3. Update
4. Delete

flows still work.

---

# Production Checklist

Before marking task complete:

✓ npm run lint

✓ npm run build

✓ prisma validate

✓ prisma generate

✓ migration verified

✓ no TypeScript errors

✓ no environment issues

✓ authentication verified

✓ authorization verified

✓ CRUD flow tested

✓ no console errors

✓ no duplicate logic

Only then may a task be considered complete.

---

# Final Principle

Do not optimize for writing code.

Optimize for maintaining code six months from now.

Future maintenance cost is more important than short-term implementation speed.


## Agent Self Review

Before marking any task complete:

1. Re-read the original requirement.
2. Verify implementation matches requirement.
3. Verify no existing feature is broken.
4. Verify build succeeds.
5. Verify edge cases are handled.
6. Verify code follows existing project patterns.

Only then report completion.