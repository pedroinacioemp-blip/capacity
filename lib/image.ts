export async function createImageFromText(text: string, backgroundColor: string, textColor: string): Promise<string> {
  const resolution = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = Math.round(resolution * 1.3);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas não suportado.');
  }

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = textColor;
  ctx.font = 'bold 52px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 18;

  const maxWidth = canvas.width * 0.78;
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const measured = ctx.measureText(testLine).width;
    if (measured > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  const startY = canvas.height / 2 - (lines.length - 1) * 34;
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + index * 70);
  });

  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(40, canvas.height - 120, canvas.width - 80, 80);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '600 22px Inter, sans-serif';
  ctx.fillText('Zarcovi', canvas.width / 2, canvas.height - 82);

  return canvas.toDataURL('image/png', 1);
}
