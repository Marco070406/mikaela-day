'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/image/photo plage.jpg"
          alt="Beach Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
      </div>

      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2 text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 drop-shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>Invitation Spéciale</span>
            <Sparkles className="w-4 h-4" />
          </div>
          
          <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl mb-6 leading-tight drop-shadow-md">
            Mikaela's <span className="text-gradient">Day</span>
          </h1>
          
          <p className="max-w-xl text-base md:text-xl text-foreground font-medium leading-relaxed mb-10 drop-shadow-sm px-4">
            Célébrez avec nous un moment d'élégance, de joie et de souvenirs inoubliables pour l'anniversaire de Mikaela.
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70 animate-bounce">
        <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
        <div className="w-[1px] h-10 bg-foreground"></div>
      </div>
    </section>
  );
};

export default Hero;
