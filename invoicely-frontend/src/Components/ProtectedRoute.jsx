import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // decode the expiry date

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken');

  if (!token || token === 'undefined') {
    // No token or invalid token, redirect to login
    return <Navigate to="/login" replace />;
  }

  try {
    // Decode the token to get its payload
    const decodedToken = jwtDecode(token);

    // Check if the token is expired
    if (decodedToken.exp * 1000 < Date.now()) {
      // Token has expired, redirect to login
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    // Invalid token, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If token is valid and not expired, render the protected component
  return children;
}

export default ProtectedRoute;
