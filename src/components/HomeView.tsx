import React from 'react';
import { useApp } from '../context/AppContext';
import { SearchBar } from './SearchBar';
import { IndiaZoneExplorer } from './IndiaZoneExplorer';
import { HackathonCard } from './HackathonCard';
import { HowItWorks } from './HowItWorks';
import { POPULAR_CITIES, TECHNOLOGIES_LIST } from '../data/locations';
import { getDeadlineStatus } from '../utils/dateUtils';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Compass, 
  Trophy, 
  PlusCircle, 
  ArrowRight,
  Code,
  ShieldAlert,
  Flame
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    hackathons, 
    navigate, 
    updateFilter, 
    selectZone, 
    selectState, 
    selectCity,
    currentUser 
  } = useApp();

  const approvedHackathons = hackathons.filter(h => h.status === 'APPROVED');

  // Featured / Upcoming hackathons
  const upcomingHackathons = [...approvedHackathons]
    .filter(h => h.featured || h.prizePoolAmount >= 150000)
    .slice(0, 3);

  // Hackathons Near You (Visakhapatnam / Andhra Pradesh / South India)
  const userCity = currentUser?.city || 'Visakhapatnam';
  const nearYouHackathons = approvedHackathons
    .filter(h => h.city.toLowerCase() === userCity.toLowerCase() || h.state === 'Andhra Pradesh')
    .slice(0, 3);

  // Closing Soon Hackathons (deadline <= 5 days remaining)
  const closingSoonHackathons = approvedHackathons
    .filter(h => {
      const { status } = getDeadlineStatus(h.registrationDeadline);
      return status === 'CLOSING_SOON';
    })
    .slice(0, 3);

  const handleCityClick = (city: string, state: string, zone: string) => {
    selectZone(zone);
    selectState(state);
    selectCity(city);
    navigate('explore');
  };

  const handleTechClick = (tech: string) => {
    updateFilter('technology', tech);
    navigate('explore');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-900">
        
        {/* Subtle Ambient Background Gradients */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-indigo-600/10 blur-[130px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Subtle Tagline */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-md mb-6">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>India's Dedicated Student Hackathon Finder</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Find Your Next <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Hackathon 🚀
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover hackathons near you. Search by location, technology, date and eligibility.
          </p>

          {/* Search Bar & Action Buttons */}
          <div className="mt-8">
            <SearchBar />
          </div>

          {/* Trust Banner / Metrics Adjacency */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-900 pt-8 text-left">
            <div>
              <span className="font-display text-2xl font-bold text-white tabular-nums">28+</span>
              <p className="text-xs text-slate-400 mt-0.5">Verified Sample Events</p>
            </div>
            <div>
              <span className="font-display text-2xl font-bold text-cyan-400 tabular-nums">7</span>
              <p className="text-xs text-slate-400 mt-0.5">India Geographic Zones</p>
            </div>
            <div>
              <span className="font-display text-2xl font-bold text-amber-300 tabular-nums">₹25L+</span>
              <p className="text-xs text-slate-400 mt-0.5">Total Prize Pool</p>
            </div>
            <div>
              <span className="font-display text-2xl font-bold text-emerald-400 tabular-nums">3 Clicks</span>
              <p className="text-xs text-slate-400 mt-0.5">Location Discovery</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. EXPLORE BY ZONE (INDIA ZONE EXPLORER) - The Core USP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <IndiaZoneExplorer />
      </section>

      {/* 4. POPULAR CITIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Direct City Access
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              Popular Student Tech Hubs
            </h2>
            <p className="text-xs text-slate-400">
              One-tap filter to active university hubs in Andhra Pradesh, Telangana, Karnataka, and beyond.
            </p>
          </div>
          <button
            onClick={() => navigate('locations')}
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 self-start sm:self-auto"
          >
            <span>View All Locations</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {POPULAR_CITIES.map((c) => {
            const count = approvedHackathons.filter(
              h => c.city === 'Online / Remote' ? h.mode === 'Online' : h.city.toLowerCase() === c.city.toLowerCase()
            ).length;

            return (
              <button
                key={c.city}
                onClick={() => handleCityClick(c.city, c.state, c.zone)}
                className="group flex flex-col items-start rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-all hover:border-cyan-500/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-cyan-950/20"
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-cyan-400">
                    {c.zone}
                  </span>
                  <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-300 font-bold">
                    {count} {count === 1 ? 'event' : 'events'}
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {c.city}
                </h3>
                <span className="text-xs text-slate-400">{c.state}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. UPCOMING HACKATHONS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Featured Highlights
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              Upcoming Premier Hackathons
            </h2>
            <p className="text-xs text-slate-400">
              National hackathons with major prize pools, industry mentorship, and fast-track hiring opportunities.
            </p>
          </div>
          <button
            onClick={() => navigate('explore')}
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 self-start sm:self-auto"
          >
            <span>View All ({approvedHackathons.length})</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingHackathons.map((h) => (
            <HackathonCard key={h.id} hackathon={h} />
          ))}
        </div>
      </section>

      {/* 6. HACKATHONS NEAR YOU (VISAKHAPATNAM / ANDHRA PRADESH) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Personalized Location Match
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold text-white">
                Hackathons Near {userCity} & Andhra Pradesh
              </h2>
              <p className="text-xs text-slate-400">
                Local campus competitions you can travel to conveniently without cross-country travel costs.
              </p>
            </div>
            <button
              onClick={() => {
                selectZone('South India');
                selectState('Andhra Pradesh');
                navigate('explore');
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 self-start sm:self-auto"
            >
              <span>See all AP Events</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearYouHackathons.map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. POPULAR TECHNOLOGIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Domain Tracks
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Discover by Technology Track
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Filter competitions focusing on your engineering stack.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto">
          {TECHNOLOGIES_LIST.map((tech) => {
            const count = approvedHackathons.filter(h => h.technologies.includes(tech)).length;
            return (
              <button
                key={tech}
                onClick={() => handleTechClick(tech)}
                className="group flex items-center gap-2.5 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-cyan-500/50 hover:bg-slate-900 hover:text-cyan-300 transition-all"
              >
                <span>{tech}</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 8. CLOSING SOON */}
      {closingSoonHackathons.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-amber-500/30 bg-amber-950/20 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5" />
                  Urgent Countdown
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold text-white">
                  Registration Closing Soon ⏰
                </h2>
                <p className="text-xs text-amber-200/80">
                  Deadlines occurring in the next 5 days. Form your team and submit before tickets close!
                </p>
              </div>
              <button
                onClick={() => {
                  updateFilter('dateRange', 'This Week');
                  navigate('explore');
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 self-start sm:self-auto"
              >
                <span>View All Urgent</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {closingSoonHackathons.map((h) => (
                <HackathonCard key={h.id} hackathon={h} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. HOW IT WORKS */}
      <HowItWorks />

      {/* 10. ADD HACKATHON CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/60 to-blue-950/50 p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-8 shadow-2xl">
          
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              For College Clubs & Organizers
            </span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hosting a Hackathon on Your Campus?
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              List your tech fest or college sprint on HackZone for free. Reach enthusiastic coders across Andhra Pradesh, Telangana, and all of India.
            </p>
          </div>

          <button
            onClick={() => navigate('add-hackathon')}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 text-sm font-extrabold text-slate-950 hover:from-cyan-300 hover:to-blue-400 shadow-xl shadow-cyan-500/30 transition-all shrink-0"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Submit Your Hackathon</span>
          </button>

        </div>
      </section>

    </div>
  );
};
