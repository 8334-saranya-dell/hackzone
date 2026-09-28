export type Zone = 
  | 'North India'
  | 'South India'
  | 'East India'
  | 'West India'
  | 'Central India'
  | 'Northeast India'
  | 'Online';

export type HackathonMode = 'Online' | 'Offline' | 'Hybrid';

export type Eligibility = 'School Students' | 'College Students' | 'Graduates' | 'Open to All';

export type PrizeCategory = 'No Prize' | '₹10K+' | '₹50K+' | '₹1 Lakh+';

export type HackathonStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export type UserRole = 'STUDENT' | 'ORGANIZER' | 'ADMIN';

export interface Hackathon {
  id: string;
  name: string;
  description: string;
  organizer: string;
  location: string;
  venue: string;
  city: string;
  state: string;
  zone: Zone;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  registrationDeadline: string; // YYYY-MM-DD
  mode: HackathonMode;
  eligibility: Eligibility;
  teamSize: string;
  prizePool: string;
  prizePoolAmount: number;
  technologies: string[];
  problemStatements?: string[];
  rules?: string[];
  schedule?: {
    phase: string;
    time: string;
    description: string;
  }[];
  registrationUrl: string;
  imageUrl: string;
  status: HackathonStatus;
  contactEmail: string;
  featured?: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  college?: string;
  city: string;
  state: string;
  preferredZone: Zone;
  interests: string[];
  role: UserRole;
  createdAt: string;
}

export interface SavedHackathon {
  id: string;
  userId: string;
  hackathonId: string;
  createdAt: string;
}

export interface LocationHierarchy {
  [zone: string]: {
    [state: string]: string[];
  };
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
