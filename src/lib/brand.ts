import palette from '../styles/palette.css?raw';
/** The favicon, sharing image and browser chrome share the page’s brand swatches. */
export function swatch(name: string): string {
  const color = palette.match(new RegExp(`--${name}:\\s*(#[\\da-f]{6})\\b`, 'i'))?.[1];
  if (!color) throw new Error(`Missing brand token: ${name}`);
  return color;
}
export const xml = (s: string) => s.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));
