# PETMS — Public Expenditure Transparency & Monitoring System

**Full-Stack Project:** Next.js Frontend (`markit/`) + Express Backend (`backend/`)

---

## Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | Next.js 12, React 17, Redux Toolkit, Bootstrap 5, Axios, React Toastify |
| Backend  | Express.js, Mongoose (MongoDB Atlas), JWT Auth, Multer, Cloudinary, Node-Cron |
| Database | MongoDB Atlas                                   |

---

## How to Run

```bash
# 1. Backend
cd backend
npm install
npm run seed   # Seeds demo users, projects, complaints
npm run dev    # Starts on http://localhost:5000

# 2. Frontend
cd markit
npm install
npm run dev    # Starts on http://localhost:3000
```

### Demo Credentials

| Role       | Email                       | Password        |
| ---------- | --------------------------- | --------------- |
| Admin      | admin@petms.gov.in          | Admin@123       |
| Contractor | contractor1@petms.gov.in    | Contractor@123  |
| Citizen    | citizen1@petms.gov.in       | Citizen@123     |

---

## Feature Status Overview

### ✅ = Working &nbsp; | &nbsp; ⚠️ = Partially Working &nbsp; | &nbsp; 🎨 = UI Only (No Backend) &nbsp; | &nbsp; ❌ = Not Implemented

---

## Authentication & Authorization

| # | Feature              | Status | Details |
|---|----------------------|--------|---------|
| 1 | Admin Login          | ✅ Working | Calls `POST /api/auth/login` with role `admin`. JWT stored in localStorage. Redirects to `/admin/dashboard`. |
| 2 | Contractor Login     | ✅ Working | Same flow with role `contractor`. Redirects to `/contractor/dashboard`. |
| 3 | Citizen Login        | ✅ Working | Same flow with role `citizen`. Redirects to `/citizen/dashboard`. |
| 4 | Auth Guard (Role-Based Access) | ✅ Working | Frontend checks `user.role` and redirects unauthorized users. Backend uses `protect` + `authorize` middleware. |
| 5 | Logout               | ✅ Working | Clears token & user from localStorage. Backend endpoint exists but is a no-op (no token blacklist). |
| 6 | User Registration    | ❌ Not Implemented | Backend `POST /api/auth/register` exists and works. `authAPI.register()` is defined in `api.js`. **But no frontend register page exists.** Users can only use seeded accounts. |

---

## Home Page

| # | Feature                          | Status | Details |
|---|----------------------------------|--------|---------|
| 7 | Live Stats (Projects/Budget/Flagged) | ✅ Working | Fetches real projects from `GET /api/projects` and computes totals dynamically. |
| 8 | Portal Navigation (3 Role Cards) | ✅ Working | Links to admin, contractor, and citizen login pages. |

---

## Admin Portal

| #  | Feature                              | Status | Details |
|----|--------------------------------------|--------|---------|
| 9  | Dashboard — Stats Cards              | ✅ Working | Calls `GET /api/stats/overview`. Shows total budget, total spent, active projects, risk-flagged count. |
| 10 | Dashboard — Department Allocation Chart | ✅ Working | Computed client-side from real project data. (Note: `GET /api/stats/department-allocation` backend endpoint exists but is not called — frontend reimplements the logic.) |
| 11 | Dashboard — Top Projects by Spending Chart | ✅ Working | Computed from real project data. |
| 12 | Dashboard — Monthly Spending Trends Chart | 🎨 UI Only | **Uses hardcoded static data** (fake Sep–Feb values). Backend `GET /api/stats/monthly-trends` exists and works, `statsAPI.getMonthlyTrends()` is defined, but **nothing calls it**. |
| 13 | Dashboard — Projects Table + Search/Filter | ✅ Working | Real API data. Search by name/location, filter by department/status. Rows are **not clickable** (no detail view). |
| 14 | Dashboard — Risk Alerts Panel        | ⚠️ Partial | Displays risk-flagged projects with real data & factors. **"Investigate" button does nothing** — no `onClick` handler. |
| 15 | Projects Page — Full Projects List   | ✅ Working | Fetches all projects from API. Auth-guarded. Renders in `ProjectsTable`. |
| 16 | Complaints Page — Complaints List    | ✅ Working | Fetches real complaints from `GET /api/complaints`. Shows tracking ID, project, issue type, upvotes, status, date. |
| 17 | Complaints — "Review" Button         | 🎨 UI Only | **Button does absolutely nothing.** No `onClick`, no modal, no form. |
| 18 | Complaints — Respond to Complaint    | ❌ Not Implemented | Backend `PUT /api/complaints/:id/respond` is fully functional. `complaintsAPI.respond()` is defined. **But zero frontend UI exists** to change status or add admin response. |

---

## Citizen Portal

| #  | Feature                              | Status | Details |
|----|--------------------------------------|--------|---------|
| 19 | Dashboard — Stats Cards              | ✅ Working | Computed from real project data (total projects, budget, avg completion, risk flagged). |
| 20 | Dashboard — Hero Search Bar          | 🎨 UI Only | The search input in the hero section has **no state, no `onChange`, and filters nothing**. It's purely decorative. |
| 21 | Dashboard — Project Gallery + Search/Filter | ✅ Working | Real API data. Client-side search by name/location and filter by department. |
| 22 | Project Cards — "View Details" Button | 🎨 UI Only | **No `onClick` handler, no `<Link>`.** There is no project detail page anywhere. Backend `GET /api/projects/:id` and `projectsAPI.getOne()` both exist but are unused. |
| 23 | Submit Complaint (Text)              | ✅ Working | Calls `POST /api/complaints` with `projectId`, `issueType`, `description`. Returns tracking ID on success. |
| 24 | Submit Complaint — Image Upload      | 🎨 UI Only | Drag-and-drop zone is **purely decorative** — no `<input type="file">`, no file state, no FormData. Backend fully supports image upload via multer + Cloudinary, but frontend never sends files. |
| 25 | My Complaints List                   | ✅ Working | Fetches real complaints filtered by citizen role. Shows tracking ID, status, upvotes, admin response. |
| 26 | Complaint Upvote                     | ❌ Not Implemented | Backend `POST /api/complaints/:id/upvote` works (toggle upvote/remove). `complaintsAPI.upvote()` is defined. **But no upvote button exists in any frontend component.** Heart icon is display-only. |

---

## Contractor Portal

| #  | Feature                              | Status | Details |
|----|--------------------------------------|--------|---------|
| 27 | Dashboard — Stats Cards              | ✅ Working | Calls `GET /api/stats/contractor`. Shows project count, budget assigned, avg completion, delayed count. |
| 28 | Dashboard — My Project Cards         | ✅ Working | Fetches from API, filters by contractor ID. Falls back to first 5 projects if no match. |
| 29 | My Projects Page                     | ✅ Working | Fetches from API with auth guard. Displays ProjectCards with real data. |
| 30 | Progress Update Form                 | ❌ Broken | Calls `PUT /api/projects/:id` which is **admin-only** (`authorize('admin')` in routes). **Contractor gets 403 Forbidden.** Needs a dedicated contractor update route. |
| 31 | Progress Update — GPS Photo Upload   | 🎨 UI Only | Drag-and-drop zone with no `<input type="file">`, no file handling, no GPS extraction. Backend `Update` model has `gpsData`, `distanceFromSite`, `isValid` fields — all unused. |
| 32 | Updates Timeline                     | 🎨 UI Only | **100% hardcoded static data.** No API call, no props for data. Shows fake project names and timestamps. |
| 33 | Payment Tranches Table               | 🎨 UI Only | **Hardcoded inline array** with fake amounts (₹100 Cr, ₹150 Cr), fake dates, and fake statuses. No backend model or endpoint for payment tranches. |

---

## Platform Features

| #  | Feature                              | Status | Details |
|----|--------------------------------------|--------|---------|
| 34 | Red Flag / Risk Detection Engine     | ✅ Working | `calculateRiskFlag()` in backend auto-flags projects. Cron job runs in production (`redFlag.job.js`). Frontend displays flags in ProjectsTable, ProjectGallery, ProjectCard, and RiskAlertsPanel. |
| 35 | Map Visualization                    | ❌ Not Implemented | Advertised on home page ("Interactive map showing all projects"). `GET /api/projects/nearby` backend endpoint works. `projectsAPI.getNearby()` is defined. **No map component exists** — no Leaflet, Google Maps, or Mapbox integration. |
| 36 | GPS Verification Pipeline            | ❌ Not Implemented | `Update` model has GPS fields. `gps.utils.js` exists for distance calculation. **But the model has zero routes, zero controllers.** It's completely orphaned. |
| 37 | Email Notifications                  | ⚠️ Backend Only | `email.utils.js` exists with SMTP config in `.env`. Not triggered from any frontend action. |

---

## Summary Count

| Status                        | Count |
|-------------------------------|-------|
| ✅ **Fully Working**          | 20    |
| ⚠️ **Partially Working**     | 3     |
| 🎨 **UI Only (No Backend)**  | 8     |
| ❌ **Not Implemented / Broken** | 6     |
| **Total Features**            | **37** |

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Route       | Status | Used by Frontend |
|--------|-------------|--------|------------------|
| POST   | `/register` | ✅ Working | ❌ No frontend page |
| POST   | `/login`    | ✅ Working | ✅ All login pages |
| GET    | `/me`       | ✅ Working | ❌ Not called |
| POST   | `/logout`   | ✅ Working | ❌ Not called (frontend clears localStorage directly) |

### Projects (`/api/projects`)
| Method | Route      | Status | Used by Frontend |
|--------|------------|--------|------------------|
| GET    | `/`        | ✅ Working | ✅ Home, Admin, Citizen, Contractor dashboards |
| GET    | `/nearby`  | ✅ Working | ❌ No map component |
| GET    | `/:id`     | ✅ Working | ❌ No detail page |
| POST   | `/`        | ✅ Working | ❌ No create project form |
| PUT    | `/:id`     | ✅ Working (Admin only) | ⚠️ Contractor form calls it but gets 403 |
| DELETE | `/:id`     | ✅ Working | ❌ No delete UI |

### Complaints (`/api/complaints`)
| Method | Route           | Status | Used by Frontend |
|--------|-----------------|--------|------------------|
| GET    | `/`             | ✅ Working | ✅ Admin & Citizen complaints pages |
| GET    | `/:id`          | ✅ Working | ❌ Not called |
| POST   | `/`             | ✅ Working | ✅ Citizen ComplaintForm (text only, no images) |
| POST   | `/:id/upvote`   | ✅ Working | ❌ No upvote button in frontend |
| PUT    | `/:id/respond`  | ✅ Working | ❌ No respond UI in admin |

### Stats (`/api/stats`)
| Method | Route                    | Status | Used by Frontend |
|--------|--------------------------|--------|------------------|
| GET    | `/overview`              | ✅ Working | ✅ Admin dashboard |
| GET    | `/department-allocation` | ✅ Working | ❌ Frontend computes client-side instead |
| GET    | `/monthly-trends`        | ✅ Working | ❌ Frontend uses hardcoded data instead |
| GET    | `/contractor`            | ✅ Working | ✅ Contractor dashboard |

---

## Critical Issues to Fix

1. **Contractor Progress Update is Broken** — `PUT /api/projects/:id` requires admin role. Contractors get 403. Need a dedicated contractor update route or adjust authorization.
2. **No Registration Page** — Backend supports it, but no frontend page exists.
3. **Admin Cannot Respond to Complaints** — "Review" button is dead. No modal/form to change status.
4. **No Upvote Button** — Backend works, but citizens can't upvote complaints.
5. **No Map Component** — Advertised as a key feature but not built.
6. **Image Upload Not Wired** — Both complaint and contractor upload zones are decorative.
7. **Update Model is Orphaned** — Has no routes or controllers despite being fully modeled.

---

## Project Structure

```
fundtracker/
├── backend/
│   ├── .env
│   ├── package.json
│   ├── scripts/seed.js
│   ├── uploads/
│   └── src/
│       ├── app.js              # Express app setup (CORS, routes, middleware)
│       ├── server.js           # Server entry point (port 5000)
│       ├── config/             # DB, Cloudinary, env validation
│       ├── controllers/        # auth, project, complaint, stats
│       ├── middleware/         # auth, error, role, upload, validate
│       ├── models/            # User, Project, Complaint, Update
│       ├── routes/            # auth, project, complaint, stats
│       ├── utils/             # email, gps, redFlag, response
│       ├── validators/        # auth, complaint, project
│       └── jobs/              # redFlag cron job
│
└── markit/
    ├── .env.local
    ├── package.json
    ├── next.config.js
    └── src/
        ├── pages/
        │   ├── _app.js         # App wrapper (Redux, AuthProvider, Toast)
        │   ├── index.js        # Home page
        │   ├── auth/           # admin-login, contractor-login, citizen-login
        │   ├── admin/          # dashboard, projects, complaints
        │   ├── citizen/        # dashboard, complaints
        │   └── contractor/     # dashboard, projects
        ├── components/
        │   ├── admin/          # ProjectsTable, AnalyticsCharts, RiskAlertsPanel
        │   ├── citizen/        # ComplaintForm, ProjectGallery, MyComplaints
        │   ├── contractor/     # ProgressUpdateForm, ProjectCard, UpdatesTimeline
        │   ├── common/         # Icons, StatsCard, ProgressBar, etc.
        │   └── layout/         # AdminSidebar, CitizenNavbar, ContractorSidebar, Footer
        ├── context/AuthContext.js
        ├── redux/              # store, authSlice, projectSlice
        ├── utils/              # api.js, constants.js, formatters.js
        ├── hooks/
        └── data/               # Static fallback data (projectData, complaintData)
```
