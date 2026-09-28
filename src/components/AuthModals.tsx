import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TECHNOLOGIES_LIST, INDIA_LOCATIONS } from '../data/locations';
import { User, UserRole, Zone } from '../types';
import { Lock, Mail, User as UserIcon, Building, MapPin, Sparkles, ArrowRight } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, navigate } = useApp();
  const [email, setEmail] = useState('saisaranya@student.edu');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<UserRole>('STUDENT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    navigate('dashboard');
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 font-bold text-slate-950 text-base mb-3 shadow-lg shadow-cyan-500/20">
            HZ
          </div>
          <h2 className="font-display text-2xl font-bold text-white">Student Sign In</h2>
          <p className="mt-1 text-xs text-slate-400">
            Access your saved hackathons, participations, and track deadlines.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@student.college.edu"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Role for Demo Session
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['STUDENT', 'ORGANIZER', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    role === r
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-xs sm:text-sm font-bold text-slate-950 hover:from-cyan-300 hover:to-blue-400 shadow-md shadow-cyan-500/25 transition-all"
          >
            Sign In to Dashboard
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          New to HackZone?{' '}
          <button
            onClick={() => navigate('register')}
            className="font-bold text-cyan-400 hover:underline"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export const RegisterView: React.FC = () => {
  const { registerUser, navigate } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    preferredZone: 'South India' as Zone,
    interests: ['AI/ML', 'Web Development'] as string[],
  });

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser(formData);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 font-bold text-slate-950 text-base mb-3 shadow-lg shadow-cyan-500/20">
            HZ
          </div>
          <h2 className="font-display text-2xl font-bold text-white">Create Student Account</h2>
          <p className="mt-1 text-xs text-slate-400">
            Get personalized hackathon recommendations for your campus & preferred technologies.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sai Saranya"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@student.college.edu"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              College / University *
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. AU College of Engineering / IIT"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                City *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Visakhapatnam"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-3.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g. Andhra Pradesh"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Technology Interests (Pick 1 or more)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TECHNOLOGIES_LIST.map((t) => {
                const isSelected = formData.interests.includes(t);
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => toggleInterest(t)}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
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

          <button
            type="submit"
            className="w-full mt-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-xs sm:text-sm font-bold text-slate-950 hover:from-cyan-300 hover:to-blue-400 shadow-md shadow-cyan-500/25 transition-all"
          >
            Create Account & Launch
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already registered?{' '}
          <button
            onClick={() => navigate('login')}
            className="font-bold text-cyan-400 hover:underline"
          >
            Sign In here
          </button>
        </div>
      </div>
    </div>
  );
};
