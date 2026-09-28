import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FilterPanel } from './FilterPanel';
import { HackathonCard } from './HackathonCard';
import { Search, Filter, X, SlidersHorizontal, MapPin } from 'lucide-react';

export const ExploreView: React.FC = () => {
  const { filteredHackathons, filters, updateFilter, setSearchQuery, clearFilters } = useApp();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const hasActiveFilters = 
    Boolean(filters.zone || filters.state || filters.city || filters.technology || filters.mode || filters.dateRange || filters.eligibility || (filters.prizePool && filters.prizePool !== 'All') || filters.searchQuery);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Top Banner / Heading */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore Student Hackathons
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Filtered discovery across India zones, cities, tech tracks, and prize pools.
          </p>
        </div>

        {/* Search bar inside Explore page */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, state, or tech keywords..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-9 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-white"
          >
            <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-3 text-xs">
          <span className="font-semibold text-slate-400 mr-1">Active Filters:</span>

          {filters.searchQuery && (
            <span className="flex items-center gap-1 rounded-lg bg-cyan-500/20 px-2.5 py-1 text-cyan-300 font-semibold">
              Query: "{filters.searchQuery}"
              <button onClick={() => updateFilter('searchQuery', '')}>
                <X className="h-3 w-3 hover:text-white" />
              </button>
            </span>
          )}

          {filters.zone && (
            <span className="flex items-center gap-1 rounded-lg bg-cyan-500/20 px-2.5 py-1 text-cyan-300 font-semibold">
              Zone: {filters.zone}
              <button onClick={() => updateFilter('zone', '')}>
                <X className="h-3 w-3 hover:text-white" />
              </button>
            </span>
          )}

          {filters.state && (
            <span className="flex items-center gap-1 rounded-lg bg-cyan-500/20 px-2.5 py-1 text-cyan-300 font-semibold">
              State: {filters.state}
              <button onClick={() => updateFilter('state', '')}>
                <X className="h-3 w-3 hover:text-white" />
              </button>
            </span>
          )}

          {filters.city && (
            <span className="flex items-center gap-1 rounded-lg bg-emerald-500/20 px-2.5 py-1 text-emerald-300 font-semibold">
              City: {filters.city}
              <button onClick={() => updateFilter('city', '')}>
                <X className="h-3 w-3 hover:text-white" />
              </button>
            </span>
          )}

          {filters.technology && (
            <span className="flex items-center gap-1 rounded-lg bg-cyan-500/20 px-2.5 py-1 text-cyan-300 font-semibold">
              Tech: {filters.technology}
              <button onClick={() => updateFilter('technology', '')}>
                <X className="h-3 w-3 hover:text-white" />
              </button>
            </span>
          )}

          {filters.mode && (
            <span className="flex items-center gap-1 rounded-lg bg-cyan-500/20 px-2.5 py-1 text-cyan-300 font-semibold">
              Mode: {filters.mode}
              <button onClick={() => updateFilter('mode', '')}>
                <X className="h-3 w-3 hover:text-white" />
              </button>
            </span>
          )}

          {filters.eligibility && (
            <span className="flex items-center gap-1 rounded-lg bg-cyan-500/20 px-2.5 py-1 text-cyan-300 font-semibold">
              {filters.eligibility}
              <button onClick={() => updateFilter('eligibility', '')}>
                <X className="h-3 w-3 hover:text-white" />
              </button>
            </span>
          )}

          {filters.prizePool && filters.prizePool !== 'All' && (
            <span className="flex items-center gap-1 rounded-lg bg-amber-500/20 px-2.5 py-1 text-amber-300 font-semibold">
              Prize: {filters.prizePool}
              <button onClick={() => updateFilter('prizePool', '')}>
                <X className="h-3 w-3 hover:text-white" />
              </button>
            </span>
          )}

          {filters.dateRange && filters.dateRange !== 'All' && (
            <span className="flex items-center gap-1 rounded-lg bg-cyan-500/20 px-2.5 py-1 text-cyan-300 font-semibold">
              {filters.dateRange}
              <button onClick={() => updateFilter('dateRange', '')}>
                <X className="h-3 w-3 hover:text-white" />
              </button>
            </span>
          )}

          <button
            onClick={clearFilters}
            className="ml-auto text-xs font-semibold text-rose-400 hover:text-rose-300"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Left Filter Panel + Right Hackathon Grid */}
      <div className="flex gap-8">
        
        {/* Left Filter Panel */}
        <FilterPanel
          isMobileOpen={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
        />

        {/* Right Content */}
        <main className="flex-1 min-w-0">
          
          {/* Results Count & Sort Indicator */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400 font-semibold">
              Showing <strong className="text-white">{filteredHackathons.length}</strong> matching hackathons
            </span>
          </div>

          {filteredHackathons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredHackathons.map((h) => (
                <HackathonCard key={h.id} hackathon={h} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
              <MapPin className="mx-auto h-8 w-8 text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-white">No hackathons match your filters</h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                Try widening your search terms, changing the selected city, or resetting the technology filter.
              </p>
              <button
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:from-cyan-300"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
