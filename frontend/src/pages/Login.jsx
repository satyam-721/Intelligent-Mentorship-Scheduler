import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { MagicBento } from '../components/MagicBento';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const success = await login({ username, password });
      if (!success) {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden selection:bg-primary/30">
      
      {/* Left Side - Visual / Marketing */}
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-1 relative bg-surface-container-lowest border-r border-outline-variant/30 flex-col justify-between p-3xl overflow-hidden"
      >
        {/* Abstract Glow */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="font-display text-3xl font-bold text-on-surface flex items-center gap-xs drop-shadow-md">
            <span className="material-symbols-outlined text-primary text-4xl">public</span>
            MentorSync
          </Link>
          <div className="mt-3xl space-y-lg max-w-md">
            <h1 className="font-display text-6xl leading-[1.1]">
              Unlock Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Career Potential</span>
            </h1>
            <p className="text-on-surface-variant text-body-lg">
              Sign in to manage your mentorship sessions, sync your Google Calendar, and grow your career seamlessly.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <MagicBento className="max-w-sm p-lg bg-surface/80 backdrop-blur-md">
              <div className="flex items-center gap-md">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">insights</span>
                </div>
                <div>
                  <p className="font-bold text-label-md">150k+ Sessions</p>
                  <p className="text-label-sm text-outline">Scheduled across 120 countries</p>
                </div>
              </div>
            </MagicBento>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-md relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="mb-2xl text-center md:text-left">
            <Link to="/" className="font-display text-3xl font-bold text-on-surface md:hidden mb-lg flex items-center justify-center gap-xs">
              <span className="material-symbols-outlined text-primary">public</span>
              MentorSync
            </Link>
            <h2 className="font-headline-lg text-headline-lg font-bold mb-xs">Welcome back</h2>
            <p className="text-on-surface-variant text-body-md">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-lg">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-error-container/20 border border-error/50 text-error p-md rounded-xl text-label-sm flex items-center gap-sm">
                <span className="material-symbols-outlined">error</span>
                {error}
              </motion.div>
            )}

            <div className="space-y-md">
              <div className="flex flex-col gap-xs group">
                <label className="text-label-sm font-bold text-on-surface-variant group-focus-within:text-primary transition-colors tracking-wider">USERNAME</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">person</span>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl pl-3xl pr-md py-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md shadow-inner"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-xs group">
                <label className="text-label-sm font-bold text-on-surface-variant group-focus-within:text-primary transition-colors tracking-wider">PASSWORD</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">lock</span>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl pl-3xl pr-md py-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md shadow-inner"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full py-4 text-headline-md" isLoading={isLoading} iconRight="arrow_forward">
              Sign In
            </Button>
          </form>

          <p className="mt-xl text-center text-on-surface-variant text-label-sm">
            Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline transition-all">Create an account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
