'use client';

import { Question } from '@/lib/types';

interface SurveyQuestionProps {
  question: Question;
  answer: string;
  onChange: (questionId: string, value: string) => void;
  disabled?: boolean;
}

export default function SurveyQuestion({
  question,
  answer,
  onChange,
  disabled = false,
}: SurveyQuestionProps) {
  const { question_no, question_text_gujarati, answer_type, options = [] } = question;

  const renderInput = () => {
    switch (answer_type) {
      case 'text':
        return (
          <input
            type="text"
            className="gov-input"
            value={answer}
            onChange={(e) => onChange(question.id, e.target.value)}
            disabled={disabled}
            placeholder="જવાબ લખો..."
          />
        );
      case 'number':
        return (
          <input
            type="number"
            className="gov-input"
            value={answer}
            onChange={(e) => onChange(question.id, e.target.value)}
            disabled={disabled}
            placeholder="સંખ્યા લખો..."
          />
        );
      case 'select':
        return (
          <select
            className="gov-input bg-white"
            value={answer}
            onChange={(e) => onChange(question.id, e.target.value)}
            disabled={disabled}
          >
            <option value="">પસંદ કરો...</option>
            {options
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((opt) => (
                <option key={opt.id} value={opt.option_label}>
                  {opt.option_label}
                </option>
              ))}
          </select>
        );
      case 'radio':
        return (
          <div className="flex flex-wrap gap-4 mt-2">
            {options
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((opt) => {
                const isChecked = answer === opt.option_label;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-2 px-4 py-2 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      isChecked
                        ? 'border-navy-900 bg-navy-50 text-navy-900 font-semibold'
                        : 'border-gov-border bg-white hover:border-navy-500'
                    } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`question_${question.id}`}
                      value={opt.option_label}
                      checked={isChecked}
                      onChange={() => onChange(question.id, opt.option_label)}
                      disabled={disabled}
                      className="w-4 h-4 text-navy-900 focus:ring-navy-500 border-gray-300"
                    />
                    <span>{opt.option_label}</span>
                  </label>
                );
              })}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="gov-card space-y-3">
      <label className="block text-sm font-semibold text-navy-950">
        {question_no}. {question_text_gujarati}
      </label>
      {renderInput()}
    </div>
  );
}
