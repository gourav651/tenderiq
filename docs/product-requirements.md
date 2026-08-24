# TenderIQ — Product Requirements

## 1. Product Overview

TenderIQ is an AI-powered procurement intelligence platform that helps businesses discover, understand, evaluate, and track government tenders from a centralized platform.

The product is designed for businesses that regularly participate in government procurement and currently spend significant time searching procurement portals, reading tender documents, evaluating eligibility, and tracking deadlines.

TenderIQ is not intended to be a simple CRUD-based tender management application.

The core product value is procurement intelligence:

* Discover relevant tenders
* Understand tender requirements
* Evaluate company eligibility
* Ask questions about tender documents
* Track procurement opportunities
* Reduce manual research
* Reduce missed deadlines

---

## 2. Problem

Businesses participating in government procurement commonly face the following problems:

### Fragmented discovery

Relevant tenders are distributed across different procurement portals and organizations.

### Time-consuming document analysis

Tender documents can contain dozens or hundreds of pages of technical, financial, legal, and administrative requirements.

### Eligibility uncertainty

Companies must manually compare their qualifications, experience, turnover, certifications, and other capabilities against tender requirements.

### Missed deadlines

Important tender opportunities can be missed because submission deadlines are difficult to track across multiple portals.

### Lack of centralized workflow

Companies often use spreadsheets, email, bookmarks, and separate systems to track procurement opportunities.

### Lack of procurement intelligence

Businesses have limited visibility into:

* frequently issued tender categories
* organizations issuing tenders
* geographic opportunities
* tender values
* upcoming deadlines
* historical application activity

---

## 3. Target Users

Primary users:

* Software companies
* Construction companies
* Infrastructure companies
* Solar companies
* Engineering companies
* MSMEs
* Startups
* Government contractors
* Procurement consultants

The initial product will focus on a company-level user rather than building a complex enterprise organization system.

---

## 4. Core Value Proposition

TenderIQ should allow a business to move from:

"Search multiple websites → download PDFs → manually read documents → determine eligibility → track deadlines"

to:

"Search TenderIQ → understand the opportunity → evaluate eligibility → save it → track the application → receive deadline reminders."

---

## 5. Core User Journey

The primary user journey is:

1. User creates an account.
2. User creates or joins a company.
3. User completes the company profile.
4. User specifies procurement interests.
5. User opens the Tender Discovery page.
6. User searches and filters tenders.
7. User opens a tender.
8. User reviews tender information and documents.
9. User requests an AI summary.
10. User reviews extracted requirements.
11. User checks company eligibility.
12. User asks questions about the tender.
13. User saves the tender.
14. User creates an application/tracking record.
15. User tracks the application.
16. User receives deadline reminders.
17. User reviews procurement activity through analytics.

---

# 6. Core Product Modules

TenderIQ consists of the following logical modules:

### Authentication

Responsible for:

* registration
* login
* logout
* sessions
* protected routes
* authorization

### Company

Responsible for:

* company profile
* company information
* business category
* turnover
* experience
* certifications
* areas of operation
* procurement preferences

### Tender

Responsible for:

* tender records
* tender discovery
* search
* filtering
* sorting
* tender details
* tender status
* source information

### Document

Responsible for:

* tender documents
* PDF metadata
* document storage
* document processing
* extracted text

### AI

Responsible for:

* tender summaries
* requirement extraction
* eligibility analysis
* tender question answering
* tender comparison
* proposal generation in future phases

### Saved Tender

Responsible for:

* saving tenders
* removing saved tenders
* saved tender dashboard

### Application

Responsible for:

* procurement opportunity tracking
* application status
* notes
* submission tracking
* outcome tracking

### Notification

Responsible for:

* in-app notifications
* deadline reminders
* email notifications

### Analytics

Responsible for:

* procurement activity
* saved tender statistics
* application statistics
* tender category trends
* geographic trends

### Admin

Responsible for:

* user management
* company management
* tender management
* platform statistics
* tender ingestion management

---

# 7. Tender Discovery

Tender Discovery is the central feature of TenderIQ.

Users should be able to search tenders using:

* keywords
* natural-language queries
* category
* state
* city
* organization
* tender type
* estimated value
* publication date
* submission deadline

Users should be able to sort results by:

* relevance
* newest
* deadline
* tender value

The system must support pagination.

Search filters should be represented in URL parameters where appropriate so that search results can be shared and revisited.

---

# 8. Natural Language Search

TenderIQ should support natural-language procurement queries such as:

"Find solar tenders in Odisha below ₹5 crore closing within 30 days."

The AI layer should convert the user's intent into structured search filters.

Example:

```json
{
  "category": "solar",
  "state": "Odisha",
  "maxValue": 50000000,
  "deadlineWithinDays": 30
}
```

The application must then perform the actual database query using PostgreSQL.

The LLM must not directly determine which database records to return.

The LLM translates user intent into structured filters.

PostgreSQL retrieves the actual data.

---

# 9. Tender Details

Each tender should have a dedicated detail page containing:

* title
* reference number
* issuing organization
* category
* location
* estimated value
* publication date
* submission deadline
* tender type
* description
* source portal
* original source URL
* documents
* extracted requirements
* AI analysis
* save action
* application tracking action

---

# 10. AI Tender Summary

Users should be able to request an AI-generated summary of a tender document.

The summary should attempt to identify:

* tender objective
* estimated value
* submission deadline
* eligibility requirements
* technical requirements
* financial requirements
* required documents
* certifications
* important conditions
* potential risks

AI-generated information must be clearly labeled as AI-generated.

The application must not represent AI output as authoritative legal or procurement advice.

---

# 11. AI Requirement Extraction

Tender documents should be analyzed to extract structured requirements.

Possible requirement categories:

* financial
* technical
* experience
* certification
* legal
* documentation
* eligibility
* timeline

Requirements should be stored when practical so they can be reused by other features.

---

# 12. AI Eligibility Analysis

The eligibility system compares:

Company Profile

against:

Tender Requirements

The result should contain:

* overall assessment
* matching requirements
* missing requirements
* uncertain requirements
* explanation

The system should clearly distinguish:

* verified company information
* extracted tender requirements
* AI-generated interpretation

The result is an AI-assisted assessment and must not be presented as a legally binding eligibility decision.

---

# 13. Tender Question Answering

Users should be able to ask questions about an individual tender.

Examples:

* What documents are mandatory?
* What is the submission deadline?
* What is the minimum turnover requirement?
* Is previous government experience required?

The AI should answer using the available tender document content.

Where possible, answers should identify the relevant document or page/source.

The system should avoid making unsupported claims.

---

# 14. Saved Tenders

Users can save tenders for later review.

The saved tender dashboard should show:

* tender
* deadline
* value
* organization
* application status
* days remaining

---

# 15. Application Tracker

Users can track procurement opportunities through statuses such as:

* Saved
* Interested
* Preparing
* Submitted
* Under Evaluation
* Won
* Lost

Users should be able to maintain notes and important dates.

---

# 16. Notifications

TenderIQ should notify users about important events such as:

* upcoming tender deadline
* application status changes
* important saved tender events

Email notifications will use Resend.

The initial implementation does not require Redis or BullMQ.

---

# 17. Analytics

The analytics dashboard should provide useful procurement insights such as:

* number of saved tenders
* number of active applications
* submitted applications
* won/lost applications
* upcoming deadlines
* tenders by category
* tenders by geography
* tender value distribution

Analytics should focus on useful business information rather than decorative charts.

---

# 18. Admin Dashboard

Administrators should be able to:

* view users
* view companies
* manage tender records
* inspect tender ingestion
* view platform statistics

Admin capabilities must be protected by role-based authorization.

---

# 19. Tender Data Strategy

The initial system will use a controlled dataset of tender records for development and demonstration.

A seed/ingestion mechanism will be created.

The system should be designed so additional procurement data sources can be integrated later.

The initial version does not require a large distributed scraping infrastructure.

The system will not use Redis, BullMQ, RabbitMQ, Kafka, or microservices for tender ingestion.

---

# 20. Non-Goals

The initial TenderIQ version will NOT implement:

* microservices
* Kubernetes
* Redis
* BullMQ
* RabbitMQ
* Kafka
* Elasticsearch
* complex event-driven architecture
* vector databases
* custom machine-learning model training
* enterprise billing
* complex multi-tenant enterprise administration
* automated procurement submission to government portals

These may be considered future improvements if the product requires them.

---

# 21. Technology Direction

Frontend:

* Next.js App Router
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

Backend:

* Next.js Route Handlers
* Node.js runtime
* REST APIs
* modular service architecture

Database:

* PostgreSQL
* Prisma ORM

Authentication:

* Better Auth

Storage:

* Cloudinary

AI:

* Gemini API

Email:

* Resend

Infrastructure:

* Docker
* Docker Compose for local development

Deployment:

* Vercel
* Neon PostgreSQL

---

# 22. Product Principles

TenderIQ should follow these principles:

### Product over technology

Do not introduce technology simply to make the project appear more advanced.

### Simplicity

Prefer the simplest architecture that solves the current problem.

### AI as an assistant

AI should improve procurement workflows rather than exist as a generic chatbot.

### Data correctness

Tender information should be based on actual stored data and source documents whenever possible.

### Security

Users must not be able to access another company's private information.

### Maintainability

The codebase should be understandable by another developer.

### Extensibility

The architecture should allow future integrations without requiring a complete rewrite.

### Production mindset

The application should handle validation, errors, authorization, testing, logging, and deployment properly.
