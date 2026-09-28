import React from 'react';
import { getDeadlineStatus } from '../utils/dateUtils';

interface DeadlineBadgeProps {
  deadline: string;
}

export const DeadlineBadge: React.FC<DeadlineBadgeProps> = ({ deadline }) => {
  const { status, label } = getDeadlineStatus(deadline);

  if (status === 'OPEN') {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
        <span>{label}</span>
      </div>
    );
  }

  if (status === 'CLOSING_SOON') {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
      <span className="h-2 w-2 rounded-full bg-rose-400"></span>
      <span>{label}</span>
    </div>
  );
};
