import palette from '../styles/palette.css?raw';
/** The SVG endpoints and browser chrome read the same light-theme tokens as the page. */
export function swatch(name: string): string {
  const color = palette.match(new RegExp(`--${name}:\\s*(#[\\da-f]{6})\\b`, 'i'))?.[1];
  if (!color) throw new Error(`Missing brand token: ${name}`);
  return color;
}
export const xml = (s: string) => s.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));
