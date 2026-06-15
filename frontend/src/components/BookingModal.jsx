import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { studentService } from '../services/api';

export const BookingModal = ({ isOpen, onClose, slot }) => {
  const [sessionAgenda, setSessionAgenda] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen || !slot) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const calculatedEndTime = new Date(new Date(slot.startTime).getTime() + (slot.sessionDurationMinutes || 30) * 60000);
      
      // Format to ensure it matches backend requirement (append :00 if missing) using local time
      const formatTime = (dateObj) => {
        const pad = (n) => String(n).padStart(2, '0');
        const d = new Date(dateObj);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
      };

      const payload = {
        slotId: slot.id,
        mentorUsername: slot.mentor.username,
        startTime: formatTime(slot.startTime),
        endTime: formatTime(calculatedEndTime),
        sessionAgenda: sessionAgenda
      };
      await studentService.bookSlot(payload);
      setSuccess('Slot booked successfully!');
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to book slot');
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = slot.slotDate ? new Date(slot.slotDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : (slot.dayOfWeek || 'Unknown Date');
  const formattedStartTime = new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const calculatedEndTime = new Date(new Date(slot.startTime).getTime() + (slot.sessionDurationMinutes || 30) * 60000);
  const formattedEndTime = calculatedEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-md bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          className="bg-surface-container-low border border-outline-variant/50 p-xl rounded-3xl shadow-2xl max-w-lg w-full relative"
        >
          <button onClick={onClose} className="absolute top-md right-md text-outline hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
          
          <h2 className="font-display text-2xl font-bold mb-sm">Book Session with {slot.mentor.username}</h2>
          <p className="text-on-surface-variant text-label-sm mb-lg">
            {formattedDate} | {formattedStartTime} - {formattedEndTime}
          </p>
          
          {error && <div className="bg-error/20 text-error p-sm rounded-md mb-md text-label-sm">{error}</div>}
          {success && <div className="bg-primary/20 text-primary p-sm rounded-md mb-md text-label-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-md">
            <div className="flex flex-col gap-xs">
              <label className="text-label-sm font-bold text-on-surface-variant">Session Agenda / Topic</label>
              <textarea 
                required
                value={sessionAgenda} 
                onChange={(e) => setSessionAgenda(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-lg py-3 focus:border-primary focus:outline-none min-h-[100px]"
                placeholder="What do you want to discuss? E.g., System Design review, Resume feedback..."
              />
            </div>

            <div className="pt-md border-t border-outline-variant/30 flex justify-end gap-sm">
              <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" isLoading={loading}>Confirm Booking</Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
