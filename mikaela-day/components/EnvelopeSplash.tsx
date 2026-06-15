'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const EnvelopeSplash = ({ onComplete }: { onComplete: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleOpenClick = () => {
    if (isOpen) return;
    setIsOpen(true);
    
    // After the card rises, start the transition to the site
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 800);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-secondary/20 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        className="relative"
      >
        <AnimatePresence>
          {!isExiting && (
            <motion.div
              className="relative w-80 h-56 cursor-pointer group"
              onClick={handleOpenClick}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.8 }}
            >
              {/* Envelope Body */}
              <div className="absolute inset-0 bg-white shadow-2xl rounded-lg border border-primary/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-secondary/30" />
              </div>

              {/* Envelope Flap (Top) */}
              <motion.div
                initial={false}
                animate={{ rotateX: isOpen ? 180 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ transformOrigin: "top" }}
                className="absolute inset-x-0 top-0 h-1/2 bg-white border-x border-t border-primary/10 rounded-t-lg z-20 shadow-sm"
              >
                <div className="absolute inset-0 bg-secondary/10 clip-path-flap" />
              </motion.div>

              {/* Invitation Card */}
              <motion.div
                initial={false}
                animate={{ y: isOpen ? -80 : 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="absolute inset-x-4 top-4 bottom-4 bg-white z-10 shadow-lg rounded-md p-6 flex flex-col items-center justify-center border border-primary/5"
              >
                <div className="font-serif text-xl text-primary font-bold">Mikaela</div>
                <div className="text-[8px] uppercase tracking-widest text-foreground/40 mt-1">Vous invite</div>
                <div className="mt-4 w-8 h-[1px] bg-primary/30" />
              </motion.div>

              {/* Envelope Front (Triangle side folds) */}
              <div className="absolute inset-0 z-30 pointer-events-none">
                <div className="absolute inset-0 bg-white clip-path-envelope-front shadow-inner" />
              </div>

              {/* Pulsing prompt */}
              {!isOpen && (
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -bottom-12 left-0 right-0 text-center text-xs font-bold uppercase tracking-[0.3em] text-primary"
                >
                  Cliquez pour ouvrir
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style jsx global>{`
        .clip-path-flap {
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
        .clip-path-envelope-front {
          clip-path: polygon(0 100%, 50% 50%, 100% 100%, 100% 100%, 0% 100%);
          background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(252,228,236,0.5) 100%);
        }
      `}</style>
    </div>
  );
};

export default EnvelopeSplash;
