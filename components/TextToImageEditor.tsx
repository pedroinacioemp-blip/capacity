'use client';

import { useMemo, useState } from 'react';
import { ArrowDownCircle, Palette } from 'lucide-react';
import { createImageFromText } from '../lib/image';
import { loadHistory, saveHistory } from '../lib/history';

const templates = [
  { id: 'minimal', label: 'Minimal', background: '#08101E', color: '#FFFFFF' },
  { id: 'pro', label: 'Professional', background: '#0E1630', color: '#9CC4FF' },
  { id: 'quote', label: 'Quote', background: '#0B1A2C', color: '#FFD775' },
  { id: 'code', label: 'Code', background: '#0A131F', color: '#7FFFD4' },
];

interface TextToImageEditorProps {
  onSave: (text: string) => void;
}

export function TextToImageEditor({ onSave }: TextToImageEditorProps) {
  const [text, setText] = useState('Cole o texto e gere sua arte aqui.');
  const [template, setTemplate] = useState(templates[0].id);
  const [status, setStatus] = useState('Pronto para gerar imagem.');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const selectedTemplate = useMemo(() => templates.find((item) => item.id === template) ?? templates[0], [template]);

  async function handleGenerate() {
    setStatus('Gerando imagem...');
    const url = await createImageFromText(text, selectedTemplate.background, selectedTemplate.color);
    setImageUrl(url);
    setStatus('Imagem gerada com sucesso.');
  }

  async function handleDownload() {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'clipflow-text-image.png';
    link.click();
  }

  async function saveToHistory() {
    const currentHistory = loadHistory();
    const updatedHistory = [text, ...currentHistory.filter((item) => item !== text)].slice(0, 30);
    saveHistory(updatedHistory);
    setStatus('Texto salvo no histórico.');
    onSave(text);
  }

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>Texto → Imagem</h2>
          <p>Crie imagens estilizadas a partir de texto com templates modernos.</p>
        </div>
        <Palette size={24} />
      </div>
      <div className="field-group">
        <label>
          Conteúdo
          <textarea value={text} onChange={(event) => setText(event.target.value)} />
        </label>
        <label>
          Template
          <select value={template} onChange={(event) => setTemplate(event.target.value)}>
            {templates.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <div className="button-group">
          <button className="secondary" type="button" onClick={handleGenerate}>
            Gerar imagem
          </button>
          <button className="primary" type="button" disabled={!imageUrl} onClick={handleDownload}>
            <ArrowDownCircle size={18} /> Baixar PNG
          </button>
          <button className="secondary" type="button" onClick={saveToHistory}>
            Salvar no histórico
          </button>
        </div>
        {imageUrl ? (
          <figure style={{ marginTop: '1rem' }}>
            <img src={imageUrl} alt="Preview da arte" style={{ width: '100%', borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)' }} />
          </figure>
        ) : (
          <p className="status-text">Use um template e gere sua imagem.</p>
        )}
        <p className="status-text">{status}</p>
      </div>
    </section>
  );
}
