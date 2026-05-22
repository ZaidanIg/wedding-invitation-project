# API Rules

All APIs must return consistent response formats.

Success response:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR"
  }
}
```

Paginated response:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

Never:
- return inconsistent response structures
- expose internal database fields
- expose stack traces
- expose password hashes

Always:
- use proper HTTP status codes
- paginate collections
- validate all external input