# Code Eagle Admin Portal

A modern, production-grade frontend admin dashboard built for **Code Eagle Info Solutions Pvt. Ltd.** (Indore, India).

Designed with a sleek **dark neon corporate theme** (deep navy `#030b2a` to `#061a5c` with radial glows, electric cyan accents `#19d3ff`, and primary blue `#1e6bff`), Poppins typography, pill-shaped buttons, glowing cards, and complete keyboard accessibility.

Every button, modal, form, table filter, and pagination link is fully interactive and functional.

---

## 1. Tech Stack

- **Framework & Build:** React 18, Vite
- **Routing:** React Router v6 (nested layouts, protected routes, role-based guards)
- **Styling:** Tailwind CSS (custom dark neon corporate theme tokens, glow effects)
- **Forms & Validation:** React Hook Form + Zod schema validation
- **Data Visualization:** Recharts (responsive visitor traffic analytics)
- **HTTP Client:** Axios (configured with interceptors, JWT attachment, and automatic 401 logout)
- **Notifications:** react-hot-toast (dark neon glowing toast styling)
- **Icons:** Lucide React

---

## 2. Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Navigate to the admin portal directory
cd admin-portal

# Install all dependencies
npm install
```

### Running Locally
```bash
# Start Vite development server
npm run dev
```
The application will start at `http://localhost:5173`.

### Production Build
```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 3. Demo Credentials

The portal is seeded with two roles to verify role-based permissions:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@codeeagle.in` | `Admin@123` | Full access (CRUD on Services, Careers, Inquiries, and Site Settings) |
| **Editor** | `editor@codeeagle.in` | `Editor@123` | Read/Write access (Add/Edit), but **cannot** delete records and **cannot** access `/settings` |

> *Tip: On the login page, you can click the quick "Admin" or "Editor" pill buttons to auto-populate credentials.*

---

## 4. Architecture & Mock-to-Real Backend Switch

The frontend is built to communicate **exclusively** through the service layer in `src/api/`. Pages never touch `localStorage` or mock data directly.

### Switching from Mock to Real Backend
1. In `admin-portal/.env`, change:
   ```env
   VITE_USE_MOCK=false
   VITE_API_URL=http://localhost:5000/api
   ```
2. Restart the Vite dev server (`npm run dev`).
3. Services in `src/api/` will now route all requests through Axios to your live backend server.

Refer to [`API_CONTRACT.md`](./API_CONTRACT.md) for the exhaustive specification of all endpoints, parameters, request bodies, and expected responses.

---

## 5. Folder Structure

```
admin-portal/
├── src/
│   ├── api/                # Service layer (Axios + Mock switch)
│   │   ├── api.js          # Axios instance & interceptors
│   │   ├── authService.js
│   │   ├── servicesService.js
│   │   ├── jobsService.js
│   │   ├── inquiriesService.js
│   │   ├── settingsService.js
│   │   └── statsService.js
│   ├── mock/
│   │   └── mockDb.js       # Persistent browser database in localStorage
│   ├── components/         # Reusable UI components
│   │   ├── AdminLayout.jsx # Master layout wrapper
│   │   ├── Sidebar.jsx     # Desktop sidebar + mobile responsive nav
│   │   ├── Topbar.jsx      # Header, notification bell, profile menu
│   │   ├── StatCard.jsx    # Glowing neon KPI cards
│   │   ├── DataTable.jsx   # Responsive scrolling table with pagination
│   │   ├── Modal.jsx       # Keyboard accessible dialogs (Esc to close)
│   │   ├── ConfirmDialog.jsx
│   │   ├── FormField.jsx   # Accessible form wrappers with Zod validation
│   │   ├── StatusBadge.jsx # Dynamic glowing badges
│   │   ├── EmptyState.jsx  # Empty query placeholders
│   │   ├── Loader.jsx      # Neon spinners
│   │   └── ProtectedRoute.jsx # Role and auth route guard
│   ├── pages/
│   │   ├── Login.jsx       # Zod-validated authentication form
│   │   ├── Dashboard.jsx   # Real-time metrics & Recharts bar chart
│   │   ├── Services.jsx    # Service cards, search, add, edit, delete
│   │   ├── Careers.jsx     # Job listings, status toggles, add, edit
│   │   ├── Inquiries.jsx   # Client messages, filters, view, CSV export
│   │   ├── Settings.jsx    # Company contact & homepage stats
│   │   └── NotFound.jsx    # 404 page with return action
│   ├── context/
│   │   └── AuthContext.jsx # Auth state, role helpers, and session hydration
│   ├── hooks/
│   │   └── useFetch.js     # Async data hook with loading & error handling
│   ├── utils/
│   │   └── constants.js    # Roles, statuses, icon maps, storage keys
│   ├── App.jsx             # Router definition and toast configuration
│   ├── main.jsx            # Entry point
│   └── index.css           # Tailwind base, dark neon corporate gradients
├── .env.example            # Environment template
├── .gitignore
├── API_CONTRACT.md         # Full REST API specification for teammates
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 6. Features Checklist & QA Verification

- [x] **Zero Errors/Warnings:** Verified with `npm run build` and Vite dev runner.
- [x] **Authentication:** Invalid login triggers error message; valid credentials open dashboard; session persists across browser refresh; Remember Me supported.
- [x] **Protected Routes:** Unauthorized access to any route redirects to `/login`, returning to original destination after login.
- [x] **Services:** Full CRUD with search, modal forms, active visibility toggle, and instant persistence.
- [x] **Careers:** Post, edit, delete, toggle Open/Closed status, search, and status filtering.
- [x] **Inquiries:** Search, status filtering, date sorting, 5-per-page pagination, inline status dropdown, detailed view modal, deletion, and CSV export.
- [x] **Settings:** Contact information and company metrics with Zod validation, unsaved changes indicator, save and reset functionality.
- [x] **Role-Based Guards:** Editor role cannot see Delete buttons, cannot see Settings in navigation, and is redirected with a toast if visiting `/settings` directly.
- [x] **Design & Responsive:** Dark neon corporate theme with no large white areas, glowing borders, custom scrollbars, and mobile horizontal scrolling navbar.
