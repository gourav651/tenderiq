# TenderIQ — Current Development State

## Project Phase

Pre-development / Architecture Setup

---

## Completed

### Project Setup

* GitHub repository created
* Next.js application initialized
* TypeScript configured
* Tailwind CSS configured
* App Router enabled
* shadcn/ui initialized
* Prisma installed
* Zod installed
* Docker installed and available

### Project Structure

Created:

```text
docs/
prisma/
scripts/
tests/
src/components/
src/modules/
src/lib/
src/validations/
src/types/
src/utils/
```

### Documentation

Completed:

```text
docs/product-requirements.md
docs/feature-priorities.md
docs/architecture.md
docs/database.md
docs/DECISIONS.md
docs/CURRENT_STATE.md
```

### AI Agent Rules

Created:

```text
AGENTS.md
```

---

# Current Architecture

```text
Next.js
   |
   +-- Frontend
   |
   +-- Route Handlers
           |
           v
       Services
           |
           v
        Prisma
           |
           v
      PostgreSQL
```

External services:

```text
Gemini
Cloudinary
Resend
```

Development infrastructure:

```text
Docker
```

---

# Explicitly Excluded

The initial architecture does not use:

* Redis
* BullMQ
* RabbitMQ
* Kafka
* Kubernetes
* Elasticsearch
* Vector database
* Microservices

---

# Current Database Status

Completed production-ready Prisma schema in `prisma/schema.prisma`.
Generated Prisma Client v7 at `src/generated/prisma`.
Established database client wrapper in `src/lib/prisma.ts` with base64 connection URL decoder for Prisma Postgres.
Defined standard API response interface in `src/types/api.ts`.
Completed database schema push (`npx prisma db push`) and executed database seed (`npx prisma db seed` via `prisma/seed.ts`) with demo company, demo users, tenders, document metadata, tender requirements, applications, and pre-generated AI analyses.

---

# Current Authentication Status

Completed. Integrated **Better Auth** with PostgreSQL Prisma adapter:
* Central Auth setup: `src/lib/auth.ts`
* Client Auth helper: `src/lib/auth-client.ts`
* Route Handlers: `src/app/api/auth/[...all]/route.ts`
* Auth pages: `src/app/login/page.tsx` & `src/app/register/page.tsx`

# Current Company Module & Multi-Tenancy Status

Completed.
* Company repository: `src/modules/company/company.repository.ts`
* Company service: `src/modules/company/company.service.ts`
* Zod validation schemas: `src/modules/company/company.schema.ts`
* IDOR & Tenant Authorization Guard: `AuthService.getAuthCompany()` & `AuthService.verifyCompanyAccess()` in `src/modules/auth/auth.service.ts`
* API endpoints: `POST /api/company/onboarding`, `GET /api/company/me`, `PATCH /api/company/me`
* Onboarding UI form: `src/app/onboarding/page.tsx`

---

# Current AI Status

Completed. Integrated **Gemini API** (`@google/genai`) in centralized AI module (`src/modules/ai/ai.service.ts` & `src/lib/gemini.ts`):
* Implemented `AIService.parseSearchIntent` to parse natural language procurement queries into structured database search criteria.
* Added prompt injection guard and fallback heuristic parser.

---

# Current Tender Discovery & Search Status (Phase 3)

Completed.
* Tender Repository: `src/modules/tender/tender.repository.ts`
* Tender Service: `src/modules/tender/tender.service.ts`
* Zod validation schemas: `src/modules/tender/tender.schema.ts`
* API Route Handlers: `GET /api/tenders`, `GET /api/tenders/options`, `GET /api/tenders/[id]`
* UI Pages & Components: `src/app/tenders/page.tsx` (Tender Discovery Hub with AI natural language search), `src/app/tenders/[id]/page.tsx` (Tender details & AI summary view), `src/components/navbar.tsx`.

---

# Current Application Status

Database models and seed data ready for application tracking and submission workflows.

---

# Next Milestone

Phase 4: Document Intelligence & AI Eligibility Analysis Module (`src/modules/document/` & `src/modules/ai/`)

1. Build document upload and processing pipeline with Cloudinary integration.
2. Implement AI eligibility analysis engine comparing company turnover, experience, and certifications against tender requirements.
3. Build Application tracking workflows (Saved, Interested, Preparing, Submitted).

---

# Important Instructions for Future Agents

Do not assume the project should use additional infrastructure.

Read:

```text
AGENTS.md
docs/architecture.md
docs/DECISIONS.md
```

before making architectural changes.

Do not introduce Redis, BullMQ, microservices, or other major infrastructure without explicit approval.

---

# Last Updated

2026-09-04

