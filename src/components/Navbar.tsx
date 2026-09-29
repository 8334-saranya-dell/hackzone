import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  MapPin, 
  Bookmark, 
  PlusCircle, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut,
  ChevronDown,
  Bot
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { 
    currentRoute, 
    navigate, 
    currentUser, 
    savedIds, 
    logout, 
    setUserRole,
    hackathons
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const pendingCount = hackathons.filter(h => h.status === 'PENDING').length;

  const handleNav = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg py-1"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20 font-black text-lg">
              HZ
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                HackZone
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNav('home')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              currentRoute === 'home'
                ? 'text-cyan-400 bg-slate-900 font-semibold'
                : 'hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('explore')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentRoute === 'explore'
                ? 'text-cyan-400 bg-slate-900 font-semibold'
                : 'hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Compass className="h-4 w-4" />
            Explore
          </button>

          <button
            onClick={() => handleNav('locations')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentRoute === 'locations'
                ? 'text-cyan-400 bg-slate-900 font-semibold'
                : 'hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <MapPin className="h-4 w-4" />
            Locations
          </button>

          <button
            onClick={() => handleNav('saved')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentRoute === 'saved'
                ? 'text-cyan-400 bg-slate-900 font-semibold'
                : 'hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            Saved
            {savedIds.length > 0 && (
              <span className="ml-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-cyan-500/20 px-1 text-[11px] font-bold text-cyan-300">
                {savedIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNav('add-hackathon')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentRoute === 'add-hackathon'
                ? 'text-cyan-400 bg-slate-900 font-semibold'
                : 'hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            Add Hackathon
          </button>

          {currentUser?.role === 'ADMIN' && (
            <button
              onClick={() => handleNav('admin')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 text-amber-300 ${
                currentRoute === 'admin'
                  ? 'bg-amber-500/10 font-semibold'
                  : 'hover:bg-amber-500/10'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
              {pendingCount > 0 && (
                <span className="ml-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-slate-950">
                  {pendingCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-hackzone-chat'))}
            className="ml-1 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/40 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm"
            title="Chat with n8n AI Agent"
          >
            <Bot className="h-3.5 w-3.5 text-cyan-400" />
            <span>AI Chat</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </nav>

        {/* Zone 3: Primary Actions & User Status */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              {/* Quick Role Switcher for seamless demo testing */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 transition-colors"
                  title="Switch Role for Demo Testing"
                >
                  <span className={`h-2 w-2 rounded-full ${
                    currentUser.role === 'ADMIN' ? 'bg-amber-400' : currentUser.role === 'ORGANIZER' ? 'bg-purple-400' : 'bg-cyan-400'
                  }`} />
                  <span className="font-semibold text-white">{currentUser.role}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-xl shadow-black/50 z-50">
                    <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Switch Role (Demo)
                    </div>
                    {(['STUDENT', 'ORGANIZER', 'ADMIN'] as UserRole[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setUserRole(role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          currentUser.role === role ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {role === 'STUDENT' && '🎓 Student'}
                        {role === 'ORGANIZER' && '🎪 Organizer'}
                        {role === 'ADMIN' && '🛡️ Admin (Verify Events)'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNav('dashboard')}
                className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-cyan-500/40 hover:text-white transition-colors"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <span>Dashboard</span>
              </button>

              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('login')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => handleNav('register')}
                className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-lg shadow-sm shadow-cyan-500/25 transition-all"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <div className="flex md:hidden items-center gap-2">
          {currentUser && (
            <button
              onClick={() => handleNav('dashboard')}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold"
            >
              {currentUser.name.charAt(0)}
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => handleNav('home')}
              className={`p-2.5 rounded-lg text-sm font-medium text-left ${
                currentRoute === 'home' ? 'bg-slate-900 text-cyan-400' : 'text-slate-300'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('explore')}
              className={`p-2.5 rounded-lg text-sm font-medium text-left ${
                currentRoute === 'explore' ? 'bg-slate-900 text-cyan-400' : 'text-slate-300'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => handleNav('locations')}
              className={`p-2.5 rounded-lg text-sm font-medium text-left ${
                currentRoute === 'locations' ? 'bg-slate-900 text-cyan-400' : 'text-slate-300'
              }`}
            >
              Locations
            </button>
            <button
              onClick={() => handleNav('saved')}
              className={`p-2.5 rounded-lg text-sm font-medium text-left flex items-center justify-between ${
                currentRoute === 'saved' ? 'bg-slate-900 text-cyan-400' : 'text-slate-300'
              }`}
            >
              <span>Saved</span>
              {savedIds.length > 0 && (
                <span className="rounded-full bg-cyan-500/20 px-1.5 py-0.5 text-xs font-bold text-cyan-300">
                  {savedIds.length}
                </span>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent('open-hackzone-chat'));
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 to-blue-950/60 text-sm font-semibold text-cyan-300 shadow-sm"
            >
              <Bot className="h-4 w-4 text-cyan-400" />
              <span>AI Assistant (n8n)</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              onClick={() => handleNav('add-hackathon')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-sm font-semibold text-cyan-300"
            >
              <PlusCircle className="h-4 w-4" />
              Add Hackathon
            </button>

            {currentUser ? (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between rounded-lg bg-slate-900 p-2.5">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-white">{currentUser.name}</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300 font-mono">
                      {currentUser.role}
                    </span>
                  </div>
                  <button
                    onClick={() => handleNav('dashboard')}
                    className="text-xs font-semibold text-cyan-400"
                  >
                    View
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  {(['STUDENT', 'ORGANIZER', 'ADMIN'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setUserRole(r)}
                      className={`py-1 text-center rounded text-[11px] font-medium ${
                        currentUser.role === r ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                {currentUser.role === 'ADMIN' && (
                  <button
                    onClick={() => handleNav('admin')}
                    className="w-full py-2 rounded-lg bg-amber-500/10 text-amber-300 text-xs font-semibold"
                  >
                    Admin Console ({pendingCount} pending)
                  </button>
                )}

                <button
                  onClick={logout}
                  className="w-full py-2 text-center text-xs font-medium text-rose-400 hover:text-rose-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleNav('login')}
                  className="py-2.5 text-center rounded-lg border border-slate-800 bg-slate-900 text-sm font-semibold text-white"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="py-2.5 text-center rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-sm font-semibold text-slate-950"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
