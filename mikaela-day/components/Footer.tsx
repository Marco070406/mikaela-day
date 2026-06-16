'use client';

import { Heart, Phone } from 'lucide-react';
import { FaWhatsapp,  FaInstagram} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="py-20 bg-white border-t border-secondary">
      <div className="container mx-auto px-6 text-center">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-2 font-serif text-2xl font-bold italic">
            Mikaela's Day
          </div>

          <div className="flex gap-6 relative z-50">
            {/* WhatsApp */}
            <button
              onClick={() => window.open('https://wa.me/22893653235', '_blank')}
              className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all cursor-pointer border-none outline-none"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="w-5 h-5" />
            </button>

            {/* Téléphone */}
            <button
              onClick={() => (window.location.href = 'tel:+22893653235')}
              className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all cursor-pointer border-none outline-none"
              aria-label="Phone"
            >
              <Phone className="w-5 h-5" />
            </button>

            {/* Instagram */}
            <button
              onClick={() =>
                window.open(
                  'https://www.instagram.com/koffinanaa__/',
                  '_blank'
                )
              }
              className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all cursor-pointer border-none outline-none"
              aria-label="Instagram"
            >
              <FaInstagram className="w-5 h-5" />
            </button>
          </div>

          <p className="text-foreground/50 font-light max-w-md">
            Nous avons hâte de partager ce moment précieux avec vous.
          </p>

          <div className="flex items-center gap-2 text-primary font-serif italic text-lg mt-8">
            With Love <Heart className="w-4 h-4 fill-primary" />
          </div>

          <div className="text-[10px] uppercase tracking-widest text-foreground/30 font-bold mt-12">
            © 2026 Mikaela's Day • Site d'Invitation Premium
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
