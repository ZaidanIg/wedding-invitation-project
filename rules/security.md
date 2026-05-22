# Security Rules

Always:
- validate all input
- sanitize external data
- hash passwords
- use HTTP-only cookies
- validate permissions at service layer

Never trust:
- frontend validation
- client-provided roles
- client-provided IDs

Never log:
- passwords
- tokens
- secrets

Use:
- Zod validation
- RBAC authorization
- rate limiting
- secure environment variables

# Validation Enforcement Rules

Treat ALL external input as untrusted.

You MUST always validate:
- request body
- query parameters
- route params
- headers
- cookies
- environment variables
- webhook payloads
- external API responses
- form data
- search params

Validation is mandatory for ALL external data.

Never assume:
- frontend validation is correct
- client data is safe
- TypeScript types guarantee runtime safety

TypeScript only validates at compile time.
Runtime validation is still required.

Always use Zod schemas for validation.

Validation schemas must:
- live in dedicated validator/schema files
- be reusable
- be strongly typed
- be explicit

Never inline complex validation directly inside:
- route handlers
- server actions
- React components

Preferred pattern:

```ts
const validated =
  createUserSchema.parse(payload)
```

Never access unvalidated input directly.

Bad:

```ts
const email = body.email
```

Good:

```ts
const validated =
  createUserSchema.parse(body)

const email = validated.email
```

Always validate:
- string length
- required fields
- enum values
- IDs
- email format
- URLs
- numeric ranges
- file types
- file sizes

For update endpoints:
- validate partial updates explicitly
- never allow unrestricted object mutation

Always sanitize:
- HTML input
- user-generated content
- filenames
- query filters

Never trust:
- client roles
- client permissions
- client prices
- client ownership
- client IDs

Always re-check authorization at service layer.

Validation failures must:
- return structured error responses
- use proper HTTP status codes
- avoid leaking internal implementation details

Preferred validation error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Invalid email"],
    "password": ["Password too short"]
  }
}
```

If generating new API endpoints, forms, mutations, or services:
ALWAYS generate validation schema first before business logic.

Validation-first development is mandatory.