import React from "react";
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const storedUserInfo = localStorage.getItem('userInfo');
  const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

  // Check if user is logged in AND is an admin
  return userInfo && userInfo.isAdmin ? (
    <Outlet /> // If yes, render the child component (e.g., the Create Event page)
  ) : (
    <Navigate to="/login" replace /> // If no, redirect to the login page
  );
};

export default AdminRoute;