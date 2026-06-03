import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Loader component for page checks
const GlobalLoader = () => (
  <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-slate-100">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      <p className="text-sm text-slate-400 font-medium">Securing session...</p>
    </div>
  </div>
);

// Protected routes wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <GlobalLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Redirect logged-in users away from auth pages
const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <GlobalLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ExpenseProvider>
          {/* Main Router setup */}
          <Routes>
            {/* Auth pages */}
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRoute>
                  <Register />
                </AuthRoute>
              }
            />

            {/* Dashboard and profile */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast Notification Configuration */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#f8fafc',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#f8fafc',
                },
              },
            }}
          />
        </ExpenseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
