import { OfflineQueueItem } from './types';

const QUEUE_KEY = 'census_offline_queue';
const DRAFT_KEY = 'census_draft_answers';

// -------------------------------------------------------
// Offline Queue (for syncing pending saves)
// -------------------------------------------------------

export function getOfflineQueue(): OfflineQueueItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToOfflineQueue(item: OfflineQueueItem): void {
  if (typeof window === 'undefined') return;
  const queue = getOfflineQueue();
  // Replace existing item for same house+question
  const idx = queue.findIndex(
    (q) => q.house_id === item.house_id && q.question_id === item.question_id
  );
  if (idx >= 0) {
    queue[idx] = item;
  } else {
    queue.push(item);
  }
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function clearOfflineQueue(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(QUEUE_KEY);
}

export function removeFromOfflineQueue(house_id: string, question_id: string): void {
  if (typeof window === 'undefined') return;
  const queue = getOfflineQueue().filter(
    (q) => !(q.house_id === house_id && q.question_id === question_id)
  );
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

// -------------------------------------------------------
// Draft answers local cache (for instant UI restore)
// -------------------------------------------------------

export function saveDraftLocally(house_id: string, question_id: string, answer: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    const drafts = raw ? JSON.parse(raw) : {};
    if (!drafts[house_id]) drafts[house_id] = {};
    drafts[house_id][question_id] = answer;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
  } catch {
    // ignore storage errors
  }
}

export function getDraftLocally(house_id: string): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return {};
    const drafts = JSON.parse(raw);
    return drafts[house_id] || {};
  } catch {
    return {};
  }
}

export function clearDraftLocally(house_id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    const drafts = JSON.parse(raw);
    delete drafts[house_id];
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
  } catch {
    // ignore
  }
}

// -------------------------------------------------------
// Sync queue to Supabase when back online
// -------------------------------------------------------
export async function syncOfflineQueue(
  saveAnswerFn: (house_id: string, question_id: string, answer: string) => Promise<void>
): Promise<void> {
  const queue = getOfflineQueue();
  if (queue.length === 0) return;

  const failed: OfflineQueueItem[] = [];
  for (const item of queue) {
    try {
      await saveAnswerFn(item.house_id, item.question_id, item.answer);
    } catch {
      failed.push(item);
    }
  }
  localStorage.setItem(QUEUE_KEY, JSON.stringify(failed));
}

