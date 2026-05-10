import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermission } from '../hooks/usePermission';
import { useAuthStore } from '../stores/authStore';

interface RequirePermissionProps {
  children: ReactNode;
  codes: string[];
  mode?: 'all' | 'any';
}

export function RequirePermission({
  children,
  codes,
  mode = 'all',
}: RequirePermissionProps) {
  const location = useLocation();
  const token = useAuthStore((state) => state.token);
  const { hasAnyPermission, hasAllPermissions } = usePermission();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const allowed =
    mode === 'any' ? hasAnyPermission(codes) : hasAllPermissions(codes);

  if (!allowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}