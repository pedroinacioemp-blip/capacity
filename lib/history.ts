export const clipboardHistoryKey = 'clipflow_clipboard_history';

export function loadHistory(): string[] {
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

export function saveHistory(history: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(clipboardHistoryKey, JSON.stringify(history.slice(0, 30)));
}
