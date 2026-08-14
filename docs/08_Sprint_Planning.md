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


# Sprint 2

## Goal

Implement a production-oriented authentication system using
layered architecture, secure password handling, JWT-based
authentication, validation, and protected APIs.

---

## Sprint 2 Progress

### Completed

- Authentication module structure
- Register API endpoint
- Register route
- Register controller
- Register service
- User repository
- PostgreSQL integration
- Parameterized SQL queries
- Duplicate email detection
- Duplicate email error handling
- API response integration
- Password hashing using bcrypt
- Password hash removed from API response
- Registration request validation
- Login API
- Login request validation
- Password verification using bcrypt
- Invalid credential handling
- JWT generation
- JWT secret configuration
- JWT authentication middleware
- Protected `/me` endpoint
- Current user lookup from PostgreSQL
- Authentication API testing
- API versioning

---

## Sprint 2 — Day 1

### Objective

Build the initial registration flow using the layered backend
architecture.

### Completed

- Authentication module structure
- Register endpoint
- Register route
- Register controller
- Register service
- User repository
- Database insert operation
- Duplicate email check
- API response integration

---

## Sprint 2 — Day 2

### Objective

Make the User Registration API production-safe.

### Completed

- Password hashing with bcrypt
- Password hash removed from API response
- Request validation
- Duplicate email error handling
- Registration edge-case testing

---

## Sprint 2 — Day 3

### Objective

Implement user login and JWT-based authentication.

### Completed

- Login route
- Login controller
- Login service
- Login validation
- Password verification using bcrypt
- Invalid credential handling
- JWT generation
- JWT environment configuration
- JWT authentication middleware

---

## Sprint 2 — Day 4

### Objective

Use JWT authentication to protect an authenticated
user endpoint.

### Completed

- Protected `/api/v1/auth/me` endpoint
- JWT middleware integration
- Bearer token validation
- Invalid token handling
- Expired token handling
- Current user identification using JWT
- Current user lookup through repository
- PostgreSQL as source of truth for current user data
- `/me` endpoint testing

---

## Sprint 2 Current Status

Approximately **60% complete**.

### Authentication Flow Completed

```text
REGISTER
   ↓
Validation
   ↓
Password Hashing
   ↓
PostgreSQL
   ↓
LOGIN
   ↓
Password Verification
   ↓
JWT Generation
   ↓
JWT Middleware
   ↓
Protected /me
   ↓
Current User from PostgreSQL
