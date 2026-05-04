'use client';

import { useEffect, useState } from 'react';
import { Clipboard } from 'lucide-react';
import { HistoryItem, saveHistory } from '../lib/history';

interface MonitorClipboardProps {
  history: HistoryItem[];
  onHistoryChange: (items: HistoryItem[]) => void;
}

export function MonitorClipboard({ history, onHistoryChange }: MonitorClipboardProps) {
  const [clipboardText, setClipboardText] = useState('Nenhum conteúdo lido ainda.');
  const [status, setStatus] = useState('Aguardando ação');

  useEffect(() => {
    if (history.length > 0) {
      setClipboardText(history[0].text || clipboardText);
    }
  }, [history]);

  async function readClipboard() {
    try {
      setStatus('Solicitando clipboard...');
      const text = await navigator.clipboard.readText();
      if (!text) {
        setStatus('Clipboard vazio ou não permitido.');
        return;
      }
      setClipboardText(text);
      setStatus('Conteúdo lido com sucesso.');
      const item: HistoryItem = {
        id: crypto.randomUUID?.() ?? `${Date.now()}`,
        text,
        createdAt: Date.now(),
      };
      const updated = [item, ...history.filter((entry) => entry.text !== text)].slice(0, 30);
      saveHistory(updated);
      onHistoryChange(updated);
    } catch (error) {
      console.error(error);
      setStatus('Erro ao acessar o clipboard. Garanta permissão de leitura.');
    }
  }

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>Monitor de Clipboard</h2>
          <p>Captura o último texto copiado com a API do navegador.</p>
        </div>
        <Clipboard size={24} />
      </div>
      <div className="field-group">
        <label>
          Texto atual do clipboard
          <textarea readOnly value={clipboardText} />
        </label>
        <div className="button-group">
          <button className="primary" onClick={readClipboard} type="button">
            Ler clipboard agora
          </button>
        </div>
        <p className="status-text">{status}</p>
      </div>
    </section>
  );
}
