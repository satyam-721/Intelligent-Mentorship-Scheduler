import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard if they try to access the wrong role's dashboard
    return <Navigate to={user.role === 'MENTOR' ? '/dashboard' : '/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
