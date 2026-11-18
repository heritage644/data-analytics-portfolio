import type { APIRoute } from 'astro';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { swatch, xml } from '../lib/brand';
import { copy, person } from '../data/portfolio';

/** Social crawlers receive one static PNG, including the same portrait as the hero. */
export const GET: APIRoute = async () => {
  const photo = await sharp(resolve('src/images',person.headshot)).rotate().resize(300,300,{fit:'cover',position:'centre'}).jpeg({quality:90}).toBuffer();
  const image = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
    <defs><clipPath id="portrait"><circle cx="960" cy="324" r="150"/></clipPath></defs>
    <rect width="1200" height="630" fill="${swatch('white')}"/>
    <g font-family="DejaVu Sans, sans-serif" fill="${swatch('charcoal')}">
      <rect x="56" y="48" width="60" height="60" rx="8" fill="${swatch('red')}"/><text x="66" y="88" font-size="30" fill="${swatch('white')}">${xml(person.initials)}</text>
      <text x="138" y="87" font-size="28">${xml(copy.portfolio)}</text><path d="M56 135h1088M56 523h1088" stroke="${swatch('border')}"/>
      <text x="52" y="310" font-size="84" letter-spacing="-5">${xml(person.name)}</text><text x="56" y="374" font-size="38" fill="${swatch('red-hover')}">${xml(person.jobTitle)}</text>
      <text x="56" y="575" font-size="26">${xml(person.title)}</text>
    </g>
    <circle cx="960" cy="324" r="159" fill="${swatch('red-soft')}" stroke="${swatch('red')}" stroke-width="2"/>
    <image x="810" y="174" width="300" height="300" clip-path="url(#portrait)" xlink:href="data:image/jpeg;base64,${photo.toString('base64')}"/>
  </svg>`;
  const png = await sharp(Buffer.from(image)).png().toBuffer();
  return new Response(new Uint8Array(png), {headers:{'Content-Type':'image/png'}});
};
