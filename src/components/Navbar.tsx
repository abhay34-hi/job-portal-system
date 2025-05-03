
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Briefcase, Search } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-navy text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <Briefcase className="mr-2" />
            <span>Employ Your Future</span>
          </Link>

          <nav className="flex items-center space-x-1 md:space-x-4">
            <Link to="/" className="px-2 py-1 hover:text-lightblue transition-colors">
              Home
            </Link>

            {isAuthenticated && userRole === 'jobseeker' && (
              <>
                <Link to="/find-jobs" className="px-2 py-1 hover:text-lightblue transition-colors flex items-center">
                  <Search size={16} className="mr-1" /> Find Jobs
                </Link>
                <Link to="/applications" className="px-2 py-1 hover:text-lightblue transition-colors">
                  My Applications
                </Link>
                <Link to="/profile" className="px-2 py-1 hover:text-lightblue transition-colors">
                  Profile
                </Link>
              </>
            )}

            {isAuthenticated && userRole === 'employer' && (
              <>
                <Link to="/post-job" className="px-2 py-1 hover:text-lightblue transition-colors">
                  Post Job
                </Link>
                <Link to="/manage-jobs" className="px-2 py-1 hover:text-lightblue transition-colors">
                  Manage Jobs
                </Link>
                <Link to="/employer-profile" className="px-2 py-1 hover:text-lightblue transition-colors">
                  Company Profile
                </Link>
              </>
            )}

            <div className="ml-2">
              {isAuthenticated ? (
                <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700" size="sm">
                  <LogOut size={16} className="mr-1" /> Logout
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={() => navigate('/login')} variant="secondary" size="sm">
                    <User size={16} className="mr-1" /> Login
                  </Button>
                  <Button onClick={() => navigate('/register')} variant="outline" size="sm" className="border-white text-white hover:bg-white/10">
                    Register
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
