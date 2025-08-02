import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '../store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requireAuth = true,
  fallback = <UnauthorizedMessage />
}) => {
  const { isLoggedIn, hasRole } = useAuthStore();

  if (requireAuth && !isLoggedIn) {
    return <>{fallback}</>;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

const UnauthorizedMessage: React.FC = () => (
  <div className="min-h-96 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Access Denied</h3>
      <p className="text-slate-600 mb-4">
        You don't have permission to access this resource.
      </p>
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  children,
  allowedRoles,
  fallback = null
}) => {
  const { user, isLoggedIn } = useAuthStore();

  if (!isLoggedIn || !user) {
    return <>{fallback}</>;
  }

  if (!allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminOnly: React.FC<AdminOnlyProps> = ({ children, fallback = null }) => {
  return (
    <RoleGate allowedRoles={['admin']} fallback={fallback}>
      {children}
    </RoleGate>
  );
};
