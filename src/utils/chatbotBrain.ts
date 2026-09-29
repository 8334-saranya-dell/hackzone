import { Hackathon } from '../types';
import { getDeadlineStatus, formatDateRange } from './dateUtils';

export interface ChatbotResponse {
  text: string;
  matchedHackathons?: Hackathon[];
  suggestedPrompts?: string[];
  source: 'n8n' | 'hackzone';
}

/**
 * Intelligent in-app resolution engine that parses user queries and extracts
 * relevant hackathons, stats, deadlines, and answers.
 */
export const resolveHackZoneQuery = (
  rawQuery: string,
  hackathons: Hackathon[],
  userName?: string
): ChatbotResponse => {
  const query = rawQuery.trim().toLowerCase();
  const approvedHackathons = hackathons.filter((h) => h.status === 'APPROVED');
  const greetingName = userName ? userName.split(' ')[0] : 'there';

  // 1. Greetings & Meta Queries
  if (/^(hi|hello|hey|yo|namaste|greetings|hola)\b/i.test(query)) {
    return {
      text: `👋 Hello ${greetingName}! I'm your **HackZone AI Assistant**.\n\nI can help you discover student hackathons across India, check upcoming deadlines, compare prize pools, and find competitions matching your preferred tech stack.\n\nWhat are you looking for today?`,
      suggestedPrompts: [
        '📍 Hackathons in Visakhapatnam',
        '⚡ Events closing soon',
        '🤖 AI & Machine Learning hackathons',
        '🏆 Highest prize pool competitions'
      ],
      source: 'hackzone'
    };
  }

  if (query.includes('who are you') || query.includes('what can you do') || query.includes('help')) {
    return {
      text: `I'm the **HackZone Student Assistant**! Here's how I can assist you:\n\n` +
        `• **Find Hackathons**: Search by city (e.g. *Vizag, Hyderabad, Bengaluru, Delhi, Pune, Mumbai*), state, or zone.\n` +
        `• **Filter by Tech**: AI/ML, Web3, Blockchain, IoT, Cybersecurity, Cloud, and App Dev.\n` +
        `• **Track Deadlines**: Ask *"which hackathons are closing soon?"* to never miss a deadline.\n` +
        `• **Prize Pools**: Explore competitions with ₹1 Lakh to ₹5 Lakh prize pools.\n` +
        `• **Direct Access**: Click any card below to view problem statements and register directly.`,
      suggestedPrompts: [
        'Hackathons in Hyderabad',
        'IoT hackathons',
        'Online hackathons with prize pool',
        'Closing soon'
      ],
      source: 'hackzone'
    };
  }

  // 2. Urgent / Closing Soon Deadlines
  if (query.includes('closing soon') || query.includes('deadline') || query.includes('urgent') || query.includes('last date')) {
    const closingSoon = approvedHackathons
      .filter((h) => {
        const info = getDeadlineStatus(h.registrationDeadline);
        return info.status === 'CLOSING_SOON' || (info.daysRemaining <= 7 && info.daysRemaining > 0);
      })
      .sort((a, b) => {
        const da = getDeadlineStatus(a.registrationDeadline).daysRemaining;
        const db = getDeadlineStatus(b.registrationDeadline).daysRemaining;
        return da - db;
      });

    if (closingSoon.length > 0) {
      return {
        text: `⏳ Here are the **urgent hackathons closing registrations soon**! Don't wait—submit your teams before the portals close:`,
        matchedHackathons: closingSoon.slice(0, 4),
        suggestedPrompts: [
          'Hackathons in Visakhapatnam',
          'AI hackathons',
          'Online hackathons'
        ],
        source: 'hackzone'
      };
    }
  }

  // 3. Prize Pool Queries (High prize / 1 Lakh+)
  if (query.includes('prize') || query.includes('cash') || query.includes('highest') || query.includes('1 lakh') || query.includes('money')) {
    const highPrize = [...approvedHackathons]
      .filter((h) => h.prizePoolAmount >= 100000)
      .sort((a, b) => b.prizePoolAmount - a.prizePoolAmount);

    return {
      text: `🏆 Here are the **highest prize pool hackathons** in India currently listed on HackZone (₹1,00,000 up to ₹5,00,000):`,
      matchedHackathons: highPrize.slice(0, 4),
      suggestedPrompts: [
        'CodeIndia 2026 details',
        'AI hackathons in South India',
        'How do I register?'
      ],
      source: 'hackzone'
    };
  }

  // 4. City / Location Specific Queries
  const cityMappings: { [key: string]: string } = {
    vizag: 'Visakhapatnam',
    visakhapatnam: 'Visakhapatnam',
    hyderabad: 'Hyderabad',
    bengaluru: 'Bengaluru',
    bangalore: 'Bengaluru',
    delhi: 'New Delhi',
    noida: 'Noida',
    mumbai: 'Mumbai',
    pune: 'Pune',
    chennai: 'Chennai',
    kochi: 'Kochi',
    vijayawada: 'Vijayawada',
    amaravati: 'Vijayawada',
    tirupati: 'Tirupati',
    guntur: 'Guntur',
    chandigarh: 'Chandigarh',
    jaipur: 'Jaipur',
    kolkata: 'Kolkata',
    bhubaneswar: 'Bhubaneswar',
    patna: 'Patna',
    bhopal: 'Bhopal',
    indore: 'Indore',
    guwahati: 'Guwahati',
    shillong: 'Shillong',
    online: 'Online / Remote',
    remote: 'Online / Remote',
    virtual: 'Online / Remote'
  };

  for (const [key, cityName] of Object.entries(cityMappings)) {
    if (query.includes(key)) {
      const cityMatches = approvedHackathons.filter(
        (h) => h.city.toLowerCase() === cityName.toLowerCase() || (key === 'online' && h.mode === 'Online')
      );

      if (cityMatches.length > 0) {
        return {
          text: `📍 Found **${cityMatches.length} hackathon${cityMatches.length > 1 ? 's' : ''}** in **${cityName}**:`,
          matchedHackathons: cityMatches,
          suggestedPrompts: [
            'Which one has the highest prize?',
            'What are the eligibility rules?',
            'Show online hackathons'
          ],
          source: 'hackzone'
        };
      }
    }
  }

  // 5. State Specific Queries
  const stateList = [
    'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Kerala',
    'Maharashtra', 'Gujarat', 'West Bengal', 'Odisha', 'Bihar',
    'Madhya Pradesh', 'Assam', 'Meghalaya', 'Rajasthan', 'Punjab'
  ];

  for (const state of stateList) {
    if (query.includes(state.toLowerCase())) {
      const stateMatches = approvedHackathons.filter((h) => h.state.toLowerCase() === state.toLowerCase());
      if (stateMatches.length > 0) {
        return {
          text: `🏛️ Found **${stateMatches.length} hackathons** in **${state}**:`,
          matchedHackathons: stateMatches.slice(0, 4),
          suggestedPrompts: [
            'Filter by AI/ML',
            'Closing soon hackathons',
            'Events in Visakhapatnam'
          ],
          source: 'hackzone'
        };
      }
    }
  }

  // 6. Technology Track Queries
  const techMappings: { [key: string]: string } = {
    'ai': 'AI/ML',
    'ml': 'AI/ML',
    'artificial intelligence': 'AI/ML',
    'machine learning': 'AI/ML',
    'web': 'Web Development',
    'frontend': 'Web Development',
    'fullstack': 'Web Development',
    'app': 'App Development',
    'mobile': 'App Development',
    'android': 'App Development',
    'iot': 'IoT',
    'robotics': 'IoT',
    'hardware': 'IoT',
    'blockchain': 'Blockchain',
    'web3': 'Blockchain',
    'crypto': 'Blockchain',
    'cybersecurity': 'Cybersecurity',
    'security': 'Cybersecurity',
    'cloud': 'Cloud',
    'devops': 'Cloud',
    'data': 'Data Science'
  };

  for (const [key, techCategory] of Object.entries(techMappings)) {
    // word boundary check or inclusion
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(query)) {
      const techMatches = approvedHackathons.filter((h) =>
        h.technologies.some((t) => t.toLowerCase() === techCategory.toLowerCase())
      );

      if (techMatches.length > 0) {
        return {
          text: `💻 Here are the top **${techCategory}** hackathons currently accepting registrations:`,
          matchedHackathons: techMatches.slice(0, 4),
          suggestedPrompts: [
            `Show offline ${techCategory} events`,
            'Highest prize in this category',
            'Upcoming deadlines'
          ],
          source: 'hackzone'
        };
      }
    }
  }

  // 7. How to Register / Rules / Eligibility Queries
  if (query.includes('how to register') || query.includes('how to apply') || query.includes('register')) {
    return {
      text: `🚀 **How to Register for a Hackathon on HackZone:**\n\n` +
        `1. **Find your event**: Browse by location, category, or search.\n` +
        `2. **Check Details**: Click on the hackathon card to inspect the problem statements, eligibility (College / Open to All), team size, and timeline.\n` +
        `3. **Click Register Now**: Use the **🚀 REGISTER NOW** button to be redirected to the verified organizer portal (Devfolio, Unstop, Devpost, or FOSS United).\n` +
        `4. **Bookmark & Save**: Click the bookmark icon on any card to save it into your personal **My Hackathons** dashboard.`,
      suggestedPrompts: [
        'Hackathons in Andhra Pradesh',
        'Top AI hackathons',
        'Show urgent deadlines'
      ],
      source: 'hackzone'
    };
  }

  if (query.includes('organizer') || query.includes('add hackathon') || query.includes('host') || query.includes('submit')) {
    return {
      text: `📢 **Hosting or Organizing a Hackathon?**\n\n` +
        `College clubs and organizations can list their hackathons for free!\n\n` +
        `1. Click **+ Add Hackathon** in the navigation bar.\n` +
        `2. Fill in the event details (dates, venue, prize pool, problem statements, and registration URL).\n` +
        `3. Once submitted, our admin team audits and approves the listing within 24 hours to publish it to thousands of student developers.`,
      suggestedPrompts: [
        'Browse all hackathons',
        'Explore locations'
      ],
      source: 'hackzone'
    };
  }

  // 8. General Keyword Search Fallback Across Name, Description, & Technologies
  const terms = query.split(/\s+/).filter((t) => t.length > 2);
  const keywordMatches = approvedHackathons.filter((h) => {
    const textBlob = `${h.name} ${h.description} ${h.city} ${h.state} ${h.technologies.join(' ')} ${h.organizer}`.toLowerCase();
    return terms.some((term) => textBlob.includes(term));
  });

  if (keywordMatches.length > 0) {
    return {
      text: `🔍 Found **${keywordMatches.length} hackathon${keywordMatches.length > 1 ? 's' : ''}** matching "*${rawQuery}*":`,
      matchedHackathons: keywordMatches.slice(0, 4),
      suggestedPrompts: [
        'Show all hackathons',
        'Closing soon events',
        'Events in Visakhapatnam'
      ],
      source: 'hackzone'
    };
  }

  // 9. Friendly Default Fallback with Quick Suggestions
  return {
    text: `I couldn't find an exact match for "*${rawQuery}*".\n\nYou can try asking about:\n• **Cities**: Visakhapatnam, Hyderabad, Bengaluru, Pune, Delhi, Mumbai\n• **Domains**: AI/ML, Blockchain, Web Dev, IoT, Cybersecurity\n• **Deadlines**: *"Which events are closing soon?"*\n• **Prizes**: *"Show ₹1 Lakh+ prize pools"*`,
    suggestedPrompts: [
      '📍 Visakhapatnam hackathons',
      '🤖 AI hackathons in Hyderabad',
      '⏳ Closing soon',
      '🏆 ₹1 Lakh+ prize pools'
    ],
    source: 'hackzone'
  };
};
