import type { APIRoute } from 'astro';
import { local } from '../lib/paths';
export const GET: APIRoute = ({site,url}) => new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL(local('sitemap.xml'), site??url.origin).href}\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
