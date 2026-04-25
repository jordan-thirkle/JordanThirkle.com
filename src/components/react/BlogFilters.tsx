import React, { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { activeBlogTag, activeBlogView, type BlogView } from '@/store/blog';
import { LayoutGrid, Clock3 } from 'lucide-react';

interface Props {
  categories: string[];
}

export const BlogFilters: React.FC<Props> = ({ categories }) => {
  const activeFilter = useStore(activeBlogTag);
  const activeView = useStore(activeBlogView);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get('tag');
    const view = params.get('view') as BlogView;
    
    if (tag) activeBlogTag.set(tag.toLowerCase());
    if (view === 'grid' || view === 'timeline') activeBlogView.set(view);
  }, []);

  const handleFilterClick = (tag: string | null) => {
    activeBlogTag.set(tag);
    updateUrl('tag', tag);
  };

  const handleViewClick = (view: BlogView) => {
    activeBlogView.set(view);
    updateUrl('view', view);
  };

  const updateUrl = (key: string, value: string | null) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.history.pushState({}, '', url);
  };

  const filters = ['All', ...categories];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 pb-8 border-b border-zinc-900">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const id = f === 'All' ? null : f.toLowerCase();
          const isActive = activeFilter === id;
          return (
            <button
              key={f}
              onClick={() => handleFilterClick(id)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                isActive 
                  ? 'bg-white text-black border-white' 
                  : 'bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
        <button
          onClick={() => handleViewClick('grid')}
          className={`p-2 rounded-lg transition-all ${
            activeView === 'grid' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
          }`}
          aria-label="Grid View"
        >
          <LayoutGrid size={18} />
        </button>
        <button
          onClick={() => handleViewClick('timeline')}
          className={`p-2 rounded-lg transition-all ${
            activeView === 'timeline' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
          }`}
          aria-label="Timeline View"
        >
          <Clock3 size={18} />
        </button>
      </div>
    </div>
  );
};
