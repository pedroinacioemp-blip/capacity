import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ClipFlow Web',
  description: 'Versão web do ClipFlow para monitorar clipboard, gerar imagens e compartilhar rápido.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
