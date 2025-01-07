import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  // console.log('Token:', token); // Debugging

 
  // If the token is missing, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (token === 'undefined') {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children (protected component)
  return children;
}

export default ProtectedRoute;
