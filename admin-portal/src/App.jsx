import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Careers from './pages/Careers';
import Inquiries from './pages/Inquiries';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { ROLES } from './utils/constants';

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {/* Dark Neon Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#07174e',
              color: '#ffffff',
              border: '1px solid #1c3a9e',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 15px -3px rgba(25, 211, 255, 0.25)',
              borderRadius: '12px',
              fontSize: '13px',
              fontFamily: 'Poppins, sans-serif',
            },
            success: {
              iconTheme: {
                primary: '#19d3ff',
                secondary: '#07174e',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />

        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<Login />} />

          {/* Root Redirect to Dashboard */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          {/* Protected Admin Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<Services />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/inquiries" element={<Inquiries />} />

            {/* Admin-only Route: Protected against Editor */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredRole={ROLES.ADMIN}>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
