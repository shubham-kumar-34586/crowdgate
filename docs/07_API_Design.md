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

---

## Register User

### Endpoint

POST /api/v1/auth/register

### Description

Registers a new user account.

### Request Flow

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

### Request Body

```json
{
  "full_name": "Shubham Kumar",
  "email": "shubham@gmail.com",
  "password": "Password@123"
}
```

### Success Response

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

### Status

✅ Implemented

### Implementation Status

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

## Registration Validation

The registration endpoint validates incoming requests before
passing them to the controller.

### Validation Rules

* Full name is required.
* Email is required.
* Email must contain a valid basic format.
* Password is required.
* Password must contain at least 8 characters.

Invalid requests return HTTP 400 and do not reach the service
or repository layers.

### Missing Fields

HTTP 400 Bad Request

```json
{
  "success": false,
  "message": "Full name, email and password are required"
}
```

### Invalid Email

HTTP 400 Bad Request

```json
{
  "success": false,
  "message": "Invalid email address"
}
```

### Short Password

HTTP 400 Bad Request

```json
{
  "success": false,
  "message": "Password must be at least 8 characters"
}
```

---

## Password Hashing

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

### Status

✅ Implemented

---

## Duplicate Email Handling

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
409        Continue
Conflict
```

### Response

HTTP 409 Conflict

```json
{
  "success": false,
  "message": "Email already registered"
}
```

### Status

✅ Implemented

---

## User Repository

The repository layer handles direct database operations.

Current repository methods:

* `findByEmail()`
* `create()`
* `findById()`

### Find User By Email

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

## Create User

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

### Status

✅ Implemented

---

# Login User

## Endpoint

POST /api/v1/auth/login

## Description

Authenticates an existing user and generates a JWT access token.

### Request Body

```json
{
  "email": "shubham@gmail.com",
  "password": "Password@123"
}
```

### Request Flow

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
Generate JWT
  ↓
Return Safe User + Token
```

### Success Response

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
    "token": "JWT_TOKEN"
  }
}
```

The password hash is never returned to the client.

### Status

✅ Implemented

---

## Password Verification

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
Continue  401
```

### Status

✅ Implemented

---

## Invalid Login Credentials

If the email does not exist or the password is incorrect, the API
returns the same generic error.

### HTTP 401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

This prevents unnecessarily revealing whether a particular email
exists.

### Status

✅ Implemented

---

# JWT Authentication

CrowdGate uses JSON Web Tokens (JWT) to authenticate protected
API requests.

After successful login, the server generates a JWT.

### JWT Payload

```json
{
  "userId": "user-id",
  "email": "user@example.com",
  "role": "user"
}
```

---

## JWT Configuration

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

### Status

✅ Implemented

---

# JWT Authentication Middleware

The authentication middleware protects private endpoints.

### Middleware Flow

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

## Authorization Header

Protected requests must send:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## Missing JWT

If a protected endpoint is requested without an Authorization
header:

HTTP 401 Unauthorized

```json
{
  "success": false,
  "message": "Authentication required"
}
```

### Status

✅ Implemented

---

## Invalid or Expired JWT

If the token is invalid, malformed, expired, or fails JWT
verification:

HTTP 401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Status

✅ Implemented

---

# Current User — /me

## Endpoint

GET /api/v1/auth/me

## Description

Returns the currently authenticated user's current information.

This endpoint is protected by JWT authentication middleware.

---

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

---

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

---

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

---

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

### Status

✅ Implemented

---

# Authentication Error Responses

| Situation                   | HTTP Status | Message                                    |
| --------------------------- | ----------: | ------------------------------------------ |
| Missing registration fields |         400 | Full name, email and password are required |
| Invalid email               |         400 | Invalid email address                      |
| Password too short          |         400 | Password must be at least 8 characters     |
| Missing login credentials   |         400 | Email and password are required            |
| Invalid credentials         |         401 | Invalid email or password                  |
| Missing JWT                 |         401 | Authentication required                    |
| Invalid / expired JWT       |         401 | Invalid or expired token                   |
| Duplicate email             |         409 | Email already registered                   |

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

# Current Authentication Architecture

```text
                    ┌─────────────────┐
                    │     Client      │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │      Route      │
                    └────────┬────────┘
                             ↓
                  ┌──────────────────────┐
                  │ Validation / JWT     │
                  │ Middleware           │
                  └──────────┬───────────┘
                             ↓
                    ┌─────────────────┐
                    │   Controller    │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │     Service     │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │   Repository    │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    └─────────────────┘
```

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
* Generating JWT
* Fetching current user
* Deciding authentication outcomes

---

## Repository Layer

Responsible for database access.

Current methods:

```text
findByEmail()
create()
findById()
```

The repository communicates directly with PostgreSQL.

---

## Database Layer

CrowdGate uses PostgreSQL as the persistent data store.

The database layer uses a connection pool to efficiently manage
database connections.

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

---

# Future Authentication APIs

The following functionality is planned but has not yet been
implemented.

## Refresh Token System

Planned flow:

```text
Access Token
     ↓
Expires
     ↓
Refresh Token
     ↓
Generate New Access Token
```

Status:

⏳ Planned

---

## Logout

A logout and token invalidation strategy will be designed after
the refresh-token architecture is implemented.

Status:

⏳ Planned

---

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
Refresh Tokens       ⏳
     ↓
Logout Strategy      ⏳
     ↓
Role Authorization   ⏳
     ↓
Integration Tests    ⏳
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

## Pending

* [ ] Refresh token system
* [ ] Logout / token invalidation strategy
* [ ] Role-based authorization
* [ ] Additional protected APIs
* [ ] Integration test suite
* [ ] Final Sprint 2 review

---

# Current Sprint Position

CrowdGate has completed the core authentication foundation.

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
GENERATE JWT
   ↓
AUTHENTICATE REQUEST
   ↓
PROTECTED /ME
   ↓
FETCH CURRENT USER
```

The authentication foundation is ready for the next phase:

* Refresh tokens
* Logout strategy
* Role-based authorization
* Additional protected APIs
* Integration testing

---

```
```
