import Link from 'next/link';
import { House } from '@/lib/types';
import StatusBadge from './StatusBadge';

interface HouseCardProps {
  house: House;
  showEditButton?: boolean;
  onUnlock?: (id: string) => void;
}

export default function HouseCard({ house, showEditButton, onUnlock }: HouseCardProps) {
  return (
    <div
      id={`house-card-${house.house_no}`}
      className="gov-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-card-hover transition-all duration-200 animate-fade-in"
    >
      {/* House Info */}
      <div className="flex items-center gap-4">
        {/* House Number */}
        <div className="w-14 h-14 rounded-xl bg-navy-900 flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white font-bold text-lg leading-none">{house.house_no}</span>
        </div>

        <div>
          <h3 className="font-bold text-navy-900 text-base leading-tight">
            {house.owner_name || `મકાન-${house.house_no}`}
          </h3>
          <p className="text-gov-muted text-sm mt-0.5 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {house.area}
          </p>
          <div className="mt-1.5">
            <StatusBadge status={house.status} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {showEditButton && onUnlock && house.status === 'completed' && (
          <button
            id={`unlock-${house.id}`}
            onClick={() => onUnlock(house.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                       bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors border border-yellow-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            અનલૉક
          </button>
        )}

        <Link
          href={showEditButton ? `/admin/house/${house.id}` : `/houses/${house.id}`}
          id={`survey-link-${house.house_no}`}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            house.status === 'completed' && !showEditButton
              ? 'bg-green-600 text-white hover:bg-green-700'
              : house.status === 'draft'
              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
              : 'bg-saffron-500 text-white hover:bg-saffron-600'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {house.status === 'completed' && !showEditButton ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            )}
          </svg>
          {showEditButton ? 'ફેરફાર' : house.status === 'completed' ? 'જુઓ' : house.status === 'draft' ? 'ચાલુ રાખો' : 'ભરો'}
        </Link>
      </div>
    </div>
  );
}
