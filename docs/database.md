# TenderIQ — Database Design

## 1. Database

Primary database:

PostgreSQL

ORM:

Prisma

The database is the source of truth for structured TenderIQ application data.

---

# 2. Core Entities

Initial domain entities:

```text
User
Company
CompanyMember

Tender
TenderDocument
TenderRequirement

SavedTender

Application

AIAnalysis

Notification

SearchHistory
```

---

# 3. User

Represents an authenticated TenderIQ user.

Responsibilities:

* authentication identity
* user profile
* company membership
* role

Conceptual fields:

```text
id
email
name
createdAt
updatedAt
```

Authentication-specific fields should follow the requirements of the selected authentication library.

---

# 4. Company

Represents a business using TenderIQ.

Conceptual fields:

```text
id
name
description
industry
website
location
state
city
annualTurnover
yearsOfExperience
createdAt
updatedAt
```

Additional company information can be added when required by the eligibility system.

---

# 5. CompanyMember

Represents the relationship between a user and a company.

Conceptual fields:

```text
id
companyId
userId
role
createdAt
```

A user can belong to a company through this relationship.

The initial application may support a simplified company membership model, but the schema should not prevent future team functionality.

---

# 6. Tender

Represents a procurement opportunity.

Conceptual fields:

```text
id
referenceNumber
title
description

organization
category

country
state
city
location

estimatedValue
currency

tenderType

publishedAt
submissionDeadline

status

sourceName
sourceUrl

createdAt
updatedAt
```

The tender should retain source information whenever available.

---

# 7. TenderDocument

Represents a document associated with a tender.

Conceptual fields:

```text
id
tenderId

name
fileName
fileUrl
publicId

mimeType
fileSize

documentType

extractedText

createdAt
updatedAt
```

The actual file is stored externally.

The database stores metadata and references.

---

# 8. TenderRequirement

Represents a structured requirement extracted from a tender.

Conceptual fields:

```text
id
tenderId

type
title
description

isMandatory

sourceDocumentId
sourcePage

createdAt
updatedAt
```

Possible requirement types:

```text
FINANCIAL
TECHNICAL
EXPERIENCE
CERTIFICATION
DOCUMENT
LEGAL
ELIGIBILITY
TIMELINE
OTHER
```

---

# 9. SavedTender

Represents a tender saved by a company/user.

Conceptual fields:

```text
id
companyId
tenderId
createdByUserId

notes

createdAt
updatedAt
```

A company should not create duplicate saved records for the same tender unless there is a deliberate reason.

A suitable unique constraint should be considered.

---

# 10. Application

Represents a company's procurement opportunity tracking record.

Conceptual fields:

```text
id

companyId
tenderId
createdByUserId

status

notes

submissionDate
outcomeDate

createdAt
updatedAt
```

Possible statuses:

```text
SAVED
INTERESTED
PREPARING
SUBMITTED
UNDER_EVALUATION
WON
LOST
```

---

# 11. AIAnalysis

Represents AI-generated analysis associated with a tender.

Conceptual fields:

```text
id

tenderId
companyId
userId

type

status

inputReference
result

model
promptVersion

createdAt
updatedAt
```

Possible analysis types:

```text
SUMMARY
ELIGIBILITY
REQUIREMENTS
QUESTION_ANSWER
COMPARISON
PROPOSAL
```

Possible statuses:

```text
PENDING
COMPLETED
FAILED
```

AI output should be stored in a structured form where practical.

---

# 12. Notification

Represents an in-app notification.

Conceptual fields:

```text
id

userId
companyId

type
title
message

isRead

relatedTenderId
relatedApplicationId

createdAt
```

Possible notification types:

```text
DEADLINE
APPLICATION_UPDATE
SYSTEM
AI_ANALYSIS
```

---

# 13. SearchHistory

Represents a user's previous search.

Conceptual fields:

```text
id

userId
companyId

query
filters

createdAt
```

Search history is not required for the initial MVP and can be introduced after the core search system is complete.

---

# 14. Relationships

Conceptual relationship model:

```text
User
 |
 +---- CompanyMember ---- Company
                              |
             +----------------+----------------+
             |                |                |
             v                v                v
        SavedTender      Application      Notification
             |
             v
           Tender
             |
       +-----+------+
       |            |
       v            v
TenderDocument  TenderRequirement
       |
       v
   AIAnalysis
```

---

# 15. Company Data Isolation

Company-owned records should include a company reference where appropriate.

Examples:

```text
SavedTender.companyId
Application.companyId
AIAnalysis.companyId
Notification.companyId
```

Services must verify that the authenticated user belongs to the referenced company.

---

# 16. Primary Keys

All application entities should use stable unique identifiers.

UUIDs are preferred for public-facing entity IDs to reduce predictable sequential identifiers.

---

# 17. Foreign Keys

Relationships should use database foreign keys.

Examples:

```text
TenderDocument.tenderId
TenderRequirement.tenderId
SavedTender.tenderId
Application.tenderId
CompanyMember.companyId
CompanyMember.userId
```

Foreign-key behavior should be explicitly considered for deletion.

---

# 18. Unique Constraints

Potential unique constraints include:

```text
User.email

CompanyMember(companyId, userId)

SavedTender(companyId, tenderId)

Tender.referenceNumber + source
```

The exact constraints should be finalized during Prisma implementation.

---

# 19. Indexes

Indexes should be created for frequently queried fields.

Potential indexes:

### Tender

```text
referenceNumber
category
state
organization
submissionDeadline
publishedAt
status
estimatedValue
```

### SavedTender

```text
companyId
tenderId
```

### Application

```text
companyId
tenderId
status
```

### TenderRequirement

```text
tenderId
type
```

### Notification

```text
userId
isRead
createdAt
```

Indexes should be based on actual query patterns rather than added blindly.

---

# 20. Search

The initial search system should use PostgreSQL.

Potential approaches:

* indexed filters
* partial matching
* PostgreSQL full-text search

Search should support pagination.

Redis and Elasticsearch are not required.

---

# 21. Timestamps

Most entities should contain:

```text
createdAt
updatedAt
```

Time values should be stored consistently in UTC.

The frontend should convert them to the user's local timezone when displaying them.

---

# 22. Soft Delete

Soft deletion should NOT be automatically added to every entity.

Only use it when there is a real business requirement to retain deleted records.

---

# 23. Audit History

A full audit-log system is not required for the initial MVP.

If required later for administrative or enterprise functionality, it should be introduced as a separate design decision.

---

# 24. Database Transactions

Use database transactions when multiple related database changes must succeed or fail together.

Examples:

```text
Create application
+
Create related notification
```

or:

```text
Create company
+
Create initial company membership
```

Do not use transactions unnecessarily for simple reads.

---

# 25. AI Data Storage

AI results should be linked to:

* tender
* company where relevant
* user where relevant

The application should retain enough metadata to understand:

* which AI operation was performed
* which model was used
* which prompt version was used
* when it was generated
* whether it succeeded

---

# 26. Document Storage

Tender documents are stored externally.

PostgreSQL stores:

```text
file URL
public ID
metadata
tender relationship
document type
extracted text where appropriate
```

Large binary files should not be stored directly in PostgreSQL.

---

# 27. Future Database Extensions

Possible future entities:

```text
Organization
TenderSource
TenderCollectionRun
Recommendation
Subscription
UsageRecord
Team
AuditLog
```

These are intentionally excluded from the initial database.

Only introduce them when the corresponding product feature is actually being built.
