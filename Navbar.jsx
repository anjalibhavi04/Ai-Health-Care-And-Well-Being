import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AmbulanceButton from './AmbulanceButton';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center h-full">
        <div className="flex items-center gap-6">
          <Link to={user?.role === 'doctor' ? '/doctor-dashboard' : '/'} className="navbar-brand flex items-center gap-2">
            <Activity size={28} className="text-primary" />
            <span className="font-bold text-xl text-secondary">Svastha AI</span>
          </Link>
          {(!user || user.role !== 'doctor') && (
            <Link to="/chat" className="btn btn-primary" style={{ padding: '6px 14px', borderRadius: 'var(--radius)', fontSize: '0.85rem' }}>
              Get Started
            </Link>
          )}
        </div>

        <div className="navbar-links flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="nav-user flex items-center gap-2">
                <User size={18} className="text-primary" />
                <span className="text-sm font-medium">
                  {user.role === 'doctor' ? <span className="px-2 py-0.5 bg-primary-light text-primary rounded text-xs mr-1">MD</span> : null}
                  {user.name}
                </span>
              </div>
              <button className="btn-nav-logout" onClick={handleLogout} title="Sign out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-nav-login">
              <LogIn size={18} /> Sign in
            </Link>
          )}

          {(!user || user.role !== 'doctor') && <AmbulanceButton />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
