import React, { useState, useEffect } from 'react';
import { PillNav } from '../components/PillNav';
import { studentService } from '../services/api';
import { motion } from 'framer-motion';
import { Skeleton } from '../components/Skeleton';
import { Button } from '../components/Button';
import { MagicBento } from '../components/MagicBento';

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
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await studentService.getAllMentors();
        setMentors(response.data);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter(m => 
    m.username.toLowerCase().includes(search.toLowerCase()) || 
    (m.company && m.company.toLowerCase().includes(search.toLowerCase())) ||
    (m.jobTitle && m.jobTitle.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-background min-h-screen text-on-background selection:bg-primary/30">
      <PillNav />
      <main className="max-w-7xl mx-auto px-margin-desktop pt-32 pb-24">
        
        {/* Header Section */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col md:flex-row justify-between items-end gap-lg mb-2xl">
          <motion.div variants={fadeUp} className="space-y-sm">
            <h1 className="font-display text-5xl font-bold">Discover Top Mentors</h1>
            <p className="text-on-surface-variant text-body-lg">Connect with industry experts who have walked your path.</p>
          </motion.div>
          
          <motion.div variants={fadeUp} className="relative w-full md:w-96 group">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Search by name, role, or company..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl pl-3xl pr-md py-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md"
            />
          </motion.div>
        </motion.div>

        {/* Tags / Quick Filters */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex gap-sm mb-2xl overflow-x-auto pb-xs scrollbar-hide">
          {['Featured', 'System Design', 'Frontend', 'Backend', 'Staff Engineers', 'Career Advice'].map((tag, i) => (
            <button key={i} className={`px-6 py-2 rounded-full text-label-md font-bold whitespace-nowrap transition-colors ${i === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container-low border border-outline-variant/30 hover:border-primary/50 text-on-surface'}`}>
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Mentor Grid */}
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
            {filteredMentors.map(mentor => (
              <motion.div key={mentor.id} variants={fadeUp}>
                <MagicBento className="h-full flex flex-col justify-between p-xl" tilt={true} magnetism={false}>
                  <div>
                    <div className="flex justify-between items-start mb-md">
                      <div className="flex gap-md">
                        <img 
                          src={`https://i.pravatar.cc/150?u=${mentor.username}`} 
                          alt={mentor.username} 
                          className="w-16 h-16 rounded-full object-cover border border-outline-variant/50"
                        />
                        <div>
                          <h3 className="font-headline-md font-bold leading-tight text-2xl">{mentor.username}</h3>
                          <p className="text-label-sm text-primary font-bold mt-1 tracking-wider uppercase">{mentor.jobTitle || 'Software Engineer'}</p>
                          <p className="text-label-sm text-outline mt-xs">{mentor.company || 'TechCorp'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-body-md text-on-surface-variant line-clamp-3 mb-xl">
                      {mentor.bio || `Experienced engineer specializing in backend systems. Passionate about helping others level up their career.`}
                    </p>
                    
                    <div className="flex flex-wrap gap-xs mb-xl">
                      <span className="px-3 py-1.5 bg-surface rounded-md text-label-sm font-bold border border-outline-variant/30 flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[14px]">public</span> {mentor.timezone}
                      </span>
                      <span className="px-3 py-1.5 bg-surface rounded-md text-label-sm font-bold border border-outline-variant/30 flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[14px] text-primary">star</span> 5.0
                      </span>
                      {mentor.yearsOfExperience && (
                        <span className="px-3 py-1.5 bg-surface rounded-md text-label-sm font-bold border border-outline-variant/30 flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[14px]">work</span> {mentor.yearsOfExperience} YOE
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-md border-t border-outline-variant/30 pt-lg mt-auto">
                    <Button variant="outline" className="w-full py-3">View Profile</Button>
                    <Button className="w-full py-3" iconRight="calendar_month">Book</Button>
                  </div>
                </MagicBento>
              </motion.div>
            ))}
            
            {filteredMentors.length === 0 && (
              <motion.div variants={fadeUp} className="col-span-full py-3xl">
                <MagicBento className="text-center p-3xl max-w-2xl mx-auto" tilt={false}>
                  <div className="w-24 h-24 bg-surface-variant rounded-full flex items-center justify-center mx-auto mb-lg">
                    <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
                  </div>
                  <h3 className="text-headline-lg font-bold mb-xs">No mentors found</h3>
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
