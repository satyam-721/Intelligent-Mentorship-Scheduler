import React, { useState, useEffect } from 'react';
import { PillNav } from '../components/PillNav';
import { studentService } from '../services/api';
import { motion } from 'framer-motion';
import { Skeleton } from '../components/Skeleton';
import { Button } from '../components/Button';
import { MagicBento } from '../components/MagicBento';
import { BookingModal } from '../components/BookingModal';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const BrowseMentors = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await studentService.getMentorSlots();
        setSlots(response.data);
      } catch (error) {
        console.error('Error fetching slots:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, []);

  const filteredSlots = slots.filter(slot => {
    const mentor = slot.mentor || {};
    return (
      (mentor.username && mentor.username.toLowerCase().includes(search.toLowerCase())) || 
      (mentor.company && mentor.company.toLowerCase().includes(search.toLowerCase())) ||
      (mentor.jobTitle && mentor.jobTitle.toLowerCase().includes(search.toLowerCase())) ||
      (slot.notes && slot.notes.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="bg-background min-h-screen text-on-background selection:bg-primary/30">
      <PillNav />
      <BookingModal isOpen={!!selectedSlot} onClose={() => setSelectedSlot(null)} slot={selectedSlot} />
      
      <main className="max-w-7xl mx-auto px-margin-desktop pt-32 pb-24">
        
        {/* Header Section */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col md:flex-row justify-between items-end gap-lg mb-2xl">
          <motion.div variants={fadeUp} className="space-y-sm">
            <h1 className="font-display text-5xl font-bold">Discover Available Slots</h1>
            <p className="text-on-surface-variant text-body-lg">Find the perfect time to connect with industry experts.</p>
          </motion.div>
          
          <motion.div variants={fadeUp} className="relative w-full md:w-96 group">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Search by mentor, role, or company..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl pl-3xl pr-md py-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
            />
          </motion.div>
        </motion.div>

        {/* Tags / Quick Filters */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex gap-sm mb-2xl overflow-x-auto pb-xs scrollbar-hide">
          {['All Slots', 'This Week', 'One Time', 'Recurring', 'Frontend Mentors', 'Backend Mentors'].map((tag, i) => (
            <button key={i} className={`px-6 py-2 rounded-full text-label-md font-bold whitespace-nowrap transition-colors ${i === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container-low border border-outline-variant/30 hover:border-primary/50 text-on-surface'}`}>
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Slot Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <MagicBento key={i} className="p-xl" tilt={false}>
                <div className="flex gap-md mb-lg">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex flex-col gap-xs flex-1 justify-center">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full mb-lg" />
                <div className="flex gap-xs mb-lg">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
              </MagicBento>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg"
          >
            {filteredSlots.map(slot => (
              <motion.div key={slot.id} variants={fadeUp}>
                <MagicBento className="h-full flex flex-col justify-between p-xl" tilt={true} magnetism={false}>
                  <div>
                    <div className="flex justify-between items-start mb-md">
                      <div className="flex gap-md">
                        <img 
                          src={`https://i.pravatar.cc/150?u=${slot.mentor?.username || 'unknown'}`} 
                          alt={slot.mentor?.username || 'Mentor'} 
                          className="w-16 h-16 rounded-full object-cover border border-outline-variant/50"
                        />
                        <div>
                          <h3 className="font-headline-md font-bold leading-tight text-2xl">{slot.mentor?.username || 'Mentor'}</h3>
                          <p className="text-label-sm text-primary font-bold mt-1 tracking-wider uppercase">{slot.mentor?.jobTitle || 'Software Engineer'}</p>
                          <p className="text-label-sm text-outline mt-xs">{slot.mentor?.company || 'TechCorp'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-md mb-md">
                      <p className="text-label-sm font-bold text-on-surface mb-xs">
                        {slot.slotType === 'RECURRING' ? `Every ${slot.dayOfWeek}` : new Date(slot.slotDate || slot.startTime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-body-md text-on-surface-variant flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <p className="text-body-md text-on-surface-variant line-clamp-2 mb-xl">
                      {slot.notes || 'Available for mentoring sessions.'}
                    </p>
                    
                    <div className="flex flex-wrap gap-xs mb-xl">
                      <span className="px-3 py-1.5 bg-surface rounded-md text-label-sm font-bold border border-outline-variant/30 flex items-center gap-xs">
                        {slot.slotType === 'RECURRING' ? '🔁 Recurring' : '📅 One-Time'}
                      </span>
                      <span className="px-3 py-1.5 bg-surface rounded-md text-label-sm font-bold border border-outline-variant/30 flex items-center gap-xs">
                        ⏱️ {slot.sessionDurationMinutes} mins
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-md border-t border-outline-variant/30 pt-lg mt-auto">
                    <Button variant="outline" className="w-full py-3">View Profile</Button>
                    {slot.is_active ? (
                      <Button className="w-full py-3" iconRight="calendar_month" onClick={() => setSelectedSlot(slot)}>Book</Button>
                    ) : (
                      <Button 
                        className="w-full py-3" 
                        iconRight="videocam" 
                        disabled={Date.now() < new Date(slot.startTime).getTime() - (5 * 60 * 1000)}
                        onClick={() => alert('Joining session...')}
                        variant={Date.now() < new Date(slot.startTime).getTime() - (5 * 60 * 1000) ? 'ghost' : 'primary'}
                      >
                        Join
                      </Button>
                    )}
                  </div>
                </MagicBento>
              </motion.div>
            ))}
            
            {filteredSlots.length === 0 && (
              <motion.div variants={fadeUp} className="col-span-full py-3xl">
                <MagicBento className="text-center p-3xl max-w-2xl mx-auto" tilt={false}>
                  <div className="w-24 h-24 bg-surface-variant rounded-full flex items-center justify-center mx-auto mb-lg">
                    <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
                  </div>
                  <h3 className="text-headline-lg font-bold mb-xs">No slots found</h3>
                  <p className="text-body-lg text-on-surface-variant">Try adjusting your search criteria or check back later.</p>
                </MagicBento>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default BrowseMentors;
