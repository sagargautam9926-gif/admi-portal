
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';
import toast from 'react-hot-toast';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (
      !loading &&
      isAuthenticated &&
      requiredRole &&
      user?.role !== requiredRole
    ) {
      toast.error(
        'Access restricted: You do not have permissions to access this page.',
        {
          id: 'role-restricted-toast',
        }
      );
    }
  }, [loading, isAuthenticated, requiredRole, user]);

  // Authentication Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F6FD]">
        <Loader size="lg" text="Authenticating..." />
      </div>
    );
  }

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Check user role
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
