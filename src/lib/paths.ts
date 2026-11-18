import { existsSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';

/** Browser links work at the domain root and below GitHub Pages project paths. */
export const local = (path = '/') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\/+/, '')}`;
export const projectHref = (slug: string) => local(`projects/${encodeURIComponent(slug)}/`);
export function hasAsset(path: string) {
  const root = resolve('public');
  const file = resolve(root, path.replace(/^\/+/, ''));
  return file.startsWith(`${root}${sep}`) && existsSync(file) && statSync(file).isFile();
}
export const toolIcon = (icon: string) => local(icon === 'power-query' ? 'brand/power-query.svg' : `assets/icons/${icon}.svg`);
export const configuredLink = (url: string) => url.startsWith('/') ? local(url) : url;
