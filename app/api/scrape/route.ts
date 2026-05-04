import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
  try {
    const url = 'https://sites.google.com/view/zarcovirpg/personagem/principal/lend%C3%A1rio/hagoromo?authuser=0';

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const results: { imageUrl: string; caption: string }[] = [];

    // Find sections with titles like "TECNICA DA ONDA DE AR"
    $('h2, h3, h4').each((_, element) => {
      const title = $(element).text().trim();
      if (title.toUpperCase().includes('TECNICA') || title.toUpperCase().includes('TÉCNICA')) {
        // Find images in the next siblings or within the section
        let current = $(element).next();
        while (current.length && !current.is('h2, h3, h4')) {
          if (current.is('img')) {
            const imgSrc = current.attr('src');
            if (imgSrc) {
              // Find caption: next p or div with text
              let caption = '';
              let nextEl = current.next();
              while (nextEl.length && !nextEl.is('img, h2, h3, h4')) {
                if (nextEl.is('p, div') && nextEl.text().trim()) {
                  caption = nextEl.text().trim();
                  break;
                }
                nextEl = nextEl.next();
              }
              results.push({
                imageUrl: imgSrc.startsWith('http') ? imgSrc : `https://sites.google.com${imgSrc}`,
                caption: caption || title,
              });
            }
          }
          current = current.next();
        }
      }
    });

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to scrape' }, { status: 500 });
  }
}