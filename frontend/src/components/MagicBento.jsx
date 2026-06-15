import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export const MagicBento = ({ 
  children, 
  className = "", 
  glowColor = "46, 107, 79", // MentorSync Forest Green
  spotlightColor = "rgba(46, 107, 79, 0.15)",
  tilt = true,
  magnetism = true,
  ...props 
}) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const particlesRef = useRef(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    let bounds;
    
    const onMouseEnter = () => {
      bounds = card.getBoundingClientRect();
      gsap.to(glowRef.current, { opacity: 1, duration: 0.3 });
      
      // Spawn particles
      for(let i=0; i<3; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 rounded-full pointer-events-none z-0';
        particle.style.background = `rgba(${glowColor}, 0.8)`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.boxShadow = `0 0 10px rgba(${glowColor}, 0.8)`;
        particlesRef.current.appendChild(particle);
        
        gsap.to(particle, {
          y: -50 - Math.random() * 50,
          x: (Math.random() - 0.5) * 50,
          opacity: 0,
          scale: 0,
          duration: 1 + Math.random(),
          ease: "power2.out",
          onComplete: () => particle.remove()
        });
      }
    };

    const onMouseMove = (e) => {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      
      const xPct = mouseX / bounds.width - 0.5;
      const yPct = mouseY / bounds.height - 0.5;

      // Spotlight Glow Follows Cursor
      gsap.to(glowRef.current, {
        x: mouseX - bounds.width,
        y: mouseY - bounds.height,
        duration: 0.4,
        ease: "power2.out"
      });

      // Tilt Effect
      if (tilt) {
        gsap.to(card, {
          rotateX: yPct * -10,
          rotateY: xPct * 10,
          duration: 0.5,
          ease: "power2.out",
          transformPerspective: 1000
        });
      }

      // Magnetism Effect
      if (magnetism) {
        gsap.to(card, {
          x: xPct * 10,
          y: yPct * 10,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.5 });
      gsap.to(card, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
    };

    const onClick = (e) => {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      // Ripple Effect
      const ripple = document.createElement('div');
      ripple.className = 'absolute rounded-full pointer-events-none z-10';
      ripple.style.background = `radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0) 70%)`;
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.left = `${mouseX - 10}px`;
      ripple.style.top = `${mouseY - 10}px`;
      card.appendChild(ripple);

      gsap.to(ripple, {
        scale: 40,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => ripple.remove()
      });
      
      // Click bump
      gsap.to(card, { scale: 0.98, duration: 0.1, yoyo: true, repeat: 1 });
    };

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
    card.addEventListener('mousedown', onClick);

    return () => {
      card.removeEventListener('mouseenter', onMouseEnter);
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', onMouseLeave);
      card.removeEventListener('mousedown', onClick);
    };
  }, { scope: cardRef });

  return (
    <div 
      ref={cardRef} 
      className={`relative overflow-hidden bg-surface-container-high border border-outline-variant/30 rounded-2xl ${className}`}
      {...props}
    >
      {/* Background Spotlight Glow */}
      <div 
        ref={glowRef}
        className="pointer-events-none absolute w-[200%] h-[200%] rounded-full opacity-0 mix-blend-screen z-0"
        style={{
          background: `radial-gradient(circle at center, ${spotlightColor} 0%, transparent 50%)`
        }}
      />

      {/* Particle Container */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0" />

      {/* Border Glow specific to MentorSync Theme */}
      <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none z-10 mix-blend-overlay" />
      <div className="absolute inset-0 border border-primary/10 rounded-2xl pointer-events-none z-10" />

      {/* Content Container */}
      <div className="relative z-20 h-full w-full">
        {children}
      </div>
    </div>
  );
};
