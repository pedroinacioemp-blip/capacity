'use client';

import { useEffect, useState } from 'react';
import { Share2, Link2, Send } from 'lucide-react';
import { copyTextToClipboard } from '../lib/clipboard';
import { uploadImageToCloudinary } from '../lib/cloudinary';

interface SharePanelProps {
  currentText: string;
  currentImageUrl: string | null;
  onTextChange: (value: string) => void;
}

export function SharePanel({ currentText, currentImageUrl, onTextChange }: SharePanelProps) {
  const [textToShare, setTextToShare] = useState(currentText || 'Use o monitor ou gere uma imagem para compartilhar.');
  const [status, setStatus] = useState('Pronto para compartilhar.');

  useEffect(() => {
    setTextToShare(currentText || 'Use o monitor ou gere uma imagem para compartilhar.');
  }, [currentText]);

  async function handleWebShare() {
    try {
      await navigator.share?.({
        title: 'Zarcovi',
        text: textToShare,
      });
      setStatus('Compartilhamento iniciado.');
    } catch (error) {
      console.error(error);
      setStatus('Compartilhamento não suportado ou cancelado.');
    }
  }

  async function copyText() {
    await copyTextToClipboard(textToShare);
    setStatus('Texto copiado para a área de transferência.');
  }

  async function sendToWhatsApp() {
    try {
      setStatus('Preparando o envio para WhatsApp...');
      let imageLink = currentImageUrl;
      if (imageLink?.startsWith('data:image')) {
        try {
          imageLink = await uploadImageToCloudinary(imageLink);
        } catch (uploadError) {
          console.error(uploadError);
          setStatus('Upload da imagem falhou. Enviando apenas o texto.');
          imageLink = null;
        }
      }
      const payload = imageLink ? `${textToShare}\n\nImagem: ${imageLink}` : textToShare;
      const url = `https://wa.me/?text=${encodeURIComponent(payload)}`;
      window.open(url, '_blank');
      setStatus('WhatsApp aberto com a mensagem pronta.');
    } catch (error) {
      console.error(error);
      setStatus('Falha ao enviar para WhatsApp. Verifique sua conexão.');
    }
  }

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>Zarcovi Share</h2>
          <p>Envie automaticamente texto e imagem direto para o WhatsApp.</p>
        </div>
        <Share2 size={24} />
      </div>
      <div className="field-group">
        <label>
          Texto para compartilhar
          <textarea value={textToShare} onChange={(event) => {
            setTextToShare(event.target.value);
            onTextChange(event.target.value);
          }} />
        </label>
        {currentImageUrl && (
          <figure style={{ margin: '1rem 0' }}>
            <img src={currentImageUrl} alt="Prévia da imagem Zarcovi" style={{ width: '100%', borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)' }} />
          </figure>
        )}
        <div className="button-group">
          <button className="primary" type="button" onClick={sendToWhatsApp}>
            <Send size={16} /> Enviar WhatsApp
          </button>
          <button className="secondary" type="button" onClick={copyText}>
            <Link2 size={16} /> Copiar texto
          </button>
          <button className="secondary" type="button" onClick={handleWebShare}>
            Compartilhar
          </button>
        </div>
        <p className="status-text">{status}</p>
      </div>
    </section>
  );
}
