'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import Countdown from '@/components/Countdown';
import Details from '@/components/Details';
import Gallery from '@/components/Gallery';
import Guestbook from '@/components/Guestbook';
import Footer from '@/components/Footer';
import FloatingParticles from '@/components/FloatingParticles';
import EnvelopeSplash from '@/components/EnvelopeSplash';
import { AnimatePresence } from 'framer-motion';

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  return (
    <main className="relative min-h-screen bg-white selection:bg-primary/30">
      <AnimatePresence>
        {!showContent && (
          <EnvelopeSplash onComplete={() => setShowContent(true)} />
        )}
      </AnimatePresence>

      {showContent && (
        <div className="animate-in fade-in duration-1000">
          <FloatingParticles />
          <Hero />
          <Countdown />
          <Details />
          <Guestbook />
          <Gallery />
          <Footer />
        </div>
      )}
    </main>
  );
}
