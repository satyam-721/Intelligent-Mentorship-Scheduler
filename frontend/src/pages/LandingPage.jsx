import React from 'react';
import { PillNav } from '../components/PillNav';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { MagicBento } from '../components/MagicBento';
import { useNavigate } from 'react-router-dom';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen text-on-background overflow-hidden selection:bg-primary/30">
      <PillNav />

      {/* Hero Section */}
      <main className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-margin-desktop overflow-hidden">
        
        {/* Animated Background Effects */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-[10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] left-[5%] w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[100px]"
          />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-2xl relative z-10 items-center">
          
          {/* Left Column: Typography & CTA */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-xl"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-label-md font-bold shadow-[0_0_15px_rgba(46,107,79,0.3)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              ReactBits Premium Integration Active
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Schedule Mentorship Without <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Timezone Chaos</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-body-lg text-on-surface-variant max-w-xl">
              MentorSync handles the heavy lifting of scheduling across borders. Intelligent calendars, automatic timezone offsets, and instant meeting generation for elite developer pairs.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-md pt-sm">
              <Button onClick={() => navigate('/browse-mentors')} iconRight="arrow_forward" className="px-8 py-4">
                Find a Mentor
              </Button>
              <Button onClick={() => navigate('/register')} variant="outline" className="px-8 py-4 bg-surface/50 backdrop-blur-md">
                Become a Mentor
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-md pt-lg">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <img key={i} className="w-12 h-12 rounded-full border-2 border-background object-cover shadow-lg" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt={`Mentor ${i}`}/>
                ))}
              </div>
              <span className="text-label-md text-outline tracking-wide">Joined by 2,500+ Top Developers</span>
            </motion.div>
          </motion.div>

          {/* Right Column: Floating Cards Display */}
          <div className="relative h-[500px] hidden lg:block">
            {/* Main Booking Card */}
            <motion.div 
              initial={{ opacity: 0, y: 50, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1, delay: 0.3, type: "spring" }}
              className="absolute top-1/4 right-[10%] w-[340px] z-20"
            >
              <MagicBento className="p-lg bg-surface-container/90 backdrop-blur-xl">
                <div className="flex gap-md items-center mb-md border-b border-outline-variant/30 pb-md">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">videocam</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-label-md">System Design Mock</h3>
                    <p className="text-label-sm text-outline">with Alex Rivers</p>
                  </div>
                </div>
                <div className="flex items-center gap-sm text-label-sm text-primary">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Auto-synced to Google Calendar
                </div>
              </MagicBento>
            </motion.div>

            {/* Timezone Card */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5, type: "spring" }}
              className="absolute top-[10%] right-[40%] w-[220px] z-10"
            >
              <MagicBento className="p-md bg-surface-container/90 backdrop-blur-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-label-sm text-outline mb-1">San Francisco, CA</p>
                    <p className="font-display font-bold text-headline-md">10:00 AM</p>
                  </div>
                  <span className="material-symbols-outlined text-primary">light_mode</span>
                </div>
              </MagicBento>
            </motion.div>

            {/* Stat Card */}
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, type: "spring" }}
              className="absolute bottom-[20%] right-[30%] w-[260px] z-30"
            >
              <MagicBento className="p-md bg-surface-container/90 backdrop-blur-xl flex items-center gap-md">
                <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <div>
                  <p className="text-label-sm text-outline">Matching mentor...</p>
                  <p className="font-bold text-label-md text-primary">98% Match Found</p>
                </div>
              </MagicBento>
            </motion.div>
          </div>
        </div>
      </main>

      {/* MagicBento Features Showcase */}
      <section className="py-3xl px-margin-desktop bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-2xl space-y-md">
            <h2 className="font-display text-4xl font-bold">Intelligent Platform Features</h2>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Powered by advanced scheduling algorithms and seamless integrations to make global mentorship effortless.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-lg auto-rows-[240px]">
            
            {/* Large Card 1 */}
            <MagicBento className="md:col-span-2 md:row-span-2 p-2xl flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-lg">
                  <span className="material-symbols-outlined text-3xl">public</span>
                </div>
                <h3 className="font-display text-3xl font-bold mb-sm">Timezone Intelligence</h3>
                <p className="text-body-md text-on-surface-variant max-w-sm">
                  Never manually calculate a time difference again. Our engine automatically translates mentor availability into your local time, ensuring you never miss a session.
                </p>
              </div>
              <div className="mt-lg">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="World Map" className="rounded-xl w-full h-48 object-cover opacity-60 grayscale mix-blend-screen" />
              </div>
            </MagicBento>

            {/* Normal Card 1 */}
            <MagicBento className="p-xl flex flex-col justify-center">
              <span className="material-symbols-outlined text-4xl text-primary mb-md">calendar_sync</span>
              <h3 className="font-bold text-headline-md mb-xs">Calendar Sync</h3>
              <p className="text-label-sm text-on-surface-variant">Two-way Google Calendar synchronization prevents double-booking.</p>
            </MagicBento>

            {/* Normal Card 2 */}
            <MagicBento className="p-xl flex flex-col justify-center">
              <span className="material-symbols-outlined text-4xl text-primary mb-md">video_camera_front</span>
              <h3 className="font-bold text-headline-md mb-xs">Meeting Auto-Gen</h3>
              <p className="text-label-sm text-on-surface-variant">Google Meet links are automatically attached to every accepted request.</p>
            </MagicBento>

            {/* Normal Card 3 */}
            <MagicBento className="md:col-span-2 p-xl flex flex-row items-center justify-between">
              <div>
                <span className="material-symbols-outlined text-4xl text-primary mb-md">insights</span>
                <h3 className="font-bold text-headline-md mb-xs">Mentorship Analytics</h3>
                <p className="text-label-sm text-on-surface-variant max-w-xs">Track your hours, session ratings, and career growth over time.</p>
              </div>
              <div className="w-32 h-32 bg-primary/10 rounded-full blur-[30px]" />
            </MagicBento>

            {/* Normal Card 4 */}
            <MagicBento className="p-xl flex flex-col justify-center">
              <span className="material-symbols-outlined text-4xl text-primary mb-md">notifications_active</span>
              <h3 className="font-bold text-headline-md mb-xs">Smart Alerts</h3>
              <p className="text-label-sm text-on-surface-variant">Automated email reminders 24 hours and 15 minutes before sessions.</p>
            </MagicBento>

            {/* Normal Card 5 */}
            <MagicBento className="p-xl flex flex-col justify-center">
              <span className="material-symbols-outlined text-4xl text-primary mb-md">verified_user</span>
              <h3 className="font-bold text-headline-md mb-xs">Verified Mentors</h3>
              <p className="text-label-sm text-on-surface-variant">Connect with engineers from top tech companies.</p>
            </MagicBento>

          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
