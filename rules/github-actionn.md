# CI/CD Rules for Vercel Deployment

## Purpose

This document defines mandatory CI/CD rules for all code changes deployed to Vercel.

The objective is to maintain deployment stability, prevent production incidents, enforce code quality, and ensure predictable release behavior.

These rules are mandatory and must never be bypassed.

---

# 1. General Principles

## Rule 1.1

Every code change must be deployable at any time.

No code may be merged if it breaks:

* Build process
* Type checking
* Linting
* Unit tests
* Integration tests

---

## Rule 1.2

Never assume deployment success.

The agent must verify:

* Build status
* Type safety
* Environment variables
* Route compilation
* API compilation

before considering a task complete.

---

## Rule 1.3

Production is the source of truth.

Never modify production configuration without explicit instruction.

---

# 2. Branch Strategy

## Rule 2.1

Direct commits to main are prohibited.

Allowed workflow:

feature/* → develop → main

Example:

feature/user-auth
feature/payment-gateway
feature/dashboard-redesign

---

## Rule 2.2

Every pull request must contain:

* Clear description
* Scope of changes
* Risk assessment
* Testing evidence

---

## Rule 2.3

Agent must never merge code with unresolved conflicts.

---

# 3. Code Validation

Before any deployment the following commands must succeed.

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

If any command fails:

STOP deployment.

Fix the issue first.

---

# 4. TypeScript Rules

## Rule 4.1

TypeScript errors are deployment blockers.

Never ignore TypeScript errors.

Forbidden:

```ts
// @ts-ignore
// @ts-nocheck
```

Unless explicitly approved.

---

## Rule 4.2

Avoid usage of:

```ts
any
```

Preferred:

```ts
unknown
```

or proper interfaces.

---

## Rule 4.3

All API responses must use explicit typing.

Example:

```ts
type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
};
```

---

# 5. Next.js Validation

Before deployment verify:

## App Router

* Page renders correctly
* Layout compiles
* Metadata works
* Dynamic routes compile

---

## Server Components

Validate:

* No browser-only APIs
* No window usage
* No localStorage usage

inside Server Components.

---

## Client Components

Must include:

```ts
"use client";
```

when required.

---

# 6. API Route Rules

Every route must:

### Validate Input

Using:

* Zod
* Valibot
* Yup

or equivalent.

---

### Return Consistent Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

### Handle Exceptions

Mandatory:

```ts
try {
} catch (error) {
}
```

No unhandled exceptions.

---

# 7. Security Rules

## Rule 7.1

Never expose:

* API keys
* Secrets
* Tokens
* Credentials

inside:

* source code
* commits
* logs

---

## Rule 7.2

Secrets must come from:

```env
process.env
```

only.

---

## Rule 7.3

Never log sensitive information.

Forbidden:

```ts
console.log(token);
console.log(password);
console.log(secret);
```

---

# 8. Environment Variables

Agent must verify all required variables exist.

Example:

```ts
DATABASE_URL
NEXTAUTH_SECRET
NEXT_PUBLIC_APP_URL
```

Missing variables must block deployment.

---

# 9. Database Migration Rules

Before deployment:

## Validate Migration

```bash
npx prisma migrate deploy
```

must succeed.

---

## Agent Must Verify

* Migration is reversible
* No destructive operation
* No unintended data loss

---

## Forbidden

Dropping tables without approval.

Example:

```sql
DROP TABLE users;
```

---

# 10. Vercel Deployment Rules

## Pre-Deployment Checklist

Mandatory:

```bash
npm install
npm run lint
npm run type-check
npm run test
npm run build
```

---

## Build Verification

Agent must verify:

* No warnings affecting production
* No failed routes
* No failed API handlers

---

## Vercel Configuration

Validate:

* vercel.json
* rewrites
* redirects
* headers
* regions

before deployment.

---

# 11. Monitoring Rules

After deployment verify:

## Application

* Homepage
* Authentication
* Dashboard
* Critical APIs

---

## Health Checks

Must return:

```http
200 OK
```

---

## Error Monitoring

Verify:

* Sentry
* Logtail
* Datadog
* OpenTelemetry

if configured.

---

# 12. Rollback Rules

If deployment causes:

* Build failures
* Authentication issues
* Payment failures
* Database failures
* Major UI regressions

Immediate rollback is required.

---

# 13. Agent Behavior Rules

The agent MUST:

* Think before deploying
* Verify before merging
* Validate before releasing
* Explain deployment risks
* Report blockers immediately

The agent MUST NOT:

* Assume deployment success
* Ignore warnings
* Ignore failing tests
* Skip build validation
* Skip type checking
* Modify production secrets
* Bypass CI/CD gates

---

# 14. Definition of Done

A task is complete only if:

✓ Code compiles

✓ Lint passes

✓ Type check passes

✓ Tests pass

✓ Build succeeds

✓ Vercel deployment succeeds

✓ Critical pages work

✓ Critical APIs work

✓ No secrets exposed

✓ No production errors detected

Otherwise the task is NOT complete.

---

# Final Enforcement

If any rule conflicts with speed, convenience, or deadlines:

THE RULE TAKES PRIORITY.

Deployment stability is more important than deployment speed.
