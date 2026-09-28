import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          
          {/* Brand Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 font-bold text-slate-950 text-sm">
                HZ
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                HackZone
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              Discover. Build. Compete. The location-first student hackathon discovery platform.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400">
            <button onClick={() => navigate('home')} className="hover:text-cyan-400 transition-colors">
              Home
            </button>
            <button onClick={() => navigate('explore')} className="hover:text-cyan-400 transition-colors">
              Explore
            </button>
            <button onClick={() => navigate('locations')} className="hover:text-cyan-400 transition-colors">
              Locations
            </button>
            <button onClick={() => navigate('add-hackathon')} className="hover:text-cyan-400 transition-colors">
              Add Hackathon
            </button>
            <button onClick={() => navigate('dashboard')} className="hover:text-cyan-400 transition-colors">
              Student Dashboard
            </button>
            <span className="text-slate-600">·</span>
            <span className="hover:text-slate-200 cursor-pointer">About</span>
            <span className="hover:text-slate-200 cursor-pointer">Contact</span>
            <span className="hover:text-slate-200 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-200 cursor-pointer">Terms</span>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            Built with modern student engineering standards. Data for demonstration and discovery purposes.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted for student innovators in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
