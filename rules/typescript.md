# TypeScript Rules

Use strict TypeScript.

Avoid:
- any
- unknown casting
- implicit returns
- magic strings

Always:
- create DTO types
- type API responses
- type service contracts
- use enums/constants for repeated values

Prefer:
- explicit return types
- small pure functions
- readonly objects where appropriate