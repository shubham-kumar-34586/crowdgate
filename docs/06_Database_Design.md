# Database Design

## Version 1 Entities

- Users
- Organizers
- Events
- Venues
- Seats
- Bookings
- Booking Items
- Payments
- Tickets
- Notifications

---

## Database Connection

### Database Engine

- PostgreSQL (Neon Cloud)

### Connection Strategy

CrowdGate uses PostgreSQL Connection Pooling through the `pg` library.

### Reasons

- Efficient connection reuse
- Better performance
- Production-ready architecture
- Supports concurrent requests
- SSL enabled for secure communication


## Users Table

| Column | Type | Description |
|---------|------|-------------|
| id | UUID | Primary Key |
| full_name | VARCHAR(100) | User Name |
| email | VARCHAR(255) | Unique Email |
| password_hash | TEXT | Encrypted Password |
| role | VARCHAR(20) | User Role |
| is_verified | BOOLEAN | Email Verification Status |
| created_at | TIMESTAMP | Record Creation |
| updated_at | TIMESTAMP | Record Update |