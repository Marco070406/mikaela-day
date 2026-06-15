'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-0 left-0 right-0 z-50 px-8 py-8"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Heart className="w-6 h-6 text-primary fill-primary group-hover:scale-110 transition-transform" />
          <span className="font-serif text-2xl font-bold tracking-tight">Mikaela's <span className="text-primary">Day</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <Link href="#hero" className="text-xs font-bold uppercase tracking-[0.3em] hover:text-primary transition-colors">Accueil</Link>
          <Link href="#details" className="text-xs font-bold uppercase tracking-[0.3em] hover:text-primary transition-colors">Détails</Link>
          <Link href="#guestbook" className="text-xs font-bold uppercase tracking-[0.3em] hover:text-primary transition-colors">Livre d'or</Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
