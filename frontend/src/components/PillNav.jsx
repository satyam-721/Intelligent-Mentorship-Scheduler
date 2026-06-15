import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Browse Mentors', path: '/browse-mentors' }
];

export const PillNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentItems = [...navItems];
  if (user) {
    currentItems.push({ name: 'Dashboard', path: user.role === 'MENTOR' ? '/mentor/dashboard' : '/dashboard' });
  }

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'py-sm' : 'py-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-margin-desktop flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-bold text-on-surface flex items-center gap-xs z-10 drop-shadow-md">
            <span className="material-symbols-outlined text-primary text-3xl">public</span>
            MentorSync
          </Link>

          {/* Desktop PillNav */}
          <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/30 rounded-full p-1 shadow-2xl">
            {currentItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative px-6 py-2.5 rounded-full text-label-md font-bold transition-colors z-10"
                >
                  {/* Hover Pill Background */}
                  {hoveredIndex === index && (
                    <motion.div
                      layoutId="hover-pill"
                      className="absolute inset-0 bg-surface-variant/50 rounded-full -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  {/* Active Indicator Underline */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute bottom-1.5 left-1/4 right-1/4 h-[3px] bg-primary rounded-full shadow-[0_0_8px_rgba(149,212,178,0.8)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  <span className={`relative z-10 ${isActive ? 'text-primary drop-shadow-[0_0_8px_rgba(149,212,178,0.5)]' : 'text-on-surface-variant hover:text-on-surface'}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-md z-10">
            {user ? (
              <div className="flex items-center gap-md bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/30 rounded-full p-1 pl-4">
                <span className="text-label-sm text-on-surface-variant font-bold">{user.username}</span>
                <Button variant="ghost" className="px-3 py-1.5 min-w-0 h-auto rounded-full text-error hover:bg-error/10 hover:text-error" onClick={logout}>
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </Button>
                <img src={`https://i.pravatar.cc/150?u=${user.username}`} alt="Profile" className="w-8 h-8 rounded-full border border-outline-variant/50" />
              </div>
            ) : (
              <div className="flex items-center gap-xs bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/30 rounded-full p-1">
                <Link to="/login" className="px-6 py-2 rounded-full text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors font-bold">
                  Log in
                </Link>
                <Button onClick={() => window.location.href = '/register'} className="px-6 py-2 h-auto rounded-full text-label-md border border-primary/50 shadow-[0_0_15px_rgba(46,107,79,0.3)]">
                  Sign up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-on-surface z-50 p-2 bg-surface-container-low/80 backdrop-blur-xl rounded-full border border-outline-variant/30"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-3xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl pt-3xl px-margin-desktop flex flex-col"
          >
            <div className="flex flex-col gap-lg mt-xl">
              {currentItems.map((item, index) => (
                <motion.div 
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={item.path} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-display text-4xl font-bold ${location.pathname === item.path ? 'text-primary' : 'text-on-surface'}`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-auto mb-2xl">
              {!user && (
                <div className="flex flex-col gap-md">
                  <Button onClick={() => { setMobileMenuOpen(false); window.location.href = '/login'; }} variant="outline" className="w-full py-4 text-headline-md">Log in</Button>
                  <Button onClick={() => { setMobileMenuOpen(false); window.location.href = '/register'; }} className="w-full py-4 text-headline-md">Sign up</Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
