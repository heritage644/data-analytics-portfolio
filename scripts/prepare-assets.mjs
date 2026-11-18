import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';

const root = fileURLToPath(new URL('../', import.meta.url));
const kit = join(root, '.agents/skills/design-taste-frontend/assets');
/** Keep the installed skill intact. Publish its used pieces, never its demo gallery or photos. */
export function prepareAssets() {
  // Import the kit's layout/typography, not its example palettes. Work only on a
  // generated copy: the installed skill remains an untouched build dependency.
  const system = postcss.parse(readFileSync(join(kit, 'system.css'), 'utf8'));
  system.walkRules(rule => { if (rule.selector.startsWith('html[data-ground=')) rule.remove(); });
  system.walkDecls(/^--(?:p-|ground-)/, declaration => {
    if (declaration.parent.selector === ':root') declaration.remove();
  });
  mkdirSync(join(root, '.cache'), {recursive:true});
  writeFileSync(join(root, '.cache/portfolio-system.css'), system.toString());
  const copy = (from, to) => {
    const dest = join(root, 'public', to);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(from, dest);
  };
  for (const file of ['motion/motion.js', 'motion/motion.css', 'moments/moments.js', 'moments/lib.js', 'moments/word-highlight/moment.js', 'moments/word-highlight/moment.css']) {
    copy(join(kit, file), `assets/${file}`);
  }
  const marks = ['xlsx', 'sql', 'power-bi', 'linkedin', 'x'];
  mkdirSync(join(root, 'public/assets/icons'), {recursive:true});
  for (const mark of marks) {
    const svg = readFileSync(join(kit, `icons/demo/${mark}.svg`), 'utf8');
    // One-colour presentation of genuine marks. Preserve the geometry and the
    // relative shading, without introducing a second brand accent in controls.
    const neutral = svg.replace(/(fill|stroke|stop-color)="(#(?:[0-9a-f]{6}|[0-9a-f]{3}))"/gi, (_, attr, color) => {
      const hex = color.length === 4 ? [...color.slice(1)].map(c => c+c).join('') : color.slice(1);
      const [r,g,b] = hex.match(/../g).map(c => parseInt(c,16));
      const value = Math.round(.2126*r + .7152*g + .0722*b).toString(16).padStart(2,'0');
      return `${attr}="#${value.repeat(3)}"`;
    });
    writeFileSync(join(root, `public/assets/icons/${mark}.svg`), neutral);
  }
  const credits = JSON.parse(readFileSync(join(kit, 'icons/demo/icons-credits.json'), 'utf8'))
    .filter(i => marks.some(mark => i.file === `${mark}.svg`) || i.file.startsWith('ui-') && i.file === 'ui-arrow-right.svg');
  credits.push({ file: 'brand/fiverr.svg', source: 'Simple Icons 16.30.0', licence: 'CC0-1.0', trademark: true },
    { file: 'brand/power-query.svg', source: 'https://github.com/microsoft/PowerBI-Icons/blob/main/SVG/Power-Query-Colored.svg', trademark: true });
  writeFileSync(join(root, 'public/assets/icons/icons-credits.json'), JSON.stringify(credits, null, 2));
  const fonts = join(root, 'node_modules/@fontsource-variable/schibsted-grotesk');
  copy(join(fonts, 'files/schibsted-grotesk-latin-wght-normal.woff2'), 'fonts/schibsted-grotesk.woff2');
  copy(join(fonts, 'LICENSE'), 'fonts/OFL.txt');
}
