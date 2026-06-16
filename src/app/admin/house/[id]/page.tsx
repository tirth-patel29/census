'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';
import { House } from '@/lib/types';
import Navbar from '@/components/Navbar';
import SurveyForm from '@/components/SurveyForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

export default function AdminHousePage() {
  const params = useParams();
  const router = useRouter();
  const houseId = params.id as string;

  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(true); // Default to edit mode for the edit page

  useEffect(() => {
    if (!houseId) return;
    const supabase = getSupabaseClient();

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const { data: houseData, error: houseErr } = await supabase
          .from('houses')
          .select('*')
          .eq('id', houseId)
          .single();

        if (houseErr || !houseData) {
          setError('મકાન મળ્યું નહીં');
          setLoading(false);
          return;
        }
        setHouse(houseData);
      } catch (err) {
        setError('ડેટા લોડ કરવામાં ભૂલ');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [houseId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <LoadingSpinner size="lg" message="ડેટા લોડ થઈ રહ્યો છે..." />
        </main>
      </>
    );
  }

  if (error || !house) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="gov-card text-center py-12">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-navy-900 font-bold text-xl mb-4">{error || 'ભૂલ'}</h2>
            <Link href="/admin" className="btn-primary inline-flex">← વ્યવસ્થાપન પેનલ</Link>
          </div>
        </main>
      </>
    );
  }

  const handleSaveSuccess = () => {
    router.push('/admin');
    router.refresh();
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-4 pb-24">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gov-muted">
            <Link href="/admin" className="hover:text-navy-900 transition-colors">← વ્યવસ્થાપન</Link>
            <span>/</span>
            <span className="text-navy-900 font-medium">મકાન #{house.census_number || 'નવું'}</span>
          </div>

          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              editMode
                ? 'bg-purple-100 text-purple-700 border-purple-200'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            {editMode ? '👁 ફક્ત વાંચો (View)' : '✏️ ફેરફાર ચાલુ કરો (Edit)'}
          </button>
        </div>

        {/* Admin Header */}
        <div className="gov-card mb-4 bg-purple-50 border-purple-200 py-3.5 px-5">
          <div className="flex items-center gap-2">
            <span className="text-purple-600 text-lg">⚙️</span>
            <div>
              <p className="font-semibold text-purple-900 text-sm">વ્યવસ્થાપક ફેરફાર (Admin Edit)</p>
              <p className="text-purple-600 text-xs">
                {editMode ? 'સર્વેની વિગતોમાં સીધો ફેરફાર કરો' : 'વાંચન સ્થિતિ'}
              </p>
            </div>
          </div>
        </div>

        <SurveyForm
          house={house}
          readOnly={!editMode}
          onSaveSuccess={handleSaveSuccess}
        />
      </main>
    </>
  );
}
