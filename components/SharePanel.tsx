'use client';

import { useState } from 'react';
import { Share2, Link2 } from 'lucide-react';
import { copyTextToClipboard } from '../lib/clipboard';
import { uploadImageToCloudinary } from '../lib/cloudinary';

export function SharePanel() {
  const [textToShare, setTextToShare] = useState('Use o monitor para capturar texto ou gere uma imagem.');
  const [status, setStatus] = useState('Pronto para compartilhar.');

  async function handleWebShare() {
    try {
      await navigator.share?.({
        title: 'ClipFlow',
        text: textToShare,
      });
      setStatus('Compartilhamento iniciado.');
    } catch (error) {
      console.error(error);
      setStatus('Compartilhamento não suportado ou cancelado.');
    }
  }

  async function copyLink() {
    await copyTextToClipboard(textToShare);
    setStatus('Texto copiado para a área de transferência.');
  }

  async function handleUpload() {
    try {
      setStatus('Upload em progresso...');
      const result = await uploadImageToCloudinary('https://via.placeholder.com/1200x630.png?text=ClipFlow');
      setStatus(`Upload concluído. Link: ${result}`);
    } catch (error) {
      console.error(error);
      setStatus('Falha no upload. Configure a nuvem corretamente.');
    }
  }

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>Compartilhar</h2>
          <p>Envie usando o Web Share API ou copie rapidamente.</p>
        </div>
        <Share2 size={24} />
      </div>
      <div className="field-group">
        <label>
          Texto para compartilhar
          <textarea value={textToShare} onChange={(event) => setTextToShare(event.target.value)} />
        </label>
        <div className="button-group">
          <button className="primary" type="button" onClick={handleWebShare}>
            Compartilhar
          </button>
          <button className="secondary" type="button" onClick={copyLink}>
            <Link2 size={16} /> Copiar texto
          </button>
          <button className="secondary" type="button" onClick={handleUpload}>
            Enviar nuvem
          </button>
        </div>
        <p className="status-text">{status}</p>
      </div>
    </section>
  );
}
