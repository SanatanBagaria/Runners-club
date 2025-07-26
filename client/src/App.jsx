import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import AdminRoute from './components/auth/AdminRoute';
import ProtectedRoute from './components/auth/ProtectedRoute'; // Import ProtectedRoute
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventCreatePage from './pages/EventCreatePage';
import MembersPage from './pages/MembersPage'; // Import MembersPage
import EventDetailsPage from './pages/EventDetailsPage';
import MyRunsPage from './pages/MyRunsPage'; 
import EventEditPage from './pages/EventEditPage';
import ApproveMembersPage from './pages/ApproveMembersPage';

function App() {
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Member-Only Routes */}
          <Route path="" element={<ProtectedRoute />}>
            <Route path="/members" element={<MembersPage />} />
            <Route path="/my-runs" element={<MyRunsPage />} />
          </Route>

          {/* Admin-Only Routes */}
          <Route path="" element={<AdminRoute />}>
            <Route path="/admin/create-event" element={<EventCreatePage />} />
            <Route path="/admin/event/:id/edit" element={<EventEditPage />} />
            <Route path="/admin/approve-members" element={<ApproveMembersPage />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;