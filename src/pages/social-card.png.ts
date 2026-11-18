import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { swatch, xml } from '../lib/brand';
import { copy, person } from '../data/portfolio';

/** Local build-time render, not an external screenshot service. Only illustrative geometry. */
export const GET: APIRoute = async () => {
  const bars = [52,86,69,110,96,154,188].map((h,i) => {
    const x=758+i*41, y=331+i*10;
    return `<g stroke="${swatch('draft-ink')}" stroke-linejoin="round" stroke-width="2"><path d="M${x} ${y}l25 12v-${h}l-25-12z" fill="${swatch('blue-side')}"/><path d="M${x+25} ${y+12}l23-12v-${h}l-23 12z" fill="${swatch('blue-deep')}"/><path d="M${x} ${y-h}l23-12 25 12-23 12z" fill="${swatch('blue-top')}"/></g>`;
  }).join('');
  const image = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${swatch('p-bg')}"/><g font-family="DejaVu Sans, sans-serif" fill="${swatch('p-ink')}"><rect x="56" y="48" width="60" height="60" rx="8" fill="${swatch('p-accent')}"/><text x="66" y="88" font-size="30" fill="${swatch('p-accent-ink')}">${xml(person.initials)}</text><text x="138" y="87" font-size="28">${xml(copy.portfolio)}</text><path d="M56 135h1088M56 523h1088" stroke="${swatch('p-muted')}"/><text x="52" y="295" font-size="78" letter-spacing="-5">${xml(person.name)}</text><text x="56" y="363" font-size="35" fill="${swatch('p-accent')}">${xml(person.jobTitle)}</text><text x="56" y="575" font-size="26">${xml(person.title)}</text></g>${bars}</svg>`;
  const png = await sharp(Buffer.from(image)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
