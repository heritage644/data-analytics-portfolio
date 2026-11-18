import type { APIRoute } from 'astro';
import { swatch, xml } from '../lib/brand';
import { person } from '../data/portfolio';
export const GET: APIRoute = () => new Response(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="${swatch('p-accent')}"/><text x="23" y="32" fill="${swatch('p-accent-ink')}" font-size="26" font-family="Arial,sans-serif" font-weight="600" text-anchor="middle" letter-spacing="-2">${xml(person.initials)}</text></svg>`, { headers: { 'Content-Type': 'image/svg+xml' } });
