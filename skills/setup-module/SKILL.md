---
name: setup-module
description: Build a backend module from a user-provided type, response shape, or object example. Detect the repository's ORM and framework, derive matching schemas, and implement the module using local conventions. Invoke with /setup-module.
---

# Setup Module

Implement a complete backend module from the shape the user provides. Work with the stack already in the repository; do not assume a particular ORM, web framework, or folder layout.

## Required input

The user must provide at least one concrete shape, such as a TypeScript type/interface, response format, JSON object, or field list with types. If none is present, ask the user for the type or object/response format before deriving the data model. Continue repository discovery while waiting if useful.

If a shape is present but a consequential property cannot be derived (for example, whether a field is unique, nullable, or a relation), use a clear established convention when one applies. Ask only when the choice changes the data/API contract and cannot be inferred safely. Do not make the user restate information already supplied.

## Workflow

1. **Inspect the repository.** Find project instructions and inspect package manifests, ORM configuration/dependencies, database clients, schema/model files, migrations, shared validation types, route registration, and a few comparable modules. Use the module closest in purpose and complexity as the implementation pattern.
2. **Identify the active stack.** Determine which ORM and server/router framework the target module uses from dependencies and actual code. Repositories may contain multiple data tools; follow the tool used by neighboring modules. Do not introduce another ORM or framework.
3. **Translate the supplied shape.** Separate persistence fields from API request/response fields. Map scalar, collection, enum, nested, and reference fields using the detected ORM's supported types and local database conventions. Preserve supplied names and distinctions unless the repository consistently maps them. Do not invent business fields.
4. **Resolve model details.** Reuse local conventions for IDs, defaults, timestamps, audit fields, soft deletion, indexes, constraints, and table/column names where applicable. Infer only what is established by the codebase. If a nested object has no clear persistence representation, inspect similar models; ask about normalization versus JSON only if the choice remains consequential and unclear.
5. **Implement the complete module.** Add the ORM schema/model and the matching application module pieces used by this codebase, such as validation schemas, handlers/controllers, services, routes, registration, authorization, and response mapping. Include create/read/update/delete or public/admin surfaces only when requested or clearly established as part of the target module. Keep route and API behavior consistent with neighboring modules.
6. **Handle ORM artifacts.** Follow the repository's migration and client-generation conventions. Create the needed migration or schema artifact when the project expects one; regenerate generated clients/types when necessary. Do not run a migration, seed, or other command that mutates a shared/live database unless the user explicitly requests that operation.
7. **Check the result.** Review changed files for consistency, confirm the module is registered and imports resolve, and run relevant formatting, schema validation, type checking, or tests when available and appropriate. Report checks that were or were not run; do not claim runtime behavior that was not verified.

## Implementation requirements

- Treat the user's supplied shape as the source for field meaning and API data. Treat existing code as the source for implementation style and infrastructure.
- Look for separate persistence and transport schemas. An ORM model is not automatically the API response, and a response object is not automatically a normalized database model.
- Preserve nullability, optionality, defaults, enum values, and array/nested structure where the input defines them. Explain any necessary mapping in the final summary.
- Trace all router mount prefixes so endpoints are registered at the correct full path.
- Match neighboring modules' pagination, filtering, sorting, error handling, authorization, audit, and deletion behavior where relevant. Do not copy unrelated behavior blindly.
- Keep public responses from exposing internal audit or secret fields, following local public-module conventions.
- If the requested implementation conflicts with an existing schema or API convention, identify the conflict and choose the least disruptive solution consistent with user intent; ask if the contract cannot be preserved without a consequential choice.
- Avoid unrelated refactors. Do not stop after adding only a database model when the request is to set up a module.

## Completion summary

Report the model/schema and module pieces created, the resulting route paths and access behavior when routes were added, any migration/client-generation artifacts, and the validation performed. Call out unresolved input values or assumptions briefly. Never say a migration or seed was applied unless it was actually run against the intended database.
