import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mentorService } from '../services/api';
import { PillNav } from '../components/PillNav';
import { motion } from 'framer-motion';
import { MagicBento } from '../components/MagicBento';
import { Button } from '../components/Button';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SlotCreationModal } from '../components/SlotCreationModal';

const analyticsData = [
  { name: 'Mon', hours: 2 },
  { name: 'Tue', hours: 4 },
  { name: 'Wed', hours: 3 },
  { name: 'Thu', hours: 6 },
  { name: 'Fri', hours: 5 },
  { name: 'Sat', hours: 8 },
  { name: 'Sun', hours: 4 },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const MentorDashboard = () => {
  const { user } = useAuth();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [upcomingRes, pendingRes] = await Promise.all([
          mentorService.getUpcomingSessions(user.id),
          mentorService.getPendingRequests(user.id)
        ]);
        setUpcomingSessions(upcomingRes.data);
        setPendingRequests(pendingRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchDashboardData();
  }, [user]);

  const stats = [
    { label: "Pending Requests", value: pendingRequests.length.toString(), icon: "inbox", trend: "Needs attention" },
    { label: "Total Hours", value: "32h", icon: "timer", trend: "+12% vs last month" },
    { label: "Average Rating", value: "5.0", icon: "star", trend: "Top Mentor" }
  ];

  return (
    <div className="bg-background min-h-screen text-on-background selection:bg-primary/30">
      <PillNav />
      <SlotCreationModal isOpen={isSlotModalOpen} onClose={() => setIsSlotModalOpen(false)} />
      
      <main className="max-w-7xl mx-auto px-margin-desktop pt-32 pb-24 space-y-2xl">
        
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-lg"
        >
          <div>
            <h1 className="font-display text-5xl mb-xs">Mentor Dashboard</h1>
            <p className="text-on-surface-variant text-body-lg">Manage your schedule, requests, and analytics.</p>
          </div>
          <div className="flex gap-md">
            <Button variant="outline" iconRight="sync" className="bg-surface/50 backdrop-blur-md">Sync Calendar</Button>
            <Button iconRight="edit_calendar" onClick={() => setIsSlotModalOpen(true)}>Manage Availability</Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-lg"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeUp}>
              <MagicBento className="p-xl" tilt={false}>
                <div className="flex justify-between items-start mb-md">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-surface-variant text-on-surface">
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <span className="text-label-sm font-bold px-2 py-1 rounded-md bg-primary/10 text-primary">{stat.trend}</span>
                </div>
                <h3 className="text-display font-bold mb-xs text-4xl">{stat.value}</h3>
                <p className="text-on-surface-variant text-label-sm uppercase tracking-wider">{stat.label}</p>
              </MagicBento>
            </motion.div>
          ))}
        </motion.div>

        {/* Bento Layout Content */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-2xl">
          
          {/* Main Area: Analytics & Requests */}
          <div className="lg:col-span-2 space-y-2xl">
            
            {/* Analytics Chart */}
            <motion.div variants={fadeUp} className="space-y-lg">
              <h2 className="font-headline-md font-bold">Mentorship Analytics</h2>
              <MagicBento className="h-96 w-full p-md pt-xl flex flex-col justify-end" tilt={false}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgba(46, 107, 79, 0.4)" stopOpacity={1}/>
                        <stop offset="95%" stopColor="rgba(46, 107, 79, 0.0)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A0A0A0', fontSize: 12, fontFamily: 'Sora' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A0A0A0', fontSize: 12, fontFamily: 'Sora' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#161A1D', border: '1px solid #2B3137', borderRadius: '12px', fontFamily: 'Space Grotesk' }}
                      itemStyle={{ color: '#2E6B4F', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="hours" stroke="#2E6B4F" strokeWidth={4} fillOpacity={1} fill="url(#colorHours)" />
                  </AreaChart>
                </ResponsiveContainer>
              </MagicBento>
            </motion.div>

            {/* Pending Requests */}
            <motion.div variants={fadeUp} className="space-y-lg">
              <div className="flex justify-between items-center">
                <h2 className="font-headline-md font-bold">Pending Requests</h2>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-label-sm font-bold">{pendingRequests.length}</span>
              </div>
              
              {loading ? (
                <MagicBento className="h-32 w-full flex items-center justify-center p-md">
                  <div className="w-full flex items-center gap-md">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                </MagicBento>
              ) : pendingRequests.length > 0 ? (
                <div className="space-y-md">
                  {pendingRequests.map((req, i) => (
                    <MagicBento key={req.id} className="p-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-md" tilt={false}>
                      <div className="flex gap-md items-center">
                        <img src={`https://i.pravatar.cc/100?u=${req.studentName || 'student'}`} alt="Student" className="w-12 h-12 rounded-full border border-outline-variant" />
                        <div>
                          <h3 className="font-bold text-label-md">Request from {req.studentName || 'Student'}</h3>
                          <p className="text-on-surface-variant text-label-sm">{new Date(req.startTime).toLocaleString([], { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <div className="flex gap-sm w-full md:w-auto mt-4 md:mt-0">
                        <Button variant="ghost" className="text-error hover:bg-error/10 flex-1 md:flex-none">Decline</Button>
                        <Button className="flex-1 md:flex-none" iconRight="check">Accept</Button>
                      </div>
                    </MagicBento>
                  ))}
                </div>
              ) : (
                <MagicBento className="p-3xl text-center" tilt={false}>
                  <EmptyState 
                    icon="inbox"
                    title="No pending requests" 
                    description="You're all caught up! Keep your availability updated to attract more students."
                  />
                </MagicBento>
              )}
            </motion.div>

          </div>

          {/* Sidebar Area: Upcoming Sessions */}
          <div className="space-y-lg">
            <h2 className="font-headline-md font-bold">Upcoming Today</h2>
            {loading ? (
              <MagicBento className="h-48 w-full p-md flex flex-col gap-sm justify-center">
                 <Skeleton className="h-4 w-2/3" />
                 <Skeleton className="h-3 w-1/2" />
                 <Skeleton className="h-10 w-full mt-auto" />
              </MagicBento>
            ) : upcomingSessions.length > 0 ? (
              <div className="space-y-md">
                {upcomingSessions.map((session, i) => (
                  <motion.div key={session.id} variants={fadeUp}>
                    <MagicBento className="p-xl border-l-4 border-l-primary" tilt={false}>
                      <div className="flex justify-between items-start mb-md">
                        <div>
                          <p className="font-bold text-label-md mb-xs">Session with {session.studentName || 'Student'}</p>
                          <p className="text-on-surface-variant text-label-sm">
                            {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-primary">video_camera_front</span>
                      </div>
                      <Button iconRight="arrow_outward" className="w-full">Join Meeting</Button>
                    </MagicBento>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div variants={fadeUp}>
                <MagicBento className="text-center p-3xl" tilt={false}>
                  <span className="material-symbols-outlined text-5xl text-primary/50 mb-md block">celebration</span>
                  <p className="text-label-md font-bold mb-xs">Clear Schedule</p>
                  <p className="text-label-sm text-on-surface-variant">Enjoy your day off!</p>
                </MagicBento>
              </motion.div>
            )}

            <motion.div variants={fadeUp} className="pt-xl">
              <h2 className="font-headline-md font-bold mb-lg">Profile Completion</h2>
              <MagicBento className="p-xl" tilt={false}>
                <div className="flex justify-between text-label-sm font-bold mb-sm">
                  <span>Completion</span>
                  <span className="text-primary">85%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 mb-md">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1, delay: 0.5 }}
                    className="bg-primary h-2 rounded-full"
                  />
                </div>
                <p className="text-label-sm text-on-surface-variant">Connect your LinkedIn to reach 100%.</p>
                <Button variant="outline" className="w-full mt-md text-label-sm py-2">Connect LinkedIn</Button>
              </MagicBento>
            </motion.div>
          </div>

        </motion.div>
      </main>
    </div>
  );
};

export default MentorDashboard;
