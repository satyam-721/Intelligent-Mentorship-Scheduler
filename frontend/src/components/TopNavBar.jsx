import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

const TopNavBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-surface/70 backdrop-blur-2xl border-b border-outline-variant/30 py-sm shadow-xl' : 'bg-transparent py-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-margin-desktop flex justify-between items-center">
        <div className="flex items-center gap-2xl">
          <Link to="/" className="font-display text-2xl font-bold text-on-surface flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary text-3xl">public</span>
            MentorSync
          </Link>
          
          <div className="hidden md:flex gap-lg items-center">
            {['/browse-mentors'].map(path => (
              <Link key={path} to={path} className="relative text-label-sm font-bold uppercase tracking-wider group px-md py-sm rounded-full hover:bg-surface-container-low transition-colors">
                <span className={location.pathname === path ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface transition-colors'}>
                  {path.replace('/', '').replace('-', ' ')}
                </span>
                {location.pathname === path && (
                  <motion.div layoutId="nav-pill" className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-md">
          <AnimatePresence mode="wait">
            {user ? (
              <motion.div key="user" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-md">
                <Link to={user.role === 'MENTOR' ? '/mentor-dashboard' : '/student-dashboard'} className="font-bold text-label-sm hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <div className="w-px h-6 bg-outline-variant/50" />
                <Button variant="ghost" className="px-sm text-error hover:text-error hover:bg-error/10" onClick={logout}>
                  <span className="material-symbols-outlined">logout</span>
                </Button>
                <img src={`https://i.pravatar.cc/150?u=${user.username}`} alt="Profile" className="w-10 h-10 rounded-full border border-outline-variant" />
              </motion.div>
            ) : (
              <motion.div key="guest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-md">
                <Link to="/login" className="px-md py-sm text-on-surface-variant hover:text-on-surface transition-colors font-label-sm font-bold uppercase tracking-wider">
                  Log in
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="py-2 px-6">Sign up</Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default TopNavBar;
