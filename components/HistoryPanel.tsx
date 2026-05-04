'use client';

import { Trash2 } from 'lucide-react';

interface HistoryPanelProps {
  history: string[];
  onClear: () => void;
}

export function HistoryPanel({ history, onClear }: HistoryPanelProps) {
  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>Histórico</h2>
          <p>Últimos itens capturados e salvos localmente.</p>
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
          history.map((item, index) => (
            <div className="history-item" key={`${item}-${index}`}>
              {item}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
