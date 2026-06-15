import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';

export const EmptyState = ({ icon = "calendar_month", title = "No data found", description = "There is nothing to display here right now.", actionLabel, onAction }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-3xl text-center border border-dashed border-outline-variant/50 rounded-2xl bg-surface-container-low/30"
    >
      <div className="w-16 h-16 rounded-2xl bg-surface-variant flex items-center justify-center mb-lg shadow-inner">
        <span className="material-symbols-outlined text-4xl text-outline">{icon}</span>
      </div>
      <h3 className="font-headline-md text-headline-md font-bold mb-xs">{title}</h3>
      <p className="text-on-surface-variant max-w-md mb-lg">{description}</p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" icon="add">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};
