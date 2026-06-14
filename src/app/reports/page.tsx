'use client';

import { useState, useEffect, useMemo } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { House, Question, HouseAnswer, HouseStatus } from '@/lib/types';
import Navbar from '@/components/Navbar';
import ExportButtons from '@/components/ExportButtons';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatusBadge from '@/components/StatusBadge';
import OfflineIndicator from '@/components/OfflineIndicator';
import { useAuthGuard } from '@/lib/useAuthGuard';

export default function ReportsPage() {
  useAuthGuard();
  const [houses, setHouses] = useState<House[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answersMap, setAnswersMap] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [exportFilter, setExportFilter] = useState<HouseStatus | 'all'>('all');

  useEffect(() => {
    const supabase = getSupabaseClient();

    const fetchData = async () => {
      setLoading(true);
      try {
        const [{ data: housesData }, { data: questionsData }, { data: answersData }] =
          await Promise.all([
            supabase.from('houses').select('*').order('house_no'),
            supabase.from('questions').select(`*, options:question_options(*)`).order('question_no'),
            supabase.from('house_answers').select('*'),
          ]);

        setHouses(housesData || []);
        setQuestions(questionsData || []);

        const map: Record<string, Record<string, string>> = {};
        (answersData || []).forEach((a: HouseAnswer) => {
          if (!map[a.house_id]) map[a.house_id] = {};
          map[a.house_id][a.question_id] = a.answer;
        });
        setAnswersMap(map);
      } catch (err) {
        console.error('Error loading report data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredHouses = useMemo(() => {
    if (exportFilter === 'all') return houses;
    return houses.filter((h) => h.status === exportFilter);
  }, [houses, exportFilter]);

  const stats = useMemo(() => ({
    total: houses.length,
    completed: houses.filter((h) => h.status === 'completed').length,
    draft: houses.filter((h) => h.status === 'draft').length,
    pending: houses.filter((h) => h.status === 'pending').length,
  }), [houses]);

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'કુલ મકાનો', value: stats.total, color: 'text-navy-900' },
                  { label: 'પૂર્ણ', value: stats.completed, color: 'text-green-600' },
                  { label: 'ડ્રાફ્ટ', value: stats.draft, color: 'text-yellow-600' },
                  { label: 'બાકી', value: stats.pending, color: 'text-gray-600' },
                ].map((s) => (
                  <div key={s.label} className="text-center py-3 border border-gov-border rounded-xl">
                    <p className="text-xs text-gov-muted mb-1">{s.label}</p>
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-navy-900">પૂર્ણતા</span>
                  <span className="font-bold text-saffron-600">
                    {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-full bg-gradient-to-r from-saffron-500 to-green-500 rounded-full transition-all"
                    style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Export Section */}
            <div className="gov-card">
              <h2 className="section-heading">ડેટા નિકાસ</h2>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm font-medium text-gov-muted self-center">નિકાસ ફિલ્ટર:</span>
                {[
                  { value: 'all', label: 'બધા' },
                  { value: 'completed', label: 'ફક્ત પૂર્ણ' },
                  { value: 'draft', label: 'ફક્ત ડ્રાફ્ટ' },
                  { value: 'pending', label: 'ફક્ત બાકી' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    id={`export-filter-${opt.value}`}
                    onClick={() => setExportFilter(opt.value as HouseStatus | 'all')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
                      exportFilter === opt.value
                        ? 'bg-navy-900 text-white border-navy-900'
                        : 'bg-white text-navy-900 border-gov-border hover:border-navy-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
                <span className="text-xs text-gov-muted self-center ml-2">
                  ({filteredHouses.length} મકાનો)
                </span>
              </div>

              <ExportButtons
                houses={filteredHouses}
                questions={questions}
                answers={answersMap}
              />
            </div>

            {/* House Table */}
            <div className="gov-card">
              <h2 className="section-heading">મકાન-વાર સ્થિતિ</h2>
              <div className="overflow-x-auto -mx-4 md:-mx-6">
                <table className="w-full text-sm">
                  <thead className="bg-navy-900 text-white">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">મ. નં.</th>
                      <th className="text-left px-4 py-3 font-semibold">માલિક</th>
                      <th className="text-left px-4 py-3 font-semibold">વિસ્તાર</th>
                      <th className="text-left px-4 py-3 font-semibold">સ્થિતિ</th>
                      <th className="text-left px-4 py-3 font-semibold">ભ.પ્ર.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {houses.map((house, idx) => {
                      const hAnswers = answersMap[house.id] || {};
                      const filledCount = Object.values(hAnswers).filter((v) => v && v.trim()).length;
                      return (
                        <tr key={house.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2.5 font-bold text-navy-900">{house.house_no}</td>
                          <td className="px-4 py-2.5 text-gov-text">{house.owner_name}</td>
                          <td className="px-4 py-2.5 text-gov-muted">{house.area}</td>
                          <td className="px-4 py-2.5">
                            <StatusBadge status={house.status} />
                          </td>
                          <td className="px-4 py-2.5 text-gov-muted">
                            {filledCount}/{questions.length}
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
