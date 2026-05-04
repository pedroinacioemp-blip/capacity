export async function readClipboardText(): Promise<string> {
  if (!navigator.clipboard) {
    throw new Error('Clipboard API não suportado.');
  }

  return navigator.clipboard.readText();
}

export async function copyTextToClipboard(value: string): Promise<void> {
  if (!navigator.clipboard) {
    throw new Error('Clipboard API não suportado.');
  }
  await navigator.clipboard.writeText(value);
}
