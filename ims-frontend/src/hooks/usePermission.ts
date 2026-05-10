import { useAuthStore } from '../stores/authStore';

export function usePermission() {
  const permissions = useAuthStore((state) => state.permissions);

  const hasPermission = (code: string): boolean => {
    return permissions.includes(code);
  };

  const hasAnyPermission = (codes: string[]): boolean => {
    return codes.some((code) => permissions.includes(code));
  };

  const hasAllPermissions = (codes: string[]): boolean => {
    return codes.every((code) => permissions.includes(code));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}