# Project Module README.md

## Overview
This module provides RESTful endpoints for managing projects. All endpoints use TypeBox schemas for request validation and response structure. The frontend can use these schemas to implement hooks and services for API integration.

## Endpoints

### 1. `GET /projects` - List Projects
**Query Parameters (GETProjectsQuerySchema):**
```typescript
{
  offset: number,
  limit: number,
  search: string | null
}
```

**Response (GetProjectsResponseSchema):**
```typescript
{
  data: Array<{
    id: string,
    title: string,
    description: string | null,
    pageId: string,
    links: Array<{
      label: string,
      href: string
    }>,
    isDeleted: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    createdBy: string | null,
    page: any
  }>,
  meta: {
    total: number,
    offset: number,
    limit: number
  }
}
```

**Status Code:** 200

---

### 2. `GET /projects/:id` - Get Project by ID
**Response (ProjectSchema):**
```typescript
{
  id: string,
  title: string,
  description: string | null,
  pageId: string,
  links: Array<{
    label: string,
    href: string
  }>,
  isDeleted: boolean,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date | null,
  createdBy: string | null,
  page: any
}
```

**Status Code:** 200

---

### 3. `POST /projects` - Create Project
**Request Body (CreateProjectBodySchema):**
```typescript
{
  title: string,
  description: string | null,
  pageId: string,
  links: Array<{
    label: string,
    href: string
  }>,
  isDeleted: boolean
}
```

**Response (ProjectSchema):**
```typescript
{
  id: string,
  title: string,
  description: string | null,
  pageId: string,
  links: Array<{
    label: string,
    href: string
  }>,
  isDeleted: boolean,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date | null,
  createdBy: string | null,
  page: any
}
```

**Status Code:** 201 (Created)

---

### 4. `PUT /projects/:id` - Update Project
**Request Body (UpdateProjectBodySchema):**
```typescript
{
  title: string | null,
  description: string | null,
  pageId: string | null,
  links: Array<{
    label: string,
    href: string
  }> | null,
  isDeleted: boolean | null
}
```

**Response (ProjectSchema):**
```typescript
{
  id: string,
  title: string,
  description: string | null,
  pageId: string,
  links: Array<{
    label: string,
    href: string
  }>,
  isDeleted: boolean,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date | null,
  createdBy: string | null,
  page: any
}
```

**Status Code:** 200

---

### 5. `DELETE /projects/:id` - Delete Project
**Request Body (DeleteProjectBodySchema):**
```typescript
{
  isPermanent: boolean
}
```

**Response (ProjectSchema):**
```typescript
{
  id: string,
  title: string,
  description: string | null,
  pageId: string,
  links: Array<{
    label: string,
    href: string
  }>,
  isDeleted: boolean,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date | null,
  createdBy: string | null,
  page: any
}
```

**Status Code:** 200

---

## Schema Definitions
All schemas are defined using [TypeBox](https://github.com/sinclairzxz/typebox):

### Core Schemas
- **DateFieldSchema:** `type: 'date'` (ISO 8601 format)
- **ProjectLinkSchema:** 
  ```typescript
  {
    label: string,
    href: string
  }
  ```
- **ProjectSchema:** Full project object with nested `page` field

### Query Parameters
- **ListQuerySchema:** 
  ```typescript
  {
    offset: number,
    limit: number,
    search: string | null
  }
  ```

---

## Implementation Notes
1. **Frontend Integration:** Mirror these schemas in your frontend TypeScript types for API calls
2. **Validation:** Use TypeBox for request validation (as shown in the handler.ts file)
3. **Response Handling:** Expect full project objects with nested page data in all successful responses

This documentation covers all endpoints and data structures needed for frontend implementation.