'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Shirt, Info } from 'lucide-react';

const details = [
  {
    icon: Calendar,
    title: 'Date & Heure',
    content: '20 Juin 2026 à 13h00',
    subcontent: 'Et surtout soyez à l\'heure pour ne rien manquer !',
    color: 'bg-pink-100',
  },
  {
    icon: MapPin,
    title: 'Lieu',
    content: 'Maestro Beach',
    subcontent: 'Célébration dans une cabane privée sur la plage, avec vue sur la mer',
    color: 'bg-rose-100',
  },
  {
    icon: Shirt,
    title: 'Code Vestimentaire',
    content: 'Tenue de plage',
    subcontent: 'Élégance décontractée sous le soleil',
    color: 'bg-pink-50',
  },
  {
    icon: Info,
    title: 'Note Spéciale',
    content: 'Votre présence est le plus beau cadeau',
    subcontent: 'Merci de confirmer votre présence',
    color: 'bg-rose-50',
  },
];

const Details = () => {
  return (
    <section id="details" className="py-16 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="font-serif text-3xl md:text-6xl mb-4 md:mb-6">L'Événement</h2>
          <p className="text-foreground/60 max-w-2xl mx-auto italic font-light text-sm md:text-base">
            Chaque détail a été pensé pour rendre cet après-midi magique.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {details.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass p-8 md:p-10 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center text-center shadow-lg border-white/50"
            >
              <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner`}>
                <item.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-4">{item.title}</h3>
              <p className="font-medium text-foreground/80 mb-2">{item.content}</p>
              {item.subcontent && (
                <p className="text-xs text-foreground/50 uppercase tracking-widest">{item.subcontent}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Details;
