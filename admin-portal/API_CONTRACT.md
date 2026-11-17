# Code Eagle Admin Portal — API Contract & Backend Specification

This document defines the complete RESTful API contract required by the **Code Eagle Info Solutions Pvt. Ltd.** Admin Portal frontend.

The frontend is currently powered by a mock database layer (`mockDb.js`) when `VITE_USE_MOCK=true`. When `VITE_USE_MOCK=false`, the frontend Axios instance makes HTTP requests to `VITE_API_URL` matching the exact endpoints, query parameters, request bodies, and response shapes documented below.

---

## 1. Global Standards & Conventions

- **Base URL:** `http://localhost:5000/api` (configurable via `VITE_API_URL`)
- **Content-Type:** `application/json`
- **Authentication Scheme:** `Bearer <JWT_TOKEN>` via the `Authorization` request header.
- **Error Response Shape:**
  ```json
  {
    "status": "error",
    "message": "Human-readable error description",
    "errors": [] // optional validation error details
  }
  ```
- **Standard HTTP Status Codes:**
  - `200 OK`: Request succeeded.
  - `201 Created`: Resource successfully created.
  - `400 Bad Request`: Validation failure or malformed payload.
  - `401 Unauthorized`: Token missing, expired, or invalid. The frontend automatically logs out and redirects to `/login`.
  - `403 Forbidden`: Authenticated user lacks required permissions (e.g. Editor trying to access Admin endpoints).
  - `404 Not Found`: Target resource does not exist.
  - `500 Internal Server Error`: Unexpected server exception.

---

## 2. Authentication Endpoints

### 2.1 User Login
Authenticates an administrator or editor.

- **Method & Path:** `POST /api/auth/login`
- **Authentication Required:** No
- **Request Body:**
  ```json
  {
    "email": "admin@codeeagle.in",
    "password": "Admin@123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr-1",
      "email": "admin@codeeagle.in",
      "name": "Admin Eagle",
      "role": "admin", // "admin" | "editor"
      "avatar": "https://images.unsplash.com/photo-..."
    }
  }
  ```

### 2.2 Current Authenticated User
Validates the current session token on page reload.

- **Method & Path:** `GET /api/auth/me`
- **Authentication Required:** Yes (`Bearer <token>`)
- **Success Response (200 OK):**
  ```json
  {
    "id": "usr-1",
    "email": "admin@codeeagle.in",
    "name": "Admin Eagle",
    "role": "admin",
    "avatar": "https://images.unsplash.com/photo-..."
  }
  ```

### 2.3 User Logout (Optional Backend Invalidation)
- **Method & Path:** `POST /api/auth/logout`
- **Authentication Required:** Yes
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

## 3. Services Management Endpoints

### 3.1 List Services
Returns all services, with optional search filtering.

- **Method & Path:** `GET /api/admin/services`
- **Authentication Required:** Yes
- **Query Parameters:**
  - `search` *(optional, string)*: Filter by service name or description substring.
- **Success Response (200 OK):**
  ```json
  [
    {
      "id": "srv-1",
      "name": "Web Development",
      "description": "High-performance, scalable web portals and enterprise applications...",
      "icon": "Globe", // Lucide icon key: Globe, Smartphone, Brain, Cloud, Palette, Briefcase, Database, Shield, Cpu, Code
      "active": true,
      "createdAt": "2026-01-10T09:00:00.000Z",
      "updatedAt": "2026-01-10T09:00:00.000Z"
    }
  ]
  ```

### 3.2 Get Single Service
- **Method & Path:** `GET /api/admin/services/:id`
- **Authentication Required:** Yes
- **Success Response (200 OK):** Service object as above.

### 3.3 Create Service
- **Method & Path:** `POST /api/admin/services`
- **Authentication Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "Cybersecurity & Pentesting",
    "description": "Comprehensive enterprise security auditing, threat prevention, and vulnerability assessments.",
    "icon": "Shield",
    "active": true
  }
  ```
- **Success Response (201 Created):** Created service object including assigned `id`, `createdAt`, `updatedAt`.

### 3.4 Update Service
- **Method & Path:** `PUT /api/admin/services/:id`
- **Authentication Required:** Yes
- **Request Body:** Partial or full service fields.
- **Success Response (200 OK):** Updated service object.

### 3.5 Toggle Service Visibility
- **Method & Path:** `PATCH /api/admin/services/:id/toggle`
- **Authentication Required:** Yes
- **Success Response (200 OK):** Updated service object with flipped `active` boolean.

### 3.6 Delete Service
- **Method & Path:** `DELETE /api/admin/services/:id`
- **Authentication Required:** Yes (Admin role required)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "id": "srv-1"
  }
  ```

---

## 4. Career Openings Endpoints

### 4.1 List Jobs
- **Method & Path:** `GET /api/admin/jobs`
- **Authentication Required:** Yes
- **Query Parameters:**
  - `search` *(optional, string)*: Filter by title, location, type, or description.
  - `status` *(optional, string)*: Filter by status (`"Open"` | `"Closed"`).
- **Success Response (200 OK):**
  ```json
  [
    {
      "id": "job-1",
      "title": "React Developer",
      "location": "Indore, India",
      "type": "Full Time", // Full Time, Part Time, Contract, Remote, Hybrid
      "description": "We are seeking an experienced React.js Developer...",
      "status": "Open", // "Open" | "Closed"
      "createdAt": "2026-02-05T10:00:00.000Z",
      "updatedAt": "2026-02-05T10:00:00.000Z"
    }
  ]
  ```

### 4.2 Create Job Posting
- **Method & Path:** `POST /api/admin/jobs`
- **Authentication Required:** Yes
- **Request Body:**
  ```json
  {
    "title": "DevOps Engineer",
    "location": "Indore, India",
    "type": "Full Time",
    "description": "Looking for an AWS/Kubernetes DevOps specialist...",
    "status": "Open"
  }
  ```
- **Success Response (201 Created):** Created job object.

### 4.3 Update Job Posting
- **Method & Path:** `PUT /api/admin/jobs/:id`
- **Authentication Required:** Yes
- **Success Response (200 OK):** Updated job object.

### 4.4 Toggle Job Status
- **Method & Path:** `PATCH /api/admin/jobs/:id/status`
- **Authentication Required:** Yes
- **Success Response (200 OK):** Updated job object with flipped `status` (`"Open"` <-> `"Closed"`).

### 4.5 Delete Job Posting
- **Method & Path:** `DELETE /api/admin/jobs/:id`
- **Authentication Required:** Yes (Admin role required)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "id": "job-1"
  }
  ```

---

## 5. Client Inquiries Endpoints

### 5.1 List Inquiries (Paginated & Filtered)
- **Method & Path:** `GET /api/admin/inquiries`
- **Authentication Required:** Yes
- **Query Parameters:**
  - `search` *(optional, string)*: Search by client name, email, phone, service, or message.
  - `status` *(optional, string)*: `"New"` | `"In Progress"` | `"Resolved"`
  - `page` *(optional, integer, default: 1)*
  - `limit` *(optional, integer, default: 5)*
  - `sortOrder` *(optional, string, default: `"desc"`)*: `"desc"` | `"asc"` by date
- **Success Response (200 OK):**
  ```json
  {
    "inquiries": [
      {
        "id": "inq-101",
        "name": "Aarav Sharma",
        "email": "aarav.sharma@techspire.in",
        "phone": "+91 98260 11223",
        "service": "Web Development",
        "message": "We want to migrate our existing monolithic e-commerce platform...",
        "date": "2026-03-01T10:15:00.000Z",
        "status": "New" // "New" | "In Progress" | "Resolved"
      }
    ],
    "total": 12,
    "page": 1,
    "limit": 5,
    "totalPages": 3,
    "newCount": 6,
    "allFiltered": [] // Full filtered list for CSV export
  }
  ```

### 5.2 Get Count of New Inquiries
- **Method & Path:** `GET /api/admin/inquiries/count-new`
- **Authentication Required:** Yes
- **Success Response (200 OK):**
  ```json
  {
    "count": 6
  }
  ```

### 5.3 Update Inquiry Status
- **Method & Path:** `PATCH /api/admin/inquiries/:id/status`
- **Authentication Required:** Yes
- **Request Body:**
  ```json
  {
    "status": "In Progress" // "New" | "In Progress" | "Resolved"
  }
  ```
- **Success Response (200 OK):** Updated inquiry object.

### 5.4 Delete Inquiry
- **Method & Path:** `DELETE /api/admin/inquiries/:id`
- **Authentication Required:** Yes (Admin role required)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "id": "inq-101"
  }
  ```

---

## 6. Site Settings Endpoints

### 6.1 Get Site Settings
- **Method & Path:** `GET /api/admin/settings`
- **Authentication Required:** Yes
- **Success Response (200 OK):**
  ```json
  {
    "contact": {
      "email": "info@codeeagle.in",
      "phone": "+91 731 456 7890",
      "officeLocation": "Crystal IT Park, Ring Road, Indore, MP 452001, India"
    },
    "stats": {
      "yearsExperience": 8,
      "projectsCompleted": 150,
      "activeClients": 45,
      "clientSatisfaction": 99
    }
  }
  ```

### 6.2 Update Site Settings
- **Method & Path:** `PUT /api/admin/settings`
- **Authentication Required:** Yes (Admin role required)
- **Request Body:** Full or partial settings object matching the structure above.
- **Success Response (200 OK):** Updated settings object.

---

## 7. Dashboard Metrics & Analytics

### 7.1 Get Dashboard Statistics
- **Method & Path:** `GET /api/admin/stats`
- **Authentication Required:** Yes
- **Success Response (200 OK):**
  ```json
  {
    "newInquiries": 6,
    "openJobs": 3,
    "activeServices": 6,
    "weeklyVisitors": 5520,
    "weeklyVisitorsGrowth": "+14.2%",
    "visitorsChart": [
      { "day": "Mon", "visitors": 620, "pageViews": 1450 },
      { "day": "Tue", "visitors": 780, "pageViews": 1890 },
      { "day": "Wed", "visitors": 940, "pageViews": 2210 },
      { "day": "Thu", "visitors": 890, "pageViews": 2040 },
      { "day": "Fri", "visitors": 1050, "pageViews": 2600 },
      { "day": "Sat", "visitors": 710, "pageViews": 1650 },
      { "day": "Sun", "visitors": 530, "pageViews": 1220 }
    ],
    "recentInquiries": [
      // Array of top 5 latest inquiry objects
    ]
  }
  ```

