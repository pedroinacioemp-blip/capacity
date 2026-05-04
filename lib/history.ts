export interface HistoryItem {
  id: string;
  text: string;
  imageUrl?: string;
  createdAt: number;
}

export const clipboardHistoryKey = 'zarcovi_clipboard_history';

export function loadHistory(): HistoryItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(clipboardHistoryKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(history: HistoryItem[]) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(clipboardHistoryKey, JSON.stringify(history.slice(0, 30)));
}
