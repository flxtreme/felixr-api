---
name: implement-endpoint-guide
description: Inspect a named backend module and write a frontend implementation guide documenting its endpoints, authentication, query parameters, request payloads, response shapes, and frontend integration steps. Use when someone asks how to consume or implement an API module in a frontend.
---

# Implement Endpoint Guide

Produce an accurate, frontend-ready integration guide from the backend implementation. Treat repository code as the source of truth; do not infer API behavior from model names or route names alone.

## Workflow

1. Identify the requested module. If it is not named, inspect the surrounding request for a clear target; otherwise ask which module to document.
2. Trace the module end to end:
   - Route registration and parent registration to establish the full URL prefix.
   - Route declarations for HTTP methods, path parameters, query schemas, body schemas, response schemas, and route-specific security metadata.
   - Handlers for status codes, not-found behavior, and transformations between request and service.
   - Services and shared helpers for filters, sorting, pagination, response shaping, side effects, and errors.
   - Authentication, authorization, or middleware configuration that applies to the route.
3. If a frontend exists in the workspace, inspect its API client, auth handling, types, and module conventions. Use those conventions in the guide. If no frontend exists, keep implementation steps framework-neutral and label any optional framework-specific examples.
4. Document every endpoint in the requested module. Distinguish collection, detail, create, update, delete, and auxiliary endpoints. Do not mistake a URL parameter for a query parameter.
5. Compare the route schema with the handler and service. Call out mismatches, undocumented query handling, response transformations, or behavior that cannot be determined. Do not silently resolve conflicting definitions by guessing.
6. Write the guide. Do not edit frontend code unless the user also requests implementation.

## Guide contents

Include:

- The API base path and authentication requirements.
- An endpoint table with method, full path, purpose, and access level.
- For each endpoint, path parameters and accepted query parameters, including types, optionality, defaults, and actual filter/sort/pagination behavior.
- Request payloads for write operations, with required and optional fields, types, enum values, and defaults.
- Response shape and status behavior, including pagination metadata, `404` behavior, soft-delete visibility, and any fields reshaped or omitted by the service.
- Concrete JSON examples whose fields and values conform to the implementation. Use clearly marked placeholders for generated IDs, timestamps, tokens, and environment-specific URLs.
- Practical frontend steps for calling the endpoints, mapping the response to UI state, handling loading/empty/error states, sending auth when required, and invalidating or refreshing data after mutations.

## Accuracy rules

- Prefer the route schema for accepted inputs and response contracts, then use handlers and services to explain runtime behavior. Mention any disagreement between them.
- Follow mounted prefixes through all router levels; do not report a child path as the complete endpoint.
- Report search only when it is accepted and applied. State which fields are searched. If a query schema accepts a value that the service ignores, identify that limitation.
- Derive required versus optional payload fields from the actual schema. Note defaults only when validation or service code applies them.
- Do not invent fields, examples, status codes, sorting guarantees, or auth requirements. Mark unavailable details as unspecified.
- Keep backend implementation detail out of the frontend instructions unless it changes how the client must call or interpret the API.
- If the module has no list route, do not imply that pagination or search is available. If examples require a value absent from the repository (for example, a third-party checkout URL), use a placeholder and state what must be configured.

## Output style

Write a concise guide a frontend developer can implement without reopening the backend. Use headings, tables for endpoint comparisons, TypeScript types when useful, and JSON code blocks for payloads and responses. State any contract gaps or assumptions in a short final section.
