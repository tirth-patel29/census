'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';
import { House, Question, HouseAnswer } from '@/lib/types';
import Navbar from '@/components/Navbar';
import SurveyForm from '@/components/SurveyForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

export default function AdminHousePage() {
  const params = useParams();
  const houseId = params.id as string;

  const [house, setHouse] = useState<House | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<HouseAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

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

        const { data: questionsData } = await supabase
          .from('questions')
          .select(`*, options:question_options(id, question_id, option_label, sort_order)`)
          .order('question_no', { ascending: true });

        setQuestions(questionsData || []);

        const { data: answersData } = await supabase
          .from('house_answers')
          .select('*')
          .eq('house_id', houseId);

        setAnswers(answersData || []);
      } catch (err) {
        setError('ડેટા લોડ કરવામાં ભૂલ');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [houseId]);

  const handleStatusChange = (newStatus: 'draft' | 'completed') => {
    if (house) setHouse({ ...house, status: newStatus });
  };

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
            <Link href="/admin" className="btn-primary inline-flex">← પાછળ</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-4 pb-24">
        <div className="flex items-center gap-2 text-sm text-gov-muted mb-4">
          <Link href="/admin" className="hover:text-navy-900 transition-colors">← વ્યવસ્થાપન</Link>
          <span>/</span>
          <span className="text-navy-900 font-medium">મકાન #{house.house_no}</span>
        </div>

        {/* Admin Controls */}
        <div className="gov-card mb-4 bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-purple-600 text-lg">⚙️</span>
              <div>
                <p className="font-semibold text-purple-900 text-sm">વ્યવસ્થાપક દૃષ્ટિ</p>
                <p className="text-purple-600 text-xs">
                  Admin View — {editMode ? 'ફેરફાર સ્થિતિ' : 'ફક્ત વાંચો'}
                </p>
              </div>
            </div>
            <button
              id="admin-edit-toggle"
              onClick={() => setEditMode(!editMode)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                editMode
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50'
              }`}
            >
              {editMode ? '✏️ ફેરફાર ચાલુ' : '👁 ફક્ત વાંચો'}
            </button>
          </div>
        </div>

        <SurveyForm
          house={house}
          questions={questions}
          initialAnswers={answers}
          readOnly={!editMode}
          onStatusChange={handleStatusChange}
        />
      </main>
    </>
  );
}

