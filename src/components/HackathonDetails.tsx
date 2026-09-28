import React from 'react';
import { useApp } from '../context/AppContext';
import { DeadlineBadge } from './DeadlineBadge';
import { formatDateRange, formatSingleDate } from '../utils/dateUtils';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Trophy, 
  Users, 
  Bookmark, 
  ExternalLink, 
  ArrowLeft, 
  Mail, 
  Share2, 
  CheckCircle,
  FileText,
  Clock4,
  Building,
  Sparkles
} from 'lucide-react';

export const HackathonDetails: React.FC = () => {
  const { 
    selectedHackathonId, 
    hackathons, 
    closeHackathonDetails, 
    toggleSaveHackathon, 
    isSaved, 
    registerForHackathon,
    showToast
  } = useApp();

  const hackathon = hackathons.find((h) => h.id === selectedHackathonId);

  if (!hackathon) {
    return (
      <div className="mx-auto max-w-4xl py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-white">Hackathon not found</h2>
        <p className="mt-2 text-slate-400">The event you are looking for does not exist or may have been removed.</p>
        <button
          onClick={closeHackathonDetails}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore
        </button>
      </div>
    );
  }

  const saved = isSaved(hackathon.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied!', 'Hackathon details link copied to clipboard', 'info');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-200">
      
      {/* Navigation & Action Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={closeHackathonDetails}
          className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Explore</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </button>

          <button
            onClick={() => toggleSaveHackathon(hackathon.id)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
              saved
                ? 'border-rose-500/40 bg-rose-500/15 text-rose-300'
                : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${saved ? 'fill-current' : ''}`} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Hackathon Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
          <img
            src={hackathon.imageUrl}
            alt={hackathon.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover opacity-60 transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              // Fallback styling
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          
          {/* Overlaid Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="rounded-lg bg-cyan-500/20 border border-cyan-400/30 px-3 py-1 text-xs font-bold text-cyan-300 backdrop-blur-md">
              {hackathon.mode} Mode
            </span>
            <span className="rounded-lg bg-slate-900/80 border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 backdrop-blur-md">
              {hackathon.zone}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-cyan-400 tracking-wide uppercase">
                Organized by {hackathon.organizer}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {hackathon.name}
            </h1>
          </div>
        </div>

        {/* Floating Quick Action Row */}
        <div className="border-t border-slate-800 bg-slate-900/90 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div>
              <span className="text-[11px] text-slate-500 block uppercase font-bold">Prize Pool</span>
              <span className="font-display text-lg font-bold text-amber-300 flex items-center gap-1.5">
                <Trophy className="h-4 w-4" />
                {hackathon.prizePool}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block uppercase font-bold">Deadline</span>
              <div className="mt-0.5">
                <DeadlineBadge deadline={hackathon.registrationDeadline} />
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block uppercase font-bold">Team Size</span>
              <span className="font-semibold text-white flex items-center gap-1.5 mt-0.5">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                {hackathon.teamSize}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleSaveHackathon(hackathon.id)}
              className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition-all ${
                saved
                  ? 'border-rose-500/50 bg-rose-500/10 text-rose-300'
                  : 'border-slate-700 bg-slate-800 text-slate-200 hover:text-white hover:border-slate-600'
              }`}
            >
              <Bookmark className={`inline-block mr-1.5 h-3.5 w-3.5 ${saved ? 'fill-current' : ''}`} />
              {saved ? 'Saved' : '♡ Save Hackathon'}
            </button>

            <button
              onClick={() => registerForHackathon(hackathon.id)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-2.5 text-xs sm:text-sm font-extrabold text-slate-950 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/25 transition-all transform active:scale-98"
            >
              <span>🚀 REGISTER NOW</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Content: Left Details & Right Sidebar */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Problem Statement, Description, Rules, Schedule */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Section */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="font-display text-lg font-bold text-white mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-400" />
              About This Hackathon
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {hackathon.description}
            </p>

            <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-400 self-center mr-1">Technologies:</span>
              {hackathon.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-slate-700/80 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-cyan-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Problem Statements */}
          {hackathon.problemStatements && hackathon.problemStatements.length > 0 && (
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-400" />
                Problem Statements & Tracks
              </h3>
              <div className="space-y-3">
                {hackathon.problemStatements.map((ps, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-4"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-xs font-bold text-cyan-300">
                      {idx + 1}
                    </span>
                    <p className="text-sm font-medium text-slate-200 leading-relaxed">
                      {ps}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Schedule */}
          {hackathon.schedule && hackathon.schedule.length > 0 && (
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock4 className="h-5 w-5 text-cyan-400" />
                Event Schedule & Phases
              </h3>
              <div className="relative border-l border-slate-800 ml-3 space-y-6 pl-6 py-2">
                {hackathon.schedule.map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-cyan-400 ring-2 ring-cyan-500/30" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-400 font-mono">{item.time}</span>
                      <span className="text-slate-600">·</span>
                      <h4 className="text-sm font-bold text-white">{item.phase}</h4>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Rules & Guidelines */}
          {hackathon.rules && hackathon.rules.length > 0 && (
            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="font-display text-lg font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                Rules & Eligibility Guidelines
              </h3>
              <ul className="space-y-2.5">
                {hackathon.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

        </div>

        {/* Right Column: Location, Dates, Contact, Sticky Register Box */}
        <div className="space-y-6">
          
          {/* Key Dates Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-cyan-400" />
              Event Timeline
            </h4>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">Hackathon Dates</span>
                <span className="font-semibold text-white">
                  {formatDateRange(hackathon.startDate, hackathon.endDate)}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">Registration Closes</span>
                <span className="font-semibold text-white">
                  {formatSingleDate(hackathon.registrationDeadline)}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">Mode</span>
                <span className="font-semibold text-cyan-400">{hackathon.mode}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Eligibility</span>
                <span className="font-semibold text-white">{hackathon.eligibility}</span>
              </div>
            </div>
          </div>

          {/* Venue & Location Map Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Building className="h-4 w-4 text-cyan-400" />
              Venue & Location
            </h4>
            
            <p className="text-sm font-semibold text-white mb-1">
              {hackathon.venue}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-4">
              <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              {hackathon.location}
            </p>

            {/* Stylized Map Viewport */}
            <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 text-center overflow-hidden">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-white">{hackathon.city}, {hackathon.state}</span>
                <span className="text-[11px] text-slate-400">{hackathon.zone}</span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hackathon.venue} ${hackathon.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block w-full rounded-lg bg-slate-900 py-1.5 text-center text-xs font-semibold text-cyan-400 hover:bg-slate-800 transition-colors"
              >
                Open in Google Maps ↗
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4 text-cyan-400" />
              Organizer Contact
            </h4>
            <p className="text-xs text-slate-300">
              Have questions regarding registration, mentorship, or hardware?
            </p>
            <a
              href={`mailto:${hackathon.contactEmail}`}
              className="mt-3 flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:underline"
            >
              <Mail className="h-3.5 w-3.5" />
              {hackathon.contactEmail}
            </a>
          </div>

          {/* Large Sticky CTA box */}
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/40 to-slate-900/90 p-6 text-center shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 block mb-1">
              Ready to build?
            </span>
            <h4 className="font-display text-lg font-bold text-white mb-2">
              Register Before Deadline
            </h4>
            <div className="mb-4">
              <DeadlineBadge deadline={hackathon.registrationDeadline} />
            </div>
            <button
              onClick={() => registerForHackathon(hackathon.id)}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-sm font-black text-slate-950 hover:from-cyan-300 hover:to-blue-400 shadow-md shadow-cyan-500/30 transition-all"
            >
              🚀 REGISTER NOW
            </button>
            <p className="mt-2 text-[11px] text-slate-400">
              Opens the official portal on Devfolio / Unstop / Organizers.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
