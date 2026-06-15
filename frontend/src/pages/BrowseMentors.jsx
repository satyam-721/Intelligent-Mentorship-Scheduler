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

  const now = new Date();
  const bookedSlots = slots.filter((slot) => !slot.is_active);
  const canJoin = (slot) => {
    const startTime = new Date(slot.startTime).getTime();
    const endTime = new Date(slot.endTime).getTime();
    const currentTime = now.getTime();
    return currentTime >= startTime && currentTime < endTime;
  };

  return (
    <div className="bg-background min-h-screen text-on-background selection:bg-primary/30">
      <PillNav />
      <BookingModal isOpen={!!selectedSlot} onClose={() => setSelectedSlot(null)} slot={selectedSlot} />
      
      <main className="max-w-7xl mx-auto px-margin-desktop pt-32 pb-24">
        
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-2xl mb-2xl">
          <motion.div variants={fadeUp} className="space-y-sm">
            <h1 className="font-display text-5xl font-bold">Browse Mentors</h1>
            <p className="text-on-surface-variant text-body-lg">Review all available mentoring slots and your booked sessions.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <MagicBento className="p-xl" tilt={false}>
              <p className="text-label-sm uppercase tracking-wider text-primary font-bold">All Slots</p>
              <h2 className="font-headline-md font-bold text-2xl mt-xs">Available mentoring sessions</h2>
              <p className="text-on-surface-variant text-body-md mt-sm">Book open slots directly. Inactive/booked sessions appear in the booked section.</p>
            </MagicBento>
            <MagicBento className="p-xl" tilt={false}>
              <p className="text-label-sm uppercase tracking-wider text-primary font-bold">Booked Slots</p>
              <h2 className="font-headline-md font-bold text-2xl mt-xs">Your reserved sessions</h2>
              <p className="text-on-surface-variant text-body-md mt-sm">Booked sessions appear here and can be joined once the session start time is reached.</p>
            </MagicBento>
          </motion.div>
        </motion.div>

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
          <div className="space-y-2xl">
            <section className="space-y-lg">
              <div className="flex items-center justify-between gap-md flex-wrap">
                <h2 className="font-headline-md font-bold text-2xl">All Slots</h2>
                <span className="text-label-sm text-on-surface-variant">{slots.length} total</span>
              </div>
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                {slots.map((slot) => (
                  <motion.div key={slot.id} variants={fadeUp}>
                    <MagicBento className="h-full flex flex-col justify-between p-xl" tilt={true} magnetism={false}>
                      <div>
                        <div className="flex items-start justify-between gap-md mb-md">
                          <div>
                            <p className="text-label-sm text-primary font-bold uppercase tracking-wider">{slot.mentor?.username || 'Mentor'}</p>
                            <h3 className="font-headline-md font-bold leading-tight text-2xl mt-xs">{slot.mentor?.jobTitle || 'Software Engineer'}</h3>
                            <p className="text-label-sm text-outline mt-xs">{slot.mentor?.company || 'TechCorp'}</p>
                          </div>
                          <span className={`px-3 py-1.5 rounded-full text-label-sm font-bold ${slot.is_active ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>
                            {slot.is_active ? 'Open' : 'Booked'}
                          </span>
                        </div>

                        <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-md mb-md space-y-xs">
                          <p className="text-label-sm font-bold text-on-surface">{slot.slotType === 'RECURRING' ? `Every ${slot.dayOfWeek}` : new Date(slot.slotDate || slot.startTime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                          <p className="text-body-md text-on-surface-variant flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">schedule</span>{new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="text-label-sm text-on-surface-variant">Buffer: {slot.bufferMinutes || 0} mins • Duration: {slot.sessionDurationMinutes || 0} mins</p>
                        </div>

                        <p className="text-body-md text-on-surface-variant mb-xl">{slot.notes || 'Available for mentoring sessions.'}</p>
                        <div className="flex flex-wrap gap-xs mb-xl">
                          <span className="px-3 py-1.5 bg-surface rounded-md text-label-sm font-bold border border-outline-variant/30">{slot.slotType === 'RECURRING' ? '🔁 Recurring' : '📅 One-Time'}</span>
                          <span className="px-3 py-1.5 bg-surface rounded-md text-label-sm font-bold border border-outline-variant/30">Max bookable: {slot.maxBookableSlots || 1}</span>
                          <span className="px-3 py-1.5 bg-surface rounded-md text-label-sm font-bold border border-outline-variant/30">{slot.is_active ? 'Available' : 'Booked'}</span>
                        </div>
                      </div>

                      <div className="border-t border-outline-variant/30 pt-lg mt-auto">
                        {slot.is_active ? (
                          <Button className="w-full py-3" iconRight="calendar_month" onClick={() => setSelectedSlot(slot)}>Book</Button>
                        ) : (
                          <Button
                            className="w-full py-3"
                            iconRight="videocam"
                            disabled={!canJoin(slot)}
                            variant={canJoin(slot) ? 'primary' : 'ghost'}
                            onClick={() => canJoin(slot) && window.alert('Joining session...')}
                          >
                            {canJoin(slot) ? 'Join Now' : 'Join'}
                          </Button>
                        )}
                      </div>
                    </MagicBento>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            <section className="space-y-lg">
              <div className="flex items-center justify-between gap-md flex-wrap">
                <h2 className="font-headline-md font-bold text-2xl">Booked Slots</h2>
                <span className="text-label-sm text-on-surface-variant">{bookedSlots.length} reserved</span>
              </div>

              {bookedSlots.length > 0 ? (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                  {bookedSlots.map((slot) => (
                    <motion.div key={slot.id} variants={fadeUp}>
                      <MagicBento className="h-full flex flex-col justify-between p-xl" tilt={true} magnetism={false}>
                        <div>
                          <div className="flex items-start justify-between gap-md mb-md">
                            <div>
                              <p className="text-label-sm text-primary font-bold uppercase tracking-wider">{slot.mentor?.username || 'Mentor'}</p>
                              <h3 className="font-headline-md font-bold leading-tight text-2xl mt-xs">{slot.mentor?.jobTitle || 'Software Engineer'}</h3>
                              <p className="text-label-sm text-outline mt-xs">{slot.mentor?.company || 'TechCorp'}</p>
                            </div>
                            <span className="px-3 py-1.5 rounded-full text-label-sm font-bold bg-warning/10 text-warning">Booked</span>
                          </div>

                          <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-md mb-md space-y-xs">
                            <p className="text-label-sm font-bold text-on-surface">{slot.slotType === 'RECURRING' ? `Every ${slot.dayOfWeek}` : new Date(slot.slotDate || slot.startTime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            <p className="text-body-md text-on-surface-variant flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">schedule</span>{new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-label-sm text-on-surface-variant">Buffer: {slot.bufferMinutes || 0} mins • Duration: {slot.sessionDurationMinutes || 0} mins</p>
                          </div>

                          <p className="text-body-md text-on-surface-variant mb-xl">{slot.notes || 'Booked mentoring session.'}</p>
                        </div>

                        <div className="border-t border-outline-variant/30 pt-lg mt-auto">
                          <Button
                            className="w-full py-3"
                            iconRight="videocam"
                            disabled={!canJoin(slot)}
                            variant={canJoin(slot) ? 'primary' : 'ghost'}
                            onClick={() => canJoin(slot) && window.alert('Joining session...')}
                          >
                            {canJoin(slot) ? 'Join Now' : 'Join'}
                          </Button>
                        </div>
                      </MagicBento>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <MagicBento className="p-xl text-center" tilt={false}>
                  <p className="text-on-surface-variant">No booked slots yet.</p>
                </MagicBento>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default BrowseMentors;
