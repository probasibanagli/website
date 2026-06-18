import type { UserRole, ModuleKey, ModulePermissions, PermissionLevel } from '@/types';

/**
 * Permission hierarchy: none < view < edit < manage
 */
const PERMISSION_HIERARCHY: PermissionLevel[] = ['none', 'view', 'edit', 'manage'];

/**
 * Check if a permission level meets or exceeds the required level.
 */
export function hasPermission(
  actual: PermissionLevel,
  required: PermissionLevel
): boolean {
  return PERMISSION_HIERARCHY.indexOf(actual) >= PERMISSION_HIERARCHY.indexOf(required);
}

/**
 * Check if a user can access a specific module with the required permission level.
 */
export function canAccess(
  role: UserRole,
  permissions: ModulePermissions | undefined,
  module: ModuleKey,
  requiredLevel: PermissionLevel = 'view'
): boolean {
  // Super Admin has full access to everything
  if (role === 'superadmin') return true;

  // Regular users have no admin access
  if (role === 'user') return false;

  // Admin: check granular permissions
  if (!permissions) return false;
  const level = permissions[module] ?? 'none';
  return hasPermission(level, requiredLevel);
}

/**
 * Get all modules a user has access to (at least 'view').
 */
export function getAccessibleModules(
  role: UserRole,
  permissions: ModulePermissions | undefined
): ModuleKey[] {
  const ALL_MODULES: ModuleKey[] = [
    'stay', 'food', 'travel', 'emergency',
    'community', 'services', 'blog', 'users',
  ];

  if (role === 'superadmin') return ALL_MODULES;
  if (role === 'user' || !permissions) return [];

  return ALL_MODULES.filter((mod) => hasPermission(permissions[mod] ?? 'none', 'view'));
}

/**
 * Default permissions for each role.
 */
export function getDefaultPermissions(role: UserRole): ModulePermissions {
  const none: ModulePermissions = {
    stay: 'none',
    food: 'none',
    travel: 'none',
    emergency: 'none',
    community: 'none',
    services: 'none',
    blog: 'none',
    users: 'none',
  };

  const full: ModulePermissions = {
    stay: 'manage',
    food: 'manage',
    travel: 'manage',
    emergency: 'manage',
    community: 'manage',
    services: 'manage',
    blog: 'manage',
    users: 'manage',
  };

  switch (role) {
    case 'superadmin':
      return full;
    case 'admin':
      // Admins start with no permissions — Super Admin assigns them
      return none;
    case 'user':
    default:
      return none;
  }
}

/**
 * All module keys.
 */
export const ALL_MODULES: ModuleKey[] = [
  'stay', 'food', 'travel', 'emergency',
  'community', 'services', 'blog', 'users',
];

/**
 * All permission levels for UI display.
 */
export const ALL_PERMISSION_LEVELS: PermissionLevel[] = ['none', 'view', 'edit', 'manage'];
