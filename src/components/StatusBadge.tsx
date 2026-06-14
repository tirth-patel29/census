import { HouseStatus } from '@/lib/types';

const statusConfig: Record<HouseStatus, { label: string; className: string }> = {
  pending: { label: 'બાકી', className: 'badge-pending' },
  draft: { label: 'ડ્રાફ્ટ', className: 'badge-draft' },
  completed: { label: 'પૂર્ણ', className: 'badge-completed' },
};

interface StatusBadgeProps {
  status: HouseStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  return <span className={config.className}>{config.label}</span>;
}
