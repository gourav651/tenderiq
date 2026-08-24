# TenderIQ — System Architecture

## 1. Architecture Style

TenderIQ will use a **modular monolith architecture**.

The application will be deployed as a single Next.js application containing:

* frontend
* API routes
* authentication
* business logic
* database access
* AI integration

The system will not be split into microservices during the initial development.

---

# 2. High-Level Architecture

```text
                        User
                          |
                          v
                    Vercel / Next.js
                          |
          +---------------+----------------+
          |               |                |
          v               v                v
       Frontend       Route Handlers     Auth
          |               |
          |               v
          |          Service Layer
          |               |
          |               v
          |          Repository/Data
          |               |
          |               v
          |          Prisma ORM
          |               |
          |               v
          |       Neon PostgreSQL
          |
          +-------------------------------+
                          |
             +------------+------------+
             |            |            |
             v            v            v
          Gemini      Cloudinary     Resend
            AI           Files        Email
```

---

# 3. Frontend Architecture

Frontend technology:

* Next.js App Router
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

The frontend should be divided into:

### Pages

Located under:

```text
src/app/
```

### Reusable components

Located under:

```text
src/components/
```

### Feature-specific business logic

Located under:

```text
src/modules/
```

UI components should not contain database queries or sensitive business logic.

---

# 4. Backend Architecture

Next.js Route Handlers will provide REST APIs.

Example:

```text
src/app/api/tenders/route.ts
```

The Route Handler should remain thin.

Preferred flow:

```text
Route Handler
      |
      v
Validation
      |
      v
Service
      |
      v
Repository / Data Access
      |
      v
Prisma
      |
      v
PostgreSQL
```

The route should not contain large amounts of business logic.

---

# 5. Module Architecture

Business domains will be organized into modules:

```text
src/modules/

auth/
company/
tender/
document/
ai/
application/
notification/
analytics/
```

Each module can contain:

```text
service
repository
schema
types
utilities
```

Example:

```text
src/modules/tender/

tender.service.ts
tender.repository.ts
tender.schema.ts
tender.types.ts
```

Only create files that are actually needed.

---

# 6. Database Architecture

PostgreSQL is the primary persistent datastore.

Prisma is the ORM.

All application database access should go through Prisma.

The application should use:

* foreign keys
* unique constraints
* indexes
* transactions where necessary
* appropriate cascading rules

Database schema design should prioritize data integrity.

---

# 7. Authentication Architecture

Better Auth will manage authentication and sessions.

Protected requests should follow:

```text
Request
  |
  v
Authentication
  |
  v
User identity
  |
  v
Authorization
  |
  v
Business logic
```

Authentication answers:

"Who is the user?"

Authorization answers:

"Is this user allowed to perform this action?"

Both must be implemented separately.

---

# 8. Authorization / RBAC

The initial roles are:

```text
USER
ADMIN
```

A normal user should only access resources belonging to their company.

An administrator can access administrative functionality.

Every company-owned resource must be checked for ownership.

Never rely only on frontend route protection.

Authorization must also be enforced at the API/service level.

---

# 9. Company Data Isolation

A user's company should be treated as a security boundary.

For example:

```text
Company A
    |
    +-- User A
    +-- Saved Tender A
    +-- Application A
```

User A must not be able to access:

```text
Company B
    |
    +-- Application B
```

simply by changing an ID in an API request.

The service layer must verify ownership.

---

# 10. Tender Data Architecture

Tender records will be stored in PostgreSQL.

Tender documents will be stored externally through Cloudinary.

The database stores document metadata and references.

Conceptually:

```text
Tender
   |
   +--- TenderDocument
             |
             +--- Cloudinary URL
```

The system should retain the original tender source URL whenever available.

---

# 11. AI Architecture

AI requests must be centralized.

Preferred flow:

```text
User
 |
 v
Tender API
 |
 v
AI Service
 |
 v
Prompt Builder
 |
 v
Gemini API
 |
 v
Structured Output
 |
 v
Validation
 |
 v
Database
 |
 v
Response
```

The Gemini API key must never be exposed to the browser.

---

# 12. AI Output Validation

AI output must not be blindly trusted.

Whenever structured output is expected:

```text
Gemini
  |
  v
JSON
  |
  v
Zod validation
  |
  +---- invalid ---> error/retry/fallback
  |
  v
Valid data
```

AI output should be treated as untrusted external data.

---

# 13. Document Intelligence

Initial document processing:

```text
PDF
 |
 v
Cloudinary
 |
 v
Text extraction
 |
 v
AI Service
 |
 v
Summary / Requirements / Q&A
```

The initial system does not require a vector database.

If document size requires chunking, the application may implement simple chunking and relevant-text selection before sending content to Gemini.

Advanced RAG can be considered later.

---

# 14. Natural-Language Search Architecture

Example:

```text
User:
"Find solar tenders in Odisha below ₹5 crore closing within 30 days."
                     |
                     v
               Gemini Service
                     |
                     v
             Structured Filters
                     |
                     v
               Zod Validation
                     |
                     v
              Tender Service
                     |
                     v
                PostgreSQL
                     |
                     v
                Results
```

The AI does not directly query the database.

The application remains responsible for the actual query.

---

# 15. Search Architecture

Initial search will use PostgreSQL.

Search capabilities can include:

* exact filters
* partial matching
* PostgreSQL full-text search
* indexed columns
* pagination
* sorting

The application will not use Elasticsearch initially.

Redis will not be used for search caching initially.

---

# 16. File Storage

Cloudinary will store uploaded tender-related files where appropriate.

The database stores:

* file URL
* public identifier
* filename
* content type
* file size
* related tender
* upload metadata

File uploads must be validated.

---

# 17. Email

Resend will be used for email delivery.

Example flow:

```text
Application event / deadline condition
              |
              v
       Notification Service
              |
              v
            Resend
              |
              v
            Email
```

The initial system will not introduce BullMQ or a distributed job queue.

---

# 18. Background Processing

The initial architecture intentionally avoids:

* Redis
* BullMQ
* RabbitMQ
* Kafka

Operations such as:

* document processing
* AI analysis
* notifications
* ingestion

will initially use simple server-side or scheduled mechanisms appropriate to the deployment environment.

If real production requirements later demonstrate that a queue is necessary, it can be introduced as a separate architectural decision.

---

# 19. Caching

The initial version will not introduce Redis.

Performance will first be improved through:

* PostgreSQL indexes
* efficient queries
* pagination
* selecting only required fields
* avoiding N+1 queries
* appropriate Next.js caching/revalidation
* minimizing unnecessary API calls

A dedicated caching layer will only be introduced if measured performance requires it.

---

# 20. Rate Limiting

Rate limiting should be applied where necessary, particularly to:

* authentication endpoints
* AI endpoints
* file upload endpoints
* public APIs

The implementation should prefer the simplest deployment-compatible solution.

A Redis-based distributed rate limiter is not required for the initial version.

---

# 21. Error Handling

API errors should have consistent responses.

The application should distinguish:

* validation errors
* authentication errors
* authorization errors
* not found
* conflict
* external API failures
* internal server errors

Sensitive implementation details must not be exposed to users.

---

# 22. Logging

The application should provide useful server-side logs for:

* API errors
* AI failures
* document processing failures
* authentication problems
* ingestion failures

Logs must not expose:

* passwords
* authentication tokens
* API keys
* sensitive company information

---

# 23. Security Principles

TenderIQ must protect against common web vulnerabilities including:

* broken access control
* IDOR
* XSS
* CSRF where applicable
* injection
* malicious file uploads
* secret exposure
* insecure AI prompt handling
* unauthorized company data access

All external input must be validated.

---

# 24. Docker Architecture

Docker will primarily be used for local development.

Initial Docker environment:

```text
Docker Compose
     |
     +--- PostgreSQL
```

Next.js can run locally during development.

The architecture does not require Redis or other infrastructure containers.

---

# 25. Deployment Architecture

Production:

```text
                    Internet
                       |
                       v
                    Vercel
                       |
                    Next.js
                       |
         +-------------+-------------+
         |             |             |
         v             v             v
       Neon        Cloudinary      Gemini
    PostgreSQL       Storage          AI
                       |
                     Resend
```

A separate Express backend is not required.

---

# 26. Environment Management

Development secrets:

```text
.env.local
```

Example environment configuration:

```text
DATABASE_URL
BETTER_AUTH_SECRET
GEMINI_API_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
RESEND_API_KEY
```

Secrets must never be committed to Git.

---

# 27. Architectural Constraints

The following technologies must NOT be introduced without an explicit architectural decision:

* Redis
* BullMQ
* RabbitMQ
* Kafka
* Kubernetes
* microservices
* Elasticsearch
* vector database
* event sourcing
* CQRS

The default architecture should always prefer the simpler solution.

---

# 28. Architecture Evolution

The architecture should evolve based on actual requirements.

Future technologies may be introduced if:

1. A real requirement exists.
2. The current architecture cannot reasonably solve it.
3. The tradeoffs are documented.
4. The added complexity is justified.
5. The decision is recorded in DECISIONS.md.

No technology should be introduced merely because it is considered "production-grade."

---

# 29. Core Engineering Principle

TenderIQ should be:

* modular
* maintainable
* secure
* testable
* scalable enough for the project's expected usage
* understandable by another developer

The project should demonstrate strong engineering fundamentals rather than unnecessary infrastructure complexity.
