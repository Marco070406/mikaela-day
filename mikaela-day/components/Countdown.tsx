'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TARGET_DATE = new Date('2026-06-20T18:00:00');

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = TARGET_DATE.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const items = [
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Secondes', value: timeLeft.seconds },
  ];

  return (
    <section className="py-12 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto glass rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-serif text-2xl md:text-5xl mb-4">On compte les jours...</h2>
            <div className="w-16 md:w-20 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {items.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-full aspect-square flex items-center justify-center bg-white rounded-xl md:rounded-2xl shadow-inner mb-2 md:mb-4">
                  <span className="font-serif text-3xl md:text-6xl text-primary font-bold">
                    {item.value.toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="uppercase tracking-[0.1em] md:tracking-[0.2em] text-[10px] md:text-xs font-bold text-foreground/60">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Countdown;
