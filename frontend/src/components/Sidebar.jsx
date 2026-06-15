import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role = 'Student', user = { name: 'Alex Rivers', title: 'Senior Student', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxIzv5VZLlaVmAKHyZhEicZa7rD07bWHQLj2L5LsCTqJZW2brRmCkwRtsy9YFoPfDIRGx-9xZL8H68HzwkOozv7dZgD4drXqiV8O21AWYDnk9I5msR5vX_euhz2O0J8qwoK-jFbsy3IY-VxMuIoAilMVajNnu0Srvuk9fACtfSNn9iVLzoOyaAlzlxqDR5TywSDME4GoXNJxmnmy6R1mrNBd724K_7RKRFaqYyKttkChoLQmtXyXo8vNt2f-M3BNJWSW1eQoEparY' } }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Calendar', icon: 'calendar_today', path: '/calendar' },
    { name: 'Bookings', icon: 'event_note', path: '/bookings' },
    { name: 'Analytics', icon: 'analytics', path: '/analytics' },
    { name: 'Settings', icon: 'settings', path: '/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-surface border-r border-outline-variant fixed left-0 top-0 flex flex-col pt-xl">
      <div className="px-lg mb-2xl">
        <span className="font-headline-md text-headline-md font-bold text-primary">MentorSync</span>
      </div>

      <div className="px-lg flex items-center gap-md mb-2xl">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant">
          <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-bold text-on-surface text-label-md">{user.name}</p>
          <p className="text-on-surface-variant text-label-sm">{user.title}</p>
        </div>
      </div>

      <nav className="flex-1 px-md flex flex-col gap-sm">
        {navItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-md px-md py-sm rounded-lg transition-colors font-label-md ${
                isActive
                  ? 'bg-primary-container/20 text-primary border-l-4 border-primary'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-lg pb-xl flex flex-col gap-md">
        <button className="w-full border border-outline-variant text-on-surface py-sm rounded-lg hover:bg-surface-container transition-colors font-label-md">
          Switch to {role === 'Student' ? 'Mentor' : 'Student'}
        </button>
        <div className="flex flex-col gap-sm mt-md">
          <button className="flex items-center gap-md text-on-surface-variant hover:text-primary transition-colors font-label-md">
            <span className="material-symbols-outlined">help</span> Help
          </button>
          <button className="flex items-center gap-md text-on-surface-variant hover:text-error transition-colors font-label-md">
            <span className="material-symbols-outlined">logout</span> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
