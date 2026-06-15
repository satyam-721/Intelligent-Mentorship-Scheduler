import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { MagicBento } from '../components/MagicBento';
import { useAuth } from '../context/AuthContext';

const steps = [
  { id: 'role', title: 'Choose Role' },
  { id: 'account', title: 'Account Details' },
  { id: 'profile', title: 'Profile Setup' }
];

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'STUDENT',
    timezone: 'Asia/Kolkata', // default timezone
    bio: '',
    linkedinUrl: '',
    githubUsername: '',
    yearsOfExperience: 0,
    jobTitle: '',
    company: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== steps.length - 1) return;
    
    setError('');
    setIsLoading(true);
    try {
      await register(formData);
      // navigation is handled inside register
    } catch (err) {
      setError(err.response?.data || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-md relative overflow-hidden selection:bg-primary/30">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" 
        />
      </div>

      <Link to="/" className="absolute top-xl left-2xl font-display text-2xl font-bold text-on-surface z-10 flex items-center gap-xs">
        <span className="material-symbols-outlined text-primary text-3xl">public</span>
        MentorSync
      </Link>

      <div className="w-full max-w-xl z-10">
        <div className="text-center mb-2xl">
          <h1 className="font-headline-lg text-headline-lg font-bold mb-sm">Create your account</h1>
          <p className="text-on-surface-variant text-body-md">Join the global network of elite developers.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-2xl relative max-w-md mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-variant rounded-full z-0" />
          <motion.div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          
          {steps.map((step, index) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-sm">
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-label-sm border-2 transition-colors duration-300 ${
                  index <= currentStep 
                    ? 'bg-primary border-primary text-on-primary' 
                    : 'bg-surface border-surface-variant text-outline'
                }`}
                animate={{ scale: index === currentStep ? 1.1 : 1 }}
              >
                {index < currentStep ? <span className="material-symbols-outlined text-[1.2em]">check</span> : index + 1}
              </motion.div>
              <span className={`text-label-sm absolute -bottom-6 whitespace-nowrap transition-colors duration-300 ${index <= currentStep ? 'text-primary font-bold' : 'text-outline'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        <MagicBento className="p-3xl shadow-2xl relative overflow-visible min-h-[450px]" tilt={false} magnetism={false}>
          {error && (
            <div className="absolute top-0 left-0 w-full bg-error text-on-error p-sm text-center text-label-sm font-bold z-20 rounded-t-2xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="h-full flex flex-col pt-4">
            <AnimatePresence mode="wait">
              {/* STEP 1: ROLE */}
              {currentStep === 0 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col justify-center gap-lg"
                >
                  <h2 className="font-headline-md text-headline-md font-bold text-center mb-md">How will you use MentorSync?</h2>
                  <div className="grid grid-cols-2 gap-lg">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                      className={`cursor-pointer p-xl rounded-2xl border-2 transition-all text-center flex flex-col items-center gap-md ${formData.role === 'STUDENT' ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(46,107,79,0.3)]' : 'border-outline-variant hover:border-primary/50 bg-surface-container-low'}`}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${formData.role === 'STUDENT' ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface'}`}>
                        <span className="material-symbols-outlined text-3xl">school</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-label-md">Student</h3>
                        <p className="text-label-sm text-outline mt-xs">I want to learn from experts</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, role: 'MENTOR' })}
                      className={`cursor-pointer p-xl rounded-2xl border-2 transition-all text-center flex flex-col items-center gap-md ${formData.role === 'MENTOR' ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(46,107,79,0.3)]' : 'border-outline-variant hover:border-primary/50 bg-surface-container-low'}`}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${formData.role === 'MENTOR' ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface'}`}>
                        <span className="material-symbols-outlined text-3xl">psychology</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-label-md">Mentor</h3>
                        <p className="text-label-sm text-outline mt-xs">I want to share my expertise</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: ACCOUNT */}
              {currentStep === 1 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col gap-md justify-center"
                >
                  <div className="flex flex-col gap-xs group">
                    <label className="text-label-sm font-bold text-on-surface-variant group-focus-within:text-primary transition-colors tracking-wider">USERNAME</label>
                    <input 
                      type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-lg py-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md shadow-inner"
                      placeholder="e.g. alex_dev" required
                    />
                  </div>
                  <div className="flex flex-col gap-xs group">
                    <label className="text-label-sm font-bold text-on-surface-variant group-focus-within:text-primary transition-colors tracking-wider">EMAIL ADDRESS</label>
                    <input 
                      type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-lg py-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md shadow-inner"
                      placeholder="alex@example.com" required
                    />
                  </div>
                  <div className="flex flex-col gap-xs group">
                    <label className="text-label-sm font-bold text-on-surface-variant group-focus-within:text-primary transition-colors tracking-wider">PASSWORD</label>
                    <input 
                      type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-lg py-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md shadow-inner"
                      placeholder="••••••••" required
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PROFILE */}
              {currentStep === 2 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col gap-md justify-center overflow-y-auto pr-sm"
                >
                  <div className="flex flex-col gap-xs group">
                    <label className="text-label-sm font-bold text-on-surface-variant group-focus-within:text-primary transition-colors tracking-wider">TIMEZONE</label>
                    <select 
                      value={formData.timezone} onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-lg py-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-body-md shadow-inner appearance-none cursor-pointer"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time (US)</option>
                      <option value="America/Los_Angeles">Pacific Time (US)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Asia/Kolkata">India (IST)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </div>
                  
                  {formData.role === 'MENTOR' && (
                    <>
                      <div className="grid grid-cols-2 gap-md">
                        <div className="flex flex-col gap-xs group">
                          <label className="text-label-sm font-bold text-on-surface-variant group-focus-within:text-primary transition-colors tracking-wider">JOB TITLE</label>
                          <input 
                            type="text" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-lg py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-inner"
                            placeholder="Senior Engineer" required
                          />
                        </div>
                        <div className="flex flex-col gap-xs group">
                          <label className="text-label-sm font-bold text-on-surface-variant group-focus-within:text-primary transition-colors tracking-wider">COMPANY</label>
                          <input 
                            type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-lg py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-inner"
                            placeholder="Stripe" required
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-xs group">
                        <label className="text-label-sm font-bold text-on-surface-variant group-focus-within:text-primary transition-colors tracking-wider">SHORT BIO</label>
                        <textarea 
                          value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-lg py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-inner min-h-[100px]"
                          placeholder="Tell students about your expertise..." required
                        />
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-xl pt-lg border-t border-outline-variant/30">
              {currentStep > 0 ? (
                <Button type="button" variant="ghost" onClick={handlePrev}>Back</Button>
              ) : <div></div>}
              
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={handleNext} iconRight="arrow_forward">Continue</Button>
              ) : (
                <Button type="submit" isLoading={isLoading} iconRight="check">Complete Registration</Button>
              )}
            </div>
          </form>
        </MagicBento>
        
        <p className="mt-xl text-center text-on-surface-variant text-label-sm">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline transition-all">Sign in instead</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
