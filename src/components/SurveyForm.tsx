'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useRef } from 'react';
import { House, Question, HouseAnswer } from '@/lib/types';
import { getSupabaseClient } from '@/lib/supabase';
import {
  addToOfflineQueue,
  saveDraftLocally,
  getDraftLocally,
  syncOfflineQueue,
} from '@/lib/offline';
import SurveyQuestion from './SurveyQuestion';
import StatusBadge from './StatusBadge';

interface SurveyFormProps {
  house: House;
  questions: Question[];
  initialAnswers: HouseAnswer[];
  readOnly?: boolean;
  onStatusChange?: (newStatus: 'draft' | 'completed') => void;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline';

export default function SurveyForm({
  house,
  questions,
  initialAnswers,
  readOnly = false,
  onStatusChange,
}: SurveyFormProps) {
  const supabase = getSupabaseClient();
  const supabaseRef = useRef(supabase);
  const houseRef = useRef(house);
  const onStatusChangeRef = useRef(onStatusChange);

  // Keep refs current
  useEffect(() => { supabaseRef.current = supabase; }, [supabase]);
  useEffect(() => { houseRef.current = house; }, [house]);
  useEffect(() => { onStatusChangeRef.current = onStatusChange; }, [onStatusChange]);

  // Map of questionId -> answer string
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    initialAnswers.forEach((a) => {
      map[a.question_id] = a.answer;
    });
    return map;
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [submitting, setSubmitting] = useState(false);
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Core save function (stable via ref)
  const saveToSupabase = useCallback(async (
    house_id: string,
    question_id: string,
    answer: string
  ) => {
    const { error } = await supabaseRef.current
      .from('house_answers')
      .upsert(
        { house_id, question_id, answer, updated_at: new Date().toISOString() },
        { onConflict: 'house_id,question_id' }
      );
    if (error) throw error;
  }, []);

  // On mount: merge local drafts (browser refresh recovery)
  useEffect(() => {
    const localDraft = getDraftLocally(house.id);
    if (Object.keys(localDraft).length > 0) {
      setAnswers((prev) => ({ ...localDraft, ...prev }));
    }
  }, [house.id]);

  // On mount: sync offline queue when online
  useEffect(() => {
    if (navigator.onLine) {
      syncOfflineQueue(saveToSupabase);
    }
    const handleOnline = () => syncOfflineQueue(saveToSupabase);
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [saveToSupabase]);

  const saveAnswer = useCallback(async (questionId: string, value: string) => {
    const currentHouse = houseRef.current;
    // Always save locally first
    saveDraftLocally(currentHouse.id, questionId, value);

    if (!navigator.onLine) {
      addToOfflineQueue({
        house_id: currentHouse.id,
        question_id: questionId,
        answer: value,
        timestamp: Date.now(),
      });
      setSaveStatus('offline');

      if (currentHouse.status === 'pending') {
        await supabaseRef.current
          .from('houses')
          .update({ status: 'draft' })
          .eq('id', currentHouse.id);
      }
      return;
    }

    setSaveStatus('saving');
    try {
      await saveToSupabase(currentHouse.id, questionId, value);

      if (currentHouse.status === 'pending') {
        await supabaseRef.current
          .from('houses')
          .update({ status: 'draft' })
          .eq('id', currentHouse.id);
        onStatusChangeRef.current?.('draft');
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      addToOfflineQueue({
        house_id: currentHouse.id,
        question_id: questionId,
        answer: value,
        timestamp: Date.now(),
      });
    }
  }, [saveToSupabase]);

  // Handle answer change with debounce for text/number, immediate for radio
  const handleAnswerChange = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    saveDraftLocally(houseRef.current.id, questionId, value);

    const question = questions.find((q) => q.id === questionId);
    const isImmediate = question?.answer_type === 'radio' || question?.answer_type === 'select';

    if (isImmediate) {
      saveAnswer(questionId, value);
    } else {
      if (debounceTimers.current[questionId]) {
        clearTimeout(debounceTimers.current[questionId]);
      }
      debounceTimers.current[questionId] = setTimeout(() => {
        saveAnswer(questionId, value);
      }, 600);
    }
  }, [questions, saveAnswer]);

  // Load Standard Answers from question default_values
  const loadStandardAnswers = useCallback(async () => {
    const currentHouse = houseRef.current;
    const newAnswers: Record<string, string> = {};
    questions.forEach((q) => {
      if (q.default_value) {
        newAnswers[q.id] = q.default_value;
      }
    });

    setAnswers((prev) => ({ ...prev, ...newAnswers }));
    setSaveStatus('saving');

    try {
      const upsertData = Object.entries(newAnswers).map(([question_id, answer]) => ({
        house_id: currentHouse.id,
        question_id,
        answer,
        updated_at: new Date().toISOString(),
      }));

      if (upsertData.length > 0) {
        await supabaseRef.current
          .from('house_answers')
          .upsert(upsertData, { onConflict: 'house_id,question_id' });

        if (currentHouse.status === 'pending') {
          await supabaseRef.current
            .from('houses')
            .update({ status: 'draft' })
            .eq('id', currentHouse.id);
          onStatusChangeRef.current?.('draft');
        }
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    }
  }, [questions]);

  // Copy Previous House answers
  const copyPreviousHouse = useCallback(async () => {
    const currentHouse = houseRef.current;
    const prevHouseNo = currentHouse.house_no - 1;
    if (prevHouseNo < 1) {
      alert('આ પ્રથમ મકાન છે, કોઈ અગાઉનું મકાન નથી.');
      return;
    }

    setSaveStatus('saving');
    try {
      const { data: prevHouse } = await supabaseRef.current
        .from('houses')
        .select('id')
        .eq('house_no', prevHouseNo)
        .single();

      if (!prevHouse) {
        alert(`મકાન નં. ${prevHouseNo} નહી મળ્યું.`);
        setSaveStatus('idle');
        return;
      }

      const { data: prevAnswers } = await supabaseRef.current
        .from('house_answers')
        .select('question_id, answer')
        .eq('house_id', prevHouse.id);

      if (!prevAnswers || prevAnswers.length === 0) {
        alert(`મકાન નં. ${prevHouseNo} માટે કોઈ ડેટા નથી.`);
        setSaveStatus('idle');
        return;
      }

      const newAnswers: Record<string, string> = {};
      prevAnswers.forEach((a: { question_id: string; answer: string }) => {
        newAnswers[a.question_id] = a.answer;
      });
      setAnswers((prev) => ({ ...prev, ...newAnswers }));

      const upsertData = prevAnswers.map((a: { question_id: string; answer: string }) => ({
        house_id: currentHouse.id,
        question_id: a.question_id,
        answer: a.answer,
        updated_at: new Date().toISOString(),
      }));

      await supabaseRef.current
        .from('house_answers')
        .upsert(upsertData, { onConflict: 'house_id,question_id' });

      if (currentHouse.status === 'pending') {
        await supabaseRef.current
          .from('houses')
          .update({ status: 'draft' })
          .eq('id', currentHouse.id);
        onStatusChangeRef.current?.('draft');
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    }
  }, []);

  // Mark survey complete
  const markComplete = useCallback(async () => {
    const currentHouse = houseRef.current;
    setSubmitting(true);
    try {
      const { error } = await supabaseRef.current
        .from('houses')
        .update({ status: 'completed' })
        .eq('id', currentHouse.id);

      if (error) throw error;
      onStatusChangeRef.current?.('completed');
    } catch {
      alert('ભૂલ: સ્થિતિ અપડેટ ન થઈ. ફરી પ્રયાસ કરો.');
    } finally {
      setSubmitting(false);
    }
  }, []);

  const answeredCount = Object.values(answers).filter((v) => v && v.trim() !== '').length;
  const totalQuestions = questions.length;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Sticky Header */}
      <div className="gov-card border-b-4 border-b-saffron-500 sticky top-16 z-30 bg-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-navy-900">
                મકાન #{house.house_no}
              </span>
              <StatusBadge status={house.status} />
            </div>
            <p className="text-gov-muted text-sm">{house.owner_name} — {house.area}</p>
          </div>

          {/* Save Status */}
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-1.5 text-saffron-600 text-sm">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>સ્વ-સંગ્રહ...</span>
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-1.5 text-green-600 text-sm animate-fade-in">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>સ્વ-સંગ્રહ ✓</span>
              </div>
            )}
            {saveStatus === 'offline' && (
              <div className="flex items-center gap-1.5 text-orange-600 text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>ઑફ-લાઇન (સ્થાનિક)</span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="text-red-600 text-sm">⚠ ભૂલ</div>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gov-muted mb-1">
            <span>{answeredCount} / {totalQuestions} પ્રશ્નો ભર્યા</span>
            <span>{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-full bg-gradient-to-r from-saffron-500 to-green-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {!readOnly && (
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              id="load-standard-btn"
              onClick={loadStandardAnswers}
              title="તમામ પ્રશ્નોમાં સામાન્ય જવાબ ભરો"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              માનક જવાબ ભરો
            </button>

            <button
              id="copy-prev-btn"
              onClick={copyPreviousHouse}
              disabled={house.house_no <= 1}
              title={`મકાન નં. ${house.house_no - 1} ના જવાબ કૉપી કરો`}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              અ.મ. કૉપી (#{house.house_no - 1})
            </button>

            {house.status !== 'completed' && (
              <button
                id="mark-complete-btn"
                onClick={markComplete}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ml-auto"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    સર્વે પૂર્ણ કરો
                  </>
                )}
              </button>
            )}

            {house.status === 'completed' && (
              <div className="ml-auto flex items-center gap-2 text-green-600 font-semibold text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                સર્વે પૂર્ણ થઈ ગયો
              </div>
            )}
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {questions
          .sort((a, b) => a.question_no - b.question_no)
          .map((question) => (
            <SurveyQuestion
              key={question.id}
              question={question}
              answer={answers[question.id] || ''}
              onChange={handleAnswerChange}
              disabled={readOnly || house.status === 'completed'}
            />
          ))}
      </div>

      {/* Bottom Complete Button */}
      {!readOnly && house.status !== 'completed' && (
        <div className="gov-card flex items-center justify-between">
          <div className="text-sm text-gov-muted">
            {answeredCount} / {totalQuestions} ભર્યા
          </div>
          <button
            id="mark-complete-btn-bottom"
            onClick={markComplete}
            disabled={submitting}
            className="btn-success flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            સર્વે પૂર્ણ કરો
          </button>
        </div>
      )}
    </div>
  );
}

