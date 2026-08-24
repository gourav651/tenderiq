# TenderIQ — Architecture Decisions

This document records important architectural decisions so that future developers and AI agents understand why the system is designed the way it is.

---

# ADR-001 — Use a Modular Monolith

## Decision

TenderIQ will use a modular monolith instead of microservices.

## Reason

TenderIQ is being developed as a solo project with a relatively small initial user base.

A modular monolith provides:

* simpler deployment
* simpler debugging
* simpler local development
* lower infrastructure cost
* faster feature development
* clear separation of business domains

The codebase will still use modular boundaries so that future extraction into services remains possible if genuinely required.

---

# ADR-002 — Use Next.js for Frontend and Backend

## Decision

Use Next.js App Router for both frontend and backend API functionality.

## Reason

A separate Express backend would introduce another deployable service without solving a current business problem.

Next.js Route Handlers provide sufficient API capabilities for the initial TenderIQ architecture.

---

# ADR-003 — Use PostgreSQL

## Decision

PostgreSQL is the primary database.

## Reason

TenderIQ contains strongly relational data:

* companies
* users
* tenders
* documents
* requirements
* saved tenders
* applications
* notifications
* AI analyses

PostgreSQL provides strong relational integrity, filtering, indexing, transactions, and full-text search capabilities.

---

# ADR-004 — Use Prisma

## Decision

Prisma is the ORM.

## Reason

Prisma provides:

* type-safe database access
* migrations
* schema management
* good TypeScript integration
* developer-friendly database workflows

---

# ADR-005 — Do Not Use Redis Initially

## Decision

Redis will not be used in the initial architecture.

## Reason

TenderIQ does not initially require a dedicated distributed cache.

Performance will first be handled using:

* PostgreSQL indexes
* efficient queries
* pagination
* Next.js caching/revalidation
* appropriate database design

Redis can be introduced later if actual measured requirements justify it.

---

# ADR-006 — Do Not Use BullMQ Initially

## Decision

BullMQ will not be used in the initial architecture.

## Reason

The initial project does not require a distributed background job infrastructure.

Document processing, AI analysis, ingestion, and notifications can initially use simpler server-side or scheduled mechanisms.

If processing volume later requires a queue, BullMQ can be reconsidered.

---

# ADR-007 — Do Not Use Elasticsearch Initially

## Decision

Elasticsearch will not be used.

## Reason

PostgreSQL is sufficient for the initial tender search requirements.

The application can use:

* indexes
* filtering
* sorting
* PostgreSQL full-text search

A dedicated search engine should only be introduced when PostgreSQL can no longer meet measured requirements.

---

# ADR-008 — No Vector Database Initially

## Decision

A vector database will not be used in the initial version.

## Reason

Initial AI features can work with:

* extracted document text
* controlled text chunks
* Gemini
* PostgreSQL-stored metadata

Advanced RAG can be introduced later if document scale makes it necessary.

---

# ADR-009 — Gemini for AI

## Decision

Gemini API will provide the initial LLM functionality.

## Reason

TenderIQ requires LLM capabilities rather than custom ML model training.

Gemini will be used for:

* summarization
* requirement extraction
* eligibility analysis
* question answering
* future proposal generation

---

# ADR-010 — Cloudinary for Documents

## Decision

Cloudinary will be used for external document storage.

## Reason

Tender documents can be large and should not be stored as binary data directly inside PostgreSQL.

The database stores metadata and external file references.

---

# ADR-011 — Resend for Email

## Decision

Resend will provide application emails.

## Reason

TenderIQ only requires transactional email functionality during the initial version.

---

# ADR-012 — Docker for Development

## Decision

Docker will be used primarily to provide the local PostgreSQL environment.

## Reason

Docker provides reproducible development environments without requiring developers to install PostgreSQL directly.

---

# ADR-013 — No Kubernetes

## Decision

Kubernetes will not be used.

## Reason

TenderIQ does not have infrastructure requirements that justify Kubernetes.

Vercel and managed PostgreSQL are sufficient for the initial product.

---

# ADR-014 — AI Is Not the Source of Truth

## Decision

AI-generated information is not treated as authoritative tender information.

## Reason

LLMs can hallucinate or incorrectly interpret procurement requirements.

Verified tender information should come from stored tender data and source documents.

AI output should be clearly labeled as AI-generated.

---

# ADR-015 — LLM Translates Intent, Database Retrieves Data

## Decision

Natural-language search will use Gemini to convert user intent into structured filters.

PostgreSQL will perform the actual database query.

## Reason

This keeps database access deterministic and prevents the LLM from directly controlling database queries.

---

# ADR-016 — Company as a Security Boundary

## Decision

Company ownership will be enforced at the backend/service layer.

## Reason

TenderIQ is a B2B product.

Users must not be able to access another company's saved tenders, applications, AI analyses, or private information.

---

# ADR-017 — Architecture Evolves Based on Requirements

## Decision

New infrastructure should only be introduced when actual product requirements justify it.

## Reason

Production-grade engineering means choosing appropriate complexity, not maximum complexity.

Every major architectural change must be documented.
