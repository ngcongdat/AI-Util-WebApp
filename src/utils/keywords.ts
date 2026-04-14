export function isKeyword(word: string, keywords: string[]): boolean {
  const clean = word.replace(/[.,!?]$/, '');
  return keywords.some(
    k =>
      clean.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(clean.toLowerCase())
  );
}
