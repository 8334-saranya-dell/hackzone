import React from 'react';
import { useApp } from '../context/AppContext';
import { IndiaZoneExplorer } from './IndiaZoneExplorer';
import { INDIA_LOCATIONS, POPULAR_CITIES } from '../data/locations';
import { MapPin, Compass, ArrowRight, Building, Sparkles } from 'lucide-react';

export const LocationsView: React.FC = () => {
  const { hackathons, updateFilter, selectZone, selectState, selectCity, navigate } = useApp();

  const handleCitySelect = (city: string, state: string, zone: string) => {
    selectZone(zone);
    selectState(state);
    selectCity(city);
    navigate('explore');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      
      {/* Page Title Banner */}
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
          Geographic Directory
        </span>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Explore Hackathons by Location
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl">
          Find student innovation hackathons occurring on campus grounds near your university or across major Indian tech hubs.
        </p>
      </div>

      {/* Main Interactive Zone Explorer */}
      <section>
        <IndiaZoneExplorer />
      </section>

      {/* Popular Cities Grid */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-cyan-400" />
              Popular Student Tech Cities
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Top active hubs for student engineering symposiums and hackathons.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {POPULAR_CITIES.map((item) => {
            const count = hackathons.filter(
              h => h.status === 'APPROVED' && (item.city === 'Online / Remote' ? h.mode === 'Online' : h.city.toLowerCase() === item.city.toLowerCase())
            ).length;

            return (
              <button
                key={item.city}
                onClick={() => handleCitySelect(item.city, item.state, item.zone)}
                className="group flex flex-col items-start rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-left transition-all hover:border-cyan-500/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-cyan-950/30"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                    {item.zone}
                  </span>
                  <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                    {count} Events
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.city}
                </h3>
                <span className="text-xs text-slate-400 mt-0.5">{item.state}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Complete State Directory */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-xl font-bold text-white">
            Comprehensive India Zones & States Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse all states and union territories organized by geographical zone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(INDIA_LOCATIONS).map(([zone, states]) => (
            <div
              key={zone}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h3 className="font-display text-sm font-bold text-white flex items-center gap-1.5">
                  <Building className="h-4 w-4 text-cyan-400" />
                  {zone}
                </h3>
                <button
                  onClick={() => {
                    selectZone(zone);
                    navigate('explore');
                  }}
                  className="text-xs text-cyan-400 font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2">
                {Object.entries(states).map(([state, cities]) => (
                  <div key={state} className="text-xs">
                    <button
                      onClick={() => {
                        selectZone(zone);
                        selectState(state);
                        navigate('explore');
                      }}
                      className="font-bold text-slate-200 hover:text-cyan-300 text-left block"
                    >
                      {state}
                    </button>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {cities.slice(0, 4).join(', ')}{cities.length > 4 ? ` +${cities.length - 4}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
