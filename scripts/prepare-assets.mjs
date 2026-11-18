import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const kit = join(root, '.agents/skills/design-taste-frontend/assets');
/** Keep the installed skill intact. Publish its used pieces, never its demo gallery or photos. */
export function prepareAssets() {
  const copy = (from, to) => {
    const dest = join(root, 'public', to);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(from, dest);
  };
  for (const file of ['motion/motion.js', 'motion/motion.css', 'moments/moments.js', 'moments/lib.js', 'moments/word-highlight/moment.js', 'moments/word-highlight/moment.css']) {
    copy(join(kit, file), `assets/${file}`);
  }
  const marks = ['xlsx', 'sql', 'power-bi', 'linkedin', 'x'];
  for (const mark of marks) copy(join(kit, `icons/demo/${mark}.svg`), `assets/icons/${mark}.svg`);
  const credits = JSON.parse(readFileSync(join(kit, 'icons/demo/icons-credits.json'), 'utf8'))
    .filter(i => marks.some(mark => i.file === `${mark}.svg`) || i.file.startsWith('ui-') && i.file === 'ui-arrow-right.svg');
  credits.push({ file: 'brand/fiverr.svg', source: 'Simple Icons 16.30.0', licence: 'CC0-1.0', trademark: true },
    { file: 'brand/power-query.svg', source: 'https://github.com/microsoft/PowerBI-Icons/blob/main/SVG/Power-Query-Colored.svg', trademark: true });
  writeFileSync(join(root, 'public/assets/icons/icons-credits.json'), JSON.stringify(credits, null, 2));
  const fonts = join(root, 'node_modules/@fontsource-variable/schibsted-grotesk');
  copy(join(fonts, 'files/schibsted-grotesk-latin-wght-normal.woff2'), 'fonts/schibsted-grotesk.woff2');
  copy(join(fonts, 'LICENSE'), 'fonts/OFL.txt');
}
