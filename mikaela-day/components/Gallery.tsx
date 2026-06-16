'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, Image as ImageIcon, Video, X, Loader2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface MediaItem {
  id: number;
  url: string;
  type: 'photo' | 'video';
  name: string;
  created_at: string;
}

const Gallery = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetchMedia();

    // Subscribe to real-time updates for the media table
    const channel = supabase
      .channel('media-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'media' },
        (payload) => {
          console.log('Realtime insert received:', payload.new);
          setMedia((prev) => [payload.new as MediaItem, ...prev]);
        }
      )
      .subscribe((status) => {
        console.log('Realtime status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMedia = async () => {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching media:', error);
    } else {
      setMedia(data || []);
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // 3. Save to Database
      const type = file.type.startsWith('video/') ? 'video' : 'photo';
      const { error: dbError } = await supabase.from('media').insert([
        {
          url: publicUrl,
          type,
          name: file.name,
        },
      ]);

      if (dbError) throw dbError;

    } catch (error) {
      console.error('Error uploading:', error);
      alert('Une erreur est survenue lors de l\'upload.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  };

  const filteredMedia = media.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <section id="gallery" className="py-16 md:py-32 bg-secondary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-6xl mb-4 md:mb-6">Galerie Souvenirs</h2>
            <p className="text-foreground/60 font-light text-sm md:text-base mb-8">Partagez vos photos et vidéos avec nous !</p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button 
                onClick={() => setFilter('all')}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-primary text-white shadow-lg' : 'bg-white text-foreground/60 hover:bg-primary/10'}`}
              >
                Tout
              </button>
              <button 
                onClick={() => setFilter('photo')}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === 'photo' ? 'bg-primary text-white shadow-lg' : 'bg-white text-foreground/60 hover:bg-primary/10'}`}
              >
                Photos
              </button>
              <button 
                onClick={() => setFilter('video')}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === 'video' ? 'bg-primary text-white shadow-lg' : 'bg-white text-foreground/60 hover:bg-primary/10'}`}
              >
                Vidéos
              </button>
            </div>

            <div className="flex justify-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,video/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="glass px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <div className="bg-primary text-white p-1 rounded-full group-hover:bg-white group-hover:text-primary transition-colors">
                      <Plus className="w-5 h-5" />
                    </div>
                    Ajouter un souvenir
                  </>
                )}
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredMedia.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative aspect-square rounded-3xl overflow-hidden shadow-xl bg-white"
                  >
                    {item.type === 'photo' ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                        onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                      />
                    )}
                    
                    <div 
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      {item.type === 'video' && (
                        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full">
                          <Video className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {item.type === 'photo' && (
                        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full">
                          <ImageIcon className="w-5 h-5 text-white" />
                        </div>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item.url, item.name);
                        }}
                        className="bg-white text-foreground p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2 font-bold text-sm cursor-pointer"
                      >
                        <Download className="w-5 h-5 text-primary" />
                        Télécharger
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!isLoading && filteredMedia.length === 0 && (
            <div className="text-center py-20 bg-white/30 rounded-[3rem] border-2 border-dashed border-primary/20">
              <ImageIcon className="w-16 h-16 text-primary/20 mx-auto mb-4" />
              <p className="text-foreground/40 italic">Aucun souvenir partagé pour le moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox / Preview Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedItem(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 p-3 rounded-full hover:bg-white/20"
              onClick={() => setSelectedItem(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'photo' ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] rounded-xl shadow-2xl"
                />
              )}
              
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-6">
                <button
                  onClick={() => handleDownload(selectedItem.url, selectedItem.name)}
                  className="bg-primary text-white px-8 py-3 rounded-full font-bold flex items-center gap-3 hover:bg-rose-gold transition-all shadow-xl active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  Télécharger ce souvenir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
