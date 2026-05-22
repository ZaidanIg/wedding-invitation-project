# Database Rules

Use Prisma ORM.

Use singleton Prisma client.

Repositories must:
- contain database access only
- contain ORM queries only

Repositories must NOT:
- contain business logic
- contain validation logic

Always:
- select only needed fields
- avoid N+1 queries
- use transactions when consistency matters

Never expose raw entities directly to API responses.