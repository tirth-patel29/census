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
    total: 0,
    total_cars: 0,
    total_tvs: 0,
    total_married_couples: 0,
    total_rooms: 0,
  });
  const [recentHouses, setRecentHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    const supabase = getSupabaseClient();

    const fetchData = async () => {
      try {
        const { data: houses } = await supabase
          .from('houses')
          .select('id, census_number, head_name, total_rooms, married_couples, has_car, has_tv, created_at, updated_at');

        if (houses) {
          const total = houses.length;
          const total_cars = houses.filter((h) => h.has_car).length;
          const total_tvs = houses.filter((h) => h.has_tv).length;
          const total_married_couples = houses.reduce((acc, h) => acc + (h.married_couples || 0), 0);
          const total_rooms = houses.reduce((acc, h) => acc + (h.total_rooms || 0), 0);
          
          setStats({
            total,
            total_cars,
            total_tvs,
            total_married_couples,
            total_rooms,
          });

          // Show recent entries that have been filled (non-empty head_name or census_number)
          const active = houses
            .filter((h) => h.census_number || h.head_name)
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
                      <span className="text-white text-xs font-bold">🏠</span>
                    </div>
                    <div>
                      <p className="font-semibold text-navy-900 text-sm">
                        {house.head_name || 'અજ્ઞાત વડા'} ({house.census_number || 'નંબર વગર'})
                      </p>
                      <p className="text-gov-muted text-xs">
                        રૂમ: {house.total_rooms} | દંપતિ: {house.married_couples} | કાર: {house.has_car ? 'હા' : 'ના'} | ટીવી: {house.has_tv ? 'હા' : 'ના'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gov-muted">
                      {new Date(house.updated_at).toLocaleDateString('gu-IN')}
                    </span>
                    <Link href={`/houses/${house.id}`} className="text-saffron-600 hover:text-saffron-700 text-sm font-medium">
                      જુઓ →
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/houses', label: 'મકાન સૂચિ (સર્વે)', icon: '🏘️', color: 'bg-blue-50 border-blue-200 text-blue-700' },
            { href: '/admin', label: 'વ્યવસ્થાપન (ફેરફાર)', icon: '⚙️', color: 'bg-purple-50 border-purple-200 text-purple-700' },
            { href: '/reports', label: 'અહેવાલ અને નિકાસ', icon: '📊', color: 'bg-green-50 border-green-200 text-green-700' },
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
