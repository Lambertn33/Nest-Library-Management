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

## Installation

1. Clone the repository
2. npm install
3. npm run start:dev

## Environment variables

DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/DB_NAME
