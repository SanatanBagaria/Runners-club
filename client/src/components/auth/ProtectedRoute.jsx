import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const storedUserInfo = localStorage.getItem('userInfo');
  const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

  // Check if user is logged in
  return userInfo ? (
    <Outlet /> // If yes, render the child component (e.g., the Members page)
  ) : (
    <Navigate to="/login" replace /> // If no, redirect to the login page
  );
};

export default ProtectedRoute;