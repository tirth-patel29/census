import { House, Question } from './types';

// -------------------------------------------------------
// CSV Export
// -------------------------------------------------------

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportToCSV(
  houses: House[],
  questions: Question[],
  answers: Record<string, Record<string, string>>
): void {
  const sortedQuestions = [...questions].sort((a, b) => a.question_no - b.question_no);

  const headers = [
    'મકાન નંબર',
    'માલિકનું નામ',
    'વિસ્તાર',
    'સ્થિતિ',
    ...sortedQuestions.map((q) => `Q${q.question_no}: ${q.question_text_gujarati}`),
  ];

  const rows = houses.map((house) => {
    const houseAnswers = answers[house.id] || {};
    const statusMap: Record<string, string> = {
      pending: 'બાકી',
      draft: 'ડ્રાફ્ટ',
      completed: 'પૂર્ણ',
    };
    return [
      String(house.house_no),
      house.owner_name,
      house.area,
      statusMap[house.status] || house.status,
      ...sortedQuestions.map((q) => houseAnswers[q.id] || ''),
    ].map(escapeCsvField);
  });

  const csvContent = [headers.map(escapeCsvField), ...rows]
    .map((row) => row.join(','))
    .join('\n');

  const BOM = '\uFEFF'; // UTF-8 BOM for Excel compatibility with Gujarati
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `census_survey_${new Date().toISOString().split('T')[0]}.csv`);
}

// -------------------------------------------------------
// Excel Export using xlsx
// -------------------------------------------------------
export async function exportToExcel(
  houses: House[],
  questions: Question[],
  answers: Record<string, Record<string, string>>
): Promise<void> {
  const XLSX = await import('xlsx');

  const sortedQuestions = [...questions].sort((a, b) => a.question_no - b.question_no);

  const statusMap: Record<string, string> = {
    pending: 'બાકી',
    draft: 'ડ્રાફ્ટ',
    completed: 'પૂર્ણ',
  };

  const data = houses.map((house) => {
    const houseAnswers = answers[house.id] || {};
    const row: Record<string, string | number> = {
      'મકાન નંબર': house.house_no,
      'માલિકનું નામ': house.owner_name,
      'વિસ્તાર': house.area,
      'સ્થિતિ': statusMap[house.status] || house.status,
    };
    sortedQuestions.forEach((q) => {
      row[`Q${q.question_no}: ${q.question_text_gujarati}`] = houseAnswers[q.id] || '';
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'સર્વે ડેટા');

  // Column widths
  const colWidths = [
    { wch: 12 }, // house_no
    { wch: 25 }, // owner_name
    { wch: 15 }, // area
    { wch: 10 }, // status
    ...sortedQuestions.map(() => ({ wch: 30 })),
  ];
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, `census_survey_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// -------------------------------------------------------
// Completion Report CSV
// -------------------------------------------------------
export function exportCompletionReport(houses: House[]): void {
  const total = houses.length;
  const completed = houses.filter((h) => h.status === 'completed').length;
  const draft = houses.filter((h) => h.status === 'draft').length;
  const pending = houses.filter((h) => h.status === 'pending').length;
  const percent = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';

  const rows = [
    ['અહેવાલ', 'જનગણના સર્વે - પૂર્ણતા અહેવાલ'],
    ['તારીખ', new Date().toLocaleDateString('gu-IN')],
    [''],
    ['કુલ મકાનો', String(total)],
    ['પૂર્ણ', String(completed)],
    ['ડ્રાફ્ટ', String(draft)],
    ['બાકી', String(pending)],
    ['પૂર્ણતા %', `${percent}%`],
    [''],
    ['મકાન નં.', 'માલિક', 'વિસ્તાર', 'સ્થિતિ'],
    ...houses.map((h) => [
      String(h.house_no),
      h.owner_name,
      h.area,
      h.status === 'completed' ? 'પૂર્ણ' : h.status === 'draft' ? 'ડ્રાફ્ટ' : 'બાકી',
    ]),
  ];

  const csvContent = rows.map((r) => r.map(escapeCsvField).join(',')).join('\n');
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `completion_report_${new Date().toISOString().split('T')[0]}.csv`);
}

// -------------------------------------------------------
// Helper
// -------------------------------------------------------
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
