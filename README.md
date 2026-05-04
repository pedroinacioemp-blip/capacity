# ClipFlow Web

Versão web de ClipFlow criada para executar sem Flutter, com deploy natural em Vercel.

## O que está incluído
- Monitoramento e leitura de clipboard via API de navegador.
- Conversão de texto em imagem usando `canvas` no cliente.
- Histórico local em `localStorage`.
- Compartilhamento com Web Share API e cópia de link.
- Estrutura pronta para deploy no Vercel.

## Como executar
1. Abra um terminal na pasta `clipflow-vercel`.
2. Execute `npm install`.
3. Execute `npm run dev`.
4. Abra `http://localhost:3000` no navegador.

## Deploy no Vercel
1. Crie uma conta Vercel em https://vercel.com.
2. Conecte este repositório ou faça upload da pasta `clipflow-vercel`.
3. O Vercel detecta automaticamente o Next.js.
4. Use os comandos padrão: `npm install`, `npm run build`, `npm run start`.

## Estrutura
- `app/` - páginas e layout Next.js.
- `components/` - UI reutilizável.
- `lib/` - utilitários de clipboard, imagem e histórico.
- `public/` - arquivos estáticos.

## Observações
- O navegador exige ação do usuário para acessar o clipboard.
- A versão web não captura clipboard em segundo plano igual ao Android.
