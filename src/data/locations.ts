import { Zone, LocationHierarchy } from '../types';

export const INDIA_LOCATIONS: LocationHierarchy = {
  'South India': {
    'Andhra Pradesh': [
      'Visakhapatnam',
      'Vijayawada',
      'Tirupati',
      'Guntur',
      'Kakinada',
      'Nellore',
      'Rajahmundry',
      'Anantapur',
      'Other Cities'
    ],
    'Telangana': [
      'Hyderabad',
      'Warangal',
      'Nizamabad',
      'Karimnagar',
      'Khammam'
    ],
    'Karnataka': [
      'Bengaluru',
      'Mysuru',
      'Mangaluru',
      'Hubballi-Dharwad',
      'Belagavi'
    ],
    'Tamil Nadu': [
      'Chennai',
      'Coimbatore',
      'Madurai',
      'Tiruchirappalli',
      'Salem'
    ],
    'Kerala': [
      'Kochi',
      'Thiruvananthapuram',
      'Kozhikode',
      'Kollam',
      'Thrissur'
    ]
  },
  'North India': {
    'Delhi NCR': [
      'New Delhi',
      'Noida',
      'Gurugram',
      'Faridabad',
      'Ghaziabad'
    ],
    'Punjab': [
      'Chandigarh',
      'Ludhiana',
      'Amritsar',
      'Jalandhar',
      'Patiala'
    ],
    'Uttar Pradesh': [
      'Lucknow',
      'Kanpur',
      'Varanasi',
      'Greater Noida',
      'Prayagraj',
      'Agra'
    ],
    'Rajasthan': [
      'Jaipur',
      'Jodhpur',
      'Udaipur',
      'Kota',
      'Ajmer'
    ],
    'Haryana': [
      'Gurugram',
      'Faridabad',
      'Rohtak',
      'Panipat',
      'Hisar'
    ]
  },
  'West India': {
    'Maharashtra': [
      'Mumbai',
      'Pune',
      'Nagpur',
      'Nashik',
      'Chhatrapati Sambhajinagar',
      'Navi Mumbai'
    ],
    'Gujarat': [
      'Ahmedabad',
      'Surat',
      'Vadodara',
      'Gandhinagar',
      'Rajkot'
    ],
    'Goa': [
      'Panaji',
      'Margao',
      'Vasco da Gama'
    ]
  },
  'East India': {
    'West Bengal': [
      'Kolkata',
      'Siliguri',
      'Durgapur',
      'Asansol',
      'Kalyani'
    ],
    'Odisha': [
      'Bhubaneswar',
      'Cuttack',
      'Rourkela',
      'Sambalpur'
    ],
    'Bihar': [
      'Patna',
      'Gaya',
      'Bhagalpur',
      'Muzaffarpur'
    ],
    'Jharkhand': [
      'Ranchi',
      'Jamshedpur',
      'Dhanbad',
      'Bokaro'
    ]
  },
  'Central India': {
    'Madhya Pradesh': [
      'Bhopal',
      'Indore',
      'Gwalior',
      'Jabalpur',
      'Ujjain'
    ],
    'Chhattisgarh': [
      'Raipur',
      'Bilaspur',
      'Bhilai',
      'Durg'
    ]
  },
  'Northeast India': {
    'Assam': [
      'Guwahati',
      'Silchar',
      'Tezpur',
      'Jorhat',
      'Dibrugarh'
    ],
    'Meghalaya': [
      'Shillong',
      'Tura'
    ],
    'Manipur': [
      'Imphal'
    ],
    'Sikkim': [
      'Gangtok'
    ]
  },
  'Online': {
    'Pan-India Virtual': [
      'Online / Remote'
    ]
  }
};

export const ZONES: Zone[] = [
  'South India',
  'North India',
  'West India',
  'East India',
  'Central India',
  'Northeast India',
  'Online'
];

export const POPULAR_CITIES = [
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', zone: 'South India' },
  { city: 'Hyderabad', state: 'Telangana', zone: 'South India' },
  { city: 'Bengaluru', state: 'Karnataka', zone: 'South India' },
  { city: 'Vijayawada', state: 'Andhra Pradesh', zone: 'South India' },
  { city: 'Chennai', state: 'Tamil Nadu', zone: 'South India' },
  { city: 'Pune', state: 'Maharashtra', zone: 'West India' },
  { city: 'New Delhi', state: 'Delhi NCR', zone: 'North India' },
  { city: 'Online / Remote', state: 'Pan-India Virtual', zone: 'Online' },
];

export const TECHNOLOGIES_LIST = [
  'AI/ML',
  'Web Development',
  'App Development',
  'IoT',
  'Cybersecurity',
  'Blockchain',
  'Cloud',
  'Data Science',
  'Open Innovation'
];

export const getStatesForZone = (zone: Zone | string): string[] => {
  if (!INDIA_LOCATIONS[zone]) return [];
  return Object.keys(INDIA_LOCATIONS[zone]);
};

export const getCitiesForState = (zone: Zone | string, state: string): string[] => {
  if (!INDIA_LOCATIONS[zone] || !INDIA_LOCATIONS[zone][state]) return [];
  return INDIA_LOCATIONS[zone][state];
};

export const findZoneForState = (state: string): Zone | null => {
  for (const [zone, states] of Object.entries(INDIA_LOCATIONS)) {
    if (Object.keys(states).includes(state)) {
      return zone as Zone;
    }
  }
  return null;
};
