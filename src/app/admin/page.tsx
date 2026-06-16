'use client';

import { useState, useEffect, useMemo } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { House } from '@/lib/types';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import OfflineIndicator from '@/components/OfflineIndicator';
import { useAuthGuard } from '@/lib/useAuthGuard';
import Link from 'next/link';

export default function AdminPage() {
  useAuthGuard();
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = getSupabaseClient();

  const fetchHouses = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('houses')
        .select('*')
        .order('created_at', { ascending: false });
      setHouses(data || []);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('શું તમે ખરેખર આ સર્વે રેકોર્ડ કાયમ માટે રદ કરવા ઇચ્છો છો?')) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from('houses').delete().eq('id', id);
      if (error) throw error;
      setHouses((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('ભૂલ: રેકોર્ડ રદ કરી શકાયો નથી.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredHouses = useMemo(() => {
    return houses.filter((house) => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      const matchesCensus = house.census_number ? house.census_number.toLowerCase().includes(query) : false;
      const matchesHead = house.head_name ? house.head_name.toLowerCase().includes(query) : false;
      
      return matchesCensus || matchesHead;
    });
  }, [houses, searchQuery]);

  const stats = useMemo(() => {
    const total = houses.length;
    const filled = houses.filter((h) => h.census_number || h.head_name).length;
    const empty = total - filled;
    return { total, filled, empty };
  }, [houses]);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-4">
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
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'કુલ સર્વે', value: stats.total, color: 'text-navy-900' },
            { label: 'ભરેલા મકાનો', value: stats.filled, color: 'text-green-600' },
            { label: 'ખાલી રેકોર્ડ્સ', value: stats.empty, color: 'text-gray-600' },
          ].map((stat) => (
            <div key={stat.label} className="gov-card text-center py-4">
              <p className="text-xs text-gov-muted">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="gov-card">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="admin-search-input"
              type="text"
              className="gov-input pl-10"
              placeholder="જનગણના નંબર અથવા વડા નું નામ શોધો..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="ડેટા લોડ થઈ રહ્યો છે..." />
        ) : filteredHouses.length === 0 ? (
          <div className="gov-card text-center py-10">
            <p className="text-gov-muted">કોઈ મકાન મળ્યું નહીં</p>
          </div>
        ) : (
          <div className="gov-card p-0 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-navy-900 text-white text-xs uppercase">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-semibold text-center">જનગણના નંબર</th>
                    <th scope="col" className="px-6 py-3 font-semibold">વડા નું નામ</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-center">ટોટલ રૂમ</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-center">પરિણિત દંપતિ</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-center">કાર</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-center">ટીવી</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-center">Created Date</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gov-border">
                  {filteredHouses.map((house, idx) => {
                    const isFilled = !!(house.census_number || house.head_name);
                    return (
                      <tr key={house.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100 transition-colors'}>
                        <td className="px-6 py-4 font-bold text-navy-950 text-center whitespace-nowrap">
                          {house.census_number || <span className="text-red-500 font-normal italic">બાકી</span>}
                        </td>
                        <td className="px-6 py-4 font-medium text-gov-text">
                          {house.head_name || <span className="text-gray-400 italic">ભરેલ નથી</span>}
                        </td>
                        <td className="px-6 py-4 text-center text-gov-text">
                          {isFilled ? house.total_rooms : '-'}
                        </td>
                        <td className="px-6 py-4 text-center text-gov-text">
                          {isFilled ? house.married_couples : '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {isFilled ? (
                            house.has_car ? (
                              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">હા</span>
                            ) : (
                              <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded">ના</span>
                            )
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {isFilled ? (
                            house.has_tv ? (
                              <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">હા</span>
                            ) : (
                              <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded">ના</span>
                            )
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4 text-center text-gov-muted whitespace-nowrap">
                          {new Date(house.created_at).toLocaleDateString('gu-IN')}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/houses/${house.id}`}
                              className="text-green-600 hover:text-green-900 text-xs font-bold bg-green-50 hover:bg-green-100 px-2.5 py-1.5 rounded transition-colors"
                            >
                              👁 જુઓ
                            </Link>
                            <Link
                              href={`/admin/house/${house.id}`}
                              className="text-purple-600 hover:text-purple-900 text-xs font-bold bg-purple-50 hover:bg-purple-100 px-2.5 py-1.5 rounded transition-colors"
                            >
                              ✏️ ફેરફાર
                            </Link>
                            <button
                              onClick={() => handleDelete(house.id)}
                              disabled={deletingId === house.id}
                              className="text-red-600 hover:text-red-900 text-xs font-bold bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded transition-colors disabled:opacity-50"
                            >
                              ❌ રદ કરો
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <OfflineIndicator />
    </>
  );
}
