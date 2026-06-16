import { House } from './types';

// -------------------------------------------------------
// CSV Export
// -------------------------------------------------------

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportToCSV(houses: House[]): void {
  const headers = [
    'જનગણના નંબર',
    'વડા નું નામ',
    'ટોટલ રૂમ',
    'પરિણિત દંપતિ ની સંખ્યા',
    'કાર / જીપ',
    'ટીવી',
    'તારીખ',
  ];

  const rows = houses.map((house) => {
    return [
      house.census_number || '',
      house.head_name || '',
      String(house.total_rooms ?? 0),
      String(house.married_couples ?? 0),
      house.has_car ? 'હા' : 'ના',
      house.has_tv ? 'હા' : 'ના',
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
export async function exportToExcel(houses: House[]): Promise<void> {
  const XLSX = await import('xlsx');

  const data = houses.map((house) => {
    return {
      'જનગણના નંબર': house.census_number || '',
      'વડા નું નામ': house.head_name || '',
      'ટોટલ રૂમ': house.total_rooms ?? 0,
      'પરિણિત દંપતિ ની સંખ્યા': house.married_couples ?? 0,
      'કાર / જીપ': house.has_car ? 'હા' : 'ના',
      'ટીવી': house.has_tv ? 'હા' : 'ના',
      'તારીખ': new Date(house.created_at).toLocaleDateString('gu-IN'),
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'સર્વે ડેટા');

  // Column widths
  const colWidths = [
    { wch: 18 }, // census_number
    { wch: 30 }, // head_name
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
// Summary Report CSV
// -------------------------------------------------------
export function exportCompletionReport(houses: House[]): void {
  const total = houses.length;
  const filled = houses.filter((h) => h.census_number || h.head_name).length;
  const empty = total - filled;

  const rows = [
    ['અહેવાલ', 'જનગણના સર્વે - સારાંશ અહેવાલ'],
    ['તારીખ', new Date().toLocaleDateString('gu-IN')],
    [''],
    ['કુલ સર્વે રેકોર્ડ્સ', String(total)],
    ['ભરેલા મકાનો', String(filled)],
    ['ખાલી રેકોર્ડ્સ', String(empty)],
    [''],
    ['જનગણના નંબર', 'વડા નું નામ', 'ટોટલ રૂમ', 'પરિણિત દંપતિ ની સંખ્યા', 'કાર / જીપ', 'ટીવી', 'તારીખ'],
    ...houses.map((h) => [
      h.census_number || '',
      h.head_name || '',
      String(h.total_rooms ?? 0),
      String(h.married_couples ?? 0),
      h.has_car ? 'હા' : 'ના',
      h.has_tv ? 'હા' : 'ના',
      new Date(h.created_at).toLocaleDateString('gu-IN'),
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
