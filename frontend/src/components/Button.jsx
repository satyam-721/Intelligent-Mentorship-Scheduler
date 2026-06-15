import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const Button = ({ children, className, variant = 'primary', icon, iconRight, isLoading, ...props }) => {
  const baseStyles = "relative inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-colors overflow-hidden";
  
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-primary-fixed active:bg-primary-fixed-dim",
    secondary: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest active:bg-surface-variant",
    outline: "border border-outline-variant text-on-surface hover:bg-surface-container-low active:bg-surface-container",
    ghost: "text-on-surface hover:bg-surface-container-low active:bg-surface-container"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], "px-lg py-md text-body-md", className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
        />
      ) : icon ? (
        <span className="material-symbols-outlined text-[1.2em] -ml-1">{icon}</span>
      ) : null}
      
      <span>{children}</span>

      {iconRight && !isLoading && (
        <span className="material-symbols-outlined text-[1.2em] -mr-1">{iconRight}</span>
      )}
      
      {/* Ripple/Glow Effect Layer */}
      <div className="absolute inset-0 opacity-0 hover:opacity-10 pointer-events-none bg-white transition-opacity duration-300" />
    </motion.button>
  );
};
