import React from 'react';
import { useApp } from '../context/AppContext';
import { HackathonCard } from './HackathonCard';
import { Bookmark, ArrowLeft, Compass } from 'lucide-react';

export const SavedView: React.FC = () => {
  const { hackathons, savedIds, navigate } = useApp();

  const savedHackathons = hackathons.filter(h => savedIds.includes(h.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Bookmark className="h-7 w-7 text-cyan-400 fill-current" />
            <span>Saved Hackathons</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Keep track of upcoming application deadlines and saved campus events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('explore')}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            <Compass className="h-4 w-4 text-cyan-400" />
            <span>Explore More</span>
          </button>
        </div>
      </div>

      {savedHackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedHackathons.map((h) => (
            <HackathonCard key={h.id} hackathon={h} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-16 text-center">
          <Bookmark className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white">No saved hackathons yet</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
            Browse through hackathons in your zone or city and click the bookmark button to save them to your account.
          </p>
          <button
            onClick={() => navigate('explore')}
            className="mt-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:from-cyan-300"
          >
            Discover Hackathons Now
          </button>
        </div>
      )}

    </div>
  );
};
