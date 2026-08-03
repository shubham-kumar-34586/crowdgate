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
Express App
    │
    ▼
Routes
    │
    ▼
Controllers
    │
    ▼
Services (Coming Soon)
    │
    ▼
Repositories (Coming Soon)
    │
    ▼
PostgreSQL

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
