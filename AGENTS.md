# TenderIQ — AI Agent Engineering Rules

## 1. Project Identity

TenderIQ is an AI-powered procurement intelligence SaaS platform.

The goal is to help businesses discover, understand, evaluate, and track government tenders.

TenderIQ is not intended to be a generic CRUD application.

The primary product value comes from:

* tender discovery
* procurement search
* document intelligence
* AI-assisted eligibility analysis
* tender question answering
* application tracking
* deadline management
* procurement analytics

---

# 2. Primary Technology Stack

Use the following technologies unless explicitly instructed otherwise.

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

### Backend

* Next.js App Router
* Next.js Route Handlers
* Node.js runtime
* REST APIs

### Database

* PostgreSQL
* Prisma ORM

### Authentication

* Better Auth

### AI

* Gemini API

### File Storage

* Cloudinary

### Email

* Resend

### Infrastructure

* Docker
* Docker Compose

### Deployment

* Vercel
* Neon PostgreSQL

---

# 3. Architecture

TenderIQ uses a modular monolith architecture.

Do not introduce microservices.

Preferred request flow:

```text
Client
  ↓
Next.js
  ↓
Route Handler
  ↓
Validation
  ↓
Service
  ↓
Repository / Prisma
  ↓
PostgreSQL
```

For AI:

```text
Client
  ↓
API
  ↓
AI Service
  ↓
Gemini
  ↓
Validate output
  ↓
Application logic
  ↓
Database
```

Route handlers should remain thin.

Business logic belongs in service/module layers.

---

# 4. Infrastructure Restrictions

Do NOT introduce the following technologies unless the user explicitly approves an architecture change:

* Redis
* BullMQ
* RabbitMQ
* Kafka
* Kubernetes
* Elasticsearch
* vector databases
* microservices
* event sourcing
* CQRS

Do not introduce a technology merely because it is commonly used in production systems.

Prefer the simplest solution that solves the current problem.

Docker is explicitly allowed and encouraged.

---

# 5. Project Structure

Use the following structure:

```text
src/
├── app/
├── components/
├── modules/
├── lib/
├── validations/
├── types/
└── utils/
```

### `app/`

Contains:

* pages
* layouts
* route groups
* Route Handlers

### `components/`

Contains reusable UI components.

### `modules/`

Contains domain-specific business logic.

Examples:

```text
modules/
├── auth/
├── company/
├── tender/
├── document/
├── ai/
├── application/
├── notification/
└── analytics/
```

Only create a module when it is actually required.

### `lib/`

Contains shared infrastructure integrations.

Examples:

```text
prisma.ts
auth.ts
gemini.ts
cloudinary.ts
resend.ts
```

### `validations/`

Contains reusable Zod schemas where appropriate.

### `types/`

Contains shared TypeScript types only when they are genuinely shared.

### `utils/`

Contains small reusable utilities that do not belong to a specific domain.

---

# 6. Database Rules

Use Prisma for database access.

Do not access PostgreSQL directly from UI components.

Database logic should be isolated from presentation code.

Use:

* foreign keys
* unique constraints
* appropriate indexes
* transactions when necessary

Do not add indexes blindly.

Indexes should correspond to actual query patterns.

Prefer UUIDs for public-facing entity identifiers.

Store timestamps consistently in UTC.

---

# 7. Authorization Rules

Authentication and authorization are different.

Authentication determines:

"Who is this user?"

Authorization determines:

"Can this user perform this operation?"

Both must be enforced.

Frontend route protection is not sufficient.

Protected APIs and service methods must also verify authorization.

---

# 8. Company Data Isolation

Company data is private.

A user must only access data belonging to their company.

For every company-owned resource:

1. Authenticate the user.
2. Determine their company.
3. Verify resource ownership.
4. Only then perform the operation.

Do not rely on a client-provided `companyId` without verification.

Never trust IDs supplied by the browser.

---

# 9. IDOR Prevention

Always assume a malicious user can modify IDs in API requests.

For example:

```text
/api/applications/123
```

must not automatically grant access to application `123`.

Verify that application `123` belongs to the authenticated user's company.

---

# 10. Input Validation

Validate all external input.

External input includes:

* request bodies
* query parameters
* route parameters
* form data
* uploaded files
* AI output
* third-party API responses

Use Zod where appropriate.

Never assume client-side validation is sufficient.

---

# 11. API Rules

Use REST conventions.

Examples:

```text
GET
POST
PATCH
DELETE
```

Route handlers should:

1. authenticate
2. authorize
3. validate
4. call service
5. return response

Avoid putting complex business logic directly in route handlers.

---

# 12. Error Handling

Use consistent error responses.

Handle:

* validation errors
* authentication errors
* authorization errors
* not found errors
* conflict errors
* external service errors
* internal errors

Never expose:

* stack traces
* API keys
* database credentials
* internal implementation details

to end users.

---

# 13. AI Rules

All Gemini API calls must go through the AI module/service.

Never call Gemini directly from React components.

Never expose Gemini credentials to the browser.

AI output is untrusted external data.

Validate structured AI responses before using them.

AI-generated information must be clearly distinguished from verified tender data.

Never present AI output as legally binding procurement advice.

---

# 14. Prompt Injection Protection

Tender documents and user-provided text must be treated as untrusted data.

A document may contain instructions such as:

"Ignore previous instructions."

The AI system must treat this as document content, not as an instruction to the application.

System/developer instructions must remain authoritative.

Do not allow tender documents to modify application behavior.

---

# 15. AI Hallucination Handling

AI responses should be grounded in available tender information.

When possible:

* reference the source document
* reference page numbers
* distinguish facts from interpretation
* indicate uncertainty

Do not invent tender requirements.

If the required information is not available, the AI should say that it could not determine the answer.

---

# 16. File Upload Rules

Uploaded files are untrusted.

Validate:

* file type
* file size
* file extension
* MIME type

Do not execute uploaded files.

Use Cloudinary for external storage where appropriate.

Store metadata in PostgreSQL.

---

# 17. Frontend Rules

Prefer Server Components where appropriate.

Use Client Components only when client-side interactivity is actually required.

Use reusable components.

Do not duplicate UI implementations.

Follow the existing shadcn/ui design system.

Maintain responsive behavior.

Every important page should consider:

* loading state
* empty state
* error state
* success state

---

# 18. TypeScript Rules

Use strict TypeScript.

Avoid `any`.

Do not silence type errors with unnecessary casts.

Prefer explicit types for important domain objects.

Reuse existing types instead of creating duplicate representations.

---

# 19. Dependency Rules

Do not install a new dependency simply because it is convenient.

Before adding a dependency:

1. Check whether the project already has equivalent functionality.
2. Check whether native functionality is sufficient.
3. Explain why the dependency is required.
4. Keep the dependency limited to the relevant feature.

Do not introduce major infrastructure dependencies without explicit approval.

---

# 20. Code Modification Rules

Before modifying code:

1. Read the relevant documentation.
2. Inspect the existing implementation.
3. Identify the files that need modification.
4. Create an implementation plan.

During implementation:

* modify only relevant files
* reuse existing abstractions
* avoid unnecessary refactoring
* do not rewrite unrelated code

---

# 21. Testing Rules

Important business logic should have tests.

At minimum, test:

* authentication
* authorization
* company ownership
* tender search
* application workflows
* AI response validation
* important service logic

Before declaring a task complete, run:

```text
lint
typecheck
tests
```

Fix failures caused by the implementation.

---

# 22. Database Migration Rules

Never manually modify the database schema without updating Prisma.

Use Prisma migrations for schema changes.

Before destructive migrations:

* inspect the migration
* verify affected data
* explain potential consequences

Never delete production data casually.

---

# 23. Git Rules

Do not modify the Git history unless explicitly instructed.

Do not force push.

Do not commit secrets.

Use descriptive commits.

Examples:

```text
feat: implement tender search
feat: add company onboarding
fix: prevent cross-company application access
refactor: isolate tender service
test: add eligibility analysis tests
chore: update Prisma schema
```

---

# 24. Documentation Rules

When an architectural decision changes:

Update:

```text
docs/architecture.md
docs/DECISIONS.md
```

When project status changes significantly:

Update:

```text
docs/CURRENT_STATE.md
```

When a feature changes requirements:

Update the appropriate documentation.

---

# 25. Multi-Agent Rules

Multiple AI agents may work on TenderIQ.

The repository documentation is the source of truth.

Before beginning work, every agent must read:

```text
AGENTS.md
```

and the relevant files from:

```text
docs/
```

If another agent previously implemented something:

* inspect the existing code
* do not assume how it works
* do not rewrite it unnecessarily

If documentation and code disagree:

1. identify the discrepancy
2. report it
3. do not silently redesign the system

---

# 26. Agent Handoff Rules

When a task is completed:

1. Run tests.
2. Run typecheck.
3. Run lint.
4. Update `docs/CURRENT_STATE.md`.
5. Report changed files.
6. Report unresolved issues.
7. Report recommended next step.

This allows another AI agent to continue the project safely.

---

# 27. No Autonomous Architecture Changes

The agent must NOT independently introduce:

* Redis
* BullMQ
* microservices
* new databases
* new authentication systems
* new ORM
* new major frameworks
* new infrastructure

without explicit user approval.

---

# 28. Definition of Done

A task is complete only when:

* requested functionality works
* validation exists
* authorization is correct
* errors are handled
* important business logic is tested
* TypeScript passes
* lint passes
* tests pass
* no obvious security issue exists
* documentation is updated if necessary
* no unrelated code was changed

---

# 29. General Principle

Do not optimize for the number of technologies used.

Optimize for:

1. Product value
2. Correctness
3. Security
4. Maintainability
5. User experience
6. Performance
7. Simplicity

The simplest correct architecture is preferred.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
