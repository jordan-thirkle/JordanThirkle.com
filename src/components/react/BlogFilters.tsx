import React, { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { activeBlogTag } from '@/store/blog';

interface Props {
  tags: string[];
}

export const BlogFilters: React.FC<Props> = ({ tags }) => {
  const activeFilter = useStore(activeBlogTag);

  useEffect(() => {
    // Sync with URL on mount
    const params = new URLSearchParams(window.location.search);
    const tag = params.get('tag');
    if (tag) {
      activeBlogTag.set(tag.toLowerCase());
    }
  }, []);

  const handleFilterClick = (tag: string | null) => {
    activeBlogTag.set(tag);
    const url = new URL(window.location.href);
    if (tag) {
      url.searchParams.set('tag', tag);
    } else {
      url.searchParams.delete('tag');
    }
    window.history.pushState({}, '', url);
  };

  const filters = ['All', ...tags];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {filters.map((f) => {
        const id = f === 'All' ? null : f.toLowerCase();
        const isActive = activeFilter === id;
        return (
          <button
            key={f}
            onClick={() => handleFilterClick(id)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
              isActive 
                ? 'bg-white text-black border-white' 
                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
};
