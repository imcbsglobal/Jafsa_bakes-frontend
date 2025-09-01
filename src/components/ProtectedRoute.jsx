import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Prevent browser back button to cached admin pages
  useEffect(() => {
    const handlePopState = (event) => {
      if (!isAuthenticated()) {
        // Clear history and redirect to login
        window.history.replaceState(null, null, '/login');
        window.location.replace('/login');
      }
    };

    // Add event listener for browser back button
    window.addEventListener('popstate', handlePopState);
    
    // Prevent caching of protected pages
    window.addEventListener('beforeunload', () => {
      if (window.history && window.history.pushState) {
        window.history.pushState(null, null, window.location.href);
      }
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;