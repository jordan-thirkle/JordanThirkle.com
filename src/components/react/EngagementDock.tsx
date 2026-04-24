import React, { useState, useEffect } from 'react';
import { Heart, Share2, Twitter, Github, Linkedin, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '@/store';

export const EngagementDock: React.FC = () => {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    // Load local state
    const liked = localStorage.getItem('hub-liked') === 'true';
    const totalLikes = parseInt(localStorage.getItem('hub-total-likes') || '42', 10);
    setHasLiked(liked);
    setLikes(liked ? totalLikes : totalLikes);
  }, []);

  const handleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikes(prev => prev - 1);
      localStorage.setItem('hub-liked', 'false');
    } else {
      setHasLiked(true);
      setLikes(prev => prev + 1);
      localStorage.setItem('hub-liked', 'true');
      showToast('Thanks for the support!', 'success');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Jordan Thirkle | Creator Hub',
          url: window.location.href,
        });
      } catch (err) {
        setIsShareOpen(!isShareOpen);
      }
    } else {
      setIsShareOpen(!isShareOpen);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 p-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-full shadow-2xl">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            hasLiked 
            ? 'bg-rose-500/10 text-rose-500' 
            : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{likes}</span>
        </button>

        <div className="w-[1px] h-4 bg-zinc-800 mx-1" />

        <div className="relative">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {isShareOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 min-w-[160px]"
              >
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" /> Twitter
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                  <MessageCircle className="w-4 h-4" /> Threads
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-[1px] h-4 bg-zinc-800 mx-1" />

        <a
          href="https://github.com/jordanthirkle"
          target="_blank"
          className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          <Github className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
