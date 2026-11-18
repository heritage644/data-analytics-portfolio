import type { APIRoute } from 'astro';
import { projects } from '../data/portfolio';
import { local, projectHref } from '../lib/paths';
import { xml } from '../lib/brand';
export const GET: APIRoute = ({site, url}) => {
  // Site comes from the production host (or SITE_URL); the local preview uses its own origin.
  const urls = [local(), ...projects.map(p=>projectHref(p.slug))].map(p=>new URL(p,site??url.origin).href);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${xml(u)}</loc></url>`).join('\n')}\n</urlset>`, {headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
