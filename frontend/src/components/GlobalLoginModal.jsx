import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { authService } from '../services/api';

export const GlobalLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await authService.login({ username, password });
      const token = typeof response.data === 'string' ? response.data : response.data?.token;
      
      if (token && token !== "Failed") {
        localStorage.setItem('token', token);
        const mockedUser = { username, role: username.includes('mentor') ? 'MENTOR' : 'STUDENT' };
        localStorage.setItem('user', JSON.stringify(mockedUser));
        onLoginSuccess(mockedUser);
        onClose();
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-background/90 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          className="bg-surface-container-low border border-outline-variant/50 p-xl rounded-3xl shadow-2xl max-w-sm w-full relative"
        >
          <button onClick={onClose} className="absolute top-md right-md text-outline hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
          
          <div className="text-center mb-xl">
            <span className="material-symbols-outlined text-primary text-5xl mb-sm">lock_reset</span>
            <h2 className="font-display text-2xl font-bold mb-xs">Session Expired</h2>
            <p className="text-on-surface-variant text-label-sm">Please log in again to continue.</p>
          </div>
          
          {error && <div className="bg-error/20 text-error p-sm rounded-md mb-md text-label-sm text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-md">
            <div className="flex flex-col gap-xs group">
              <label className="text-label-sm font-bold text-on-surface-variant group-focus-within:text-primary transition-colors">USERNAME</label>
              <input 
                type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-lg py-3 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-xs group">
              <label className="text-label-sm font-bold text-on-surface-variant group-focus-within:text-primary transition-colors">PASSWORD</label>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-lg py-3 focus:border-primary focus:outline-none"
              />
            </div>

            <Button type="submit" className="w-full py-4 mt-sm" isLoading={isLoading}>Log In</Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
