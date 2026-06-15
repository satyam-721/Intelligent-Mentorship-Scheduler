import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { studentService } from '../services/api';

export const BookingModal = ({ isOpen, onClose, slot }) => {
  const [sessionAgenda, setSessionAgenda] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');

  const safeSlot = slot || {
    id: null,
    mentor: { username: '' },
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    slotDate: '',
    dayOfWeek: null,
    sessionDurationMinutes: 60,
    notes: ''
  };

  const durationMinutes = useMemo(() => {
    const fromServer = Number(safeSlot.sessionDurationMinutes);
    if (Number.isFinite(fromServer) && fromServer > 0) return fromServer;

    const totalMinutes = Math.max(1, Math.round((new Date(safeSlot.endTime) - new Date(safeSlot.startTime)) / 60000));
    return totalMinutes;
  }, [safeSlot]);

  const sessionOptions = useMemo(() => {
    const start = new Date(safeSlot.startTime);
    const end = new Date(safeSlot.endTime);
    const stepMs = durationMinutes * 60 * 1000;
    const options = [];

    let current = new Date(start);
    while (current.getTime() + stepMs <= end.getTime()) {
      const optionEnd = new Date(current.getTime() + stepMs);
      options.push({
        startTime: current.toISOString(),
        endTime: optionEnd.toISOString(),
        label: `${current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${optionEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      });
      current = new Date(current.getTime() + stepMs);
    }

    if (options.length === 0) {
      options.push({
        startTime: safeSlot.startTime,
        endTime: safeSlot.endTime,
        label: `${new Date(safeSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(safeSlot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      });
    }

    return options;
  }, [safeSlot, durationMinutes]);

  useEffect(() => {
    if (sessionOptions.length > 0 && !sessionOptions.some((option) => option.startTime === selectedStartTime)) {
      setSelectedStartTime(sessionOptions[0].startTime);
    }
  }, [sessionOptions, selectedStartTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const selectedSlot = sessionOptions.find((option) => option.startTime === selectedStartTime) || sessionOptions[0];
      const payload = {
        slotId: safeSlot.id,
        mentorUsername: safeSlot.mentor.username,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
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

  const formattedDate = safeSlot.slotDate ? new Date(safeSlot.slotDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : (safeSlot.dayOfWeek || 'Unknown Date');
  const selectedOption = sessionOptions.find((option) => option.startTime === selectedStartTime) || sessionOptions[0];
  const formattedStartTime = new Date(selectedOption.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedEndTime = new Date(selectedOption.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!isOpen || !slot) return null;

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
          
          <h2 className="font-display text-2xl font-bold mb-sm">Book Session with {safeSlot.mentor.username}</h2>
          <p className="text-on-surface-variant text-label-sm mb-sm">
            {formattedDate} | {formattedStartTime} - {formattedEndTime}
          </p>
          <p className="text-on-surface-variant text-label-sm mb-lg">
            Session duration: {durationMinutes} minutes. Select which part of the slot you want to book.
          </p>
          
          {error && <div className="bg-error/20 text-error p-sm rounded-md mb-md text-label-sm">{error}</div>}
          {success && <div className="bg-primary/20 text-primary p-sm rounded-md mb-md text-label-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-md">
            <div className="flex flex-col gap-xs">
              <label className="text-label-sm font-bold text-on-surface-variant">Choose session time</label>
              <select
                value={selectedStartTime}
                onChange={(e) => setSelectedStartTime(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-lg py-3 focus:border-primary focus:outline-none"
              >
                {sessionOptions.map((option) => (
                  <option key={option.startTime} value={option.startTime}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

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
