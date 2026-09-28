import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INDIA_LOCATIONS, ZONES, getStatesForZone, getCitiesForState } from '../data/locations';
import { HackathonCard } from './HackathonCard';
import { 
  MapPin, 
  ChevronRight, 
  RotateCcw, 
  Sparkles, 
  Compass,
  ArrowRight,
  Globe
} from 'lucide-react';
import { Zone } from '../types';

export const IndiaZoneExplorer: React.FC = () => {
  const { hackathons, navigate } = useApp();

  // Local state for the 3-step explorer
  const [selectedZone, setSelectedZone] = useState<string>('South India');
  const [selectedState, setSelectedState] = useState<string>('Andhra Pradesh');
  const [selectedCity, setSelectedCity] = useState<string>('Visakhapatnam');

  // Compute live counts
  const getZoneCount = (zone: string) => {
    return hackathons.filter(h => h.status === 'APPROVED' && (zone === 'Online' ? h.mode === 'Online' || h.zone === 'Online' : h.zone === zone)).length;
  };

  const getStateCount = (state: string) => {
    return hackathons.filter(h => h.status === 'APPROVED' && h.state.toLowerCase() === state.toLowerCase()).length;
  };

  const getCityCount = (city: string) => {
    return hackathons.filter(h => h.status === 'APPROVED' && h.city.toLowerCase() === city.toLowerCase()).length;
  };

  // Get matching hackathons for the currently selected city (or state/zone fallback)
  const matchingHackathons = hackathons.filter((h) => {
    if (h.status !== 'APPROVED') return false;
    if (selectedCity && selectedCity !== 'Other Cities') {
      return h.city.toLowerCase() === selectedCity.toLowerCase();
    }
    if (selectedState) {
      return h.state.toLowerCase() === selectedState.toLowerCase();
    }
    if (selectedZone) {
      return selectedZone === 'Online' ? h.mode === 'Online' || h.zone === 'Online' : h.zone === selectedZone;
    }
    return true;
  });

  const availableStates = selectedZone ? getStatesForZone(selectedZone) : [];
  const availableCities = (selectedZone && selectedState) ? getCitiesForState(selectedZone, selectedState) : [];

  const handleZoneClick = (zone: string) => {
    setSelectedZone(zone);
    const states = getStatesForZone(zone);
    if (states.length > 0) {
      setSelectedState(states[0]);
      const cities = getCitiesForState(zone, states[0]);
      setSelectedCity(cities.length > 0 ? cities[0] : '');
    } else {
      setSelectedState('');
      setSelectedCity('');
    }
  };

  const handleStateClick = (state: string) => {
    setSelectedState(state);
    const cities = getCitiesForState(selectedZone, state);
    setSelectedCity(cities.length > 0 ? cities[0] : '');
  };

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
  };

  const resetExplorer = () => {
    setSelectedZone('South India');
    setSelectedState('Andhra Pradesh');
    setSelectedCity('Visakhapatnam');
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-cyan-950/20">
      
      {/* Header & Breadcrumb Tracker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
            <Compass className="h-4 w-4" />
            <span>Interactive Location-First Discovery (3-Click System)</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            India Zone Explorer 🇮🇳
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Choose Zone → Choose State → Choose City → Discover Hackathons
          </p>
        </div>

        {/* Current Path Breadcrumb */}
        <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-xs">
          <span className="text-slate-400">India</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          <span className="font-semibold text-cyan-300">{selectedZone}</span>
          {selectedState && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
              <span className="font-semibold text-white">{selectedState}</span>
            </>
          )}
          {selectedCity && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
              <span className="font-bold text-emerald-400">{selectedCity}</span>
            </>
          )}
          <button
            onClick={resetExplorer}
            title="Reset location selector"
            className="ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Step 1: Choose Zone */}
      <div className="py-6 border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-bold">1</span>
            Step 1: Choose Zone
          </span>
          <span className="text-xs text-slate-400">
            {ZONES.length} Geographic Zones & Virtual
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {ZONES.map((zone) => {
            const isSelected = selectedZone === zone;
            const count = getZoneCount(zone);

            return (
              <button
                key={zone}
                onClick={() => handleZoneClick(zone)}
                className={`relative flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/40 text-white shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  {zone === 'Online' ? (
                    <Globe className={`h-4 w-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                  ) : (
                    <MapPin className={`h-4 w-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                  )}
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </div>
                <span className="font-semibold text-xs leading-tight">{zone}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Choose State */}
      {availableStates.length > 0 && (
        <div className="py-6 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-bold">2</span>
              Step 2: Choose State in {selectedZone}
            </span>
            <span className="text-xs text-slate-400">
              {availableStates.length} Regions Available
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableStates.map((state) => {
              const isSelected = selectedState === state;
              const count = getStateCount(state);

              return (
                <button
                  key={state}
                  onClick={() => handleStateClick(state)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300 shadow-md shadow-cyan-950/20'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span>{state}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-cyan-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Choose City */}
      {availableCities.length > 0 && (
        <div className="py-6 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">3</span>
              Step 3: Choose City in {selectedState}
            </span>
            <span className="text-xs text-slate-400">
              Select City to Reveal Events
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableCities.map((city) => {
              const isSelected = selectedCity === city;
              const count = getCityCount(city);

              return (
                <button
                  key={city}
                  onClick={() => handleCityClick(city)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold shadow-md shadow-emerald-950/30 ring-1 ring-emerald-500/50'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <MapPin className={`h-3 w-3 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{city}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 rounded-full ${
                      isSelected ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-slate-800 text-emerald-400'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Matching Hackathons Section */}
      <div className="pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>Hackathons in {selectedCity || selectedState || selectedZone}</span>
              <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-bold text-cyan-300">
                {matchingHackathons.length} {matchingHackathons.length === 1 ? 'Event' : 'Events'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Showing verified student hackathons in {selectedCity}, {selectedState} ({selectedZone})
            </p>
          </div>

          <button
            onClick={() => navigate('explore')}
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 self-start sm:self-auto"
          >
            <span>Open in Full Filter View</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {matchingHackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {matchingHackathons.map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center bg-slate-950/40">
            <MapPin className="mx-auto h-8 w-8 text-slate-600 mb-2" />
            <h4 className="text-sm font-bold text-white">
              No hackathons found in {selectedCity} yet
            </h4>
            <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
              Are you organizing an event in {selectedCity} or {selectedState}? Submit it to HackZone and reach thousands of student builders across India!
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => setSelectedCity('')}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                View all in {selectedState}
              </button>
              <button
                onClick={() => navigate('add-hackathon')}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-bold text-slate-950 hover:from-cyan-300"
              >
                + Add Hackathon in {selectedCity}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
