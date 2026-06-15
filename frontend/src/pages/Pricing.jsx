import React from 'react';
import { PillNav } from '../components/PillNav';
import { motion } from 'framer-motion';
import { MagicBento } from '../components/MagicBento';

const Pricing = () => {
  return (
    <div className="bg-background min-h-screen text-on-background selection:bg-primary/30">
      <PillNav />
      <main className="max-w-7xl mx-auto px-margin-desktop pt-32 pb-24 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          className="font-display text-5xl font-bold mb-md"
        >
          Simple, Transparent Pricing
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-on-surface-variant text-body-lg mb-2xl"
        >
          Start for free, upgrade when you need to.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-4xl mx-auto">
          <MagicBento className="p-3xl text-center" tilt={false}>
            <span className="material-symbols-outlined text-5xl text-primary mb-md">payments</span>
            <h2 className="text-headline-md font-bold mb-sm">Pricing Plans Coming Soon</h2>
            <p className="text-on-surface-variant">We are currently in Public Beta. All premium features are free for early adopters!</p>
          </MagicBento>
        </motion.div>
      </main>
    </div>
  );
};

export default Pricing;
