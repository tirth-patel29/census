'use client';

import { Question } from '@/lib/types';

interface SurveyQuestionProps {
  question: Question;
  answer: string;
  onChange: (questionId: string, value: string) => void;
  disabled?: boolean;
}

export default function SurveyQuestion({ question, answer, onChange, disabled }: SurveyQuestionProps) {
  const handleChange = (value: string) => {
    onChange(question.id, value);
  };

  return (
    <div
      id={`question-${question.question_no}`}
      className="gov-card border-l-4 border-l-saffron-500 hover:border-l-saffron-600 transition-colors"
    >
      {/* Question Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center
                        text-sm font-bold flex-shrink-0 mt-0.5">
          {question.question_no}
        </div>
        <h3 className="text-base font-semibold text-navy-900 leading-snug">
          {question.question_text_gujarati}
        </h3>
      </div>

      {/* Answer Input based on type */}
      <div className="ml-11">
        {(question.answer_type === 'text') && (
          <input
            id={`answer-${question.id}`}
            type="text"
            className="gov-input"
            value={answer}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            placeholder="અહીં જવાબ દાખલ કરો..."
          />
        )}

        {(question.answer_type === 'number') && (
          <input
            id={`answer-${question.id}`}
            type="number"
            className="gov-input max-w-xs"
            value={answer}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            placeholder="0"
            min="0"
          />
        )}

        {(question.answer_type === 'radio' || question.answer_type === 'select') && question.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {question.options
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((option) => (
                <label
                  key={option.id}
                  className={`radio-option ${answer === option.option_label ? 'selected' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                  htmlFor={`option-${option.id}`}
                >
                  <input
                    id={`option-${option.id}`}
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.option_label}
                    checked={answer === option.option_label}
                    onChange={() => handleChange(option.option_label)}
                    disabled={disabled}
                    className="w-5 h-5 flex-shrink-0"
                  />
                  <span className="leading-snug">{option.option_label}</span>
                </label>
              ))}
          </div>
        )}

        {/* Show current answer if answered */}
        {answer && question.answer_type !== 'radio' && question.answer_type !== 'select' && (
          <div className="mt-2 flex items-center gap-1.5 text-green-600 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>ભર્યું</span>
          </div>
        )}
      </div>
    </div>
  );
}
