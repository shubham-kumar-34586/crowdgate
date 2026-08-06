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

---

---

## Register User

### Endpoint

POST /api/v1/auth/register

### Description

Registers a new user account.

### Current Flow

Client
↓
Route
↓
Controller
↓
Service
↓
Repository
↓
PostgreSQL

### Request Body

```json
{
  "full_name": "Shubham Kumar",
  "email": "shubham@gmail.com",
  "password": "123456"
}
```

### Success Response

HTTP 201 Created

### Status

✅ Implemented (Phase 1)