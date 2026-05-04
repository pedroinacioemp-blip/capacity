'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ScrapedItem {
  imageUrl: string;
  caption: string;
}

export default function ScraperPage() {
  const [data, setData] = useState<ScrapedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  async function scrapeContent() {
    setLoading(true);
    setStatus('Extraindo conteúdo...');
    try {
      const response = await fetch('/api/scrape');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
        setStatus('Conteúdo extraído com sucesso. Enviando para WhatsApp...');
        // Automatically send to WhatsApp after successful extraction
        setTimeout(() => sendToWhatsApp(), 1000); // Small delay for user feedback
      } else {
        setStatus('Falha ao extrair conteúdo.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Erro ao conectar com a API.');
    }
    setLoading(false);
  }

  async function sendToWhatsApp() {
    if (data.length === 0) return;

    setStatus('Preparando envio para WhatsApp...');
    const payload = data.map(item => `${item.caption}\nImagem: ${item.imageUrl}`).join('\n\n');
    const url = `https://wa.me/?text=${encodeURIComponent(payload)}`;
    window.open(url, '_blank');
    setStatus('WhatsApp aberto com o conteúdo.');
  }

  return (
    <main className="page-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">Zarcovi Scraper</p>
          <h1>Extrair Técnicas de Hagoromo</h1>
          <p className="hero-copy">
            Extraia imagens e legendas das técnicas de Hagoromo e envie automaticamente para o WhatsApp.
          </p>
        </div>
      </header>
      <section className="grid-layout">
        <div className="card">
          <div className="card-header">
            <div>
              <h2>Extração Automática</h2>
              <p>Busque técnicas e imagens da página de Hagoromo e envie diretamente para o WhatsApp.</p>
            </div>
          </div>
          <div className="field-group">
            <div className="button-group">
              <button className="primary" onClick={scrapeContent} disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Extrair e Enviar WhatsApp'}
              </button>
            </div>
            <p className="status-text">{status}</p>
          </div>
        </div>
        {data.length > 0 && (
          <div className="card">
            <div className="card-header">
              <div>
                <h2>Conteúdo Extraído</h2>
                <p>{data.length} itens encontrados.</p>
              </div>
            </div>
            <div className="history-list">
              {data.map((item, index) => (
                <div key={index} className="history-item">
                  <p style={{ margin: '0 0 0.75rem', whiteSpace: 'pre-wrap' }}>{item.caption}</p>
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