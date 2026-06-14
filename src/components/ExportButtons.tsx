'use client';

import { useState } from 'react';
import { exportToCSV, exportToExcel, exportCompletionReport } from '@/lib/export';
import { House, Question } from '@/lib/types';

interface ExportButtonsProps {
  houses: House[];
  questions: Question[];
  answers: Record<string, Record<string, string>>;
}

export default function ExportButtons({ houses, questions, answers }: ExportButtonsProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleCSV = async () => {
    setExporting('csv');
    try {
      exportToCSV(houses, questions, answers);
    } finally {
      setTimeout(() => setExporting(null), 1000);
    }
  };

  const handleExcel = async () => {
    setExporting('excel');
    try {
      await exportToExcel(houses, questions, answers);
    } finally {
      setTimeout(() => setExporting(null), 1000);
    }
  };

  const handleCompletionReport = () => {
    setExporting('report');
    try {
      exportCompletionReport(houses);
    } finally {
      setTimeout(() => setExporting(null), 1000);
    }
  };

  const buttons = [
    {
      id: 'export-csv-btn',
      label: 'CSV ડાઉનલોડ',
      sublabel: 'Comma Separated',
      icon: '📄',
      key: 'csv',
      onClick: handleCSV,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 'export-excel-btn',
      label: 'Excel ડાઉનલોડ',
      sublabel: 'Spreadsheet (.xlsx)',
      icon: '📊',
      key: 'excel',
      onClick: handleExcel,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      id: 'export-report-btn',
      label: 'પૂર્ણતા અહેવાલ',
      sublabel: 'Completion Report',
      icon: '📋',
      key: 'report',
      onClick: handleCompletionReport,
      color: 'bg-saffron-500 hover:bg-saffron-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {buttons.map((btn) => (
        <button
          key={btn.key}
          id={btn.id}
          onClick={btn.onClick}
          disabled={exporting !== null}
          className={`${btn.color} text-white rounded-xl p-5 flex items-center gap-4
                      transition-all duration-200 active:scale-95 shadow-card
                      hover:shadow-card-hover disabled:opacity-60 disabled:cursor-not-allowed
                      disabled:active:scale-100 text-left`}
        >
          <span className="text-3xl">{btn.icon}</span>
          <div>
            <p className="font-bold text-base leading-tight">
              {exporting === btn.key ? 'તૈયાર થઈ રહ્યું છે...' : btn.label}
            </p>
            <p className="text-xs opacity-80 mt-0.5">{btn.sublabel}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
