import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HackathonStatus } from '../types';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Trash2, 
  Eye, 
  Users, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { formatDateRange, formatSingleDate } from '../utils/dateUtils';

export const AdminDashboard: React.FC = () => {
  const { 
    hackathons, 
    updateHackathonStatus, 
    deleteHackathon, 
    openHackathonDetails, 
    currentUser,
    setUserRole,
    navigate
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'users'>('pending');
  const [searchFilter, setSearchFilter] = useState('');

  const pendingList = hackathons.filter(h => h.status === 'PENDING');
  const approvedList = hackathons.filter(h => h.status === 'APPROVED');
  const rejectedList = hackathons.filter(h => h.status === 'REJECTED');

  const filteredHackathons = (
    activeTab === 'pending' ? pendingList :
    activeTab === 'approved' ? approvedList :
    rejectedList
  ).filter(h => 
    h.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    h.organizer.toLowerCase().includes(searchFilter.toLowerCase()) ||
    h.city.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Sample registered users list for admin overview
  const sampleUsers = [
    { id: 'usr-1', name: 'Sai Saranya', email: 'saisaranya@student.edu', role: 'STUDENT', college: 'AU College of Engineering', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
    { id: 'usr-2', name: 'Rahul Sharma', email: 'rahul.s@iitd.ac.in', role: 'STUDENT', college: 'IIT Delhi', city: 'New Delhi', state: 'Delhi NCR' },
    { id: 'usr-3', name: 'Ananya Rao', email: 'ananya@t-hub.co', role: 'ORGANIZER', college: 'T-Hub Lead', city: 'Hyderabad', state: 'Telangana' },
    { id: 'usr-4', name: 'Karthik Raja', email: 'karthik@shaastra.org', role: 'ORGANIZER', college: 'IIT Madras', city: 'Chennai', state: 'Tamil Nadu' },
    { id: 'usr-5', name: 'Admin Root', email: 'admin@hackzone.dev', role: 'ADMIN', college: 'HackZone Core', city: 'Bengaluru', state: 'Karnataka' },
  ];

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="mx-auto max-w-xl py-20 px-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 mb-4">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-white">Admin Privileges Required</h2>
        <p className="mt-2 text-sm text-slate-400">
          You are currently signed in with the role <strong className="text-cyan-400 font-mono">{currentUser?.role || 'GUEST'}</strong>.
        </p>
        <button
          onClick={() => setUserRole('ADMIN')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md transition-all"
        >
          <ShieldCheck className="h-4 w-4" />
          Switch to Admin Role (Demo Mode)
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Admin Console</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Hackathon Verification & Moderation
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Review submissions, approve student events for public discovery, or manage platform users.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center">
            <span className="block font-display text-lg font-bold text-amber-300">
              {pendingList.length}
            </span>
            <span className="text-[10px] font-semibold text-amber-400 uppercase">
              Pending
            </span>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-center">
            <span className="block font-display text-lg font-bold text-emerald-300">
              {approvedList.length}
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 uppercase">
              Approved
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-center">
            <span className="block font-display text-lg font-bold text-white">
              {sampleUsers.length}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">
              Users
            </span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 md:border-b-0 md:pb-0">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pending'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Pending Submissions</span>
            <span className="ml-1 rounded-full bg-amber-500/30 px-1.5 py-0.2 text-[10px]">
              {pendingList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'approved'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Check className="h-3.5 w-3.5" />
            <span>Approved Events</span>
            <span className="ml-1 rounded-full bg-emerald-500/30 px-1.5 py-0.2 text-[10px]">
              {approvedList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rejected'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <X className="h-3.5 w-3.5" />
            <span>Rejected</span>
            <span className="ml-1 rounded-full bg-rose-500/30 px-1.5 py-0.2 text-[10px]">
              {rejectedList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Registered Users</span>
          </button>
        </div>

        {activeTab !== 'users' && (
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by title, organizer, city..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === 'users' ? (
        /* Users Table */
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">College / Organization</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {sampleUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-bold text-white block">{u.name}</span>
                    <span className="text-[11px] text-slate-400">{u.email}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                      u.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-300' :
                      u.role === 'ORGANIZER' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{u.college}</td>
                  <td className="px-5 py-4 text-slate-400">{u.city}, {u.state}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => navigate('explore')}
                      className="text-xs font-semibold text-cyan-400 hover:underline"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Hackathons List */
        <div className="space-y-4">
          {filteredHackathons.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center bg-slate-950/30">
              <ShieldCheck className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <h3 className="text-sm font-bold text-white">No {activeTab} hackathons found</h3>
              <p className="text-xs text-slate-400 mt-1">
                {activeTab === 'pending'
                  ? 'All submitted hackathons have been reviewed!'
                  : 'No entries match your search criteria.'}
              </p>
            </div>
          ) : (
            filteredHackathons.map((h) => (
              <div
                key={h.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-colors hover:border-slate-700"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                      h.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      h.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {h.status}
                    </span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-400 font-semibold">{h.zone}</span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-cyan-400">{h.mode}</span>
                  </div>

                  <h3 className="font-display text-base font-bold text-white line-clamp-1">
                    {h.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {h.description}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span>Organizer: <strong className="text-slate-300">{h.organizer}</strong></span>
                    <span>Location: <strong className="text-slate-300">{h.city}, {h.state}</strong></span>
                    <span>Deadline: <strong className="text-slate-300">{formatSingleDate(h.registrationDeadline)}</strong></span>
                    <span>Prize: <strong className="text-amber-300 font-bold">{h.prizePool}</strong></span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 border-t border-slate-800 pt-3 lg:border-t-0 lg:pt-0">
                  <button
                    onClick={() => openHackathonDetails(h.id)}
                    className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                  >
                    <Eye className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Preview</span>
                  </button>

                  {h.status !== 'APPROVED' && (
                    <button
                      onClick={() => updateHackathonStatus(h.id, 'APPROVED')}
                      className="flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-sm"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {h.status !== 'REJECTED' && (
                    <button
                      onClick={() => updateHackathonStatus(h.id, 'REJECTED')}
                      className="flex items-center gap-1 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  )}

                  <button
                    onClick={() => deleteHackathon(h.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
