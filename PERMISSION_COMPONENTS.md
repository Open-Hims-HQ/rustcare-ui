# Permission-Enhanced UI Components

All shadcn/ui components have been enhanced with built-in permission support. This allows you to control visibility and interactivity based on user permissions without wrapping components in guards.

## Features

- **Optional Permission Checks**: All components accept an optional `permission` prop
- **Flexible Visibility**: Use `hideIfDenied` to control whether denied components are hidden or disabled
- **Consistent API**: Same permission props across all components
- **Type-Safe**: Full TypeScript support with proper types

## Common Props

All enhanced components support these props:

```typescript
interface PermissionProps {
  permission?: PermissionCheck;  // Optional permission to check
  hideIfDenied?: boolean;        // true = hide, false = show but disabled (default: false)
}
```

## Component Examples

### Button

```tsx
import { Button } from "~/components/ui/button";

// Basic button with permission
<Button permission="users:create">
  Create User
</Button>

// Hide button if permission denied
<Button permission="users:delete" hideIfDenied>
  Delete User
</Button>

// Custom disabled message
<Button 
  permission="admin:access" 
  disabledMessage="Admin access required"
>
  Admin Panel
</Button>
```

### Card Components

All card sub-components support individual permissions:

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";

<Card permission="dashboard:view">
  <CardHeader permission="dashboard:view_header">
    <CardTitle permission="dashboard:view_title">
      Dashboard
    </CardTitle>
  </CardHeader>
  
  <CardContent permission="dashboard:view_content">
    Sensitive content here
  </CardContent>
  
  <CardFooter permission="dashboard:view_actions">
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input

```tsx
import { Input } from "~/components/ui/input";

// Readonly when permission denied
<Input 
  permission="profile:edit" 
  placeholder="Email"
/>

// Hide when permission denied
<Input 
  permission="admin:view_secret" 
  hideIfDenied
  placeholder="Secret Key"
/>
```

### Select

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";

<Select>
  <SelectTrigger permission="settings:change_role">
    <SelectValue placeholder="Select role" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="admin">Admin</SelectItem>
    <SelectItem value="user">User</SelectItem>
  </SelectContent>
</Select>
```

### Navigation Menu

Each navigation component supports individual permissions:

```tsx
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "~/components/ui/navigation-menu";

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger permission="admin:view">
        Admin
      </NavigationMenuTrigger>
      <NavigationMenuContent permission="admin:view_content">
        <NavigationMenuLink permission="users:manage">
          Manage Users
        </NavigationMenuLink>
        <NavigationMenuLink permission="roles:manage">
          Manage Roles
        </NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

### Badge

```tsx
import { Badge } from "~/components/ui/badge";

<Badge permission="status:view" variant="success">
  Active
</Badge>

<Badge permission="admin:badge" hideIfDenied variant="danger">
  Admin Only
</Badge>
```

### Label

```tsx
import { Label } from "~/components/ui/label";

<div>
  <Label htmlFor="secret" permission="secrets:view">
    Secret Key
  </Label>
  <Input id="secret" permission="secrets:view" />
</div>
```

## Advanced Usage

### Combining Multiple Permissions

Use the permission hooks for complex logic:

```tsx
import { useAnyPermission, useAllPermissions } from "~/hooks/usePermissions";

function AdvancedComponent() {
  // Check if user has ANY of these permissions
  const canView = useAnyPermission([
    "admin:view",
    "manager:view",
    "user:view_own"
  ]);

  // Check if user has ALL of these permissions
  const canManage = useAllPermissions([
    "users:edit",
    "users:delete"
  ]);

  return (
    <Card>
      {canView && <CardContent>Content</CardContent>}
      {canManage && (
        <CardFooter>
          <Button>Manage</Button>
        </CardFooter>
      )}
    </Card>
  );
}
```

### Conditional Rendering

Use the `ConditionalRender` component for custom logic:

```tsx
import { ConditionalRender } from "~/components/PermissionGuard";

<ConditionalRender permission="feature:access">
  {(hasPermission) => (
    hasPermission ? (
      <Button variant="default">Full Access</Button>
    ) : (
      <Button variant="outline">Request Access</Button>
    )
  )}
</ConditionalRender>
```

## Permission Types

```typescript
type PermissionCheck = {
  action: PermissionAction;      // 'create' | 'read' | 'update' | 'delete' | ...
  resource: ResourceType;        // 'users' | 'roles' | 'secrets' | ...
  resourceId?: string;           // Optional specific resource ID
  context?: Record<string, any>; // Additional context
};

// Example permission checks
const permissions = {
  createUser: { action: 'create', resource: 'users' },
  editSecret: { action: 'update', resource: 'secrets', resourceId: 'secret-123' },
  viewDashboard: { action: 'read', resource: 'dashboard' },
  deleteRole: { action: 'delete', resource: 'roles' },
};
```

## Component Support Matrix

| Component | Permission | hideIfDenied | Additional Features |
|-----------|-----------|--------------|-------------------|
| Button | ✅ | ✅ | `disabledMessage` |
| Input | ✅ | ✅ | readonly/disabled |
| Card | ✅ | ✅ | - |
| CardHeader | ✅ | ✅ | - |
| CardTitle | ✅ | ✅ | - |
| CardContent | ✅ | ✅ | - |
| CardFooter | ✅ | ✅ | - |
| CardDescription | ✅ | ✅ | - |
| Select | ✅ | ✅ | - |
| SelectTrigger | ✅ | ✅ | - |
| Badge | ✅ | ✅ | - |
| Label | ✅ | ✅ | - |
| NavigationMenu | ✅ | ✅ | - |
| NavigationMenuList | ✅ | ✅ | - |
| NavigationMenuTrigger | ✅ | ✅ | - |
| NavigationMenuContent | ✅ | ✅ | - |
| NavigationMenuLink | ✅ | ✅ | - |

## Best Practices

1. **Granular Permissions**: Apply permissions at the most specific level needed
   ```tsx
   // Good - specific permissions
   <CardContent permission="dashboard:view_statistics">
     Statistics
   </CardContent>
   
   // Less ideal - too broad
   <Card permission="dashboard:view">
     <CardContent>Statistics</CardContent>
   </Card>
   ```

2. **Hide vs Disable**: Choose the right behavior
   - Use `hideIfDenied={true}` for sensitive content that shouldn't be visible
   - Use `hideIfDenied={false}` (default) for actions that should be visible but disabled

3. **Performance**: Permission checks are memoized, but avoid unnecessary nesting
   ```tsx
   // Good - single check
   <div>
     {secrets.map(secret => (
       <Card key={secret.id} permission="secrets:view">
         {secret.name}
       </Card>
     ))}
   </div>
   
   // Better - check once
   const canView = usePermission("secrets:view");
   <div>
     {canView && secrets.map(secret => (
       <Card key={secret.id}>{secret.name}</Card>
     ))}
   </div>
   ```

4. **Fallback UI**: Provide good user experience for denied permissions
   ```tsx
   <ConditionalRender permission="premium:feature">
     {(hasPremium) => hasPremium ? (
       <PremiumContent />
     ) : (
       <Card>
         <CardContent>
           <p>Upgrade to Premium to access this feature</p>
           <Button>Upgrade Now</Button>
         </CardContent>
       </Card>
     )}
   </ConditionalRender>
   ```

## Migration Guide

If you have existing code using `PermissionGuard` components, you can migrate to the enhanced components:

### Before (using guards)
```tsx
<PermissionGuard permission="users:create">
  <Button>Create User</Button>
</PermissionGuard>
```

### After (using enhanced components)
```tsx
<Button permission="users:create">Create User</Button>
```

Both approaches work, but the enhanced components provide cleaner syntax and better integration.

## Troubleshooting

### Permission not working?

1. **Check security config**: Ensure permissions are enabled in `/app/lib/security-config.ts`
   ```typescript
   export const ENABLE_PERMISSIONS = true;
   ```

2. **Verify user context**: Make sure user data is loaded in route loaders
   ```typescript
   export async function loader({ request }: LoaderFunctionArgs) {
     const user = await getUserFromSession(request);
     return json({ user });
   }
   ```

3. **Check permission format**: Ensure permission object is correct
   ```typescript
   // Correct
   permission={{ action: 'read', resource: 'users' }}
   
   // Also correct (shorthand if using string helper)
   permission="users:read"
   ```

## Related Documentation

- [PERMISSIONS_SYSTEM.md](./PERMISSIONS_SYSTEM.md) - Complete permission system documentation
- [SECURITY_CONFIG.md](./SECURITY_CONFIG.md) - Security configuration guide
- [PermissionGuard.tsx](./app/components/PermissionGuard.tsx) - Legacy guard components
