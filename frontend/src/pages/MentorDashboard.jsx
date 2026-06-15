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

  const handleConfirm = async (bookingId) => {
    try {
      await mentorService.confirmBooking(bookingId);
      setPendingRequests(prev => prev.filter(r => r.id !== bookingId));
      // Optionally fetch upcoming sessions again
      const upcomingRes = await mentorService.getUpcomingSessions(user.id);
      setUpcomingSessions(upcomingRes.data);
    } catch (error) {
      console.error('Failed to confirm booking:', error);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await mentorService.rejectBooking(bookingId);
      setPendingRequests(prev => prev.filter(r => r.id !== bookingId));
    } catch (error) {
      console.error('Failed to reject booking:', error);
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <MagicBento className="p-xl relative overflow-hidden" tilt={false}>
                <div className="absolute -right-6 -top-6 text-primary/10">
                  <span className="material-symbols-outlined text-9xl">{stat.icon}</span>
                </div>
                <div className="relative z-10">
                  <p className="text-label-md font-bold text-on-surface-variant mb-md">{stat.label}</p>
                  <p className="font-display text-5xl font-bold mb-xs">{stat.value}</p>
                  <p className="text-label-sm text-primary font-bold tracking-wider uppercase">{stat.trend}</p>
                </div>
              </MagicBento>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2xl">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-2xl">
            {/* Upcoming Sessions */}
            <section>
              <div className="flex justify-between items-center mb-lg">
                <h2 className="font-headline-lg text-headline-lg font-bold">Upcoming Sessions</h2>
                <Button variant="ghost" iconRight="arrow_forward">View All</Button>
              </div>
              
              {loading ? (
                <div className="space-y-md">
                  {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
                </div>
              ) : upcomingSessions.length > 0 ? (
                <div className="space-y-md">
                  {upcomingSessions.map((session, i) => (
                    <MagicBento key={session.id || i} className="p-lg flex flex-col md:flex-row gap-lg items-start md:items-center justify-between" tilt={false} magnetism={false}>
                      <div className="flex items-center gap-md">
                        <img 
                          src={`https://i.pravatar.cc/150?u=${session.student?.username || 'unknown'}`} 
                          alt="Student" 
                          className="w-14 h-14 rounded-full object-cover border border-outline-variant/50"
                        />
                        <div>
                          <h3 className="font-bold text-title-lg">{session.student?.username || 'Student'}</h3>
                          <p className="text-on-surface-variant text-label-sm mt-1">{session.sessionAgenda || 'Mentorship Session'}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-xl items-center w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                          <p className="font-bold text-label-md">{new Date(session.startTime).toLocaleDateString()}</p>
                          <p className="text-on-surface-variant text-label-sm">{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div className="flex gap-sm">
                          <Button variant="outline" className="h-12 w-12 !p-0 flex items-center justify-center rounded-xl" title="Reschedule">
                            <span className="material-symbols-outlined">edit_calendar</span>
                          </Button>
                          <Button className="h-12 px-6 rounded-xl" iconRight="videocam">Join</Button>
                        </div>
                      </div>
                    </MagicBento>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon="event_busy" 
                  title="No upcoming sessions" 
                  description="You have no scheduled sessions for the next 7 days."
                />
              )}
            </section>

            {/* Analytics Area */}
            <section>
              <h2 className="font-headline-lg text-headline-lg font-bold mb-lg">Engagement</h2>
              <MagicBento className="p-xl h-[400px] w-full" tilt={false}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="var(--color-outline)" tick={{ fill: 'var(--color-on-surface-variant)' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="var(--color-outline)" tick={{ fill: 'var(--color-on-surface-variant)' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--color-surface-container)', borderRadius: '12px', border: '1px solid var(--color-outline-variant)' }}
                      itemStyle={{ color: 'var(--color-on-surface)' }}
                    />
                    <Area type="monotone" dataKey="hours" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                  </AreaChart>
                </ResponsiveContainer>
              </MagicBento>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-2xl">
            
            {/* Pending Requests */}
            <section>
              <div className="flex justify-between items-center mb-lg">
                <h2 className="font-headline-lg text-headline-lg font-bold">Requests</h2>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-label-sm font-bold">{pendingRequests.length}</span>
              </div>

              {loading ? (
                <div className="space-y-md">
                  {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
                </div>
              ) : pendingRequests.length > 0 ? (
                <div className="space-y-md">
                  {pendingRequests.map((req, i) => (
                    <MagicBento key={req.id || i} className="p-lg bg-surface-container-low" tilt={false}>
                      <div className="flex gap-md mb-md">
                        <img 
                          src={`https://i.pravatar.cc/150?u=${req.student?.username || 'unknown'}`} 
                          alt="Student" 
                          className="w-12 h-12 rounded-full object-cover border border-outline-variant/50"
                        />
                        <div>
                          <p className="font-bold text-label-md">{req.student?.username || 'Student'}</p>
                          <p className="text-on-surface-variant text-label-sm">{new Date(req.startTime).toLocaleDateString()} at {new Date(req.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <p className="text-body-sm text-on-surface-variant mb-md line-clamp-2">
                        {req.sessionAgenda || 'Requested a mentorship session.'}
                      </p>
                      <div className="grid grid-cols-2 gap-sm">
                        <Button variant="outline" className="w-full py-2 !text-label-sm hover:bg-error/10 hover:text-error hover:border-error/50" onClick={() => handleReject(req.id)}>Decline</Button>
                        <Button className="w-full py-2 !text-label-sm" onClick={() => handleConfirm(req.id)}>Accept</Button>
                      </div>
                    </MagicBento>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon="done_all" 
                  title="All caught up" 
                  description="You have no pending requests to review."
                />
              )}
            </section>
            
            {/* Profile Completion */}
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
          
        </div>
      </main>
    </div>
  );
};

export default MentorDashboard;
