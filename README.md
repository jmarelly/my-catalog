# Product Catalog

A modern full-stack e-commerce product catalog application built with React and Node.js.

## 1. Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **Material-UI (MUI)** for component library
- **TanStack React Query** for server state management
- **React Router** for client-side routing
- **Zod** for schema validation

### Backend

- **Node.js** with Express framework
- **TypeScript** for type safety
- **SQLite** with Drizzle ORM for database
- **JWT** for authentication
- **bcrypt** for password hashing
- **Pino** for logging

### Development Tools

- **ESLint** for code linting
- **Prettier** for code formatting
- **Nodemon** for server hot reload

## 2. How to Initialize and Run

### Prerequisites

- Node.js 20+
- npm or yarn

### Quick Start

```bash
# Clone repository
git clone <your-repo-url>
cd product-catalog

# Install all dependencies
npm run install

# Initialize the database (one-time setup)
npm run db:init

# Start development servers (both client and server)
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

### Individual Server Setup

```bash
# Initialize database (if not already done)
npm run db:init

# Start only client
npm run client:dev

# Start only server (in another terminal)
npm run server:dev
```

### Environment Setup

The `.env` file is included for development and testing purposes for the sake of the Task. Otherwise this file should be ingnored by git.

**Admin Credentials**: Username: `admin`, Password: `admin123` (can be found in the login modal or server seed script)

## 3. How to Use

### Public Features

- **Browse Products**: View paginated product catalog with search
- **Product Details**: Click any product for detailed view
- **Category Filtering**: Filter products by category

### Admin Features (Login Required)

- **Product Management**: Create, edit, delete products
- **Bulk Price Updates**: Update prices for multiple products
- **Authentication**: Secure admin access with JWT tokens

### Navigation

- **Home**: Browse product catalog
- **Admin Panel**: Manage products (admin only)
- **Login**: Admin authentication

## 4. API Calls

### Authentication

```http
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
```

### Products

```http
GET    /api/v1/products              # Get paginated products
GET    /api/v1/products?search=term  # Search products
POST   /api/v1/products              # Create product (admin)
PUT    /api/v1/products/:id          # Update product (admin)
DELETE /api/v1/products/:id          # Delete product (admin)
POST   /api/v1/products/bulk-price-update # Bulk price update (admin)
```

### Categories

```http
GET /api/v1/categories # Get all categories
```

### Request/Response Examples

#### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  --cookie-jar cookies.txt
```

#### Get Products

```bash
curl http://localhost:3000/api/v1/products?page=1&limit=10
```

#### Create Product

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Wireless Headphones",
    "price": 99.99,
    "categoryId": "electronics",
    "description": "High-quality wireless headphones"
  }'
```

## 5. Postman Collection

Import the `ProductCatalog.postman_collection.json` file into Postman to test all API endpoints.

### Collection Features

- **Environment Variables**: `{{baseUrl}}` and `{{token}}` for easy configuration
- **Authentication Flow**: Login and token management
- **Complete CRUD Operations**: All product and category endpoints
- **Search and Pagination**: Query parameter examples
- **Admin Operations**: Protected endpoints for product management

### Setup in Postman

1. Import `ProductCatalog.postman_collection.json`
2. Set environment variable `baseUrl` to `http://localhost:3000`
3. Run authentication requests to get JWT token
4. Use authenticated requests for admin operations

## Additional Notes

- **Database**: SQLite database is created and seeded automatically on first server start (after running db:generate and db:push)
- **Hot Reload**: Both client and server support hot reloading during development
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Security**: JWT authentication with bcrypt password hashing
- **Validation**: Zod schemas for both client and server-side validation

## Development Commands

```bash
# Install dependencies
npm run install:all

# Database
npm run db:init         # Initialize database (generate + push schema)

# Development
npm run dev              # Both client and server
npm run client:dev       # Client only
npm run server:dev       # Server only

# Building
npm run build           # Build both
npm run client:build    # Build client
npm run server:build    # Build server

# Individual Database Commands
npm run db:generate     # Generate migrations (server directory)
npm run db:push         # Push schema changes (server directory)
npm run db:studio       # Open Drizzle Studio (server directory)
```

## Database Setup

The application uses SQLite with Drizzle ORM for data persistence.

### Initial Setup

Before running the application for the first time, you need to initialize the database:

1. **Run the initialization script**: `npm run db:init`
   - This generates migrations, applies the schema, and seeds initial data
2. **Start the server**: `npm run server:dev`

**Note**: In development, the server skips running migrations on startup since the schema is managed via `db:push`. Migrations are only applied in production environments.

The database will be automatically created and populated with:

- **Admin user**: username `admin`, password `admin123`
- **Sample products** across various categories
- **Product categories** (Electronics, Clothing, Books, etc.)

### Database Files

- **Schema**: `server/src/database/schema.ts`
- **Connection**: `server/src/database/connections.ts`
- **Database file**: `server/store.db` (created automatically)
- **Migrations**: `server/drizzle/` directory

### Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`
- These can also be found in the login modal and server seed script

```

```
