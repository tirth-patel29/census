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
  const q1 = questions.find((q) => q.question_no === 1);
  const q2 = questions.find((q) => q.question_no === 2);
  const q3 = questions.find((q) => q.question_no === 3);
  const q4 = questions.find((q) => q.question_no === 4);
  const q5 = questions.find((q) => q.question_no === 5);
  const q6 = questions.find((q) => q.question_no === 6);
  const q7 = questions.find((q) => q.question_no === 7);

  const headers = [
    'જનગણના નંબર',
    'મકાન નંબર',
    'વડા નું નામ',
    'ટોટલ રૂમ',
    'પરિણિત દંપતિ ની સંખ્યા',
    'કાર / જીપ',
    'ટીવી',
    'Created Date',
  ];

  const rows = houses.map((house) => {
    const houseAnswers = answers[house.id] || {};
    return [
      q1 ? (houseAnswers[q1.id] || '') : '',
      q2 ? (houseAnswers[q2.id] || '') : '',
      q3 ? (houseAnswers[q3.id] || '') : '',
      q4 ? (houseAnswers[q4.id] || '') : '',
      q5 ? (houseAnswers[q5.id] || '') : '',
      q6 ? (houseAnswers[q6.id] || '') : '',
      q7 ? (houseAnswers[q7.id] || '') : '',
      new Date(house.created_at).toLocaleDateString('gu-IN'),
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

  const q1 = questions.find((q) => q.question_no === 1);
  const q2 = questions.find((q) => q.question_no === 2);
  const q3 = questions.find((q) => q.question_no === 3);
  const q4 = questions.find((q) => q.question_no === 4);
  const q5 = questions.find((q) => q.question_no === 5);
  const q6 = questions.find((q) => q.question_no === 6);
  const q7 = questions.find((q) => q.question_no === 7);

  const data = houses.map((house) => {
    const houseAnswers = answers[house.id] || {};
    return {
      'જનગણના નંબર': q1 ? (houseAnswers[q1.id] || '') : '',
      'મકાન નંબર': q2 ? (houseAnswers[q2.id] || '') : '',
      'વડા નું નામ': q3 ? (houseAnswers[q3.id] || '') : '',
      'ટોટલ રૂમ': q4 ? (houseAnswers[q4.id] || '') : '',
      'પરિણિત દંપતિ ની સંખ્યા': q5 ? (houseAnswers[q5.id] || '') : '',
      'કાર / જીપ': q6 ? (houseAnswers[q6.id] || '') : '',
      'ટીવી': q7 ? (houseAnswers[q7.id] || '') : '',
      'Created Date': new Date(house.created_at).toLocaleDateString('gu-IN'),
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'સર્વે ડેટા');

  // Column widths
  const colWidths = [
    { wch: 18 }, // census_number
    { wch: 15 }, // house_no
    { wch: 25 }, // owner_name
    { wch: 12 }, // total_rooms
    { wch: 22 }, // married_couples
    { wch: 12 }, // has_car
    { wch: 10 }, // has_tv
    { wch: 15 }, // date
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
