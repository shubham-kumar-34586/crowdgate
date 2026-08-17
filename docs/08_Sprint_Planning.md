
# Current Sprint Position

CrowdGate has completed the core authentication foundation,
including access-token authentication and refresh-token lifecycle
management.

Current flow:

```text
REGISTER
   ↓
VALIDATE
   ↓
HASH PASSWORD
   ↓
STORE USER
   ↓
LOGIN
   ↓
VERIFY PASSWORD
   ↓
GENERATE ACCESS TOKEN
   ↓
GENERATE REFRESH TOKEN
   ↓
STORE HASHED REFRESH TOKEN
   ↓
AUTHENTICATE REQUEST
   ↓
PROTECTED /ME
   ↓
REFRESH ACCESS TOKEN
   ↓
ROTATE REFRESH TOKEN
   ↓
LOGOUT
   ↓
REVOKE REFRESH TOKEN
```

The authentication system is now ready for the next phase:

* Role-based authorization
* Additional protected APIs
* Automated integration testing
* Final Sprint 2 review

````

---

# `docs/08_Sprint_Planning.md`

```markdown
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

---

# Sprint 2

## Goal

Implement a production-oriented authentication system using
layered architecture, secure password handling, JWT-based
authentication, refresh-token lifecycle management, validation,
and protected APIs.

---

# Sprint 2 Progress

## Completed

### Authentication Foundation

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

### Refresh Token System

- Refresh token database migration
- `refresh_tokens` table
- Foreign key relationship with users
- `ON DELETE CASCADE`
- Refresh token repository
- Refresh token creation
- Refresh token lookup
- Refresh token expiration validation
- Refresh token revocation validation
- Refresh token revocation
- Refresh token generation
- Refresh token hashing
- Refresh token storage in PostgreSQL
- Refresh token rotation
- Refresh API
- Logout API
- Revoked refresh-token reuse protection
- Refresh and logout API testing

---

# Sprint 2 — Day 1

## Objective

Build the initial registration flow using the layered backend
architecture.

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

---

# Sprint 2 — Day 2

## Objective

Make the User Registration API production-safe.

## Completed

- Password hashing with bcrypt
- Password hash removed from API response
- Request validation
- Duplicate email error handling
- Registration edge-case testing

---

# Sprint 2 — Day 3

## Objective

Implement user login and JWT-based authentication.

## Completed

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

# Sprint 2 — Day 4

## Objective

Use JWT authentication to protect an authenticated
user endpoint.

## Completed

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

# Sprint 2 — Day 5

## Objective

Implement the refresh-token architecture and complete the
authentication token lifecycle.

## Completed

### Database

- Created `refresh_tokens` table
- Added UUID primary key
- Added `user_id` foreign key
- Added `ON DELETE CASCADE`
- Added unique `token_hash`
- Added `expires_at`
- Added `created_at`
- Added `revoked_at`

### Refresh Token Repository

- Created `refreshToken.repository.js`
- Added `create()`
- Added `findByTokenHash()`
- Added `revokeById()`
- Added parameterized SQL queries

### Authentication Service

- Added refresh-token generation
- Added refresh-token hashing
- Added refresh-token persistence
- Added refresh-token validation
- Added expiration checking
- Added revocation checking
- Added access-token generation during refresh
- Added refresh-token rotation
- Added old-token revocation

### Authentication Controller

- Added refresh-token controller flow
- Added logout controller flow
- Integrated API response handling

### Authentication Routes

Added:

```text
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
````

### Testing

* Login successfully generates access token
* Login successfully generates refresh token
* Refresh token is stored in PostgreSQL
* Valid refresh token generates new tokens
* Refresh-token rotation works
* Old refresh token becomes invalid after rotation
* Logout successfully revokes refresh token
* `revoked_at` is stored in PostgreSQL
* Revoked refresh token cannot be reused
* Invalid refresh token returns 401
* Expired refresh token returns 401

---

# Sprint 2 Current Status

Approximately **80% complete**.

The core authentication system is now implemented.

---

# Authentication Flow Completed

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
Access Token Generation
   ↓
Refresh Token Generation
   ↓
Hash Refresh Token
   ↓
Store Refresh Token
   ↓
JWT Middleware
   ↓
Protected /me
   ↓
Refresh Token
   ↓
Validate Refresh Token
   ↓
Rotate Refresh Token
   ↓
New Access Token
   ↓
Logout
   ↓
Revoke Refresh Token
```

---

# Sprint 2 Remaining Work

## Pending

### Role-Based Authorization

* Role-based authorization middleware
* User/Admin permission checks
* Protected admin endpoints

### Additional Protected APIs

* Application-specific protected resources
* Authentication integration with future modules

### Automated Testing

* Authentication integration test suite
* Refresh-token lifecycle tests
* Logout/revocation automated tests

### Final Sprint Review

* Code review
* Security review
* API documentation review
* Sprint completion review

---

# Sprint 2 Completion Criteria

Sprint 2 will be considered complete when:

* [x] Registration works
* [x] Login works
* [x] Password hashing works
* [x] Password verification works
* [x] JWT authentication works
* [x] Protected `/me` endpoint works
* [x] Refresh token system works
* [x] Refresh token hashing works
* [x] Refresh token rotation works
* [x] Refresh token revocation works
* [x] Logout works
* [x] Revoked tokens cannot be reused
* [x] Authentication APIs are documented
* [ ] Role-based authorization is implemented
* [ ] Additional protected APIs are implemented
* [ ] Automated integration tests are implemented
* [ ] Final Sprint 2 review is completed

---

# Current Architecture

```text
                         CLIENT
                            ↓
                          ROUTE
                            ↓
               ┌────────────┴────────────┐
               ↓                         ↓
        VALIDATION                 JWT MIDDLEWARE
               │                         │
               └────────────┬────────────┘
                            ↓
                       CONTROLLER
                            ↓
                         SERVICE
                            ↓
                      REPOSITORY
                            ↓
                       PostgreSQL
```

---

# Refresh Token Architecture

```text
CLIENT
  ↓
LOGIN
  ↓
Auth Service
  ↓
Generate Refresh Token
  ↓
Hash Refresh Token
  ↓
Refresh Token Repository
  ↓
PostgreSQL
```

---

# Refresh Flow

```text
CLIENT
  ↓
Refresh Token
  ↓
/refresh
  ↓
Hash Token
  ↓
Find Token
  ↓
Check Expiration
  ↓
Check Revocation
  ↓
Find User
  ↓
Revoke Old Token
  ↓
Generate New Access Token
  ↓
Generate New Refresh Token
  ↓
Store New Refresh Token
  ↓
Return New Tokens
```

---

# Logout Flow

```text
CLIENT
  ↓
Refresh Token
  ↓
/logout
  ↓
Find Refresh Token
  ↓
Revoke Token
  ↓
Set revoked_at
  ↓
PostgreSQL
  ↓
Logout Successful
```

---

# Sprint 2 Security Features

The following security mechanisms are currently implemented:

* bcrypt password hashing
* Generic invalid-login error
* Parameterized SQL queries
* JWT authentication
* Bearer token validation
* JWT expiration handling
* Refresh-token hashing
* Refresh-token expiration
* Refresh-token revocation
* Refresh-token rotation
* Revoked-token reuse protection
* Environment-based JWT secret
* Password hash protection from API responses

---

# Sprint 2 API Status

| API                     | Method | Status |
| ----------------------- | ------ | ------ |
| `/health`               | GET    | ✅      |
| `/api/v1/auth/register` | POST   | ✅      |
| `/api/v1/auth/login`    | POST   | ✅      |
| `/api/v1/auth/me`       | GET    | ✅      |
| `/api/v1/auth/refresh`  | POST   | ✅      |
| `/api/v1/auth/logout`   | POST   | ✅      |

---

# Sprint 2 Git Milestones

## Completed

```text
feat(auth): add protected current user endpoint
```

## Current Work

The refresh-token and logout implementation is ready to be
committed after final documentation verification.

---

# Next Sprint 2 Session

Before writing new features, the next session will first review
and understand the refresh-token implementation:

1. Refresh-token database design
2. `refresh_tokens` table
3. Refresh token generation
4. Token hashing
5. Refresh token repository
6. `findByTokenHash()`
7. `revokeById()`
8. Refresh service logic
9. Token rotation
10. Logout and revocation
11. Why revoked tokens return 401
12. Complete authentication lifecycle

After understanding the implementation:

```text
Code Review
     ↓
Documentation Review
     ↓
Git Commit
     ↓
Git Push
     ↓
Continue Sprint 2
```

---

# Sprint 2 Overall Position

```text
Authentication Foundation       ✅
Registration                    ✅
Validation                      ✅
Password Security               ✅
Login                           ✅
JWT Access Token                ✅
JWT Middleware                  ✅
Protected /me                   ✅
Refresh Token Database          ✅
Refresh Token Repository        ✅
Refresh Token Generation        ✅
Refresh Token Hashing           ✅
Refresh Token Rotation          ✅
Refresh Token Revocation        ✅
Refresh API                     ✅
Logout API                      ✅
Role Authorization              ⏳
Additional Protected APIs       ⏳
Automated Integration Tests     ⏳
Final Sprint Review             ⏳
```

**Sprint 2: ~80% complete**

```

Once you paste these two, **don't change the code yet**. Then we can do the Git check and commit today's complete refresh-token + logout feature.
```
