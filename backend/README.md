# ⚙️ PETMS Backend API

> Node.js REST API for Public Expenditure Transparency & Monitoring System

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your MongoDB URI and other config

# Seed database with sample data
npm run seed

# Start development server
npm run dev

# Start production server
npm start
```

Server runs on `http://localhost:5000`

## 📋 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@petms.gov.in | Admin@123 |
| Contractor | contractor@example.com | Contractor@123 |
| Citizen | citizen@example.com | Citizen@123 |

## 📚 API Endpoints

### Auth (`/api/auth`)
- `POST /register` - Register user
- `POST /login` - Login (requires email, password, role)
- `GET /me` - Get current user (protected)
- `POST /logout` - Logout (protected)

### Projects (`/api/projects`)
- `GET /` - Get all projects (public, with filters)
- `GET /nearby` - Get nearby projects (public)
- `GET /:id` - Get single project (public)
- `POST /` - Create project (admin)
- `PUT /:id` - Update project (admin)
- `DELETE /:id` - Soft delete project (admin)

### Complaints (`/api/complaints`)
- `GET /` - Get complaints (filtered by role)
- `GET /:id` - Get single complaint
- `POST /` - Submit complaint (citizen)
- `POST /:id/upvote` - Upvote complaint (citizen)
- `PUT /:id/respond` - Admin response

### Stats (`/api/stats`)
- `GET /overview` - Dashboard stats (admin)
- `GET /department-allocation` - Budget by department (admin)
- `GET /monthly-trends` - Spending trends (admin)
- `GET /contractor` - Contractor stats (contractor)

## 🔧 Environment Variables

See `.env.example` for all required and optional variables.
