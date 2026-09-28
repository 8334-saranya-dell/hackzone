import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Hackathon, User, Zone, HackathonStatus, UserRole } from '../types';
import { SAMPLE_HACKATHONS } from '../data/sampleHackathons';
import { getDeadlineStatus } from '../utils/dateUtils';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface FilterState {
  zone: string;
  state: string;
  city: string;
  technology: string;
  mode: string;
  dateRange: string;
  eligibility: string;
  prizePool: string;
  searchQuery: string;
}

interface AppContextType {
  hackathons: Hackathon[];
  filteredHackathons: Hackathon[];
  currentUser: User | null;
  savedIds: string[];
  registeredIds: string[];
  currentRoute: string;
  selectedHackathonId: string | null;
  filters: FilterState;
  searchQuery: string;
  toasts: ToastMessage[];
  
  // Navigation & Details
  navigate: (route: string, hackathonId?: string | null) => void;
  openHackathonDetails: (id: string) => void;
  closeHackathonDetails: () => void;
  
  // Filters & Discovery
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: (key: keyof FilterState, value: string) => void;
  setSearchQuery: (query: string) => void;
  searchHackathons: (query: string) => Hackathon[];
  filterHackathons: (query: string) => Hackathon[];
  selectZone: (zone: string) => void;
  selectState: (state: string) => void;
  selectCity: (city: string) => void;
  clearFilters: () => void;
  
  // Actions
  toggleSaveHackathon: (id: string) => void;
  isSaved: (id: string) => boolean;
  registerForHackathon: (id: string) => void;
  isRegistered: (id: string) => boolean;
  
  // Hackathon Management
  addNewHackathon: (data: Omit<Hackathon, 'id' | 'status' | 'createdAt'>) => string;
  updateHackathonStatus: (id: string, status: HackathonStatus) => void;
  deleteHackathon: (id: string) => void;
  
  // Auth
  login: (email: string, role?: UserRole) => boolean;
  registerUser: (userData: Partial<User>) => void;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
  
  // Toast
  showToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

const DEFAULT_FILTERS: FilterState = {
  zone: '',
  state: '',
  city: '',
  technology: '',
  mode: '',
  dateRange: '',
  eligibility: '',
  prizePool: '',
  searchQuery: '',
};

const DEFAULT_STUDENT_USER: User = {
  id: 'usr_student_01',
  name: 'Sai Saranya',
  email: 'saisaranya@student.edu',
  college: 'Andhra University College of Engineering',
  city: 'Visakhapatnam',
  state: 'Andhra Pradesh',
  preferredZone: 'South India',
  interests: ['AI/ML', 'Web Development', 'Cloud'],
  role: 'STUDENT',
  createdAt: '2026-09-01'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize Hackathons from localStorage or default
  const [hackathons, setHackathons] = useState<Hackathon[]>(() => {
    try {
      const stored = localStorage.getItem('hackzone_hackathons');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return SAMPLE_HACKATHONS;
  });

  // Current User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('hackzone_user');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEFAULT_STUDENT_USER;
  });

  // Saved Hackathons
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('hackzone_saved');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return ['hack-vizag-01', 'hack-hyd-01'];
  });

  // Registered Hackathons
  const [registeredIds, setRegisteredIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('hackzone_registered');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return ['hack-blr-01'];
  });

  // Router & Active Selection
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);

  // Search Query state (reactively updates as user types)
  const [searchQuery, setSearchQueryState] = useState<string>('');

  // Filters State
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync Hackathons to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hackzone_hackathons', JSON.stringify(hackathons));
    } catch (e) {
      console.error(e);
    }
  }, [hackathons]);

  // Sync User to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('hackzone_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('hackzone_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Sync Saved to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hackzone_saved', JSON.stringify(savedIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedIds]);

  // Sync Registered to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hackzone_registered', JSON.stringify(registeredIds));
    } catch (e) {
      console.error(e);
    }
  }, [registeredIds]);

  const showToast = (title: string, description?: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigate = (route: string, hackathonId?: string | null) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentRoute(route);
    if (hackathonId !== undefined) {
      setSelectedHackathonId(hackathonId);
    }
  };

  const openHackathonDetails = (id: string) => {
    setSelectedHackathonId(id);
    setCurrentRoute('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeHackathonDetails = () => {
    setSelectedHackathonId(null);
    setCurrentRoute('explore');
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    if (key === 'searchQuery') {
      setSearchQueryState(value);
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const setSearchQuery = (query: string) => {
    setSearchQueryState(query);
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  /**
   * Filters hackathons based on whether the name, city, state, or technology
   * includes the search query string in real-time.
   */
  const searchHackathons = (query: string): Hackathon[] => {
    const trimmed = (query || '').trim().toLowerCase();
    if (!trimmed) {
      return hackathons.filter(h => h.status === 'APPROVED');
    }
    const terms = trimmed.split(/\s+/).filter(Boolean);

    return hackathons.filter((h) => {
      if (h.status !== 'APPROVED') return false;
      const name = (h.name || '').toLowerCase();
      const city = (h.city || '').toLowerCase();
      const state = (h.state || '').toLowerCase();
      const techList = (h.technologies || []).map((t) => t.toLowerCase());

      // Check if name, city, state, or technology includes the query string
      const nameMatches = name.includes(trimmed);
      const cityMatches = city.includes(trimmed);
      const stateMatches = state.includes(trimmed);
      const techMatches = techList.some((tech) => tech.includes(trimmed));

      if (nameMatches || cityMatches || stateMatches || techMatches) {
        return true;
      }

      // Also support multi-word search queries (e.g. "AI Visakhapatnam")
      if (terms.length > 1) {
        return terms.every((term) =>
          name.includes(term) ||
          city.includes(term) ||
          state.includes(term) ||
          techList.some((tech) => tech.includes(term))
        );
      }

      return false;
    });
  };

  // Real-time derived state filtering hackathons reactively based on searchQuery (name, city, state, or technology) & active filters
  const filteredHackathons = useMemo(() => {
    const query = (searchQuery || filters.searchQuery || '').trim().toLowerCase();
    const terms = query ? query.split(/\s+/).filter(Boolean) : [];

    return hackathons.filter((h) => {
      // Only APPROVED hackathons are visible publicly
      if (h.status !== 'APPROVED') return false;

      // Real-time keyword filter: checks if name, city, state, or technology includes query
      if (query) {
        const name = (h.name || '').toLowerCase();
        const city = (h.city || '').toLowerCase();
        const state = (h.state || '').toLowerCase();
        const techList = (h.technologies || []).map((t) => t.toLowerCase());

        const nameMatches = name.includes(query);
        const cityMatches = city.includes(query);
        const stateMatches = state.includes(query);
        const techMatches = techList.some((tech) => tech.includes(query));

        let matchesSearch = nameMatches || cityMatches || stateMatches || techMatches;

        if (!matchesSearch && terms.length > 1) {
          matchesSearch = terms.every((term) =>
            name.includes(term) ||
            city.includes(term) ||
            state.includes(term) ||
            techList.some((tech) => tech.includes(term))
          );
        }

        if (!matchesSearch) return false;
      }

      // Zone filter
      if (filters.zone) {
        if (filters.zone === 'Online') {
          if (h.mode !== 'Online' && h.zone !== 'Online') return false;
        } else if (h.zone !== filters.zone) {
          return false;
        }
      }

      // State filter
      if (filters.state && h.state.toLowerCase() !== filters.state.toLowerCase()) {
        return false;
      }

      // City filter
      if (filters.city && filters.city !== 'Other Cities' && h.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      // Mode filter
      if (filters.mode && h.mode !== filters.mode) {
        return false;
      }

      // Technology filter
      if (filters.technology && !h.technologies.includes(filters.technology)) {
        return false;
      }

      // Eligibility filter
      if (filters.eligibility && h.eligibility !== filters.eligibility) {
        return false;
      }

      // Prize Pool filter
      if (filters.prizePool && filters.prizePool !== 'All') {
        if (filters.prizePool === 'No Prize' && h.prizePoolAmount > 0) return false;
        if (filters.prizePool === '₹10K+' && h.prizePoolAmount < 10000) return false;
        if (filters.prizePool === '₹50K+' && h.prizePoolAmount < 50000) return false;
        if (filters.prizePool === '₹1 Lakh+' && h.prizePoolAmount < 100000) return false;
      }

      // Date Range filter
      if (filters.dateRange && filters.dateRange !== 'All') {
        const { daysRemaining, status } = getDeadlineStatus(h.registrationDeadline);
        if (filters.dateRange === 'This Week' && (daysRemaining > 7 || status === 'CLOSED')) return false;
        if (filters.dateRange === 'This Month' && (daysRemaining > 30 || status === 'CLOSED')) return false;
        if (filters.dateRange === 'Upcoming' && status === 'CLOSED') return false;
      }

      return true;
    });
  }, [hackathons, searchQuery, filters]);

  const selectZone = (zone: string) => {
    setFilters((prev) => ({
      ...prev,
      zone,
      state: '',
      city: '',
    }));
  };

  const selectState = (state: string) => {
    setFilters((prev) => ({
      ...prev,
      state,
      city: '',
    }));
  };

  const selectCity = (city: string) => {
    setFilters((prev) => ({
      ...prev,
      city,
    }));
  };

  const clearFilters = () => {
    setSearchQueryState('');
    setFilters(DEFAULT_FILTERS);
  };

  const toggleSaveHackathon = (id: string) => {
    const exists = savedIds.includes(id);
    const target = hackathons.find(h => h.id === id);
    if (exists) {
      setSavedIds((prev) => prev.filter((item) => item !== id));
      showToast('Removed from Saved', target ? target.name : undefined, 'info');
    } else {
      setSavedIds((prev) => [...prev, id]);
      showToast('Saved to My Hackathons', target ? target.name : undefined, 'success');
    }
  };

  const isSaved = (id: string) => savedIds.includes(id);

  const registerForHackathon = (id: string) => {
    const target = hackathons.find((h) => h.id === id);
    if (!registeredIds.includes(id)) {
      setRegisteredIds((prev) => [...prev, id]);
      showToast('Registration Opened', target ? `Redirecting to official portal for ${target.name}` : undefined, 'success');
    }
    if (target?.registrationUrl) {
      window.open(target.registrationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const isRegistered = (id: string) => registeredIds.includes(id);

  const addNewHackathon = (data: Omit<Hackathon, 'id' | 'status' | 'createdAt'>): string => {
    const newId = `hack-${Date.now().toString(36)}`;
    const newHackathon: Hackathon = {
      ...data,
      id: newId,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setHackathons((prev) => [newHackathon, ...prev]);
    showToast(
      'Hackathon Submitted!',
      'It has been submitted for admin verification and will appear publicly once approved.',
      'success'
    );
    return newId;
  };

  const updateHackathonStatus = (id: string, status: HackathonStatus) => {
    setHackathons((prev) =>
      prev.map((h) => (h.id === id ? { ...h, status } : h))
    );
    showToast(
      `Hackathon Status Updated`,
      `Set to ${status}`,
      status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'error' : 'info'
    );
  };

  const deleteHackathon = (id: string) => {
    setHackathons((prev) => prev.filter((h) => h.id !== id));
    showToast('Hackathon Deleted', undefined, 'info');
  };

  const login = (email: string, role: UserRole = 'STUDENT'): boolean => {
    const user: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role,
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      preferredZone: 'South India',
      interests: ['AI/ML', 'Web Development'],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCurrentUser(user);
    showToast('Welcome back!', `Logged in as ${user.name} (${user.role})`, 'success');
    return true;
  };

  const registerUser = (userData: Partial<User>) => {
    const user: User = {
      id: `usr_${Date.now()}`,
      name: userData.name || 'Student Developer',
      email: userData.email || 'developer@hackzone.dev',
      college: userData.college || 'Engineering College',
      city: userData.city || 'Visakhapatnam',
      state: userData.state || 'Andhra Pradesh',
      preferredZone: (userData.preferredZone as Zone) || 'South India',
      interests: userData.interests || ['AI/ML', 'Web Development'],
      role: 'STUDENT',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCurrentUser(user);
    showToast('Account Created!', `Welcome to HackZone, ${user.name}`, 'success');
    navigate('dashboard');
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out', 'You have been safely signed out.', 'info');
    navigate('home');
  };

  const setUserRole = (role: UserRole) => {
    if (currentUser) {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
      showToast('Role Switched', `Active role is now ${role}`, 'info');
    }
  };

  const value = useMemo(
    () => ({
      hackathons,
      filteredHackathons,
      currentUser,
      savedIds,
      registeredIds,
      currentRoute,
      selectedHackathonId,
      filters,
      searchQuery,
      toasts,
      navigate,
      openHackathonDetails,
      closeHackathonDetails,
      setFilters,
      updateFilter,
      setSearchQuery,
      searchHackathons,
      filterHackathons: searchHackathons,
      selectZone,
      selectState,
      selectCity,
      clearFilters,
      toggleSaveHackathon,
      isSaved,
      registerForHackathon,
      isRegistered,
      addNewHackathon,
      updateHackathonStatus,
      deleteHackathon,
      login,
      registerUser,
      logout,
      setUserRole,
      showToast,
      dismissToast,
    }),
    [
      hackathons,
      filteredHackathons,
      currentUser,
      savedIds,
      registeredIds,
      currentRoute,
      selectedHackathonId,
      filters,
      searchQuery,
      toasts,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
