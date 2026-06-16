'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { House, HouseStatus } from '@/lib/types';
import Navbar from '@/components/Navbar';
import HouseCard from '@/components/HouseCard';
import HouseSearch from '@/components/HouseSearch';
import LoadingSpinner from '@/components/LoadingSpinner';
import OfflineIndicator from '@/components/OfflineIndicator';
import { useSearchParams } from 'next/navigation';
import { useAuthGuard } from '@/lib/useAuthGuard';

const PAGE_SIZE = 20;

function HousesContent() {
  useAuthGuard();
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<HouseStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const supabase = getSupabaseClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter === 'draft' || filter === 'pending' || filter === 'completed') {
      setStatusFilter(filter as HouseStatus);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchHouses = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('houses')
          .select('*')
          .order('house_no', { ascending: true });
        setHouses(data || []);
      } catch (err) {
        console.error('Error fetching houses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const paginatedHouses = useMemo(() => {
    return filteredHouses.slice(0, page * PAGE_SIZE);
  }, [filteredHouses, page]);

  const hasMore = paginatedHouses.length < filteredHouses.length;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-navy-900">મકાન સૂચિ</h1>
        <p className="text-gov-muted text-sm mt-0.5">House List — Survey Status</p>
      </div>

      <HouseSearch
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={(q) => setSearchQuery(q)}
        onStatusChange={(s) => setStatusFilter(s)}
        totalCount={houses.length}
        filteredCount={filteredHouses.length}
      />

      {loading ? (
        <LoadingSpinner message="મકાન સૂચિ લોડ થઈ રહી છે..." />
      ) : filteredHouses.length === 0 ? (
        <div className="gov-card text-center py-12">
          <div className="text-5xl mb-4">🏠</div>
          <h3 className="font-bold text-navy-900 text-lg mb-2">કોઈ મકાન મળ્યું નહીં</h3>
          <p className="text-gov-muted text-sm">
            {searchQuery ? `"${searchQuery}" માટે કોઈ પરિણામ નથી` : 'ફિલ્ટર બદલો'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 btn-secondary text-sm px-4 py-2"
            >
              શોધ ક્લિઅર કરો
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedHouses.map((house) => (
              <HouseCard key={house.id} house={house} />
            ))}
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
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-4">
        <Suspense fallback={<LoadingSpinner message="લોડ થઈ રહ્યો છે..." />}>
          <HousesContent />
        </Suspense>
      </main>
      <OfflineIndicator />
    </>
  );
}

