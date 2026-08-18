import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './ProtectedRoute';
import { Heart, Menu, X, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <span>K</span>
          <Heart size={18} fill="currentColor" className="fade-in" />
          <span>S</span>
        </NavLink>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/story" 
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Our Story
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/rsvp" 
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              RSVP
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/faqs" 
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              FAQs
            </NavLink>
          </li>
          <li>
            <button 
              className="btn btn-secondary" 
              onClick={handleLogout}
              style={{ padding: '0.5rem 1.2rem', fontSize: '0.8rem', display: 'flex', gap: '0.4rem' }}
            >
              <LogOut size={14} />
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
