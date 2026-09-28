import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ZONES, TECHNOLOGIES_LIST, getStatesForZone, getCitiesForState } from '../data/locations';
import { Zone, HackathonMode, Eligibility } from '../types';
import { PlusCircle, Sparkles, CheckCircle, ArrowLeft } from 'lucide-react';

export const AddHackathonView: React.FC = () => {
  const { addNewHackathon, navigate, currentUser } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    organizer: currentUser?.college ? `${currentUser.name} (${currentUser.college})` : '',
    description: '',
    zone: 'South India' as Zone,
    state: 'Andhra Pradesh',
    city: 'Visakhapatnam',
    venue: '',
    startDate: '2026-11-15',
    endDate: '2026-11-17',
    registrationDeadline: '2026-11-05',
    mode: 'Offline' as HackathonMode,
    eligibility: 'College Students' as Eligibility,
    teamSize: '2 - 4 Members',
    prizePool: '₹1,00,000',
    prizePoolAmount: 100000,
    technologies: ['AI/ML', 'Web Development'] as string[],
    registrationUrl: 'https://unstop.com',
    contactEmail: currentUser?.email || 'organizer@hackzone.dev',
    imageUrl: '/src/assets/images/hackathon_ai_banner_1790597121036.jpg',
  });

  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const availableStates = getStatesForZone(formData.zone);
  const availableCities = getCitiesForState(formData.zone, formData.state);

  const handleZoneChange = (zone: Zone) => {
    const states = getStatesForZone(zone);
    const newState = states[0] || '';
    const cities = getCitiesForState(zone, newState);
    setFormData(prev => ({
      ...prev,
      zone,
      state: newState,
      city: cities[0] || ''
    }));
  };

  const handleStateChange = (state: string) => {
    const cities = getCitiesForState(formData.zone, state);
    setFormData(prev => ({
      ...prev,
      state,
      city: cities[0] || ''
    }));
  };

  const toggleTechnology = (tech: string) => {
    setFormData(prev => {
      const exists = prev.technologies.includes(tech);
      return {
        ...prev,
        technologies: exists
          ? prev.technologies.filter(t => t !== tech)
          : [...prev.technologies, tech]
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.organizer || !formData.venue || !formData.description) {
      alert('Please fill all mandatory fields.');
      return;
    }

    const createdId = addNewHackathon({
      ...formData,
      location: formData.mode === 'Online' ? 'Online / Remote' : `${formData.city}, ${formData.state}`,
      problemStatements: [
        'Open challenge track for student innovators',
        'Scalable digital solutions for community and campus life'
      ],
      rules: [
        'Must be original work developed during the hackathon sprint',
        'All college/school teams must adhere to code of conduct'
      ],
      schedule: [
        { phase: 'Opening & Team Check-in', time: 'Day 1 - 09:00 AM', description: 'Briefing and API credentials unlocking' },
        { phase: 'Mentoring Sessions', time: 'Day 1 - 04:00 PM', description: 'Expert engineering check-in' },
        { phase: 'Final Demo & Pitching', time: 'Day 2 - 02:00 PM', description: 'Judges panel review and award announcement' }
      ]
    });

    setSubmittedId(createdId);
  };

  if (submittedId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-400 mb-6">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
          Hackathon Submitted Successfully!
        </h2>
        <p className="mt-3 text-sm text-slate-300 leading-relaxed">
          Your hackathon <strong className="text-white">"{formData.name}"</strong> has been received with status <span className="inline-block rounded bg-amber-500/20 px-2 py-0.5 font-mono text-xs font-bold text-amber-300">PENDING</span>.
          It will appear publicly in discovery results immediately after verification by the HackZone admin team.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate('admin')}
            className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-5 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20"
          >
            Go to Admin Dashboard to Review / Approve
          </button>
          <button
            onClick={() => {
              setSubmittedId(null);
              navigate('explore');
            }}
            className="rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Explore Other Hackathons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Add a Hackathon
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Publish your college fest, campus coding sprint, or national hackathon to reach thousands of student builders.
          </p>
        </div>

        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
          <PlusCircle className="h-6 w-6" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info Section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Hackathon Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vizag DevSummit 2026"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Organizer / College Club *
              </label>
              <input
                type="text"
                required
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                placeholder="e.g. AU Tech Society & GDG"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a concise summary of the hackathon theme, target participants, and challenges..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Location & Mode Section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            2. Location & Mode
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Mode *
              </label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value as HackathonMode })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="Offline">Offline</option>
                <option value="Online">Online</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Zone *
              </label>
              <select
                value={formData.zone}
                onChange={(e) => handleZoneChange(e.target.value as Zone)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                {ZONES.map(z => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                State *
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                {availableStates.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                City *
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                {availableCities.map(ct => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Venue / Campus Building *
              </label>
              <input
                type="text"
                required
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g. University Main Auditorium, Beach Road"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Dates & Timeline */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            3. Dates & Deadlines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                End Date *
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Registration Deadline *
              </label>
              <input
                type="date"
                required
                value={formData.registrationDeadline}
                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Eligibility, Prizes & Tech */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            4. Details, Prizes & Tracks
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Eligibility
              </label>
              <select
                value={formData.eligibility}
                onChange={(e) => setFormData({ ...formData, eligibility: e.target.value as Eligibility })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="College Students">College Students</option>
                <option value="School Students">School Students</option>
                <option value="Graduates">Graduates</option>
                <option value="Open to All">Open to All</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Team Size
              </label>
              <input
                type="text"
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                placeholder="e.g. 2 - 4 Members"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Prize Pool
              </label>
              <input
                type="text"
                value={formData.prizePool}
                onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                placeholder="e.g. ₹1,00,000"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Select Technologies (Click to toggle)
            </label>
            <div className="flex flex-wrap gap-2">
              {TECHNOLOGIES_LIST.map((t) => {
                const isSelected = formData.technologies.includes(t);
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => toggleTechnology(t)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Official Registration URL *
              </label>
              <input
                type="url"
                required
                value={formData.registrationUrl}
                onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
                placeholder="https://devfolio.co or Google Form"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Contact Email *
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="organizer@university.edu"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-3 text-xs sm:text-sm font-bold text-slate-950 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Submit Hackathon for Verification</span>
          </button>
        </div>

      </form>
    </div>
  );
};
