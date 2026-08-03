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
  "status": "healthy",
  "message": "CrowdGate API is running",
  "timestamp": "2026-08-03T10:30:00.000Z"
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