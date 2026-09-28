import React from 'react';
import { Hackathon } from '../types';
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
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface HackathonCardProps {
  hackathon: Hackathon;
}

export const HackathonCard: React.FC<HackathonCardProps> = ({ hackathon }) => {
  const { 
    openHackathonDetails, 
    toggleSaveHackathon, 
    isSaved, 
    registerForHackathon,
    updateFilter 
  } = useApp();

  const saved = isSaved(hackathon.id);

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'Online':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
      case 'Hybrid':
        return 'text-purple-400 bg-purple-950/60 border-purple-800/60';
      default:
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-cyan-950/20">
      
      {/* Top Bar: Mode, Status, & Save Button */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${getModeColor(hackathon.mode)}`}>
              {hackathon.mode}
            </span>
            {hackathon.featured && (
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                <Sparkles className="h-3 w-3" /> Featured
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveHackathon(hackathon.id);
            }}
            className={`p-2 rounded-xl border transition-all ${
              saved
                ? 'border-rose-500/50 bg-rose-500/15 text-rose-400 shadow-sm shadow-rose-500/20'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
            aria-label={saved ? 'Remove from saved' : 'Save hackathon'}
            title={saved ? 'Saved' : 'Save'}
          >
            <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title & Organizer */}
        <div className="mb-3">
          <h3 
            onClick={() => openHackathonDetails(hackathon.id)}
            className="font-display text-lg font-bold text-white transition-colors hover:text-cyan-400 cursor-pointer line-clamp-2"
          >
            {hackathon.name}
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-400 line-clamp-1">
            by {hackathon.organizer}
          </p>
        </div>

        {/* Meta Grid */}
        <div className="space-y-1.5 mb-4 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{hackathon.location}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span>{formatDateRange(hackathon.startDate, hackathon.endDate)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <DeadlineBadge deadline={hackathon.registrationDeadline} />
          </div>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hackathon.technologies.slice(0, 3).map((tech) => (
            <button
              key={tech}
              onClick={(e) => {
                e.stopPropagation();
                updateFilter('technology', tech);
              }}
              className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-cyan-300 transition-colors"
            >
              {tech}
            </button>
          ))}
          {hackathon.technologies.length > 3 && (
            <span className="text-[11px] text-slate-500 self-center">
              +{hackathon.technologies.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Segment: Prize, Eligibility & Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Prize Pool</span>
            <span className="font-display font-bold text-amber-300 text-sm flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" />
              {hackathon.prizePool}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Eligibility</span>
            <span className="font-medium text-slate-200 flex items-center justify-end gap-1">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              {hackathon.eligibility}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => openHackathonDetails(hackathon.id)}
            className="flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            <span>View Details</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => registerForHackathon(hackathon.id)}
            className="flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 shadow-sm shadow-cyan-500/20 transition-all"
          >
            <span>Register</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
