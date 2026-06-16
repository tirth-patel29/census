'use client';

import { HouseStatus } from '@/lib/types';

interface HouseSearchProps {
  searchQuery: string;
  statusFilter: HouseStatus | 'all';
  onSearchChange: (query: string) => void;
  onStatusChange: (status: HouseStatus | 'all') => void;
  totalCount: number;
  filteredCount: number;
}

const statusOptions: { value: HouseStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'બધા' },
  { value: 'pending', label: 'બાકી' },
  { value: 'draft', label: 'ડ્રાફ્ટ' },
  { value: 'completed', label: 'પૂર્ણ' },
];

export default function HouseSearch({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange,
  totalCount,
  filteredCount,
}: HouseSearchProps) {
  return (
    <div className="gov-card">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="house-search-input"
            type="text"
            className="gov-input pl-10"
            placeholder="મકાન નં. અથવા માલિકનું નામ શોધો..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              id={`filter-${opt.value}`}
              onClick={() => onStatusChange(opt.value)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border-2 whitespace-nowrap ${
                statusFilter === opt.value
                  ? 'bg-navy-900 text-white border-navy-900'
                  : 'bg-white text-navy-900 border-gov-border hover:border-navy-500'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result Count */}
      <div className="mt-3 text-sm text-gov-muted">
        {filteredCount === totalCount ? (
          <span>કુલ {totalCount} મકાનો</span>
        ) : (
          <span>
            <strong className="text-navy-900">{filteredCount}</strong> મળ્યા (કુલ {totalCount} માંથી)
          </span>
        )}
      </div>
    </div>
  );
}

