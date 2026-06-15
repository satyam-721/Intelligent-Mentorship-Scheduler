import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { mentorService } from '../services/api';

export const SlotCreationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    slotType: 'ONE_TIME',
    startTime: '',
    endTime: '',
    dayOfWeek: '',
    slotDate: '',
    sessionDurationMinutes: 30,
    bufferMinutes: 10,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...formData,
        // dayOfWeek is null if ONE_TIME
        dayOfWeek: formData.slotType === 'ONE_TIME' ? null : formData.dayOfWeek || 'MONDAY'
      };
      await mentorService.createSlot(payload);
      setSuccess('Slot created successfully!');
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError('Failed to create slot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-md bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          className="bg-surface-container-low border border-outline-variant/50 p-xl rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative"
        >
          <button onClick={onClose} className="absolute top-md right-md text-outline hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
          
          <h2 className="font-display text-2xl font-bold mb-lg">Create Availability Slot</h2>
          
          {error && <div className="bg-error/20 text-error p-sm rounded-md mb-md text-label-sm">{error}</div>}
          {success && <div className="bg-primary/20 text-primary p-sm rounded-md mb-md text-label-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-md">
            <div className="flex flex-col gap-xs">
              <label className="text-label-sm font-bold text-on-surface-variant">Slot Type</label>
              <select 
                value={formData.slotType} 
                onChange={(e) => setFormData({...formData, slotType: e.target.value})}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-lg py-3 focus:border-primary focus:outline-none"
              >
                <option value="ONE_TIME">One Time</option>
                <option value="RECURRING">Recurring</option>
              </select>
            </div>

            {formData.slotType === 'ONE_TIME' ? (
              <div className="flex flex-col gap-xs">
                <label className="text-label-sm font-bold text-on-surface-variant">Date</label>
                <input 
                  type="date" required value={formData.slotDate} onChange={(e) => setFormData({...formData, slotDate: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-lg py-3 focus:border-primary focus:outline-none [color-scheme:dark]"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-xs">
                <label className="text-label-sm font-bold text-on-surface-variant">Day of Week</label>
                <select 
                  value={formData.dayOfWeek} onChange={(e) => setFormData({...formData, dayOfWeek: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-lg py-3 focus:border-primary focus:outline-none"
                >
                  <option value="MONDAY">Monday</option>
                  <option value="TUESDAY">Tuesday</option>
                  <option value="WEDNESDAY">Wednesday</option>
                  <option value="THURSDAY">Thursday</option>
                  <option value="FRIDAY">Friday</option>
                  <option value="SATURDAY">Saturday</option>
                  <option value="SUNDAY">Sunday</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-md">
              <div className="flex flex-col gap-xs">
                <label className="text-label-sm font-bold text-on-surface-variant">Start Time</label>
                {/* For datetime-local vs time, backend expects local date time if one_time usually, but let's use datetime-local to be safe, or just time if backend parses it relative to date. The spec says "2026-06-15T10:00:00" */}
                <input 
                  type="datetime-local" required value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-lg py-3 focus:border-primary focus:outline-none [color-scheme:dark]"
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-label-sm font-bold text-on-surface-variant">End Time</label>
                <input 
                  type="datetime-local" required value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-lg py-3 focus:border-primary focus:outline-none [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-md">
              <div className="flex flex-col gap-xs">
                <label className="text-label-sm font-bold text-on-surface-variant">Duration (mins)</label>
                <input 
                  type="number" required value={formData.sessionDurationMinutes} onChange={(e) => setFormData({...formData, sessionDurationMinutes: parseInt(e.target.value)})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-lg py-3 focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-label-sm font-bold text-on-surface-variant">Buffer (mins)</label>
                <input 
                  type="number" required value={formData.bufferMinutes} onChange={(e) => setFormData({...formData, bufferMinutes: parseInt(e.target.value)})}
                  className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-lg py-3 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="text-label-sm font-bold text-on-surface-variant">Notes</label>
              <input 
                type="text" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-lg py-3 focus:border-primary focus:outline-none"
                placeholder="Optional notes"
              />
            </div>

            <div className="pt-md border-t border-outline-variant/30 flex justify-end gap-sm">
              <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" isLoading={loading}>Create Slot</Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
