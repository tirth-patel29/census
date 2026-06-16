'use client';

import { useState, useEffect, useMemo } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { House, HouseStatus } from '@/lib/types';
import Navbar from '@/components/Navbar';
import HouseCard from '@/components/HouseCard';
import HouseSearch from '@/components/HouseSearch';
import LoadingSpinner from '@/components/LoadingSpinner';
import OfflineIndicator from '@/components/OfflineIndicator';
import { useAuthGuard } from '@/lib/useAuthGuard';

export default function AdminPage() {
  useAuthGuard();
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<HouseStatus | 'all'>('all');
  const [unlocking, setUnlocking] = useState<string | null>(null);

  const fetchHouses = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from('houses')
        .select('*')
        .order('house_no', { ascending: true });
      setHouses(data || []);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleUnlock = async (id: string) => {
    if (!confirm('શું તમે ખરેખર આ સર્વે અનલૉક કરવા ઇચ્છો છો?')) return;
    setUnlocking(id);
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('houses')
        .update({ status: 'draft' })
        .eq('id', id);
      if (error) throw error;
      setHouses((prev) => prev.map((h) => (h.id === id ? { ...h, status: 'draft' } : h)));
    } catch {
      alert('અનલૉક કરવામાં ભૂલ.');
    } finally {
      setUnlocking(null);
    }
  };

  const filteredHouses = useMemo(() => {
    return houses.filter((house) => {
      const matchesStatus = statusFilter === 'all' || house.status === statusFilter;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        house.house_no.toString().includes(query) ||
        house.owner_name.toLowerCase().includes(query) ||
        house.area.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [houses, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: houses.length,
    completed: houses.filter((h) => h.status === 'completed').length,
    draft: houses.filter((h) => h.status === 'draft').length,
    pending: houses.filter((h) => h.status === 'pending').length,
  }), [houses]);

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">વ્યવસ્થાપન પૅનલ</h1>
            <p className="text-gov-muted text-sm">Admin Panel — Manage All Surveys</p>
          </div>
          <button
            id="admin-refresh-btn"
            onClick={fetchHouses}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gov-border rounded-lg text-sm font-medium hover:border-navy-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            રિફ્રેશ
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'કુલ', value: stats.total, color: 'text-navy-900' },
            { label: 'પૂર્ણ', value: stats.completed, color: 'text-green-600' },
            { label: 'ડ્રાફ્ટ', value: stats.draft, color: 'text-yellow-600' },
            { label: 'બાકી', value: stats.pending, color: 'text-gray-600' },
          ].map((stat) => (
            <div key={stat.label} className="gov-card text-center py-4">
              <p className="text-xs text-gov-muted">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <HouseSearch
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
          totalCount={houses.length}
          filteredCount={filteredHouses.length}
        />

        {loading ? (
          <LoadingSpinner message="ડેટા લોડ થઈ રહ્યો છે..." />
        ) : filteredHouses.length === 0 ? (
          <div className="gov-card text-center py-10">
            <p className="text-gov-muted">કોઈ મકાન મળ્યું નહીં</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHouses.map((house) => (
              <div key={house.id} className={unlocking === house.id ? 'opacity-50 pointer-events-none' : ''}>
                <HouseCard house={house} showEditButton onUnlock={handleUnlock} />
              </div>
            ))}
          </div>
        )}
      </main>
      <OfflineIndicator />
    </>
  );
}

