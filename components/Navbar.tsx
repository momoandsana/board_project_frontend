
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BoardType } from '../types';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-neutral-950 text-neutral-200 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white hover:text-neutral-300 transition-colors">
              My Page
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link to={`/board/${BoardType.FREE}`} className="text-neutral-400 hover:bg-neutral-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Free Board
                </Link>
                <Link to={`/board/${BoardType.NOTICE}`} className="text-neutral-400 hover:bg-neutral-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Notice Board
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <>
                  <span className="text-neutral-400 mr-4">Welcome, <span className="text-neutral-100 font-medium">{user.username}</span>!</span>
                  {user.is_admin && (
                    <Link to="/admin/users" className="text-neutral-400 hover:bg-neutral-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      Admin
                    </Link>
                  )}
                  <Link to="/my-page" className="text-neutral-400 hover:bg-neutral-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    My Page
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-neutral-200 hover:bg-white text-neutral-900 px-3 py-2 rounded-md text-sm font-medium transition-colors ml-4"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-neutral-400 hover:bg-neutral-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-neutral-200 hover:bg-white text-neutral-900 px-3 py-2 rounded-md text-sm font-medium transition-colors ml-4"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
          {/* Mobile menu button can be added here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;