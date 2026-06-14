'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';
import { House, Question, HouseAnswer } from '@/lib/types';
import Navbar from '@/components/Navbar';
import SurveyForm from '@/components/SurveyForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import OfflineIndicator from '@/components/OfflineIndicator';
import Link from 'next/link';
import { useAuthGuard } from '@/lib/useAuthGuard';

export default function SurveyPage() {
  useAuthGuard();
  const params = useParams();
  const router = useRouter();
  const houseId = params.id as string;

  const [house, setHouse] = useState<House | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<HouseAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

        const { data: questionsData, error: qErr } = await supabase
          .from('questions')
          .select(`*, options:question_options(id, question_id, option_label, sort_order)`)
          .order('question_no', { ascending: true });

        if (qErr) throw qErr;
        setQuestions(questionsData || []);

        const { data: answersData, error: aErr } = await supabase
          .from('house_answers')
          .select('*')
          .eq('house_id', houseId);

        if (aErr) throw aErr;
        setAnswers(answersData || []);
      } catch (err) {
        console.error('Error loading survey:', err);
        setError('ડેટા લોડ કરવામાં ભૂલ. ફરી પ્રયાસ કરો.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [houseId]);

  const handleStatusChange = (newStatus: 'draft' | 'completed') => {
    if (house) {
      setHouse({ ...house, status: newStatus });
    }
    if (newStatus === 'completed') {
      setTimeout(() => router.push('/houses'), 2000);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          <LoadingSpinner size="lg" message="સર્વે ફોર્મ લોડ થઈ રહ્યો છે..." />
        </main>
      </>
    );
  }

  if (error || !house) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          <div className="gov-card text-center py-12">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="font-bold text-navy-900 text-xl mb-2">{error || 'ભૂલ'}</h2>
            <Link href="/houses" className="btn-primary mt-4 inline-flex">← પાછળ જાઓ</Link>
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
          <Link href="/houses" className="hover:text-navy-900 transition-colors">← મકાન સૂચિ</Link>
          <span>/</span>
          <span className="text-navy-900 font-medium">મકાન #{house.house_no}</span>
        </div>

        <SurveyForm
          house={house}
          questions={questions}
          initialAnswers={answers}
          onStatusChange={handleStatusChange}
        />
      </main>
      <OfflineIndicator />
    </>
  );
}
