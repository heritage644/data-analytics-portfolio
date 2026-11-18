/** Vite imports the originals as metadata. Only Astro's generated display sizes
 * are used in the UI, including when served below a project subpath. */
const media = import.meta.glob<ImageMetadata>('../images/*.{jpg,jpeg,png,webp,avif}', { eager: true, import: 'default' });
export function imageSource(file: string): ImageMetadata {
  const source = media[`../images/${file}`];
  if (!source) throw new Error(`Missing portfolio image: src/images/${file}. Use image: null for an unillustrated study.`);
  return source;
}
