'use client';

import { Trash2 } from 'lucide-react';
import { HistoryItem } from '../lib/history';

interface HistoryPanelProps {
  history: HistoryItem[];
  onClear: () => void;
}

export function HistoryPanel({ history, onClear }: HistoryPanelProps) {
  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>Histórico</h2>
          <p>Últimos textos e imagens salvos para compartilhar.</p>
        </div>
        <Trash2 size={24} />
      </div>
      <div className="button-group" style={{ justifyContent: 'space-between' }}>
        <span className="badge">{history.length} itens</span>
        <button className="secondary" type="button" onClick={onClear}>
          Limpar histórico
        </button>
      </div>
      <div className="history-list">
        {history.length === 0 ? (
          <div className="history-item">Nenhum histórico registrado ainda.</div>
        ) : (
          history.map((item) => (
            <div className="history-item" key={item.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.65rem', color: '#9fbcff', fontSize: '0.85rem' }}>
                <span>{new Date(item.createdAt).toLocaleString()}</span>
                <span>{item.imageUrl ? 'Imagem + Texto' : 'Texto'}</span>
              </div>
              <p style={{ margin: '0 0 0.75rem', whiteSpace: 'pre-wrap' }}>{item.text}</p>
              {item.imageUrl && (
                <img src={item.imageUrl} alt="Histórico Zarcovi" className="history-image" />
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
