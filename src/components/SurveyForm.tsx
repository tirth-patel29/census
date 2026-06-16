'use client';

import { useState } from 'react';
import { House } from '@/lib/types';
import { getSupabaseClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface SurveyFormProps {
  house: House;
  readOnly?: boolean;
  onSaveSuccess?: () => void;
}

export default function SurveyForm({ house, readOnly = false, onSaveSuccess }: SurveyFormProps) {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const [submitting, setSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  // Form states
  const [censusNumber, setCensusNumber] = useState(house.census_number || '');
  const [headName, setHeadName] = useState(house.head_name || '');
  const [totalRooms, setTotalRooms] = useState<number | ''>(house.total_rooms ?? '');
  const [marriedCouples, setMarriedCouples] = useState<number | ''>(house.married_couples ?? '');
  const [hasCar, setHasCar] = useState<boolean | null>(house.has_car ?? null);
  const [hasTv, setHasTv] = useState<boolean | null>(house.has_tv ?? null);

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!censusNumber.trim()) {
      newErrors.censusNumber = 'જનગણના નંબર દાખલ કરવો ફરજિયાત છે.';
    }
    if (!headName.trim()) {
      newErrors.headName = 'વડા નું નામ દાખલ કરવું ફરજિયાત છે.';
    }
    if (totalRooms === '' || totalRooms < 0) {
      newErrors.totalRooms = 'ટોટલ રૂમ યોગ્ય સંખ્યામાં દાખલ કરો.';
    }
    if (marriedCouples === '' || marriedCouples < 0) {
      newErrors.marriedCouples = 'પરિણિત દંપતિ ની સંખ્યા યોગ્ય સંખ્યામાં દાખલ કરો.';
    }
    if (hasCar === null) {
      newErrors.hasCar = 'કાર / જીપ ની વિગત પસંદ કરવી ફરજિયાત છે.';
    }
    if (hasTv === null) {
      newErrors.hasTv = 'ટીવી ની વિગત પસંદ કરવી ફરજિયાત છે.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setSaveStatus('idle');

    try {
      const { error } = await supabase
        .from('houses')
        .update({
          census_number: censusNumber.trim(),
          head_name: headName.trim(),
          total_rooms: Number(totalRooms),
          married_couples: Number(marriedCouples),
          has_car: hasCar,
          has_tv: hasTv,
          updated_at: new Date().toISOString(),
        })
        .eq('id', house.id);

      if (error) throw error;

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
      
      if (onSaveSuccess) {
        onSaveSuccess();
      } else {
        router.push('/houses');
        router.refresh();
      }
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sticky Save Status Bar */}
      {saveStatus === 'saved' && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-800 text-sm animate-fade-in flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>માહિતી સફળતાપૂર્વક સાચવવામાં આવી છે!</span>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-800 text-sm animate-fade-in flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>ભૂલ: માહિતી સાચવી શકાઈ નથી. ફરી પ્રયાસ કરો.</span>
        </div>
      )}

      {/* Main Form Fields */}
      <div className="gov-card space-y-5">
        <h2 className="text-xl font-bold text-navy-900 border-b border-gov-border pb-3">
          જનગણના પત્રક વિગત
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Census Number */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-navy-950" htmlFor="census_number">
              ૧. જનગણના નંબર <span className="text-red-500">*</span>
            </label>
            {readOnly ? (
              <div className="p-3 bg-gray-50 border border-gov-border rounded-lg text-gov-text font-bold">
                {censusNumber || <span className="text-red-500 font-normal italic">ખાલી</span>}
              </div>
            ) : (
              <input
                id="census_number"
                type="text"
                className={`gov-input font-semibold ${errors.censusNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                placeholder="દા.ત. C-001"
                value={censusNumber}
                onChange={(e) => {
                  setCensusNumber(e.target.value);
                  if (errors.censusNumber) setErrors({ ...errors, censusNumber: '' });
                }}
              />
            )}
            {errors.censusNumber && <p className="text-xs text-red-600 font-medium">{errors.censusNumber}</p>}
          </div>

          {/* Head of Family Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-navy-950" htmlFor="head_name">
              ૨. વડા નું નામ <span className="text-red-500">*</span>
            </label>
            {readOnly ? (
              <div className="p-3 bg-gray-50 border border-gov-border rounded-lg text-gov-text">
                {headName || <span className="text-gray-400 italic">ભરેલ નથી</span>}
              </div>
            ) : (
              <input
                id="head_name"
                type="text"
                className={`gov-input ${errors.headName ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                placeholder="પૂરું નામ દાખલ કરો"
                value={headName}
                onChange={(e) => {
                  setHeadName(e.target.value);
                  if (errors.headName) setErrors({ ...errors, headName: '' });
                }}
              />
            )}
            {errors.headName && <p className="text-xs text-red-600 font-medium">{errors.headName}</p>}
          </div>

          {/* Total Rooms */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-navy-950" htmlFor="total_rooms">
              ૩. ટોટલ રૂમ <span className="text-red-500">*</span>
            </label>
            {readOnly ? (
              <div className="p-3 bg-gray-50 border border-gov-border rounded-lg text-gov-text">
                {totalRooms !== '' ? totalRooms : <span className="text-gray-400 italic">ભરેલ નથી</span>}
              </div>
            ) : (
              <input
                id="total_rooms"
                type="number"
                min="0"
                className={`gov-input ${errors.totalRooms ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                placeholder="રૂમની સંખ્યા"
                value={totalRooms}
                onChange={(e) => {
                  setTotalRooms(e.target.value === '' ? '' : Number(e.target.value));
                  if (errors.totalRooms) setErrors({ ...errors, totalRooms: '' });
                }}
              />
            )}
            {errors.totalRooms && <p className="text-xs text-red-600 font-medium">{errors.totalRooms}</p>}
          </div>

          {/* Married Couples */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-navy-950" htmlFor="married_couples">
              ૪. પરિણિત દંપતિ ની સંખ્યા <span className="text-red-500">*</span>
            </label>
            {readOnly ? (
              <div className="p-3 bg-gray-50 border border-gov-border rounded-lg text-gov-text">
                {marriedCouples !== '' ? marriedCouples : <span className="text-gray-400 italic">ભરેલ નથી</span>}
              </div>
            ) : (
              <input
                id="married_couples"
                type="number"
                min="0"
                className={`gov-input ${errors.marriedCouples ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`}
                placeholder="દંપતિની સંખ્યા"
                value={marriedCouples}
                onChange={(e) => {
                  setMarriedCouples(e.target.value === '' ? '' : Number(e.target.value));
                  if (errors.marriedCouples) setErrors({ ...errors, marriedCouples: '' });
                }}
              />
            )}
            {errors.marriedCouples && <p className="text-xs text-red-600 font-medium">{errors.marriedCouples}</p>}
          </div>

          {/* Has Car */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-navy-950">
              ૫. કાર / જીપ <span className="text-red-500">*</span>
            </label>
            {readOnly ? (
              <div className="p-3 bg-gray-50 border border-gov-border rounded-lg text-gov-text">
                {hasCar === null ? <span className="text-gray-400 italic">ભરેલ નથી</span> : hasCar ? 'હા' : 'ના'}
              </div>
            ) : (
              <div className="flex gap-4">
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 font-semibold ${hasCar === true ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-gov-border hover:border-blue-400 bg-white'}`}>
                  <input
                    type="radio"
                    name="has_car"
                    checked={hasCar === true}
                    onChange={() => {
                      setHasCar(true);
                      if (errors.hasCar) setErrors({ ...errors, hasCar: '' });
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span>હા</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 font-semibold ${hasCar === false ? 'border-red-600 bg-red-50 text-red-900' : 'border-gov-border hover:border-red-400 bg-white'}`}>
                  <input
                    type="radio"
                    name="has_car"
                    checked={hasCar === false}
                    onChange={() => {
                      setHasCar(false);
                      if (errors.hasCar) setErrors({ ...errors, hasCar: '' });
                    }}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span>ના</span>
                </label>
              </div>
            )}
            {errors.hasCar && <p className="text-xs text-red-600 font-medium">{errors.hasCar}</p>}
          </div>

          {/* Has TV */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-navy-950">
              ૬. ટીવી <span className="text-red-500">*</span>
            </label>
            {readOnly ? (
              <div className="p-3 bg-gray-50 border border-gov-border rounded-lg text-gov-text">
                {hasTv === null ? <span className="text-gray-400 italic">ભરેલ નથી</span> : hasTv ? 'હા' : 'ના'}
              </div>
            ) : (
              <div className="flex gap-4">
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 font-semibold ${hasTv === true ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-gov-border hover:border-blue-400 bg-white'}`}>
                  <input
                    type="radio"
                    name="has_tv"
                    checked={hasTv === true}
                    onChange={() => {
                      setHasTv(true);
                      if (errors.hasTv) setErrors({ ...errors, hasTv: '' });
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span>હા</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 font-semibold ${hasTv === false ? 'border-red-600 bg-red-50 text-red-900' : 'border-gov-border hover:border-red-400 bg-white'}`}>
                  <input
                    type="radio"
                    name="has_tv"
                    checked={hasTv === false}
                    onChange={() => {
                      setHasTv(false);
                      if (errors.hasTv) setErrors({ ...errors, hasTv: '' });
                    }}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span>ના</span>
                </label>
              </div>
            )}
            {errors.hasTv && <p className="text-xs text-red-600 font-medium">{errors.hasTv}</p>}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!readOnly && (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push('/houses')}
            className="btn-secondary px-6 py-2.5"
            disabled={submitting}
          >
            રદ કરો
          </button>
          <button
            type="submit"
            className="btn-success px-8 py-2.5 flex items-center gap-2"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>સાચવી રહ્યું છે...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>માહિતી સાચવો</span>
              </>
            )}
          </button>
        </div>
      )}
    </form>
  );
}
