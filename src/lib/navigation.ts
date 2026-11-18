const root = document.documentElement;
const toggle = document.querySelector<HTMLButtonElement>('.theme-control');
const system = matchMedia('(prefers-color-scheme: dark)');
function theme(dark: boolean) {
  root.dataset.theme = root.dataset.tone = dark ? 'dark' : 'light';
  toggle?.setAttribute('aria-checked', String(dark));
  const chrome = getComputedStyle(root).getPropertyValue(dark ? '--night' : '--white').trim();
  document.querySelectorAll('meta[name="theme-color"]').forEach(meta => meta.setAttribute('content',chrome));
}
theme(root.dataset.theme === 'dark');
toggle?.addEventListener('click', () => {
  theme(root.dataset.theme !== 'dark');
  try { localStorage.setItem('ra-theme', root.dataset.theme!); } catch { /* Private mode. */ }
});
system.addEventListener('change', e => {
  try { if (['light', 'dark'].includes(localStorage.getItem('ra-theme') ?? '')) return; } catch { /* Use OS preference. */ }
  theme(e.matches);
});
window.addEventListener('storage', event => {
  if (event.key === 'ra-theme') theme(event.newValue ? event.newValue === 'dark' : system.matches);
});
// Use the kit's sheet markup/CSS without its optional idle-time image prefetcher.
// Keep off-screen dashboard files natively lazy, and take background landmarks out of the tab order.
const header = document.querySelector<HTMLElement>('header.nav');
const menuButton = header?.querySelector<HTMLButtonElement>('.nav__toggle');
if (header && menuButton) {
  const landmarks = document.querySelectorAll<HTMLElement>('body > main, body > footer');
  const setMenu = (open: boolean, restoreFocus = false) => {
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-locked', open);
    menuButton.setAttribute('aria-expanded', String(open));
    landmarks.forEach(el => { el.inert = open; });
    if (open) header.querySelector<HTMLElement>('.nav__link')?.focus();
    else if (restoreFocus) menuButton.focus();
  };
  menuButton.addEventListener('click', () => setMenu(!header.classList.contains('is-open')));
  matchMedia('(min-width: 1024px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (header.classList.contains('is-open')) setMenu(false, true);
      else {
        const item = (event.target as Element).closest<HTMLElement>('.nav__item');
        if(item?.querySelector('.nav__menu')) {
          item.classList.add('dismissed'); item.querySelector<HTMLElement>('.nav__link')?.focus();
        }
      }
      return;
    }
    if (event.key !== 'Tab' || !header.classList.contains('is-open')) return;
    const focusable = Array.from(header.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')).filter(el => el.offsetWidth && !el.classList.contains('skip-link'));
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  header.querySelectorAll('.nav__item').forEach(item => {
    item.addEventListener('pointerenter', () => item.classList.remove('dismissed'));
    item.addEventListener('focusout', event => {
      if (!item.contains((event as FocusEvent).relatedTarget as Node | null)) item.classList.remove('dismissed');
    });
  });
  header.addEventListener('click', event => {
    const a = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
    if (!a || !header.classList.contains('is-open')) return;
    setMenu(false);
    if (a.pathname === location.pathname && a.hash) {
      const dest = document.getElementById(a.hash.slice(1));
      dest?.focus({ preventScroll: true });
    }
  });
}
const links = [...document.querySelectorAll<HTMLAnchorElement>('.nav__link[href^="#"]')];
const sections = links.map(link => document.getElementById(`${link.hash.slice(1)}-section`)).filter((s): s is HTMLElement => !!s);
if (sections.length) {
  const io = new IntersectionObserver(entries => {
    const now = entries.filter(e => e.isIntersecting).at(-1);
    if (now) links.forEach(a => {
      if (`${a.hash}-section` === `#${now.target.id}`) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }, { rootMargin: '-12% 0px -62% 0px', threshold: 0 });
  [...sections, document.getElementById('overview')].forEach(s => { if (s) io.observe(s); });
}
for (const year of document.querySelectorAll<HTMLElement>('[data-year]')) year.textContent = String(new Date().getFullYear());
