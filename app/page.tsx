'use client';

import { useEffect, useState } from 'react';
import { MonitorClipboard } from '../components/MonitorClipboard';
import { TextToImageEditor } from '../components/TextToImageEditor';
import { HistoryPanel } from '../components/HistoryPanel';
import { SharePanel } from '../components/SharePanel';
import { loadHistory } from '../lib/history';

export default function HomePage() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  return (
    <main className="page-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">ClipFlow Web</p>
          <h1>Clipboard inteligente e compartilhamento rápido</h1>
          <p className="hero-copy">
            Leia e organize o último conteúdo copiado, converta texto em imagem estilizada e compartilhe com um clique.
          </p>
        </div>
      </header>
      <section className="grid-layout">
        <MonitorClipboard history={history} onHistoryChange={setHistory} />
        <TextToImageEditor onSave={(text) => setHistory((prev) => [text, ...prev.slice(0, 29)])} />
        <SharePanel />
        <HistoryPanel history={history} onClear={() => {
          localStorage.removeItem(clipboardHistoryKey);
          setHistory([]);
        }} />
      </section>
    </main>
  );
}
