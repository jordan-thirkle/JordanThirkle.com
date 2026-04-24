import React, { useState } from 'react';
import { Copy, Check, Mail } from 'lucide-react';
import { showToast } from '@/store';

export const CopyEmail: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = 'hello@jordanthirkle.com';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      showToast('Email copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('Failed to copy email', 'error');
    }
  };

  return (
    <div className="group relative">
      <button
        onClick={handleCopy}
        className="flex items-center gap-4 px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white transition-all hover:border-zinc-700 hover:bg-zinc-800/50 w-full md:w-auto"
      >
        <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
          <Mail className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-0.5">Email Address</span>
          <span className="text-lg font-medium">{email}</span>
        </div>
        <div className="ml-auto pl-8">
          {copied ? (
            <Check className="w-5 h-5 text-emerald-500" />
          ) : (
            <Copy className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400" />
          )}
        </div>
      </button>
    </div>
  );
};
