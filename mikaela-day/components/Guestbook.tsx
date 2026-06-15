'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

interface Message {
  id: number;
  name: string;
  text: string;
  date: string;
}

const Guestbook = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [payload.new as Message, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    const newMessage = {
      name,
      text,
      date: formattedDate,
    };

    const { error } = await supabase.from('messages').insert([newMessage]);

    if (error) {
      console.error('Error saving message:', error);
      alert('Une erreur est survenue lors de l\'envoi du message.');
      return;
    }

    setName('');
    setText('');
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F8BBD0', '#FCE4EC', '#D4AF37'],
    });
  };

  if (isLoading) {
    return (
      <section id="guestbook" className="py-16 md:py-32">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-foreground/60 animate-pulse">Chargement du livre d'or...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="guestbook" className="py-16 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-6xl mb-4 md:mb-6">Livre d'Or</h2>
            <p className="text-foreground/60 font-light text-sm md:text-base">Laissez un petit mot doux pour Mikaela.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl h-fit"
            >
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-xs md:text-sm font-bold uppercase tracking-widest text-foreground/60 mb-2 px-2">
                    Votre Nom
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-primary" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/50 border-none rounded-xl md:rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-6 focus:ring-2 focus:ring-primary outline-none transition-all shadow-inner text-sm md:text-base"
                      placeholder="Ex: Sophie"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold uppercase tracking-widest text-foreground/60 mb-2 px-2">
                    Votre Message
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 md:top-6 w-4 md:w-5 h-4 md:h-5 text-primary" />
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={4}
                      className="w-full bg-white/50 border-none rounded-xl md:rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-6 focus:ring-2 focus:ring-primary outline-none transition-all shadow-inner text-sm md:text-base"
                      placeholder="Écrivez quelque chose de gentil..."
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-rose-gold transition-all shadow-lg active:scale-95 text-sm md:text-base"
                >
                  <Send className="w-4 md:w-5 h-4 md:h-5" />
                  Envoyer le message
                </button>
              </form>
            </motion.div>

            {/* Messages Grid */}
            <div className="space-y-4 md:space-y-6 max-h-[500px] md:max-h-[600px] overflow-y-auto pr-2 md:pr-4 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="glass p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-md border-l-4 border-l-primary"
                    >
                      <div className="flex justify-between items-start mb-2 md:mb-4">
                        <h4 className="font-serif text-lg md:text-xl font-bold">{msg.name}</h4>
                        <span className="text-[10px] md:text-xs text-foreground/40 font-bold uppercase tracking-tighter italic">
                          {msg.date}
                        </span>
                      </div>
                      <p className="text-sm md:text-base text-foreground/70 leading-relaxed italic">"{msg.text}"</p>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-8 md:p-10 bg-secondary/10 rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-secondary"
                  >
                    <MessageSquare className="w-10 md:w-12 h-10 md:h-12 text-secondary mb-4 opacity-50" />
                    <p className="text-sm md:text-base text-foreground/40 italic">Soyez le premier à laisser un message !</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
};

export default Guestbook;
