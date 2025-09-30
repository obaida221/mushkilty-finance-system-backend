# Mushkilty Finance System Backend

A comprehensive NestJS backend with Role-Based Access Control (RBAC) for finance systems.

## Features

- 🔐 **Complete RBAC Authentication & Authorization**
- 🏛️ **Role & Permission Management**
- 👥 **User Management with Password Hashing**
- 📊 **RESTful API with Swagger Documentation**
- 🗄️ **PostgreSQL Database with TypeORM**
- 🔑 **JWT-based Authentication**
- 🛡️ **Permission-based Route Guards**

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd mushkilty-finance-system-backend
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Start the application:**
```bash
npm run start:dev
```

4. **Seed initial data:**
```bash
# Visit http://localhost:3000/bootstrap/seed in your browser or
curl -X POST http://localhost:3000/bootstrap/seed
```

## API Documentation

Visit `http://localhost:3000/api` for interactive Swagger documentation.

## Authentication Flow

### 1. Login
```bash
POST /auth/login
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Bootstrap Admin",
    "role": {
      "id": 1,
      "name": "admin",
      "description": "Full access"
    }
  }
}
```

### 2. Use the token in subsequent requests:
```bash
curl -H "Authorization: Bearer <access_token>" http://localhost:3000/users
```

## Default Roles & Permissions

### Roles Created on Bootstrap:
- **admin**: Full system access
- **accountant**: Manage transactions and reports  
- **approver**: Approve high-value transactions
- **viewer**: Read-only access

### Default Permissions:
- `transactions:*` (create, read, update, approve, delete)
- `users:*` (read, create, update, delete)
- `roles:*` (read, create, update, delete)
- `permissions:*` (read, create, update, delete)

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get current user profile

### Users (Requires appropriate permissions)
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Roles (Requires appropriate permissions)
- `GET /roles` - List all roles
- `GET /roles/:id` - Get role by ID
- `POST /roles` - Create new role
- `PUT /roles/:id` - Update role
- `POST /roles/:id/permissions` - Assign permissions to role
- `DELETE /roles/:id` - Delete role

### Permissions (Requires appropriate permissions)
- `GET /permissions` - List all permissions
- `POST /permissions` - Create new permission

### Bootstrap
- `POST /bootstrap/seed` - Initialize default data

## Permission System

### Format: `resource:action`
Examples:
- `users:read` - Can view users
- `users:create` - Can create users
- `transactions:approve` - Can approve transactions

### Adding New Permissions:
```typescript
// In your controller
@Permissions('new-resource:action')
@Get()
someEndpoint() {
  // Only users with this permission can access
}
```

## Project Structure

```
src/
├── auth/                 # Authentication & authorization
│   ├── guards/          # JWT & permission guards
│   ├── decorators/      # Custom decorators
│   ├── strategies/      # Passport strategies
│   └── dto/            # Auth-related DTOs
├── users/               # User management
├── roles/               # Role management  
├── permissions/         # Permission management
├── bootstrap/           # Data seeding
└── common/             # Shared utilities
```

## Security Features

- ✅ JWT tokens with configurable expiration
- ✅ Password hashing with bcrypt
- ✅ Permission-based route protection
- ✅ Input validation with class-validator
- ✅ Global exception handling
- ✅ CORS enabled
- ✅ SQL injection protection via TypeORM

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_USERNAME` | Database username | postgres |
| `DB_PASSWORD` | Database password | - |
| `DB_NAME` | Database name | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | Token expiration | 24h |

## Scripts

```bash
npm run start          # Start production server
npm run start:dev      # Start development server
npm run build          # Build for production
npm run test           # Run tests
npm run lint           # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request