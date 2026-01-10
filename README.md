# Next.js + Prisma + PostgreSQL Boilerplate

A modern, production-ready boilerplate for building full-stack web applications with Next.js, Prisma ORM, and PostgreSQL. Includes authentication, role-based access control, and a polished UI with shadcn/ui components.

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Pre-built, customizable React components
- **Lucide React** - Icon library

### Backend & Database
- **Prisma ORM 7** - Next-generation ORM for Node.js and TypeScript
- **PostgreSQL 18** - Relational database
- **Node.js** - JavaScript runtime

### Development & DevOps
- **pnpm** - Fast, disk space efficient package manager
- **Docker & Docker Compose** - Containerization and orchestration
- **ESLint** - Code quality and style checking
- **TypeScript** - Static type checking

### UI Components
- **Radix UI** - Unstyled, accessible component primitives
- **shadcn/ui** - Built-in components: Button, Card, Dialog, Input, Label, Separator, Badge

## Features

✅ **Authentication System** - User registration and login foundation  
✅ **Role-Based Access Control (RBAC)** - Built-in roles and permissions  
✅ **Database Models** - User, Role, Permission, Account, Session, and AuditLog models  
✅ **Responsive UI** - Mobile-first design with Tailwind CSS  
✅ **Docker Setup** - Ready for containerized development and deployment  
✅ **Type Safety** - Full TypeScript support end-to-end  
✅ **Database Seeding** - Automated database initialization  

## Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** 18+ ([download](https://nodejs.org/))
- **pnpm** 9+ (install with `npm install -g pnpm`)
- **Docker & Docker Compose** ([download](https://www.docker.com/products/docker-desktop))
- **PostgreSQL** 18+ (or use the included Docker setup)
- **Git** (for version control)

## Installation & Setup

### Option 1: Using Docker (Recommended)

The easiest way to get started with automatic database setup and hot-reload.

#### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd nextjs-prisma-postgres-boilerplate
```

#### Step 2: Create Environment Variables
Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://root:secret@db:5432/homestead"
NODE_ENV="development"
```

#### Step 3: Build the Docker Image
```bash
docker compose build
```

This command will:
- Build the Next.js application Docker image based on the Dockerfile
- Prepare all dependencies and configurations

#### Step 4: Start the Application with Docker Compose
```bash
docker compose up -d
```

This command will:
- Start a PostgreSQL database container on port 5432
- Start the Next.js application container on port 3000 (using the pre-built image)
- Automatically run `pnpm install` (if needed)
- Start the development server with hot-reload

#### Step 5: Access the Application
Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

#### Step 6: Stop the Application
```bash
docker compose down
```

---

### Option 2: Local Setup (Without Docker)

#### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd nextjs-prisma-postgres-boilerplate
```

#### Step 2: Install Dependencies
```bash
pnpm install
```

#### Step 3: Set Up PostgreSQL Database

You have two options:

**A. Using Docker for Database Only:**
```bash
docker run --name postgres-db \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=homestead \
  -p 5432:5432 \
  -d postgres:18
```

**B. Using Local PostgreSQL Installation:**
```bash
# Create database
createdb homestead

# Ensure the connection works (optional)
psql -h localhost -U postgres -d homestead
```

#### Step 4: Create Environment Variables
Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://root:secret@localhost:5432/homestead"
NODE_ENV="development"
```

#### Step 5: Initialize the Database with Prisma
```bash
pnpm prisma migrate dev
```

This will:
- Create database tables based on the Prisma schema
- Generate the Prisma Client

#### Step 6: (Optional) Seed the Database
```bash
pnpm prisma db seed
```

This populates the database with initial data as defined in [prisma/seed.ts](prisma/seed.ts).

#### Step 7: Start the Development Server
```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

```bash
# Development
pnpm dev              # Start Next.js dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm prisma migrate dev    # Create and apply migrations
pnpm prisma migrate reset  # Reset database (development only)
pnpm prisma studio        # Open Prisma Studio GUI for database
pnpm prisma db seed       # Seed database with initial data
pnpm prisma generate      # Generate Prisma Client

# Linting & Quality
pnpm lint             # Run ESLint
```

## Project Structure

```
nextjs-prisma-postgres-boilerplate/
├── app/
│   ├── components/           # React components
│   │   ├── login-form.tsx   # Login component
│   │   └── ui/              # shadcn/ui components
│   ├── dashboard/           # Dashboard pages
│   ├── page.tsx             # Home page
│   └── layout.tsx           # Root layout
├── lib/
│   ├── prisma.ts            # Prisma client instance
│   └── utils.ts             # Utility functions
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeding
├── public/                  # Static assets
├── .env.local              # Environment variables (create this)
├── docker compose.yml      # Docker services configuration
├── Dockerfile              # Next.js app containerization
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Project dependencies
└── README.md               # This file
```

## Database Schema Overview

The boilerplate includes the following key database models:

### User Model
- Stores user account information
- Fields: id, email, passwordHash, firstName, lastName, isActive, createdAt, updatedAt
- Relations: accounts, sessions, auditLogs, roles (RBAC)

### Role Model
- Defines user roles for access control
- Fields: id, name, description, createdAt, updatedAt
- Relations: permissions, users

### Permission Model
- Defines granular permissions (action + resource)
- Fields: id, action, resource, description
- Relations: roles

### UserRole Model
- Maps users to roles with optional scope
- Fields: id, userId, roleId, scopeType, scopeId, assignedAt

### Additional Models
- **Account** - Third-party authentication accounts
- **Session** - Active user sessions
- **AuditLog** - Activity tracking and compliance

## Viewing Database Contents

Use Prisma Studio to visualize and manage your database:

```bash
pnpm prisma studio
```

This opens an interactive GUI at [http://localhost:5555](http://localhost:5555) where you can:
- View all tables and records
- Create, update, and delete records
- Export data
- Manage relationships visually

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database connection
DATABASE_URL="postgresql://root:secret@localhost:5432/homestead"

# Node environment
NODE_ENV="development"
```

## Development Workflow

### Making Database Changes

1. **Update the Schema**
   ```bash
   # Edit prisma/schema.prisma
   ```

2. **Create a Migration**
   ```bash
   pnpm prisma migrate dev --name your_migration_name
   ```

3. **The Prisma Client is automatically generated**
   - Use it in your code: `import { prisma } from '@/lib/prisma'`

### Creating New Components

Components use shadcn/ui and are located in `app/components/ui/`. They're already configured and ready to use.

### Adding New Pages

Create new routes by adding files in the `app/` directory:
```
app/
  ├── page.tsx           # / route
  ├── dashboard/
  │   └── page.tsx      # /dashboard route
  └── settings/
      └── page.tsx      # /settings route
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in the Vercel dashboard
5. Deploy with one click

### Deploy with Docker

Build and push your Docker image to a registry:

```bash
docker build -t my-app:latest .
docker tag my-app:latest my-registry/my-app:latest
docker push my-registry/my-app:latest
```

Then deploy using Docker Compose or Kubernetes on your hosting platform.

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Failed
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env.local`
- Ensure database and user exist
- Test connection: `psql $DATABASE_URL`

### Prisma Client Not Generated
```bash
pnpm prisma generate
```

### Docker Issues
```bash
# Clean up Docker resources
docker compose down -v  # Remove volumes
docker compose up -d --build  # Rebuild images
```