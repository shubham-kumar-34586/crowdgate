# High-Level Architecture

---

CrowdGate follows a layered architecture.

```

Client
    │
    ▼
Frontend (React)
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
Connection Pool
    │
    ▼
PostgreSQL
    │
    ▼
Response

```

---

## Components

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
