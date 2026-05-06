import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Component responsible for checking authentication status via JWT token
export const ProtectedRoute: React.FC = () => {
  // Check if the JWT token exists in localStorage
  const token = localStorage.getItem('sbp_token');
  const location = useLocation();

  if (!token) {
    // If no token, redirect to login. Save the current location state
    // so that after login, we can redirect the user back to where they intended to go.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If token exists, allow access to the child routes (Outlet)
  return <Outlet />;
};