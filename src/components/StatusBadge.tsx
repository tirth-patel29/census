import { HouseStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: HouseStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const labels: Record<HouseStatus, string> = {
    pending: 'બાકી',
    draft: 'ડ્રાફ્ટ',
    completed: 'પૂર્ણ',
  };

  const colors: Record<HouseStatus, string> = {
    pending: 'bg-gray-100 text-gray-800 border-gray-200',
    draft: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    completed: 'bg-green-50 text-green-800 border-green-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[status]}`}
    >
      {labels[status]}
    </span>
  );
}
