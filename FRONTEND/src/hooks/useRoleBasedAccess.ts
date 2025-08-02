import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '../store/useAuthStore';

export const useRoleBasedAccess = () => {
  const { user, isLoggedIn, isAdmin, hasRole } = useAuthStore();

  const canAccessAdminPanel = () => {
    return isLoggedIn && isAdmin();
  };

  const canModerateReports = () => {
    return isLoggedIn && isAdmin();
  };

  const canDeleteReports = () => {
    return isLoggedIn && isAdmin();
  };

  const canViewAllReports = () => {
    return isLoggedIn && isAdmin();
  };

  const canCreateReports = () => {
    return isLoggedIn;
  };

  const canEditOwnReports = () => {
    return isLoggedIn;
  };

  const canVoteOnReports = () => {
    return isLoggedIn;
  };

  const requiresRole = (requiredRole: UserRole) => {
    return isLoggedIn && hasRole(requiredRole);
  };

  const requiresAdmin = () => {
    return requiresRole('admin');
  };

  const getUserRole = (): UserRole | null => {
    return user?.role || null;
  };

  const isCurrentUser = (userId: string) => {
    return user?.id === userId;
  };

  return {
    canAccessAdminPanel,
    canModerateReports,
    canDeleteReports,
    canViewAllReports,
    canCreateReports,
    canEditOwnReports,
    canVoteOnReports,
    requiresRole,
    requiresAdmin,
    getUserRole,
    isCurrentUser,
    isAdmin: isAdmin(),
    userRole: user?.role,
  };
};
