import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const SITE_ROOT = 'https://sites.google.com/view/zarcovirpg';

interface CharacterIndex {
  id: string;
  name: string;
  pageUrl: string;
  techniqueCount: number;
  techniques: string[];
}

interface TechniqueItem {
  technique: string;
  imageUrl: string;
  caption: string;
  summary?: string;
}

function normalizeUrl(href: string) {
  try {
    return new URL(href, SITE_ROOT).toString();
  } catch {
    return href;
  }
}

function extractCharacterLinks(html: string) {
  const $ = cheerio.load(html);
  const links = new Map<string, string>();

  $('a[href]').each((_, element) => {
    const href = $(element).attr('href')?.trim();
    if (!href) return;
    const absolute = normalizeUrl(href);
    if (!absolute.includes('/view/zarcovirpg/personagem')) return;

    const name = $(element).text().trim() || absolute.split('/').pop() || absolute;
    if (!name || name.toLowerCase().includes('signin') || name.toLowerCase().includes('authuser')) return;
    if (!links.has(name)) {
      links.set(name, absolute);
    }
  });

  const index: CharacterIndex[] = [];
  Array.from(links.entries()).forEach(([name, pageUrl], indexCounter) => {
    index.push({
      id: `${indexCounter}-${name.replace(/\s+/g, '-').toLowerCase()}`,
      name,
      pageUrl,
      techniqueCount: 0,
      techniques: [],
    });
  });

  return index;
}

function extractTechniqueItems(html: string) {
  const $ = cheerio.load(html);
  const items: TechniqueItem[] = [];

  $('h1, h2, h3, h4, p, div').each((_, element) => {
    const title = $(element).text().trim();
    if (!title) return;
    const isTechniqueTitle = /\bT[EÉ]CNICA\b|\bTECNI[ÇC]A\b|\bONDA\b|\bCHAKRA\b|\bPRIMORDIAL\b/i.test(title);
    if (!isTechniqueTitle) return;

    let current = $(element).next();
    const techniqueName = title;

    while (current.length && !current.is('h1, h2, h3, h4')) {
      const imageNodes = current.is('img') ? [current] : current.find('img').toArray();
      imageNodes.forEach((node: any) => {
        const img = $(node);
        const imgSrc = img.attr('src') || img.attr('data-src');
        if (!imgSrc) return;

        let caption = '';
        let nextSibling = img.parent().next();
        while (nextSibling.length && !nextSibling.is('h1, h2, h3, h4')) {
          const candidateText = nextSibling.text().trim();
          if (candidateText) {
            caption = candidateText;
            break;
          }
          nextSibling = nextSibling.next();
        }

        const absoluteSrc = imgSrc.startsWith('http') ? imgSrc : normalizeUrl(imgSrc);
        items.push({
          technique: techniqueName,
          imageUrl: absoluteSrc,
          caption: caption || techniqueName,
        });
      });
      current = current.next();
    }
  });

  return items;
}

function fallbackSummaries(items: TechniqueItem[]) {
  return items.map((item) => ({
    ...item,
    summary: item.caption.length > 120 ? `${item.caption.slice(0, 120).trim()}...` : item.caption,
  }));
}

async function generateSummaries(items: TechniqueItem[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || items.length === 0) {
    return fallbackSummaries(items);
  }

  const promptItems = items
    .map((item, index) => `${index + 1}. Technique: ${item.technique}\nCaption: ${item.caption}`)
    .join('\n\n');

  const system = 'Você é uma IA que resume técnicas de RPG em um parágrafo curto para cada item.';
  const user = `Gere um JSON válido contendo uma lista de objetos com as chaves technique e summary. Use o conteúdo abaixo como base:\n\n${promptItems}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.7,
      }),
    });

    const json = await response.json();
    const text = json?.choices?.[0]?.message?.content;
    if (!text) {
      return fallbackSummaries(items);
    }

    const body = text.trim();
    const jsonText = body.startsWith('{') || body.startsWith('[') ? body : body.replace(/^[^\[]*/, '');
    const parsed = JSON.parse(jsonText);
    if (!Array.isArray(parsed)) {
      return fallbackSummaries(items);
    }

    return items.map((item) => {
      const found = parsed.find((entry: any) => entry.technique === item.technique);
      return {
        ...item,
        summary: found?.summary ?? item.caption,
      };
    });
  } catch (error) {
    console.error('OpenAI summary error:', error);
    return fallbackSummaries(items);
  }
}

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const characterParam = requestUrl.searchParams.get('character');

    const siteResponse = await fetch(SITE_ROOT);
    if (!siteResponse.ok) {
      throw new Error(`Failed to fetch site root: ${siteResponse.status}`);
    }

    const rootHtml = await siteResponse.text();
    const characterIndex = extractCharacterLinks(rootHtml);

    if (!characterParam) {
      return NextResponse.json({ success: true, index: characterIndex });
    }

    const characterUrl = normalizeUrl(characterParam);
    const selected = characterIndex.find(
      (entry) => entry.pageUrl === characterUrl || entry.name.toLowerCase() === characterParam.toLowerCase()
    );
    if (!selected) {
      return NextResponse.json({ success: false, error: 'Character not found in site index.' }, { status: 404 });
    }

    const pageResponse = await fetch(selected.pageUrl);
    if (!pageResponse.ok) {
      throw new Error(`Failed to fetch character page: ${pageResponse.status}`);
    }

    const pageHtml = await pageResponse.text();
    let items = extractTechniqueItems(pageHtml);
    items = await generateSummaries(items);

    return NextResponse.json({
      success: true,
      character: selected.name,
      pageUrl: selected.pageUrl,
      items,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to scrape' }, { status: 500 });
  }
}
