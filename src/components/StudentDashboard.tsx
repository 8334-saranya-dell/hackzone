import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HackathonCard } from './HackathonCard';
import { 
  Bookmark, 
  Calendar, 
  Clock, 
  Sparkles, 
  Award, 
  Bell, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { formatSingleDate, getDeadlineStatus } from '../utils/dateUtils';

export const StudentDashboard: React.FC = () => {
  const { 
    currentUser, 
    hackathons, 
    savedIds, 
    registeredIds, 
    openHackathonDetails, 
    navigate,
    toggleSaveHackathon
  } = useApp();

  const [activeTab, setActiveTab] = useState<'saved' | 'deadlines' | 'registered' | 'recommended'>('saved');

  // Filter lists
  const savedHackathons = hackathons.filter(h => savedIds.includes(h.id));
  const registeredHackathons = hackathons.filter(h => registeredIds.includes(h.id));

  // Upcoming deadlines (events with deadlines soonest)
  const deadlineSorted = [...hackathons]
    .filter(h => h.status === 'APPROVED')
    .sort((a, b) => new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime())
    .slice(0, 6);

  // Recommended based on user city/interests
  const recommendedHackathons = hackathons.filter(h => {
    if (h.status !== 'APPROVED') return false;
    const matchesCity = currentUser?.city && h.city.toLowerCase() === currentUser.city.toLowerCase();
    const matchesInterests = currentUser?.interests?.some(i => h.technologies.includes(i));
    return matchesCity || matchesInterests;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* User Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <UserCheck className="h-4 w-4" />
              <span>Student Developer Profile</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Hello, {currentUser?.name || 'Student Builder'} 🚀
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              {currentUser?.college || 'College of Engineering'} · {currentUser?.city || 'Visakhapatnam'}, {currentUser?.state || 'Andhra Pradesh'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('explore')}
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:from-cyan-300 transition-all shadow-md shadow-cyan-500/20"
            >
              Discover Hackathons
            </button>
          </div>
        </div>

        {/* Live Notification Banners */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Registration Closes in 2 Days</span>
              <span className="text-amber-300/80">T-Hub CyberShield & AI Hackathon is ending registrations soon.</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3.5 text-xs text-cyan-200">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-white block">3 New AI Hackathons Near Visakhapatnam</span>
              <span className="text-cyan-300/80">Matching your preferred technologies: AI/ML, Web Development.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-8">
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'saved'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="h-3.5 w-3.5" />
          <span>My Saved Hackathons</span>
          <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px]">
            {savedHackathons.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('deadlines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'deadlines'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Registration Deadlines</span>
        </button>

        <button
          onClick={() => setActiveTab('registered')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'registered'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          <span>My Participations</span>
          <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px]">
            {registeredHackathons.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('recommended')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'recommended'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Recommended For You</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'saved' && (
        <div>
          {savedHackathons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedHackathons.map((h) => (
                <HackathonCard key={h.id} hackathon={h} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center bg-slate-900/20">
              <Bookmark className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <h3 className="text-sm font-bold text-white">No saved hackathons yet</h3>
              <p className="mt-1 text-xs text-slate-400">
                Click the heart or save button on any hackathon card to pin it here.
              </p>
              <button
                onClick={() => navigate('explore')}
                className="mt-4 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
              >
                Browse Hackathons
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'deadlines' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 mb-4">
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-1">
              Upcoming Deadlines Countdown
            </h3>
            <p className="text-xs text-slate-400">
              Review critical dates to make sure your team application is locked in on time.
            </p>
          </div>

          <div className="divide-y divide-slate-800/80 rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
            {deadlineSorted.map((h) => {
              const { status, label } = getDeadlineStatus(h.registrationDeadline);
              return (
                <div
                  key={h.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400' :
                        status === 'CLOSING_SOON' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        {label}
                      </span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-slate-400">{h.city}, {h.state}</span>
                    </div>

                    <h4 
                      onClick={() => openHackathonDetails(h.id)}
                      className="font-display text-sm sm:text-base font-bold text-white hover:text-cyan-400 cursor-pointer"
                    >
                      {h.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Deadline: <strong className="text-slate-200">{formatSingleDate(h.registrationDeadline)}</strong> · Event Dates: {h.startDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openHackathonDetails(h.id)}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        if (h.registrationUrl) window.open(h.registrationUrl, '_blank');
                      }}
                      className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-bold text-slate-950 hover:from-cyan-300"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'registered' && (
        <div>
          {registeredHackathons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredHackathons.map((h) => (
                <div key={h.id} className="relative">
                  <div className="absolute top-2 right-2 z-10 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-slate-950 shadow">
                    Registered ✓
                  </div>
                  <HackathonCard hackathon={h} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center bg-slate-900/20">
              <Award className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <h3 className="text-sm font-bold text-white">No registered hackathons</h3>
              <p className="mt-1 text-xs text-slate-400">
                When you click "Register" on a hackathon, it will appear here so you can keep track of your participations!
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'recommended' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-1">
              Handpicked for Your Interests
            </h3>
            <p className="text-xs text-slate-400">
              Based on your location ({currentUser?.city}) and tech stacks ({currentUser?.interests?.join(', ')}).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedHackathons.map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
