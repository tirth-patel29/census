import { DashboardStats } from '@/lib/types';

interface DashboardStatsProps {
  stats: DashboardStats;
  loading?: boolean;
}

export default function DashboardStatsComponent({ stats, loading }: DashboardStatsProps) {
  const cards = [
    {
      id: 'stat-total',
      label: 'કુલ મકાનો',
      value: stats.total,
      sublabel: 'Total Houses',
      color: 'bg-navy-900',
      textColor: 'text-white',
      icon: (
        <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'stat-completed',
      label: 'પૂર્ણ',
      value: stats.completed,
      sublabel: 'Completed',
      color: 'bg-green-600',
      textColor: 'text-white',
      icon: (
        <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'stat-draft',
      label: 'ડ્રાફ્ટ',
      value: stats.draft,
      sublabel: 'In Progress',
      color: 'bg-yellow-500',
      textColor: 'text-white',
      icon: (
        <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      id: 'stat-pending',
      label: 'બાકી',
      value: stats.pending,
      sublabel: 'Pending',
      color: 'bg-gray-500',
      textColor: 'text-white',
      icon: (
        <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="gov-card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            id={card.id}
            className={`${card.color} ${card.textColor} rounded-xl p-5 shadow-card flex flex-col justify-between hover:shadow-card-hover transition-shadow duration-200`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">{card.label}</p>
                <p className="text-xs opacity-60">{card.sublabel}</p>
              </div>
              {card.icon}
            </div>
            <div className="mt-3">
              <p className="text-4xl font-bold">{card.value.toLocaleString('gu-IN')}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="gov-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-navy-900">સર્વે પ્રગતિ</span>
          <span className="text-lg font-bold text-saffron-600">
            {stats.completion_percent.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-saffron-500 to-green-500 rounded-full transition-all duration-700"
            style={{ width: `${stats.completion_percent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gov-muted mt-1">
          <span>0</span>
          <span>{stats.total} મકાનો</span>
        </div>
      </div>
    </div>
  );
}
