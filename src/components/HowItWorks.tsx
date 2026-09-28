import React from 'react';
import { MapPin, Compass, Rocket } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
          Streamlined Process
        </span>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          How HackZone Works
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
          Stop hopping across endless messaging channels. Discover and enter university hackathons in three straightforward steps.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="relative rounded-3xl border border-slate-800 bg-slate-900/40 p-8 text-left backdrop-blur-sm transition-all hover:border-slate-700 hover:bg-slate-900/70">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 mb-6">
              <MapPin className="h-7 w-7" />
            </div>
            <div className="text-xs font-bold font-mono text-cyan-400 mb-1">
              01 — CHOOSE LOCATION
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              Select Zone, State or City
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Drill down by region across India or toggle virtual remote hackathons to find events close to your campus or anywhere in India.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-3xl border border-slate-800 bg-slate-900/40 p-8 text-left backdrop-blur-sm transition-all hover:border-slate-700 hover:bg-slate-900/70">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 mb-6">
              <Compass className="h-7 w-7" />
            </div>
            <div className="text-xs font-bold font-mono text-blue-400 mb-1">
              02 — DISCOVER
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              Explore Matching Hackathons
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Filter by technology tracks like AI/ML, Web3, IoT, prize pools, registration deadlines, and student team size requirements.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-3xl border border-slate-800 bg-slate-900/40 p-8 text-left backdrop-blur-sm transition-all hover:border-slate-700 hover:bg-slate-900/70">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-6">
              <Rocket className="h-7 w-7" />
            </div>
            <div className="text-xs font-bold font-mono text-emerald-400 mb-1">
              03 — PARTICIPATE
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              Open Event & Register
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Review full problem statements, rules, schedule, save to your dashboard, and register directly on official portals in one tap.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
