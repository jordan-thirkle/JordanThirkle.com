import React, { useState, useEffect } from 'react';
import { Heart, Share2, Twitter, Linkedin, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '@/store';

interface Props {
  title?: string;
  url?: string;
}

export const EngagementDock: React.FC<Props> = ({ title = '', url = '' }) => {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    const liked = localStorage.getItem('hub-liked') === 'true';
    const totalLikes = parseInt(localStorage.getItem('hub-total-likes') || '0', 10);
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

  const handleShare = () => {
    setIsShareOpen(!isShareOpen);
  };

  const tweetText = `Just posted: ${title} 🏗️\n\nBy @jordan_Thirkle #BuildInPublic #AI #Engineering`;
  const [currentUrl, setCurrentUrl] = useState(url);

  useEffect(() => {
    if (!url && typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, [url]);

  const xShareUrl = `https://x.com/intent/post?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(currentUrl || '')}`;

  const handleCopyThread = () => {
    const header = `${title} 🧵\n\n`;
    const body = `I just published a new update on the Hub. Here is the technical breakdown:\n\n${currentUrl}\n\n`;
    const footer = `@jordan_Thirkle #BuildInPublic`;
    
    const fullText = `${header}${body}${footer}`;
    
    // Simple splitting logic if it exceeds 280 (though for now we just format it nicely)
    if (fullText.length > 280) {
      const part1 = `${header}I just published a new update on the Hub. (1/2)\n\n${currentUrl}`;
      const part2 = `The full technical breakdown is live. Check it out to see the progress. (2/2)\n\n@jordan_Thirkle #BuildInPublic`;
      navigator.clipboard.writeText(`${part1}\n\n---\n\n${part2}`);
      showToast('Thread split & copied!', 'success');
    } else {
      navigator.clipboard.writeText(fullText);
      showToast('Formatted for X!', 'success');
    }
    setIsShareOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 p-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-full shadow-2xl">
        <button
          onClick={handleLike}
          aria-label={hasLiked ? "Unlike" : "Like"}
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

        <a 
          href="#comments"
          aria-label="Scroll to comments"
          className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          <MessageSquare className="w-4 h-4" />
        </a>

        <div className="w-[1px] h-4 bg-zinc-800 mx-1" />

        <div className="relative">
          <button
            onClick={handleShare}
            aria-label="Share post"
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
                className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 min-w-[200px]"
              >
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(currentUrl || '');
                    showToast('Link copied!', 'success');
                    setIsShareOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors w-full text-left"
                >
                  <Share2 className="w-4 h-4" /> Copy Link
                </button>
                <a 
                  href={xShareUrl}
                  target="_blank"
                  onClick={() => setIsShareOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  Share on X
                </a>
                <button 
                  onClick={handleCopyThread}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors w-full text-left"
                >
                  <MessageSquare className="w-4 h-4" /> Copy for X Thread
                </button>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl || '')}`}
                  target="_blank"
                  onClick={() => setIsShareOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
