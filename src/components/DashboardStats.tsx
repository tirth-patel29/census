import { DashboardStats } from '@/lib/types';

interface DashboardStatsProps {
  stats: DashboardStats;
  loading?: boolean;
}

export default function DashboardStatsComponent({ stats, loading }: DashboardStatsProps) {
  const cards = [
    {
      id: 'stat-total-houses',
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
      id: 'stat-total-cars',
      label: 'કુલ કાર / જીપ',
      value: stats.total_cars,
      sublabel: 'Total Cars / Jeeps',
      color: 'bg-blue-600',
      textColor: 'text-white',
      icon: (
        <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 18a2 2 0 100-4 2 2 0 000 4zm0 0h4a2 2 0 002-2V9a2 2 0 00-2-2H8a2 2 0 00-2 2v7a2 2 0 002 2h4zm0-9h4M8 9h4" />
        </svg>
      ),
    },
    {
      id: 'stat-total-tvs',
      label: 'કુલ ટીવી',
      value: stats.total_tvs,
      sublabel: 'Total TVs',
      color: 'bg-indigo-600',
      textColor: 'text-white',
      icon: (
        <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M7 4h10M5 20h14M12 17v3M4 6h16v10H4V6z" />
        </svg>
      ),
    },
    {
      id: 'stat-total-couples',
      label: 'પરિણિત દંપતિ',
      value: stats.total_married_couples,
      sublabel: 'Married Couples',
      color: 'bg-red-500',
      textColor: 'text-white',
      icon: (
        <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'stat-total-rooms',
      label: 'કુલ રૂમ',
      value: stats.total_rooms,
      sublabel: 'Total Rooms',
      color: 'bg-green-600',
      textColor: 'text-white',
      icon: (
        <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
          <div className="mt-4">
            <p className="text-3xl font-bold">{card.value.toLocaleString('gu-IN')}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
