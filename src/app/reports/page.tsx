'use client';

import { useState, useEffect, useMemo } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { House } from '@/lib/types';
import Navbar from '@/components/Navbar';
import ExportButtons from '@/components/ExportButtons';
import LoadingSpinner from '@/components/LoadingSpinner';
import OfflineIndicator from '@/components/OfflineIndicator';
import { useAuthGuard } from '@/lib/useAuthGuard';

export default function ReportsPage() {
  useAuthGuard();
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: housesData } = await supabase
          .from('houses')
          .select('*')
          .order('created_at', { ascending: false });

        setHouses(housesData || []);
      } catch (err) {
        console.error('Error loading report data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    const total = houses.length;
    const total_cars = houses.filter((h) => h.has_car).length;
    const total_tvs = houses.filter((h) => h.has_tv).length;
    const total_married_couples = houses.reduce((acc, h) => acc + (h.married_couples || 0), 0);
    const total_rooms = houses.reduce((acc, h) => acc + (h.total_rooms || 0), 0);
    const filled = houses.filter((h) => h.census_number || h.head_name).length;
    
    return {
      total,
      total_cars,
      total_tvs,
      total_married_couples,
      total_rooms,
      filled,
    };
  }, [houses]);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">અહેવાલ અને નિકાસ</h1>
          <p className="text-gov-muted text-sm">Reports & Export — Census Data</p>
        </div>

        {loading ? (
          <LoadingSpinner message="ડેટા લોડ થઈ રહ્યો છે..." />
        ) : (
          <>
            {/* Summary Stats */}
            <div className="gov-card">
              <h2 className="section-heading">સારાંશ</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'કુલ સર્વે', value: stats.total, color: 'text-navy-900' },
                  { label: 'કુલ કાર / જીપ', value: stats.total_cars, color: 'text-blue-600' },
                  { label: 'કુલ ટીવી', value: stats.total_tvs, color: 'text-indigo-600' },
                  { label: 'પરિણિત દંપતિ', value: stats.total_married_couples, color: 'text-red-600' },
                  { label: 'કુલ રૂમ', value: stats.total_rooms, color: 'text-green-600' },
                ].map((s) => (
                  <div key={s.label} className="text-center py-3 border border-gov-border rounded-xl">
                    <p className="text-xs text-gov-muted mb-1">{s.label}</p>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-navy-900">ભરેલા ફોર્મ્સની વિગત</span>
                  <span className="font-bold text-saffron-600">
                    {stats.total > 0 ? ((stats.filled / stats.total) * 100).toFixed(1) : 0}% ({stats.filled} / {stats.total})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-full bg-gradient-to-r from-saffron-500 to-green-500 rounded-full transition-all"
                    style={{ width: `${stats.total > 0 ? (stats.filled / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Export Section */}
            <div className="gov-card">
              <h2 className="section-heading">ડેટા નિકાસ</h2>
              <ExportButtons houses={houses} />
            </div>

            {/* House Table */}
            <div className="gov-card">
              <h2 className="section-heading">મકાન-વાર સર્વે રેકોર્ડ્સ</h2>
              <div className="overflow-x-auto -mx-4 md:-mx-6">
                <table className="w-full text-sm">
                  <thead className="bg-navy-900 text-white">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-center">જનગણના નંબર</th>
                      <th className="text-left px-4 py-3 font-semibold">વડા નું નામ</th>
                      <th className="px-4 py-3 font-semibold text-center">રૂમ</th>
                      <th className="px-4 py-3 font-semibold text-center">દંપતિ</th>
                      <th className="px-4 py-3 font-semibold text-center">કાર</th>
                      <th className="px-4 py-3 font-semibold text-center">ટીવી</th>
                      <th className="px-4 py-3 font-semibold text-center">તારીખ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {houses.map((house, idx) => {
                      const isFilled = !!(house.census_number || house.head_name);
                      return (
                        <tr key={house.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2.5 font-bold text-navy-900 text-center">
                            {house.census_number || <span className="text-red-500 font-normal italic">બાકી</span>}
                          </td>
                          <td className="px-4 py-2.5 text-gov-text">
                            {house.head_name || <span className="text-gray-400 italic">ભરેલ નથી</span>}
                          </td>
                          <td className="px-4 py-2.5 text-center text-gov-text">{isFilled ? house.total_rooms : '-'}</td>
                          <td className="px-4 py-2.5 text-center text-gov-text">{isFilled ? house.married_couples : '-'}</td>
                          <td className="px-4 py-2.5 text-center text-gov-text">
                            {isFilled ? (house.has_car ? 'હા' : 'ના') : '-'}
                          </td>
                          <td className="px-4 py-2.5 text-center text-gov-text">
                            {isFilled ? (house.has_tv ? 'હા' : 'ના') : '-'}
                          </td>
                          <td className="px-4 py-2.5 text-center text-gov-muted">
                            {new Date(house.created_at).toLocaleDateString('gu-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
      <OfflineIndicator />
    </>
  );
}
