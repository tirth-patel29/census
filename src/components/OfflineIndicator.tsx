'use client';

import { useState, useEffect } from 'react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check queue count
    const checkQueue = () => {
      try {
        const raw = localStorage.getItem('census_offline_queue');
        const queue = raw ? JSON.parse(raw) : [];
        setQueueCount(queue.length);
      } catch {
        setQueueCount(0);
      }
    };

    checkQueue();
    const interval = setInterval(checkQueue, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && queueCount === 0) return null;

  return (
    <div
      id="offline-indicator"
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50 animate-fade-in`}
    >
      {!isOnline && (
        <div className="flex items-center gap-3 bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg">
          <div className="w-3 h-3 rounded-full bg-white pulse-dot" />
          <div>
            <p className="font-semibold text-sm">ઑફ-લાઇન</p>
            <p className="text-xs text-red-200">ડેટા સ્થાનિક રીતે સચવાઈ રહ્યો છે</p>
          </div>
        </div>
      )}
      {isOnline && queueCount > 0 && (
        <div className="flex items-center gap-3 bg-yellow-500 text-white px-4 py-3 rounded-xl shadow-lg">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <div>
            <p className="font-semibold text-sm">{queueCount} ફેરફારો સમક્રમ થઈ રહ્યા છે</p>
            <p className="text-xs text-yellow-100">ઑનલાઇન — ડેટા અપલોડ થઈ રહ્યો છે</p>
          </div>
        </div>
      )}
    </div>
  );
}
