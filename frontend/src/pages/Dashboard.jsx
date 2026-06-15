import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import MentorDashboard from './MentorDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return user.role === 'MENTOR' ? <MentorDashboard /> : <StudentDashboard />;
};

export default Dashboard;
