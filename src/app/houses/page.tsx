'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { House } from '@/lib/types';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import OfflineIndicator from '@/components/OfflineIndicator';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthGuard } from '@/lib/useAuthGuard';
import Link from 'next/link';

const PAGE_SIZE = 20;

function HousesContent() {
  useAuthGuard();
  const router = useRouter();
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const supabase = getSupabaseClient();
  const searchParams = useSearchParams();

  const fetchHouses = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('houses')
        .select('*')
        .order('created_at', { ascending: false });
      setHouses(data || []);
    } catch (err) {
      console.error('Error fetching houses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSurvey = async () => {
    setAdding(true);
    try {
      const { data, error } = await supabase
        .from('houses')
        .insert({
          census_number: '',
          head_name: '',
          total_rooms: 0,
          married_couples: 0,
          has_car: false,
          has_tv: false,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        router.push(`/houses/${data.id}`);
      }
    } catch (err) {
      console.error('Error adding new survey:', err);
      alert('નવો સર્વે શરૂ કરવામાં ભૂલ આવી.');
    } finally {
      setAdding(false);
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

  const paginatedHouses = useMemo(() => {
    return filteredHouses.slice(0, page * PAGE_SIZE);
  }, [filteredHouses, page]);

  const hasMore = paginatedHouses.length < filteredHouses.length;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">મકાન સૂચિ</h1>
          <p className="text-gov-muted text-sm mt-0.5">House List — Census Records</p>
        </div>
        <button
          onClick={handleAddSurvey}
          disabled={adding}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          {adding ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>શરૂ થઈ રહ્યું છે...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>નવો સર્વે ઉમેરો</span>
            </>
          )}
        </button>
      </div>

      {/* Search Input Box */}
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
            id="house-search-input"
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
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="mt-2 text-xs text-gov-muted">
          {filteredHouses.length === houses.length ? (
            <span>કુલ {houses.length} સર્વે રેકોર્ડ્સ</span>
          ) : (
            <span>
              <strong>{filteredHouses.length}</strong> મળ્યા (કુલ {houses.length} માંથી)
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="મકાન સૂચિ લોડ થઈ રહી છે..." />
      ) : filteredHouses.length === 0 ? (
        <div className="gov-card text-center py-12">
          <div className="text-5xl mb-4">🏠</div>
          <h3 className="font-bold text-navy-900 text-lg mb-2">કોઈ મકાન મળ્યું નહીં</h3>
          <p className="text-gov-muted text-sm">
            {searchQuery ? `"${searchQuery}" માટે કોઈ પરિણામ નથી` : 'કોઈ રેકોર્ડ ઉપલબ્ધ નથી'}
          </p>
        </div>
      ) : (
        <>
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
                  {paginatedHouses.map((house, idx) => {
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
                            {isFilled ? (
                              <>
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
                              </>
                            ) : (
                              <Link
                                href={`/houses/${house.id}`}
                                className="text-saffron-600 hover:text-saffron-900 text-xs font-bold bg-saffron-50 hover:bg-saffron-100 px-2.5 py-1.5 rounded transition-colors"
                              >
                                ✏️ ભરો
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {hasMore && (
            <div className="text-center pt-2">
              <button
                id="load-more-btn"
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary px-8"
              >
                વધુ જુઓ ({filteredHouses.length - paginatedHouses.length} બાકી)
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function HousesPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-4">
        <Suspense fallback={<LoadingSpinner message="લોડ થઈ રહ્યો છે..." />}>
          <HousesContent />
        </Suspense>
      </main>
      <OfflineIndicator />
    </>
  );
}
