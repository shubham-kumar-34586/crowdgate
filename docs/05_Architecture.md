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
Services (Upcoming)
    │
    ▼
Repositories (Upcoming)
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

### Database

- PostgreSQL

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
