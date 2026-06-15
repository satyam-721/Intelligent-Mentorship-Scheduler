import React from 'react';

const DashboardTopNav = ({ title = 'Dashboard' }) => {
  return (
    <div className="h-20 border-b border-outline-variant bg-surface flex items-center justify-between px-lg sticky top-0 z-40">
      <div className="flex items-center gap-md">
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="font-headline-md text-headline-md text-primary font-bold">{title}</h2>
      </div>
      <div className="flex items-center gap-lg">
        <button className="relative text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        <button className="w-10 h-10 rounded-full border border-outline-variant overflow-hidden">
          <span className="material-symbols-outlined mt-1 text-on-surface-variant">person</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardTopNav;
