import React, { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { activeProjectFilter } from '@/store/projects';

interface Props {
  categories: string[];
}

export const ProjectFilters: React.FC<Props> = ({ categories }) => {
  const activeFilter = useStore(activeProjectFilter);

  useEffect(() => {
    // Sync with URL on mount
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');
    if (filter) {
      activeProjectFilter.set(filter.toLowerCase());
    }
  }, []);

  const handleFilterClick = (filter: string | null) => {
    activeProjectFilter.set(filter);
    const url = new URL(window.location.href);
    if (filter) {
      url.searchParams.set('filter', filter);
    } else {
      url.searchParams.delete('filter');
    }
    window.history.pushState({}, '', url);
  };

  const filters = ['All', ...categories];

  return (
    <div className="flex flex-wrap gap-2 mb-12">
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
