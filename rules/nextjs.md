# Next.js Backend Rules

Use App Router architecture.

Route handlers must:
- parse request
- call service
- return formatted response

Route handlers must NOT:
- contain database queries
- contain business logic
- contain validation logic

Preferred route handler:

```ts
export async function POST(req: Request) {
  const body = await req.json()

  const result =
    await authService.register(body)

  return successResponse(result)
}
```

Use Server Actions only for:
- simple mutations
- UI-coupled actions

Do not place complex workflows inside Server Actions.

Do not query database directly inside:
- React components
- layouts
- middleware