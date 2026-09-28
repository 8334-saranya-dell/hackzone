import React from 'react';
import { useApp } from '../context/AppContext';
import { ZONES, TECHNOLOGIES_LIST, getStatesForZone, getCitiesForState } from '../data/locations';
import { Filter, RotateCcw, X } from 'lucide-react';
import { Zone } from '../types';

interface FilterPanelProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { filters, updateFilter, clearFilters, selectZone, selectState, selectCity } = useApp();

  const states = filters.zone ? getStatesForZone(filters.zone) : [];
  const cities = (filters.zone && filters.state) ? getCitiesForState(filters.zone, filters.state) : [];

  const modes = ['Online', 'Offline', 'Hybrid'];
  const eligibilities = ['School Students', 'College Students', 'Graduates', 'Open to All'];
  const prizePools = ['All', '₹10K+', '₹50K+', '₹1 Lakh+'];
  const dateRanges = ['All', 'This Week', 'This Month', 'Upcoming'];

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-cyan-400" />
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Filters
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Zone Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Zone
        </label>
        <select
          value={filters.zone}
          onChange={(e) => {
            selectZone(e.target.value);
          }}
          className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-medium text-white focus:border-cyan-500 focus:outline-none"
        >
          <option value="">All Zones</option>
          {ZONES.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </div>

      {/* State Selector */}
      {filters.zone && states.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            State ({filters.zone})
          </label>
          <select
            value={filters.state}
            onChange={(e) => selectState(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-medium text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="">All States in {filters.zone}</option>
            {states.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      )}

      {/* City Selector */}
      {filters.state && cities.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            City ({filters.state})
          </label>
          <select
            value={filters.city}
            onChange={(e) => selectCity(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-medium text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="">All Cities in {filters.state}</option>
            {cities.map((ct) => (
              <option key={ct} value={ct}>{ct}</option>
            ))}
          </select>
        </div>
      )}

      {/* Mode */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {modes.map((m) => {
            const isSelected = filters.mode === m;
            return (
              <button
                key={m}
                onClick={() => updateFilter('mode', isSelected ? '' : m)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Technology */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Technology
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TECHNOLOGIES_LIST.map((tech) => {
            const isSelected = filters.technology === tech;
            return (
              <button
                key={tech}
                onClick={() => updateFilter('technology', isSelected ? '' : tech)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {tech}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Date
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {dateRanges.map((d) => {
            const isSelected = (filters.dateRange === d) || (!filters.dateRange && d === 'All');
            return (
              <button
                key={d}
                onClick={() => updateFilter('dateRange', d === 'All' ? '' : d)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Eligibility */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Eligibility
        </label>
        <select
          value={filters.eligibility}
          onChange={(e) => updateFilter('eligibility', e.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-medium text-white focus:border-cyan-500 focus:outline-none"
        >
          <option value="">All Eligibility Types</option>
          {eligibilities.map((el) => (
            <option key={el} value={el}>{el}</option>
          ))}
        </select>
      </div>

      {/* Prize Pool */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Prize Pool
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {prizePools.map((p) => {
            const isSelected = (filters.prizePool === p) || (!filters.prizePool && p === 'All');
            return (
              <button
                key={p}
                onClick={() => updateFilter('prizePool', p === 'All' ? '' : p)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-semibold'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Panel */}
      <aside className="hidden md:block w-72 shrink-0 rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 backdrop-blur-md self-start sticky top-24">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-950/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-xs h-full bg-slate-900 border-l border-slate-800 p-5 overflow-y-auto">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
