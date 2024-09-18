## Introduction

The Borrow Management System API allows administrators to track and manage book borrowing requests and returns in a library. Users can request books, return them, and administrators can manage borrowing statuses and view history.

## Features

- User authentication with JWT
- Role-based access control (Admin/User)
- Borrow/Return status tracking
- Book management (CRUD operations for books)
- Automated email notifications for overdue books

## Technologies

- [NestJS](https://nestjs.com/) - Backend framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Prisma](https://www.prisma.io/) - ORM
- [JWT](https://jwt.io/) - Authentication
- Docker
- Docker compose

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo

   ```

2. **Start the services**
   docker-compose up --build

3. Migrating the DB:

- docker exec -it nest_app sh
- npx prisma db push

### Running the Backend

NestJS Backend: The application runs on port 3002. Ensure the DATABASE_URL in the Docker environment configuration matches your PostgreSQL setup.

### Monitoring and Observability

Prometheus: Accessible at http://localhost:9090. Used for metrics collection.
Grafana: Accessible at http://localhost:3000. Used for visualization of metrics (credentials: admin/admin).
