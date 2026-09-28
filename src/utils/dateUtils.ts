export type DeadlineStatus = 'OPEN' | 'CLOSING_SOON' | 'CLOSED';

export const getDeadlineStatus = (deadlineDateStr: string): {
  status: DeadlineStatus;
  label: string;
  daysRemaining: number;
  badgeClass: string;
} => {
  // Current simulated app date is 2026-09-28
  const today = new Date('2026-09-28T00:00:00');
  const deadline = new Date(`${deadlineDateStr}T23:59:59`);
  
  const diffTime = deadline.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      status: 'CLOSED',
      label: 'Registration Closed',
      daysRemaining: 0,
      badgeClass: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    };
  }

  if (daysRemaining <= 5) {
    return {
      status: 'CLOSING_SOON',
      label: `Closing Soon (${daysRemaining}d left)`,
      daysRemaining,
      badgeClass: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    };
  }

  return {
    status: 'OPEN',
    label: `Registration Open (${daysRemaining}d left)`,
    daysRemaining,
    badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };
};

export const formatDateRange = (startDateStr: string, endDateStr: string): string => {
  try {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const startDay = start.getDate();
    const endDay = end.getDate();
    const year = end.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}–${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
  } catch {
    return `${startDateStr} to ${endDateStr}`;
  }
};

export const formatSingleDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};
