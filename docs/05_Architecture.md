# High-Level Architecture

---

CrowdGate follows a layered architecture.

```

Client
    │
    ▼
React Frontend
    │
    ▼
Express Application
    │
    ▼
Global Middleware
    │
    ▼
Routes
    │
    ▼
Controllers
    │
    ▼
Services
    │
    ▼
Repositories
    │
    ▼
PostgreSQL
    │
    ▼
Response

```

---

## Components
### Authentication Module

Authentication follows a layered architecture:

- Routes
- Controllers
- Services
- Repositories
- PostgreSQL

### Register Flow

Client
    │
    ▼
POST /api/v1/auth/register
    │
    ▼
Auth Route
    │
    ▼
Auth Controller
    │
    ▼
Auth Service
    │
    ▼
User Repository
    │
    ▼
PostgreSQL

### Frontend

- React
- Tailwind CSS

### Backend

- Node.js
- Express.js

### Database Connection

- PostgreSQL Connection Pool (`pg`)
- SSL Enabled
- Centralized Database Module


### Database Layer

- PostgreSQL (Neon Cloud)
- Connection Pool (`pg`)
- SQL Migration Files

### Cache

- Redis

### Storage

- Cloudinary

### Authentication

- JWT
- Refresh Tokens

### Real-Time Communication

- Socket.IO

### Queue

- RabbitMQ (Future)

### Deployment

- Docker

- Nginx
