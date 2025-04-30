# Role-Based Access Control (RBAC) Implementation

## Overview

The StarShop backend implements a Role-Based Access Control (RBAC) system to manage user permissions and access control. This system allows for fine-grained control over which users can access specific endpoints and perform certain actions.

## Core Components

### 1. Roles

The system defines three primary roles:
- `buyer`: For users who can purchase items
- `seller`: For users who can list and manage items for sale
- `admin`: For users with administrative privileges

### 2. Role Guard

The `RolesGuard` is a NestJS guard that implements the `CanActivate` interface. It:
- Checks if the current user has the required roles to access a route
- Throws an `UnauthorizedException` if the user is not authenticated or doesn't have the required roles
- Uses the `RoleService` to verify user roles

### 3. Role Decorator

The `@Roles()` decorator is used to specify which roles are required to access a route:

```typescript
@Roles('admin')
@Get('protected-route')
async protectedRoute() {
  // Only users with admin role can access this
}
```

### 4. Role Service

The `RoleService` provides methods for:
- Creating, reading, updating, and deleting roles
- Assigning and removing roles from users
- Checking if a user has specific roles
- Managing user-role relationships

## Usage Examples

### Protecting Routes

```typescript
@Controller('items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ItemsController {
  @Post()
  @Roles('seller')
  async createItem() {
    // Only sellers can create items
  }

  @Get()
  @Roles('buyer', 'seller', 'admin')
  async getItems() {
    // All authenticated users can view items
  }
}
```

### Checking Roles in Services

```typescript
@Injectable()
export class SomeService {
  constructor(private readonly roleService: RoleService) {}

  async someMethod(userId: number) {
    const isAdmin = await this.roleService.hasRole(userId, 'admin');
    if (isAdmin) {
      // Perform admin-only operation
    }
  }
}
```

## Database Schema

The RBAC system uses two main entities:

1. `Role` - Stores role information
   - `id`: Primary key
   - `name`: Role name (buyer, seller, admin)

2. `UserRole` - Manages the many-to-many relationship between users and roles
   - `userId`: Foreign key to User
   - `roleId`: Foreign key to Role

## Best Practices

1. Always use both `JwtAuthGuard` and `RolesGuard` together
2. Specify roles at the most granular level needed
3. Use `hasAnyRole` when multiple roles can access a resource
4. Keep role names consistent across the application
5. Document role requirements in API documentation

## Security Considerations

- Role checks are performed after JWT authentication
- Role assignments should be managed by administrators only
- Role names are type-safe using TypeScript types
- Role checks are performed at both the route and service levels when needed 