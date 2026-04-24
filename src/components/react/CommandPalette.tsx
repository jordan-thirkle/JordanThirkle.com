import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { isSearchOpen } from '@/store';
import { Search, Command, Book, Layout, User, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const CommandPalette: React.FC = () => {
  const isOpen = useStore(isSearchOpen);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isSearchOpen.set(!isSearchOpen.get());
      }
      if (e.key === 'Escape') {
        isSearchOpen.set(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const items = [
    { name: 'Home', icon: Layout, href: '/' },
    { name: 'Blog', icon: Book, href: '/blog' },
    { name: 'Uses', icon: Settings, href: '/uses' },
    { name: 'About', icon: User, href: '#about' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => isSearchOpen.set(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center px-4 border-b border-zinc-800">
              <Search className="w-5 h-5 text-zinc-500" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="w-full h-14 bg-transparent border-none focus:ring-0 text-zinc-100 placeholder-zinc-500 text-sm"
              />
              <kbd className="hidden sm:flex h-5 items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-400">
                <span className="text-xs">ESC</span>
              </kbd>
            </div>

            <div className="p-2">
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Navigation</p>
              <div className="space-y-1">
                {items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors group"
                  >
                    <item.icon className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="px-4 py-3 bg-zinc-950/50 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Command className="w-3 h-3 text-zinc-500" />
                <span className="text-[10px] text-zinc-500">Press ENTER to select</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
