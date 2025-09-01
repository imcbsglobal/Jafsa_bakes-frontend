import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, Settings, Home } from 'lucide-react';
import jafsaLogo from '../assets/logo-js.png';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true }); // ✅ redirect to homepage after logout
  };

  const isActive = (path) => location.pathname === path;

  // Logo content component
  const LogoContent = () => (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
        <img 
          src={jafsaLogo} 
          alt="JAFSA - The Sweet Stories" 
          className="w-full h-full object-cover"
        />
      </div>
      <span className="font-bold text-lg text-yellow-600">JAFSA BAKES</span>
    </div>
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand - Conditional Link */}
          {location.pathname === '/admin' ? (
            // On admin page - no link, just display logo
            <div className="flex items-center space-x-2 text-2xl font-bold text-primary-600">
              <LogoContent />
            </div>
          ) : (
            // On other pages - clickable link to home
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              <LogoContent />
            </Link>
          )}

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Show Home button when on admin panel, Admin Panel button when on home */}
            {user && (
              <>
                {location.pathname === '/admin' ? (
                  // Show Home button when on admin panel
                  <Link
                    to="/"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:text-primary-600 hover:bg-gray-100"
                  >
                    <Home size={18} />
                    <span>Home</span>
                  </Link>
                ) : (
                  // Show Admin Panel button when on home page
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:text-primary-600 hover:bg-gray-100"
                  >
                    <Settings size={18} />
                    <span>Admin Panel</span>
                  </Link>
                )}
              </>
            )}

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-600 text-sm">
                  Welcome, {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/login') 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;