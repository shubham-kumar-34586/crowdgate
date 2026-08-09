# Sprint 1

## Goal

Initialize backend architecture.

## Tasks

- Backend Setup
- Node Initialization
- Express Installation
- Folder Structure
- Environment Configuration

## Sprint 1 Status

Completed

- Backend folder structure
- Express application setup
- Global middleware
- Health API
- Route layer
- Controller layer
- API response utility
- Global 404 middleware
- Global error middleware
- PostgreSQL cloud connection
- Connection pooling
- SQL migration folder
- Users table
- Repository layer foundation

Status

Sprint 1 Completed Successfully


## Sprint 2 Progress

### Completed

- Authentication module structure
- Register API endpoint
- Repository skeleton
- First repository methods
- SQL parameterized queries
- API versioning

### In Progress

- Service Layer


# Sprint 2 — Day 1

## Completed

- Authentication module structure
- Register endpoint
- Register route
- Register controller
- Register service
- User repository
- Database insert operation
- Duplicate email check
- API response integration

## Pending

- Password hashing
- Validation
- JWT Authentication
- Login API

## Sprint 2 — Day 2

### Objective

Make the User Registration API production-safe.

### Planned Work

- Password hashing using bcrypt
- Remove password_hash from API response
- Request validation
- Duplicate email error handling
- Registration edge-case testing

### Target

Sprint 2 progress: 50%

### Day 2 Progress

- Password hashing with bcrypt ✅
- Password removed from API response ✅
- Registration request validation 🚧

# Sprint 2 — Authentication

## Progress

Sprint 2 is approximately 50% complete.

### Completed

- [x] Authentication route structure
- [x] User registration API
- [x] Registration input validation
- [x] Duplicate email detection
- [x] Password hashing with bcrypt
- [x] User creation through repository layer
- [x] Login API
- [x] Login credential validation
- [x] JWT access token generation
- [x] JWT secret configuration
- [x] Authentication middleware foundation

### Authentication Architecture

```text
Client
   │
   ▼
Auth Route
   │
   ▼
Validation Middleware
   │
   ▼
Auth Controller
   │
   ▼
Auth Service
   │
   ├── Check existing user
   ├── Hash / compare password
   └── Generate JWT
   │
   ▼
User Repository
   │
   ▼
PostgreSQL