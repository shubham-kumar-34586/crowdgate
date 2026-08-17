Yes. We should update both documents **to reflect the work actually completed today**: refresh-token storage, refresh endpoint, token rotation, logout/revocation, and testing. We should also remove the old “planned” status for refresh/logout.

Below are the **two complete copy-paste files**. 

---

# `docs/07_API_Design.md`

````markdown
# CrowdGate API Design

---

## Health Check

### Endpoint

GET /health

### Description

Returns the current status of the CrowdGate API.

### Success Response (200)

```json
{
  "success": true,
  "message": "CrowdGate API is running",
  "data": {
    "status": "healthy",
    "timestamp": "2026-08-05T18:30:00.000Z"
  }
}
````

---

## Unknown Route

### Endpoint

ANY *

### Description

Handles all unknown routes.

### Response

404 Not Found

```json
{
  "success": false,
  "message": "Route not found"
}
```

---

# Authentication APIs

## Authentication Architecture

CrowdGate authentication follows a layered architecture.

### Public Authentication APIs

```text
HTTP Request
     ↓
Route
     ↓
Validation Middleware
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
PostgreSQL
     ↓
Response
```

### Protected Authentication APIs

```text
HTTP Request
     ↓
Route
     ↓
JWT Authentication Middleware
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
PostgreSQL
     ↓
Response
```

### Refresh Token Operations

```text
HTTP Request
     ↓
Route
     ↓
Controller
     ↓
Auth Service
     ↓
Refresh Token Repository
     ↓
PostgreSQL
     ↓
Response
```

---

# Register User

## Endpoint

POST /api/v1/auth/register

## Description

Registers a new user account.

## Request Flow

```text
Client
  ↓
POST /api/v1/auth/register
  ↓
Validation Middleware
  ↓
Auth Controller
  ↓
Auth Service
  ↓
Check Existing Email
  ↓
Hash Password
  ↓
User Repository
  ↓
PostgreSQL
  ↓
Return Safe User
```

## Request Body

```json
{
  "full_name": "Shubham Kumar",
  "email": "shubham@gmail.com",
  "password": "Password@123"
}
```

## Success Response

HTTP 201 Created

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user-id",
    "full_name": "Shubham Kumar",
    "email": "shubham@gmail.com",
    "role": "user",
    "is_verified": false,
    "created_at": "...",
    "updated_at": "..."
  }
}
```

## Status

✅ Implemented

## Implementation Status

* Route: ✅
* Controller: ✅
* Service: ✅
* Repository: ✅
* PostgreSQL: ✅
* Parameterized SQL: ✅
* Password Hashing: ✅
* Password Response Protection: ✅
* Validation: ✅
* Duplicate Email Handling: ✅
* Error Handling: ✅

---

# Registration Validation

The registration endpoint validates incoming requests before
passing them to the controller.

## Validation Rules

* Full name is required.
* Email is required.
* Email must contain a valid basic format.
* Password is required.
* Password must contain at least 8 characters.

Invalid requests return HTTP 400 and do not reach the service
or repository layers.

## Missing Fields

HTTP 400 Bad Request

```json
{
  "success": false,
  "message": "Full name, email and password are required"
}
```

## Invalid Email

HTTP 400 Bad Request

```json
{
  "success": false,
  "message": "Invalid email address"
}
```

## Short Password

HTTP 400 Bad Request

```json
{
  "success": false,
  "message": "Password must be at least 8 characters"
}
```

---

# Password Hashing

CrowdGate never stores plain-text passwords in PostgreSQL.

Passwords are hashed using bcrypt before being stored.

```text
Plain Password
      ↓
bcrypt.hash()
      ↓
Password Hash
      ↓
PostgreSQL
```

The current bcrypt configuration uses a cost factor of 12.

The password hash is never returned to the client.

## Status

✅ Implemented

---

# Duplicate Email Handling

Before creating a new user, the service checks whether the email
already exists.

```text
Registration Request
       ↓
findByEmail()
       ↓
User exists?
    ↙       ↘
  YES        NO
   ↓          ↓
 409       Continue
Conflict
```

## Response

HTTP 409 Conflict

```json
{
  "success": false,
  "message": "Email already registered"
}
```

## Status

✅ Implemented

---

# User Repository

The repository layer handles direct database operations.

Current repository methods:

```text
findByEmail()
create()
findById()
```

## Find User By Email

```sql
SELECT *
FROM users
WHERE email = $1;
```

The email value is passed separately as a parameter.

```text
$1 → email
```

Parameterized SQL is used to prevent user input from being
directly inserted into SQL queries.

---

# Create User

The repository inserts a new user into PostgreSQL.

```sql
INSERT INTO users
(
    full_name,
    email,
    password_hash,
    role
)
VALUES
(
    $1,
    $2,
    $3,
    $4
)
RETURNING *;
```

Parameter mapping:

```text
$1 → full_name
$2 → email
$3 → password_hash
$4 → role
```

Newly registered users currently receive:

```text
role = user
```

## Status

✅ Implemented

---

# Login User

## Endpoint

POST /api/v1/auth/login

## Description

Authenticates an existing user and generates an access token
and refresh token.

## Request Body

```json
{
  "email": "shubham@gmail.com",
  "password": "Password@123"
}
```

## Request Flow

```text
Client
  ↓
POST /api/v1/auth/login
  ↓
Login Validation
  ↓
Auth Controller
  ↓
Auth Service
  ↓
Find User By Email
  ↓
Compare Password Using bcrypt
  ↓
Generate Access Token
  ↓
Generate Refresh Token
  ↓
Hash Refresh Token
  ↓
Store Refresh Token
  ↓
Return Safe User + Tokens
```

## Success Response

HTTP 200 OK

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-id",
      "full_name": "Shubham Kumar",
      "email": "shubham@gmail.com",
      "role": "user",
      "is_verified": false
    },
    "accessToken": "JWT_ACCESS_TOKEN",
    "refreshToken": "REFRESH_TOKEN"
  }
}
```

The password hash is never returned to the client.

## Status

✅ Implemented

---

# Password Verification

During login, the supplied password is compared with the stored
bcrypt password hash.

```text
Login Password
      ↓
bcrypt.compare()
      ↓
Stored Password Hash
      ↓
Match?
   ↙     ↘
 YES      NO
  ↓        ↓
Continue   401
```

## Status

✅ Implemented

---

# Invalid Login Credentials

If the email does not exist or the password is incorrect, the API
returns the same generic error.

## HTTP 401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

This prevents unnecessarily revealing whether a particular email
exists.

## Status

✅ Implemented

---

# JWT Authentication

CrowdGate uses JSON Web Tokens (JWT) to authenticate protected
API requests.

After successful login, the server generates a JWT access token.

## JWT Payload

```json
{
  "userId": "user-id",
  "email": "user@example.com",
  "role": "user"
}
```

---

# JWT Configuration

The JWT secret is stored in environment variables.

```env
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=...
```

The actual secret must never be committed to Git.

The application accesses the secret through:

```text
process.env.JWT_SECRET
```

## Status

✅ Implemented

---

# JWT Authentication Middleware

The authentication middleware protects private endpoints.

## Middleware Flow

```text
HTTP Request
      ↓
Read Authorization Header
      ↓
Check "Bearer " Prefix
      ↓
Extract JWT
      ↓
Verify JWT
      ↓
Decode User Information
      ↓
Store Data in req.user
      ↓
next()
```

---

# Authorization Header

Protected requests must send:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# Missing JWT

If a protected endpoint is requested without an Authorization
header:

HTTP 401 Unauthorized

```json
{
  "success": false,
  "message": "Authentication required"
}
```

## Status

✅ Implemented

---

# Invalid or Expired JWT

If the token is invalid, malformed, expired, or fails JWT
verification:

HTTP 401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

## Status

✅ Implemented

---

# Current User — /me

## Endpoint

GET /api/v1/auth/me

## Description

Returns the currently authenticated user's current information.

This endpoint is protected by JWT authentication middleware.

## /me Request Flow

```text
Client
  ↓
GET /api/v1/auth/me
  ↓
JWT Authentication Middleware
  ↓
Verify JWT
  ↓
Extract userId
  ↓
Auth Controller
  ↓
Auth Service
  ↓
User Repository
  ↓
PostgreSQL
  ↓
Return Current User
```

## Why /me Queries PostgreSQL

The JWT identifies the user, but PostgreSQL remains the source
of truth for the user's current information.

The server uses the `userId` from the JWT to retrieve the latest
user record.

```text
JWT
 ↓
userId
 ↓
PostgreSQL
 ↓
Latest User Record
```

This prevents stale user information from being returned when
user data changes after a token was issued.

## /me Authentication

The request requires:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Without Token

HTTP 401 Unauthorized

```json
{
  "success": false,
  "message": "Authentication required"
}
```

### With Invalid Token

HTTP 401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

## /me Success Response

HTTP 200 OK

```json
{
  "success": true,
  "message": "Current user fetched successfully",
  "data": {
    "id": "user-id",
    "full_name": "Shubham Kumar",
    "email": "shubham@gmail.com",
    "role": "user",
    "is_verified": false,
    "created_at": "...",
    "updated_at": "..."
  }
}
```

The password hash is never returned.

## Status

✅ Implemented

---

# Access Token

## Purpose

The access token authenticates requests to protected APIs.

## Usage

```http
Authorization: Bearer <access_token>
```

## Characteristics

* Short-lived
* JWT based
* Contains user identity and role
* Verified using JWT authentication middleware
* Used for protected API requests

---

# Refresh Token

## Purpose

The refresh token allows the client to obtain a new access token
without requiring the user to log in again.

## Characteristics

* Long-lived
* Stored securely by the client
* Stored in hashed form in PostgreSQL
* Associated with a specific user
* Can expire
* Can be revoked
* Rotated when used successfully

---

# Refresh Token Database

## Table

```text
refresh_tokens
```

## Columns

| Column     | Description                            |
| ---------- | -------------------------------------- |
| id         | Unique refresh-token record identifier |
| user_id    | User who owns the refresh token        |
| token_hash | Hashed refresh token                   |
| expires_at | Refresh token expiration time          |
| created_at | Token creation timestamp               |
| revoked_at | Token revocation timestamp             |

## Database Relationship

```text
users
  │
  │ 1
  │
  └───────< refresh_tokens
```

A user can have multiple refresh tokens.

The `user_id` column references `users.id`.

If a user is deleted, their refresh-token records are
automatically deleted using `ON DELETE CASCADE`.

---

# Refresh Token Security

CrowdGate does not store the raw refresh token in PostgreSQL.

The refresh token is hashed before being stored.

```text
Raw Refresh Token
        ↓
       Hash
        ↓
   token_hash
        ↓
   PostgreSQL
```

This reduces the risk of exposing usable refresh tokens if
the database is compromised.

---

# Refresh Token Repository

The repository layer handles refresh-token database operations.

Current repository methods:

```text
create()
findByTokenHash()
revokeById()
```

## Create Refresh Token

Creates a refresh-token record in PostgreSQL.

```sql
INSERT INTO refresh_tokens (
    user_id,
    token_hash,
    expires_at
)
VALUES ($1, $2, $3)
RETURNING *;
```

## Find Valid Refresh Token

A refresh token is considered valid only when:

* The token exists.
* The token has not been revoked.
* The token has not expired.

Conceptually:

```sql
SELECT *
FROM refresh_tokens
WHERE token_hash = $1
AND revoked_at IS NULL
AND expires_at > CURRENT_TIMESTAMP;
```

## Revoke Refresh Token

Logout or token rotation can revoke a refresh-token record.

```sql
UPDATE refresh_tokens
SET revoked_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
```

## Status

✅ Implemented

---

# Refresh Access Token

## Endpoint

POST /api/v1/auth/refresh

## Description

Generates a new access token using a valid refresh token.

The refresh-token system uses token rotation.

## Request Body

```json
{
  "refreshToken": "REFRESH_TOKEN"
}
```

## Request Flow

```text
Client
  ↓
POST /api/v1/auth/refresh
  ↓
Refresh Token
  ↓
Auth Controller
  ↓
Auth Service
  ↓
Hash Refresh Token
  ↓
Find Token
  ↓
Check Expiration
  ↓
Check Revocation
  ↓
Find User
  ↓
Revoke Current Refresh Token
  ↓
Generate New Access Token
  ↓
Generate New Refresh Token
  ↓
Store New Refresh Token
  ↓
Return New Tokens
```

## Success Response

HTTP 200 OK

```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "NEW_JWT_ACCESS_TOKEN",
    "refreshToken": "NEW_REFRESH_TOKEN"
  }
}
```

## Security Checks

The refresh token must:

* Exist in the database.
* Belong to a valid user.
* Not be expired.
* Not be revoked.

## Invalid Refresh Token

HTTP 401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid or expired refresh token"
}
```

## Token Rotation

After a successful refresh:

```text
Old Refresh Token
       ↓
    Revoked
       ↓
New Refresh Token
       ↓
Stored in PostgreSQL
```

The old refresh token cannot be reused.

## Status

✅ Implemented

---

# Logout

## Endpoint

POST /api/v1/auth/logout

## Description

Invalidates the current refresh token.

## Request Body

```json
{
  "refreshToken": "REFRESH_TOKEN"
}
```

## Request Flow

```text
Client
  ↓
POST /api/v1/auth/logout
  ↓
Refresh Token
  ↓
Auth Controller
  ↓
Auth Service
  ↓
Find Refresh Token
  ↓
Revoke Refresh Token
  ↓
PostgreSQL
  ↓
Logout Successful
```

## Success Response

HTTP 200 OK

```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

The refresh token is not deleted immediately.

Instead, `revoked_at` is populated so the token becomes invalid.

## Reuse After Logout

Attempting to use the revoked refresh token again returns:

HTTP 401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid or expired refresh token"
}
```

## Status

✅ Implemented

---

# Complete Authentication Flow

```text
                         LOGIN
                           ↓
                  Verify Credentials
                           ↓
              ┌────────────┴────────────┐
              ↓                         ↓
        Access Token              Refresh Token
        Short-lived                Long-lived
              ↓                         ↓
       Protected APIs              Hash + Store
              ↓                         ↓
           Expires                PostgreSQL
                                        ↓
                                  /refresh
                                        ↓
                               Rotate Token
                                        ↓
                              New Access Token
                                        ↓
                                Protected API
```

---

# Logout Flow

```text
Client
  ↓
Refresh Token
  ↓
/logout
  ↓
Find Refresh Token
  ↓
Set revoked_at
  ↓
PostgreSQL
  ↓
Token becomes invalid
```

---

# Authentication Architecture

```text
                        Client
                          │
                          ↓
                        Route
                          │
            ┌─────────────┴─────────────┐
            ↓                           ↓
      Validation                 JWT Middleware
            │                           │
            └─────────────┬─────────────┘
                          ↓
                     Controller
                          ↓
                       Service
                          ↓
                    Repository
                          ↓
                     PostgreSQL
```

For refresh-token operations:

```text
Client
  ↓
Route
  ↓
Controller
  ↓
Auth Service
  ↓
Refresh Token Repository
  ↓
PostgreSQL
```

---

# Authentication Error Responses

| Situation                       | HTTP Status | Message                                    |
| ------------------------------- | ----------: | ------------------------------------------ |
| Missing registration fields     |         400 | Full name, email and password are required |
| Invalid email                   |         400 | Invalid email address                      |
| Password too short              |         400 | Password must be at least 8 characters     |
| Missing login credentials       |         400 | Email and password are required            |
| Invalid credentials             |         401 | Invalid email or password                  |
| Missing JWT                     |         401 | Authentication required                    |
| Invalid / expired JWT           |         401 | Invalid or expired token                   |
| Invalid / expired refresh token |         401 | Invalid or expired refresh token           |
| Duplicate email                 |         409 | Email already registered                   |

---

# Authentication Testing

Authentication APIs have been tested using an API client.

## Registration Tests

| Test Case                   | Expected Result | Status |
| --------------------------- | --------------- | ------ |
| Valid registration          | 201 Created     | ✅      |
| Missing full name           | 400 Bad Request | ✅      |
| Missing email               | 400 Bad Request | ✅      |
| Missing password            | 400 Bad Request | ✅      |
| Invalid email               | 400 Bad Request | ✅      |
| Password below 8 characters | 400 Bad Request | ✅      |
| Duplicate email             | 409 Conflict    | ✅      |

---

## Login Tests

| Test Case         | Expected Result  | Status |
| ----------------- | ---------------- | ------ |
| Valid credentials | 200 OK           | ✅      |
| Wrong password    | 401 Unauthorized | ✅      |
| Unknown email     | 401 Unauthorized | ✅      |
| Missing password  | 400 Bad Request  | ✅      |
| Invalid email     | 400 Bad Request  | ✅      |

---

## Protected Endpoint Tests

| Test Case                | Expected Result  | Status |
| ------------------------ | ---------------- | ------ |
| `/me` without token      | 401 Unauthorized | ✅      |
| `/me` with invalid token | 401 Unauthorized | ✅      |
| `/me` with valid JWT     | 200 OK           | ✅      |

---

## Refresh Token Tests

| Test Case                         | Expected Result    | Status |
| --------------------------------- | ------------------ | ------ |
| Login creates refresh token       | 200 OK             | ✅      |
| Refresh with valid token          | 200 OK             | ✅      |
| Refresh returns new access token  | New token returned | ✅      |
| Refresh returns new refresh token | New token returned | ✅      |
| Old refresh token after rotation  | 401 Unauthorized   | ✅      |
| Invalid refresh token             | 401 Unauthorized   | ✅      |
| Expired refresh token             | 401 Unauthorized   | ✅      |
| Revoked refresh token             | 401 Unauthorized   | ✅      |

---

## Logout Tests

| Test Case                          | Expected Result  | Status |
| ---------------------------------- | ---------------- | ------ |
| Logout with valid refresh token    | 200 OK           | ✅      |
| `revoked_at` updated in PostgreSQL | Timestamp stored | ✅      |
| Reuse revoked refresh token        | 401 Unauthorized | ✅      |

---

# Layer Responsibilities

## Route Layer

Responsible for:

* Defining API endpoints
* Connecting middleware
* Connecting controllers

Current authentication routes:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

---

## Validation Layer

Responsible for:

* Checking required fields
* Validating basic input format
* Rejecting invalid requests early

Validation prevents invalid requests from reaching the service
and database layers.

---

## Controller Layer

Responsible for:

* Receiving HTTP requests
* Calling services
* Sending HTTP responses
* Passing errors to the global error handler

Controllers do not contain database queries.

---

## Service Layer

Responsible for business logic.

Current responsibilities include:

* Checking duplicate email
* Hashing passwords
* Comparing passwords
* Generating access tokens
* Generating refresh tokens
* Validating refresh tokens
* Rotating refresh tokens
* Revoking refresh tokens
* Fetching current user
* Deciding authentication outcomes

---

## Repository Layer

Responsible for database access.

### User Repository

Current methods:

```text
findByEmail()
create()
findById()
```

### Refresh Token Repository

Current methods:

```text
create()
findByTokenHash()
revokeById()
```

The repositories communicate directly with PostgreSQL.

---

## Database Layer

CrowdGate uses PostgreSQL as the persistent data store.

The database layer uses a connection pool to efficiently manage
database connections.

Current authentication tables:

```text
users
refresh_tokens
```

The `refresh_tokens.user_id` column references `users.id`.

The relationship uses:

```sql
ON DELETE CASCADE
```

---

# Security Practices

CrowdGate currently follows these security practices:

* Passwords are hashed using bcrypt.
* Password hashes are never returned to API clients.
* JWT secrets are stored in environment variables.
* Protected endpoints require Bearer token authentication.
* Invalid and expired JWTs are rejected.
* Invalid login attempts use a generic authentication message.
* Database queries use parameterized SQL.
* User data is accessed through the repository layer.
* Refresh tokens are stored in hashed form.
* Refresh tokens can expire.
* Refresh tokens can be revoked.
* Refresh tokens are rotated after successful refresh.
* Revoked refresh tokens cannot be reused.
* Authentication logic is separated from HTTP handling.
* Validation occurs before business logic execution.
* Sensitive environment variables are not committed to Git.

---

# Current API Status

| API                     | Method | Status        |
| ----------------------- | ------ | ------------- |
| `/health`               | GET    | ✅ Implemented |
| `/api/v1/auth/register` | POST   | ✅ Implemented |
| `/api/v1/auth/login`    | POST   | ✅ Implemented |
| `/api/v1/auth/me`       | GET    | ✅ Implemented |
| `/api/v1/auth/refresh`  | POST   | ✅ Implemented |
| `/api/v1/auth/logout`   | POST   | ✅ Implemented |

---

# Future Authentication APIs

The following functionality is planned but has not yet been
implemented.

## Role-Based Authorization

The user model already contains a `role` field.

Future authorization middleware will use the role to restrict
specific endpoints based on user permissions.

Example:

```text
User
 ↓
role = user

Admin
 ↓
role = admin
```

Status:

⏳ Planned

---

## Additional Protected APIs

Future application modules will use the JWT authentication
middleware to protect private resources.

Status:

⏳ Planned

---

## Integration Test Suite

A dedicated automated integration-test suite for authentication
will be added in a future phase.

Status:

⏳ Planned

---

# Authentication Roadmap

```text
Registration
     ↓
Password Hashing
     ↓
Validation
     ↓
Login
     ↓
JWT Generation
     ↓
JWT Middleware
     ↓
Protected /me
     ↓
Refresh Tokens
     ↓
Token Rotation
     ↓
Logout / Token Revocation
     ↓
Role Authorization       ⏳
     ↓
Additional Protected APIs ⏳
     ↓
Integration Tests         ⏳
```

---

# Implementation Status

## Completed

* [x] Authentication module structure
* [x] Registration API
* [x] Login API
* [x] Request validation
* [x] Password hashing
* [x] Password verification
* [x] Duplicate email handling
* [x] Parameterized SQL
* [x] JWT generation
* [x] JWT authentication middleware
* [x] Protected `/me` endpoint
* [x] Safe user responses
* [x] Authentication error handling
* [x] Authentication API testing
* [x] Refresh token database table
* [x] Refresh token repository
* [x] Refresh token generation
* [x] Refresh token hashing
* [x] Refresh token validation
* [x] Refresh token expiration check
* [x] Refresh token revocation check
* [x] Refresh token rotation
* [x] Protected refresh-token lifecycle
* [x] Refresh API
* [x] Logout API
* [x] Logout token revocation
* [x] Revoked token reuse protection

## Pending

* [ ] Role-based authorization
* [ ] Additional protected APIs
* [ ] Automated integration test suite
* [ ] Final Sprint 2 review

---
