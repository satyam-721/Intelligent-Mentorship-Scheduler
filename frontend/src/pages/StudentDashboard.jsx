import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/api';
import { PillNav } from '../components/PillNav';
import { motion } from 'framer-motion';
import { MagicBento } from '../components/MagicBento';
import { Button } from '../components/Button';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { useNavigate } from 'react-router-dom';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await studentService.getUpcomingSessions(user.id);
        setUpcomingSessions(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchDashboardData();
  }, [user]);

  const handleCancel = async (bookingId) => {
    try {
      await studentService.cancelBooking(bookingId);
      setUpcomingSessions(prev => prev.filter(s => s.id !== bookingId));
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const stats = [
    { label: "Completed Sessions", value: "12", icon: "task_alt", trend: "+2 this month" },
    { label: "Mentors Connected", value: "4", icon: "groups", trend: "Top 10% active" },
    { label: "Upcoming Meetings", value: upcomingSessions.length.toString(), icon: "calendar_month", trend: "Next in 2 days" }
  ];

  return (
    <div className="bg-background min-h-screen text-on-background selection:bg-primary/30">
      <PillNav />
      
      <main className="max-w-7xl mx-auto px-margin-desktop pt-32 pb-24 space-y-2xl">
        
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-lg"
        >
          <div>
            <h1 className="font-display text-5xl mb-xs">Welcome back, <span className="text-primary">{user?.username}</span></h1>
            <p className="text-on-surface-variant text-body-lg">Ready to level up your career today?</p>
          </div>
          <Button onClick={() => navigate('/browse-mentors')} iconRight="search" className="py-3 px-6 shadow-[0_0_15px_rgba(46,107,79,0.3)]">
            Find a New Mentor
          </Button>
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

        {/* Dashboard Sections */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-2xl">
          
          {/* Main Content: Upcoming Sessions */}
          <div className="lg:col-span-2 space-y-lg">
            <div className="flex justify-between items-center">
              <h2 className="font-headline-md font-bold">Upcoming Sessions</h2>
              <Button variant="ghost" className="text-primary" iconRight="open_in_new">View Calendar</Button>
            </div>
            
            {loading ? (
              <div className="space-y-md">
                {[1, 2].map(i => (
                  <MagicBento key={i} className="h-32 w-full flex items-center p-md gap-lg">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </MagicBento>
                ))}
              </div>
            ) : upcomingSessions.length > 0 ? (
              <div className="space-y-md">
                {upcomingSessions.map((session, i) => (
                  <motion.div key={session.id || i} variants={fadeUp}>
                    <MagicBento className="p-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-lg hover:border-primary/50 transition-colors">
                      <div className="flex gap-md items-center">
                        <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex flex-col items-center justify-center border border-primary/20">
                          <span className="text-label-sm font-bold uppercase tracking-widest">{new Date(session.startTime).toLocaleString('default', { month: 'short' })}</span>
                          <span className="font-display text-2xl leading-none font-bold">{new Date(session.startTime).getDate()}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-headline-md leading-tight">Mentorship Session</h3>
                          <p className="text-on-surface-variant text-label-sm mt-1">with <span className="font-bold text-on-surface">{session.mentor?.username || 'Mentor'}</span></p>
                          <div className="flex items-center gap-xs mt-sm text-label-sm text-outline font-bold">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-sm w-full md:w-auto">
                        <Button variant="outline" onClick={() => handleCancel(session.id)} className="flex-1 md:flex-none py-3 text-error hover:bg-error/10 hover:border-error/50">Cancel</Button>
                        <Button iconRight="videocam" className="flex-1 md:flex-none py-3">Join Meet</Button>
                      </div>
                    </MagicBento>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div variants={fadeUp}>
                <MagicBento className="p-3xl text-center" tilt={false}>
                  <EmptyState 
                    icon="event_busy"
                    title="No upcoming sessions" 
                    description="Your calendar is clear. Find a mentor and schedule your first session to level up."
                    actionLabel="Find a Mentor"
                    onAction={() => navigate('/browse-mentors')}
                  />
                </MagicBento>
              </motion.div>
            )}
          </div>

          {/* Sidebar: Recommended Mentors or Activity */}
          <div className="space-y-lg">
            <h2 className="font-headline-md font-bold">Recommended Mentors</h2>
            <motion.div variants={fadeUp}>
              <MagicBento className="p-lg flex flex-col gap-md" tilt={false}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-md items-center group cursor-pointer p-sm rounded-xl hover:bg-surface-variant/50 transition-colors">
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="Mentor" className="w-12 h-12 rounded-full border border-outline-variant group-hover:border-primary transition-colors" />
                    <div className="flex-1">
                      <p className="font-bold text-label-md group-hover:text-primary transition-colors">Sarah Chen</p>
                      <p className="text-label-sm text-outline">Staff Engineer @ Stripe</p>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">arrow_forward_ios</span>
                  </div>
                ))}
                <div className="border-t border-outline-variant/30 mt-sm pt-md">
                  <Button variant="ghost" className="w-full text-label-sm uppercase tracking-wider" onClick={() => navigate('/browse-mentors')}>View All</Button>
                </div>
              </MagicBento>
            </motion.div>

            <motion.div variants={fadeUp} className="pt-md">
              <MagicBento className="p-xl bg-gradient-to-br from-surface-container-high to-primary/5 border-primary/20" tilt={false}>
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <h3 className="font-bold text-label-md mb-xs">Pro Tip</h3>
                <p className="text-label-sm text-on-surface-variant">
                  Sync your Google Calendar so Mentors know exactly when you are free without sending messages back and forth.
                </p>
                <Button variant="outline" className="w-full mt-md py-2 border-primary/30 hover:border-primary/50 text-label-sm">Connect Calendar</Button>
              </MagicBento>
            </motion.div>
          </div>

        </motion.div>
      </main>
    </div>
  );
};

export default StudentDashboard;
