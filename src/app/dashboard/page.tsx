'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { DashboardStats, House } from '@/lib/types';
import Navbar from '@/components/Navbar';
import DashboardStatsComponent from '@/components/DashboardStats';
import OfflineIndicator from '@/components/OfflineIndicator';
import Link from 'next/link';
import { useAuthGuard } from '@/lib/useAuthGuard';
import { SkeletonStats, SkeletonList } from '@/components/Skeleton';

export default function DashboardPage() {
  const { loading: authLoading } = useAuthGuard();
  const [stats, setStats] = useState<DashboardStats>({
    total: 0, completed: 0, draft: 0, pending: 0, completion_percent: 0,
  });
  const [recentHouses, setRecentHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    const supabase = getSupabaseClient();

    const fetchData = async () => {
      try {
        // Only select needed columns — faster query
        const { data: houses } = await supabase
          .from('houses')
          .select('id, house_no, owner_name, area, status, created_at, updated_at');

        if (houses) {
          const total = houses.length;
          const completed = houses.filter((h) => h.status === 'completed').length;
          const draft = houses.filter((h) => h.status === 'draft').length;
          const pending = houses.filter((h) => h.status === 'pending').length;
          setStats({ total, completed, draft, pending, completion_percent: total > 0 ? (completed / total) * 100 : 0 });

          const active = houses
            .filter((h) => h.status !== 'pending')
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .slice(0, 5);
          setRecentHouses(active);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading]);

  const statusLabel: Record<string, string> = { pending: 'બાકી', draft: 'ડ્રાફ્ટ', completed: 'પૂર્ણ' };
  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-600',
    draft: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">ડૅશબોર્ડ</h1>
            <p className="text-gov-muted text-sm mt-0.5">
              {new Date().toLocaleDateString('gu-IN', { dateStyle: 'long' })}
            </p>
          </div>
          <Link href="/houses" className="btn-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            નવો સર્વે
          </Link>
        </div>

        {/* Stats — show skeleton instantly then real data */}
        {loading ? <SkeletonStats /> : <DashboardStatsComponent stats={stats} loading={false} />}

        {/* Recent Activity */}
        {loading ? (
          <SkeletonList count={3} />
        ) : recentHouses.length > 0 ? (
          <div className="gov-card">
            <h2 className="section-heading">તાજેતરની પ્રવૃત્તિ</h2>
            <div className="space-y-2">
              {recentHouses.map((house) => (
                <div key={house.id} className="flex items-center justify-between py-2.5 border-b border-gov-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-navy-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">{house.house_no}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-navy-900 text-sm">{house.owner_name}</p>
                      <p className="text-gov-muted text-xs">{house.area}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[house.status]}`}>
                      {statusLabel[house.status]}
                    </span>
                    <Link href={`/houses/${house.id}`} className="text-saffron-600 hover:text-saffron-700 text-sm font-medium">
                      ખોલો →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/houses" className="block mt-4 text-saffron-600 hover:text-saffron-700 text-sm font-semibold">
              બધા મકાનો જુઓ →
            </Link>
          </div>
        ) : null}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: '/houses', label: 'મકાન સૂચિ', icon: '🏘️', color: 'bg-blue-50 border-blue-200 text-blue-700' },
            { href: '/houses?filter=draft', label: 'ડ્રાફ્ટ', icon: '✏️', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
            { href: '/admin', label: 'વ્યવસ્થાપન', icon: '⚙️', color: 'bg-purple-50 border-purple-200 text-purple-700' },
            { href: '/reports', label: 'અહેવાલ', icon: '📊', color: 'bg-green-50 border-green-200 text-green-700' },
          ].map((action) => (
            <Link key={action.href} href={action.href}
              className={`gov-card border-2 flex flex-col items-center text-center gap-3 py-5 hover:shadow-card-hover transition-all duration-200 ${action.color}`}>
              <span className="text-3xl">{action.icon}</span>
              <span className="font-semibold text-sm">{action.label}</span>
            </Link>
          ))}
        </div>
      </main>
      <OfflineIndicator />
    </>
  );
}

