export interface GroupSimpleView {
  id: string;
  code: string;
  groupName: string;
}

export interface AccountDetailView {
  id: string;
  email: string;
  provider: string;
  providerId: string;
  status: 'ACTIVE' | 'BLOCKED' | 'PENDING';
  groups: GroupSimpleView[];
  lastLoginAt?: string;
  createdAt: string;
}

export interface UserDetailView {
  id: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  account: AccountDetailView;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 
  | 'SYSTEM_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'UNIT_ADMIN'
  | 'LEADER'
  | 'EDITOR'
  | 'CONTRIBUTOR'
  | 'USER';

export const ROLE_HIERARCHY: UserRole[] = [
  'USER',
  'CONTRIBUTOR',
  'EDITOR',
  'LEADER',
  'UNIT_ADMIN',
  'SCHOOL_ADMIN',
  'SYSTEM_ADMIN',
];

export function extractRolesFromGroups(groups: GroupSimpleView[]): UserRole[] {
  const roleMap: Record<string, UserRole> = {
    'SYSTEM_ADMIN': 'SYSTEM_ADMIN',
    'SCHOOL_ADMIN': 'SCHOOL_ADMIN',
    'UNIT_ADMIN': 'UNIT_ADMIN',
    'LEADER': 'LEADER',
    'UNIT_LEADER': 'LEADER',
    'EDITOR': 'EDITOR',
    'UNIT_EDITOR': 'EDITOR',
    'CONTRIBUTOR': 'CONTRIBUTOR',
    'USER': 'USER',
  };

  const roles: UserRole[] = [];
  
  for (const group of groups) {
    const code = group.code.toUpperCase();
    for (const [key, role] of Object.entries(roleMap)) {
      if (code.includes(key) && !roles.includes(role)) {
        roles.push(role);
      }
    }
  }

  if (roles.length === 0) {
    roles.push('USER');
  }

  return roles.sort((a, b) => ROLE_HIERARCHY.indexOf(b) - ROLE_HIERARCHY.indexOf(a));
}

export function getHighestRole(roles: UserRole[]): UserRole {
  if (roles.length === 0) return 'USER';
  return roles.reduce((highest, current) => {
    return ROLE_HIERARCHY.indexOf(current) > ROLE_HIERARCHY.indexOf(highest)
      ? current
      : highest;
  }, roles[0]);
}

export function hasRole(userRoles: UserRole[], requiredRole: UserRole): boolean {
  const userHighestIndex = Math.max(...userRoles.map(r => ROLE_HIERARCHY.indexOf(r)));
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  return userHighestIndex >= requiredIndex;
}
