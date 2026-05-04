'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Send } from 'lucide-react';

interface CharacterIndex {
  id: string;
  name: string;
  pageUrl: string;
  techniqueCount: number;
}

interface ScrapedItem {
  imageUrl: string;
  caption: string;
  technique: string;
  summary?: string;
}

export default function ScraperPage() {
  const [index, setIndex] = useState<CharacterIndex[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [data, setData] = useState<ScrapedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchIndex();
  }, []);

  async function fetchIndex() {
    setStatus('Carregando índice de personagens...');
    try {
      const response = await fetch('/api/scraper');
      const result = await response.json();
      if (result.success) {
        setIndex(result.index || []);
        setSelectedCharacter(result.index?.[0]?.pageUrl || '');
        setStatus('Índice carregado. Selecione um personagem.');
      } else {
        setStatus('Falha ao carregar índice de personagens.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Erro ao conectar com a API de índice.');
    }
  }

  const selected = useMemo(
    () => index.find((item) => item.pageUrl === selectedCharacter) || index[0] || null,
    [index, selectedCharacter]
  );

  async function extractAndSend() {
    if (!selected) {
      setStatus('Selecione um personagem antes de extrair.');
      return;
    }

    setLoading(true);
    setStatus(`Extraindo técnicas de ${selected.name}...`);
    try {
      const response = await fetch(`/api/scraper?character=${encodeURIComponent(selected.pageUrl)}`);
      const result = await response.json();
      if (result.success) {
        const items = result.items || [];
        setData(items);
        setStatus('Técnicas extraídas. Enviando automaticamente para o WhatsApp...');
        setTimeout(() => sendToWhatsApp(items), 1000);
      } else {
        setStatus('Falha ao extrair as técnicas.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Erro ao acessar a API de scraping.');
    }
    setLoading(false);
  }

  function buildWhatsAppPayload(items: ScrapedItem[]) {
    return items
      .map((item) => `Técnica: ${item.technique}\nDescrição: ${item.summary ?? item.caption}\nImagem: ${item.imageUrl}`)
      .join('\n\n');
  }

  function sendToWhatsApp(items: ScrapedItem[]) {
    if (items.length === 0) return;
    setStatus('Abrindo WhatsApp com o conteúdo extraído...');
    const payload = buildWhatsAppPayload(items);
    const url = `https://wa.me/?text=${encodeURIComponent(payload)}`;
    window.open(url, '_blank');
  }

  return (
    <main className="page-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">Zarcovi Central</p>
          <h1>Índice de Técnicas de Personagens</h1>
          <p className="hero-copy">
            Construa um índice completo de personagens, extraia imagens das técnicas e envie automaticamente para o WhatsApp.
          </p>
        </div>
      </header>

      <section className="grid-layout">
        <div className="card">
          <div className="card-header">
            <div>
              <h2>Índice de Personagens</h2>
              <p>Selecione o personagem desejado para extrair suas técnicas.</p>
            </div>
          </div>
          <div className="field-group">
            {index.length === 0 ? (
              <p>Carregando personagens...</p>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {index.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={item.pageUrl === selectedCharacter ? 'primary' : 'secondary'}
                    onClick={() => setSelectedCharacter(item.pageUrl)}
                    style={{ textAlign: 'left' }}
                  >
                    <strong>{item.name}</strong> — {item.techniqueCount} técnicas
                  </button>
                ))}
              </div>
            )}
            <div className="button-group" style={{ marginTop: '1rem' }}>
              <button className="primary" type="button" onClick={extractAndSend} disabled={loading || !selected}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Extrair e Enviar WhatsApp</>}
              </button>
            </div>
            <p className="status-text">{status}</p>
          </div>
        </div>

        {data.length > 0 && (
          <div className="card">
            <div className="card-header">
              <div>
                <h2>Visualização de Técnicas</h2>
                <p>{data.length} imagens e descrições preparadas para envio.</p>
              </div>
            </div>
            <div className="history-list">
              {data.map((item, index) => (
                <div key={`${item.imageUrl}-${index}`} className="history-item">
                  <p style={{ margin: '0 0 0.5rem', fontWeight: 700 }}>{item.technique}</p>
                  <p style={{ margin: '0 0 0.75rem', whiteSpace: 'pre-wrap', color: '#cfd7ff' }}>
                    {item.summary ?? item.caption}
                  </p>
                  <img src={item.imageUrl} alt={item.caption} className="history-image" />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
