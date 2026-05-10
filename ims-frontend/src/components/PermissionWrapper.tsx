import type { ReactNode } from 'react';
import { usePermission } from '../hooks/usePermission';

interface PermissionWrapperProps {
  children: ReactNode;
  code: string;
  mode?: 'all' | 'any';
  fallback?: ReactNode;
}

export function PermissionWrapper({
  children,
  code,
  mode = 'all',
  fallback = null,
}: PermissionWrapperProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

  let allowed = false;
  if (mode === 'any') {
    allowed = hasAnyPermission(Array.isArray(code) ? code : [code]);
  } else {
    allowed = hasAllPermissions(Array.isArray(code) ? code : [code]);
  }

  return allowed ? <>{children}</> : <>{fallback}</>;
}