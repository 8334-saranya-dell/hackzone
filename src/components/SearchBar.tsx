import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, MapPin, Sparkles, PlusCircle, ArrowRight, Trophy } from 'lucide-react';
import { DeadlineBadge } from './DeadlineBadge';

export const SearchBar: React.FC = () => {
  const { 
    filters, 
    updateFilter, 
    setSearchQuery,
    searchHackathons,
    openHackathonDetails,
    navigate, 
    selectZone, 
    selectState,
    currentUser,
    showToast
  } = useApp();

  const [inputVal, setInputVal] = useState(filters.searchQuery || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync when filters.searchQuery changes externally (e.g. from clearFilters)
  useEffect(() => {
    setInputVal(filters.searchQuery || '');
  }, [filters.searchQuery]);

  // Compute real-time search matches from AppProvider helper
  const realtimeMatches = searchHackathons(inputVal);

  // Handle typing in real-time
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    setSearchQuery(val);
    setShowDropdown(val.trim().length > 0);
  };

  const handleClear = () => {
    setInputVal('');
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputVal);
    setShowDropdown(false);
    navigate('explore');
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickFilter = (type: string) => {
    switch (type) {
      case 'Nearby':
        if (currentUser?.city) {
          updateFilter('city', currentUser.city);
          showToast('Filtering Nearby', `Showing hackathons in ${currentUser.city}`, 'info');
        } else {
          updateFilter('city', 'Visakhapatnam');
          showToast('Filtering Nearby', 'Showing hackathons in Visakhapatnam', 'info');
        }
        break;
      case 'Andhra Pradesh':
        selectZone('South India');
        selectState('Andhra Pradesh');
        break;
      case 'Telangana':
        selectZone('South India');
        selectState('Telangana');
        break;
      case 'South India':
        selectZone('South India');
        break;
      case 'India':
        updateFilter('zone', '');
        updateFilter('state', '');
        updateFilter('city', '');
        break;
      case 'Online':
        updateFilter('mode', 'Online');
        break;
      default:
        break;
    }
    navigate('explore');
  };

  const quickFilters = [
    { label: '📍 Nearby (Vizag)', val: 'Nearby' },
    { label: 'Andhra Pradesh', val: 'Andhra Pradesh' },
    { label: 'Telangana', val: 'Telangana' },
    { label: 'South India', val: 'South India' },
    { label: 'All India', val: 'India' },
    { label: '🌐 Online', val: 'Online' },
  ];

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto relative">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative z-30">
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute left-4 text-cyan-400">
            <Search className="h-5 w-5" />
          </div>

          <input
            type="text"
            value={inputVal}
            onChange={handleInputChange}
            onFocus={() => {
              if (inputVal.trim().length > 0) setShowDropdown(true);
            }}
            placeholder="Search hackathon, city (e.g. Visakhapatnam), state, or technology (e.g. AI)..."
            className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/90 py-4 pl-12 pr-32 text-sm sm:text-base text-white placeholder-slate-400 shadow-2xl shadow-cyan-950/20 backdrop-blur-md transition-all focus:border-cyan-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          />

          {inputVal && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-24 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
              aria-label="Clear search query"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            type="submit"
            className="absolute right-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:from-cyan-300 hover:to-blue-400 shadow-md shadow-cyan-500/20 transition-all"
          >
            Search
          </button>
        </div>
      </form>

      {/* Real-time Search Dropdown Preview */}
      {showDropdown && inputVal.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-40 rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Real-time Matches for "{inputVal}"</span>
            </div>
            <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[11px] font-bold text-cyan-300">
              {realtimeMatches.length} {realtimeMatches.length === 1 ? 'event' : 'events'} found
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80">
            {realtimeMatches.length > 0 ? (
              realtimeMatches.slice(0, 5).map((h) => (
                <div
                  key={h.id}
                  onClick={() => {
                    setShowDropdown(false);
                    openHackathonDetails(h.id);
                  }}
                  className="p-3.5 hover:bg-slate-800/70 transition-colors cursor-pointer text-left flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {h.name}
                      </span>
                      <span className="shrink-0 text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-800 text-slate-300">
                        {h.mode}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{h.city}, {h.state}</span>
                      </span>

                      <span className="text-slate-600">·</span>

                      <span className="flex items-center gap-1 text-amber-300 font-medium">
                        <Trophy className="h-3 w-3" />
                        {h.prizePool}
                      </span>

                      <span className="text-slate-600">·</span>

                      <div className="flex gap-1 truncate">
                        {h.technologies.slice(0, 2).map((t) => (
                          <span key={t} className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] text-cyan-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                No matching hackathons found for "{inputVal}". Try searching by state (e.g. Andhra Pradesh), city (e.g. Visakhapatnam), or tech (e.g. AI/ML).
              </div>
            )}
          </div>

          <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">
              Filters by Name, City, State, or Technology
            </span>
            <button
              type="button"
              onClick={() => {
                setShowDropdown(false);
                setSearchQuery(inputVal);
                navigate('explore');
              }}
              className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>View all in Explore</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => navigate('explore')}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-bold text-slate-950 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/25 transition-all transform active:scale-98"
        >
          <Sparkles className="h-4 w-4" />
          Explore Hackathons
        </button>

        <button
          onClick={() => navigate('add-hackathon')}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white hover:border-cyan-500/40 transition-all"
        >
          <PlusCircle className="h-4 w-4 text-cyan-400" />
          Add a Hackathon
        </button>
      </div>

      {/* Quick Filters Pill Bar */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-slate-400 font-medium mr-1">Quick Filters:</span>
        {quickFilters.map((q) => (
          <button
            key={q.val}
            onClick={() => handleQuickFilter(q.val)}
            className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 font-medium text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
};
