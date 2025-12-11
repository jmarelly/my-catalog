# Product Catalog - Frontend

React-based frontend for the Product Catalog application.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling and development
- **Material-UI (MUI)** for component library
- **TanStack React Query** for server state management
- **React Router** for client-side routing
- **Zod** for form validation

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Features

### Public Features

- **Product Catalog**: Paginated product browsing
- **Search**: Real-time product search
- **Category Filtering**: Filter products by category
- **Product Details**: Modal view for product information

### Admin Features

- **Product Management**: Create, edit, delete products
- **Bulk Operations**: Update prices for multiple products
- **Authentication**: Secure admin access

### UI/UX Features

- **Responsive Design**: Mobile-friendly interface
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success/error feedback
- **Form Validation**: Real-time validation with Zod

## Component Architecture

### Page Components

- `Home.tsx` - Product catalog with search and pagination
- `Admin.tsx` - Admin dashboard for product management
- `Login.tsx` - Authentication form

### Shared Components

- `ProductCard.tsx` - Individual product display
- `ProductFormDialog.tsx` - Create/edit product form
- `BulkDiscountDialog.tsx` - Bulk discount update interface
- `Pagination.tsx` - Pagination controls

### State Management

- **React Query**: Server state management and caching
- **React Context**: Authentication state
- **Local State**: Form states and UI interactions

## API Integration

The frontend communicates with the backend API through dedicated service functions:

```typescript
// Authentication
authApi.login(credentials);
authApi.me();
authApi.logout();

// Products
productsApi.getAll({ page, limit, search });
productsApi.create(productData);
productsApi.update(id, productData);
productsApi.delete(id);

// Categories
categoriesApi.getAll();
```

All API calls include automatic error handling and toast notifications.
