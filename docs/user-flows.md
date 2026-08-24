# TenderIQ — User Flows

## 1. Public Website

```text
Landing Page
    |
    +-- Product Overview
    +-- Features
    +-- How It Works
    +-- Pricing/Future
    +-- Login
    +-- Sign Up
```

The landing page should communicate the procurement intelligence value rather than presenting TenderIQ as a generic tender management system.

---

# 2. Registration Flow

```text
Landing Page
     |
     v
Sign Up
     |
     v
Create Account
     |
     v
Create Company
     |
     v
Company Onboarding
     |
     v
Dashboard
```

---

# 3. Company Onboarding

```text
Company Name
     |
     v
Industry
     |
     v
Location
     |
     v
Annual Turnover
     |
     v
Experience
     |
     v
Certifications
     |
     v
Areas of Operation
     |
     v
Procurement Preferences
     |
     v
Complete
     |
     v
Dashboard
```

The onboarding information will later be used by the AI-assisted eligibility system.

---

# 4. Dashboard Flow

```text
Login
  |
  v
Dashboard
  |
  +-- Recommended/Relevant Tenders
  |
  +-- Upcoming Deadlines
  |
  +-- Saved Tenders
  |
  +-- Active Applications
  |
  +-- Procurement Statistics
```

The dashboard should provide actionable information rather than only display statistics.

---

# 5. Tender Discovery Flow

```text
Dashboard
    |
    v
Tender Discovery
    |
    +-- Search
    |
    +-- Filters
    |
    +-- Sorting
    |
    +-- Pagination
    |
    v
Tender Results
    |
    v
Tender Details
```

---

# 6. Keyword Search

Example:

```text
User enters:

solar
```

Flow:

```text
Search Input
    |
    v
Tender API
    |
    v
PostgreSQL
    |
    v
Filtered Results
```

---

# 7. Natural Language Search

Example:

```text
"Find solar tenders in Odisha below ₹5 crore closing within 30 days."
```

Flow:

```text
User Query
    |
    v
AI Service
    |
    v
Structured Search Filters
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
Tender Results
```

The AI does not directly access the database.

---

# 8. Tender Details Flow

```text
Tender Results
      |
      v
Tender Details
      |
      +-- Overview
      |
      +-- Requirements
      |
      +-- Documents
      |
      +-- AI Analysis
      |
      +-- Eligibility
      |
      +-- Ask AI
      |
      +-- Save Tender
      |
      +-- Track Application
```

---

# 9. Tender Document Flow

```text
Tender Details
      |
      v
Documents
      |
      v
Select PDF
      |
      +-- View
      |
      +-- Download
      |
      +-- Analyze with AI
```

---

# 10. AI Summary Flow

```text
Tender Details
      |
      v
Generate AI Summary
      |
      v
AI Service
      |
      v
Gemini
      |
      v
Validate Output
      |
      v
Save Analysis
      |
      v
Display Summary
```

The UI should clearly label the result as AI-generated.

---

# 11. Eligibility Flow

```text
Tender
      |
      +
      |
Company Profile
      |
      v
Eligibility Analysis
      |
      v
Gemini
      |
      v
Analysis
      |
      +-- Matching Requirements
      |
      +-- Missing Requirements
      |
      +-- Uncertain Requirements
      |
      +-- Explanation
```

---

# 12. Tender Q&A Flow

```text
Tender Details
      |
      v
Ask Question
      |
      v
Question
      +
Tender Document Content
      |
      v
AI Service
      |
      v
Gemini
      |
      v
Answer
      |
      v
Display Answer
```

Where possible, the answer should provide document/page references.

---

# 13. Save Tender Flow

```text
Tender Details
      |
      v
Save Tender
      |
      v
Create SavedTender
      |
      v
Dashboard / Saved Tenders
```

Unsave:

```text
Saved Tender
      |
      v
Unsave
      |
      v
Remove SavedTender
```

---

# 14. Application Tracker Flow

```text
Tender
   |
   v
Track Application
   |
   v
Create Application
   |
   v
Interested
   |
   v
Preparing
   |
   v
Submitted
   |
   v
Under Evaluation
   |
   +----> Won
   |
   +----> Lost
```

Users should be able to add notes and relevant dates.

---

# 15. Deadline Flow

```text
Saved Tender / Application
          |
          v
Submission Deadline
          |
          v
Calculate Days Remaining
          |
          +----> Dashboard
          |
          +----> Notification
          |
          +----> Email
```

---

# 16. Notification Flow

```text
Deadline / Application Event
          |
          v
Notification Service
          |
          +----> In-App Notification
          |
          +----> Email via Resend
```

---

# 17. Analytics Flow

```text
Dashboard
    |
    v
Analytics
    |
    +-- Saved Tenders
    +-- Applications
    +-- Active Applications
    +-- Won/Lost
    +-- Tender Categories
    +-- Geographic Distribution
    +-- Tender Values
```

Analytics should be based on meaningful procurement activity.

---

# 18. Company Profile Flow

```text
Dashboard
    |
    v
Company Settings
    |
    +-- Company Information
    +-- Business Details
    +-- Experience
    +-- Certifications
    +-- Procurement Preferences
```

Changes should affect future eligibility analysis.

---

# 19. Admin Flow

```text
Admin Login
     |
     v
Admin Dashboard
     |
     +-- Users
     |
     +-- Companies
     |
     +-- Tenders
     |
     +-- Ingestion
     |
     +-- Platform Analytics
```

Admin routes must be protected by backend authorization.

---

# 20. Error Flows

Every important flow should handle:

```text
Loading
Error
Empty State
Success
```

Examples:

### Tender Search

```text
Search
  |
  +-- Loading
  |
  +-- Results
  |
  +-- No Results
  |
  +-- Error
```

### AI Analysis

```text
Request AI
    |
    +-- Processing
    |
    +-- Success
    |
    +-- Invalid Response
    |
    +-- Gemini Error
    |
    +-- Retry
```

---

# 21. Unauthorized Access

```text
Unauthenticated User
        |
        v
Protected Page
        |
        v
Login
```

Authenticated but unauthorized:

```text
USER
 |
 v
Admin Route
 |
 v
403 / Unauthorized
```

---

# 22. Company Data Isolation

```text
User A
  |
  v
Company A
  |
  +-- Applications
  +-- Saved Tenders
  +-- Private AI Analysis
```

User A must never be able to access:

```text
Company B
```

through manipulated URLs or API parameters.

---

# 23. Primary Product Loop

The most important end-to-end flow is:

```text
Discover
   |
   v
Understand
   |
   v
Evaluate
   |
   v
Save
   |
   v
Track
   |
   v
Act
```

TenderIQ should optimize the product around this loop.
