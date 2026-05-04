'use client';

import { useEffect, useState } from 'react';
import { MonitorClipboard } from '../components/MonitorClipboard';
import { TextToImageEditor } from '../components/TextToImageEditor';
import { HistoryPanel } from '../components/HistoryPanel';
import { SharePanel } from '../components/SharePanel';
import { HistoryItem, clipboardHistoryKey, loadHistory } from '../lib/history';

export default function HomePage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadHistory();
    setHistory(stored);
    if (stored.length > 0) {
      setCurrentText(stored[0].text);
      setCurrentImageUrl(stored[0].imageUrl ?? null);
    }
  }, []);

  function handleHistoryChange(items: HistoryItem[]) {
    setHistory(items);
    setCurrentText(items[0]?.text ?? '');
    setCurrentImageUrl(items[0]?.imageUrl ?? null);
  }

  return (
    <main className="page-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">Zarcovi RPG</p>
          <h1>Zarcovi — compartilhe suas histórias com WhatsApp</h1>
          <p className="hero-copy">
            Armazene textos e imagens criadas ou copiadas, organize tudo no histórico e envie para o WhatsApp com um clique.
          </p>
        </div>
      </header>
      <section className="grid-layout">
        <MonitorClipboard history={history} onHistoryChange={handleHistoryChange} />
        <TextToImageEditor onSave={(item) => handleHistoryChange([item, ...history.filter((entry) => entry.id !== item.id)].slice(0, 30))} />
        <SharePanel currentText={currentText} currentImageUrl={currentImageUrl} onTextChange={setCurrentText} />
        <HistoryPanel history={history} onClear={() => {
          localStorage.removeItem(clipboardHistoryKey);
          setHistory([]);
          setCurrentText('');
          setCurrentImageUrl(null);
        }} />
      </section>
    </main>
  );
}
