/** Run against the production preview. Browser/a11y tooling is development-only. */
import { chromium } from 'playwright-core';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { CONTACT_EMAIL, SHOW_CV, person, copy, projects, filters, projectLabels } from '../src/data/portfolio.ts';
const require = createRequire(import.meta.url);
const base = process.env.TEST_URL ?? 'http://127.0.0.1:4321/';
const browser = await chromium.launch({executablePath:process.env.CHROME_PATH || undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const problems=[];
const counts = Object.fromEntries(filters.map((filter,i) => [filter, i === 0 ? projects.length : projects.filter(project => projectLabels(project).includes(filter)).length]));
const supplied = path => existsSync(new URL(`../public${path}`, import.meta.url));
const cvExpected = SHOW_CV && supplied(person.cv);
async function audit(page,where) {
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  const violations=await page.evaluate(async()=> (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,msg:n.failureSummary}))})));
  for(const v of violations) problems.push({where,...v});
}
async function checkLanding(page,id) {
  await page.waitForFunction(id=>{
    const heading = document.getElementById(id), header = document.querySelector('header.nav').getBoundingClientRect();
    const r = heading.getBoundingClientRect();
    return location.hash === `#${id}` && document.activeElement === heading && Math.abs(r.top-header.bottom-16)<2 && r.bottom<=innerHeight;
  },id,{timeout:5000});
  assert.equal(await page.locator(`#${id}`).count(),1);
}
async function checkHeroLinks(page, viaMenu = false) {
  for (const id of ['projects','contact','about']) {
    // Previously, visiting a destination via the mobile menu changed its offset
    // on the next hero click. Seed the same destination, including contact at EOF.
    if (viaMenu) {
      await page.locator('.nav__toggle').click(); await page.locator(`.nav__link[href="#${id}"]`).click();
      assert.equal(await page.locator('main').evaluate(e=>e.inert),false);
      await checkLanding(page,id);
    }
    for (const method of ['pointer','keyboard']) {
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
      await page.waitForFunction(()=>scrollY === 0);
      const link = page.locator(`#overview a[href="#${id}"]`);
      if (method === 'pointer') await link.click(); else await link.press('Enter');
      await checkLanding(page,id);
    }
  }
}
async function checkViewer(page,link,view,auditLabel,method='keyboard') {
  if (method==='pointer') await link.click(); else await link.press('Enter');
  const box=page.locator('#image-lightbox[open]'); await box.waitFor();
  const image=box.locator('img'); await image.evaluate(img=>img.decode());
  assert.equal(await image.getAttribute('alt'),view.alt);
  assert.match(await image.getAttribute('src'),/\.webp$/);
  assert.equal(await box.locator('#image-title').innerText(),view.name);
  const close=box.locator('[data-dismiss-image]'), zoom=box.locator('[data-zoom]');
  assert.equal(await close.evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('Tab'); assert.equal(await zoom.evaluate(el=>el===document.activeElement),true);
  await zoom.press('Enter'); assert.equal(await zoom.innerText(),copy.ui.fit);
  assert.equal(await image.evaluate(el=>Math.round(el.getBoundingClientRect().width)===el.naturalWidth),true);
  await page.keyboard.press('Shift+Tab'); assert.equal(await box.locator('[data-canvas]').evaluate(el=>el===document.activeElement),true);
  await zoom.press('Enter'); assert.equal(await zoom.innerText(),copy.ui.actual);
  if(auditLabel) await audit(page,auditLabel);
  await page.keyboard.press('Escape'); await box.waitFor({state:'hidden'});
  assert.equal(await link.evaluate(el=>el===document.activeElement),true);
}
try {
 for(const [width,height] of [[360,800],[768,1024],[1440,900]]) for(const scheme of ['light','dark']) {
  const ctx=await browser.newContext({viewport:{width,height},colorScheme:scheme,reducedMotion:width===1440?'no-preference':'reduce'});
  const p=await ctx.newPage();
  p.on('pageerror',e=>problems.push({where:'Page exception',message:e.message}));
  p.on('console',m=>{if(['warning','error'].includes(m.type())) problems.push({where:`${width} ${scheme} browser console (${p.url()})`,message:m.text()});});
  p.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)problems.push({where:'HTTP error',message:`${r.status()} ${r.url()}`});});
  await p.goto(base,{waitUntil:'networkidle'});
  assert.equal(await p.locator('html').getAttribute('data-theme'),scheme);
  assert.equal(await p.locator('h1').count(),1);
  assert.ok(await p.locator('.scroll-cue svg').evaluate(el=>el.getBoundingClientRect().width>=12),'Visible scroll cue');
  assert.equal(await p.locator('.project-card').count(),projects.length);
  assert.equal(await p.locator('form').count(),0);
  assert.equal(await p.locator('.contact-actions a[href^="mailto:"]').count(),Number(Boolean(CONTACT_EMAIL)));
  assert.equal(await p.locator('.contact-actions a[download]').count(),Number(cvExpected));
  const portrait=p.getByAltText(person.portraitAlt,{exact:true});
  await portrait.evaluate(img=>img.decode()); assert.equal(await portrait.getAttribute('fetchpriority'),'high');
  assert.equal(await portrait.getAttribute('loading'),'eager');
  assert.ok(await portrait.evaluate(img=>img.currentSrc.endsWith('.webp')));
  assert.equal(await p.locator('html').evaluate(el=>getComputedStyle(el).scrollBehavior),width===1440?'smooth':'auto');
  for (const [i,project] of projects.entries()) {
    const card = p.locator('.project-card').nth(i);
    assert.equal(await card.locator('.thumbnail img').count(),Number(Boolean(project.image)));
    assert.equal(await card.locator('.preview-label').count(),Number(!project.image));
    if (project.image) assert.equal(await card.locator('.thumbnail img').getAttribute('alt'),project.image.alt);
    assert.equal(await card.locator('.card-resources a').count(),[project.dashboardUrl,project.reportUrl].filter(Boolean).length);
  }
  await p.keyboard.press('Tab'); assert.equal(await p.locator(':focus').getAttribute('class'),'skip-link');
  await p.keyboard.press('Enter'); assert.equal(await p.locator(':focus').getAttribute('id'),'top');
  for(const id of ['overview','about-section','skills-section','projects-section','contact-section']) {
    const section=p.locator(`#${id}`); await section.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false,`${width} ${scheme} ${id} overflows`);
  }
  await audit(p,`${width} ${scheme} home`);
  const theme=p.locator('.theme-control');await theme.click();await p.reload({waitUntil:'networkidle'});
  assert.equal(await theme.getAttribute('aria-checked'),String(scheme==='light'));await theme.click();
  if(width<1024) {
    await p.getByRole('button',{name:'Navigation menu'}).click();assert.equal(await p.locator('main').evaluate(e=>e.inert),true);
    await p.keyboard.press('Escape');assert.equal(await p.locator('.nav__toggle').getAttribute('aria-expanded'),'false');
  }
  await checkHeroLinks(p,width<1024);
  for(const [filter,count] of Object.entries(counts)) {
    const button=p.getByRole('button',{name:filter,exact:true});
    if (filter==='HR') { await button.focus(); await p.keyboard.press('Space'); } else await button.click();
    assert.equal(await p.locator('.project-card:visible').count(),count,filter);
    assert.equal(await p.locator('.filter[aria-pressed="true"]').count(),1);
  }
  await p.getByRole('button',{name:'All',exact:true}).click();
  for(const link of await p.locator('[data-study-link]').all()) {
    const href=await link.getAttribute('href');await link.focus();await p.keyboard.press('Enter');
    await p.waitForSelector('dialog[open] #study-title');
    assert.equal(await p.locator('dialog [data-full-page]').getAttribute('href'),new URL(href,base).href);
    assert.equal(await p.locator('dialog h1').count(),0);
    const study=projects.find(project=>new URL(href,base).pathname.endsWith(`/projects/${project.slug}/`));
    assert.ok(study);
    assert.equal(await p.locator('dialog .study-resources a').count(),[study.dashboardUrl,study.reportUrl].filter(Boolean).length);
    if(href.includes('ict-operations')) assert.equal(await p.locator('dialog .study-block h3').first().innerText(),'Planned');
    if(href.includes('healthcare')) {
      assert.match(await p.locator('dialog .study-note').innerText(),/Counts reflect records/);
      await audit(p,`${width} ${scheme} dialog`);
    }
    const gallery=p.locator('#case-dialog .gallery-view'), views=[study.image,...study.additionalImages].filter(Boolean);
    assert.equal(await gallery.count(),views.length);
    for (const [i,view] of views.entries()) {
      await checkViewer(p,gallery.nth(i),view,study.slug==='sales-performance'?`${width} ${scheme} enlarged image`:null, i===0?'pointer':'keyboard');
      assert.equal(await p.locator('#case-dialog').evaluate(el=>el.open),true);
    }
    const lastControl=p.locator('#case-dialog a[href],#case-dialog button').last();
    await lastControl.focus();await p.keyboard.press('Tab');assert.equal(await p.locator(':focus').getAttribute('data-full-page'),'');
    await p.keyboard.press('Shift+Tab');assert.equal(await lastControl.evaluate(el=>el===document.activeElement),true);
    await p.keyboard.press('Escape');await p.waitForSelector('dialog[open]',{state:'hidden'});
    assert.equal(await p.locator(':focus').getAttribute('href'),href);
  }
  for(const a of await p.locator('.social-link').all()){assert.equal(await a.getAttribute('target'),'_blank');assert.equal(await a.getAttribute('rel'),'noopener noreferrer');}
  await p.goto(new URL('projects/healthcare-operations/',base).href,{waitUntil:'networkidle'});assert.equal(await p.locator('h1').count(),1);
  await audit(p,`${width} ${scheme} standalone study`);
  await checkViewer(p,p.locator('.gallery-view').first(),projects.find(x=>x.industry==='Healthcare').image,null,'pointer');
  console.log(`Checked ${width}×${height}, ${scheme}: sections, repeated pointer/keyboard hero jumps, responsive images, lightboxes, theme persistence, ${filters.length} filters, ${projects.length} dialogs, focus return, static study and axe.`);
  await ctx.close();
 }
 const ctx=await browser.newContext({javaScriptEnabled:false,colorScheme:'dark',reducedMotion:'reduce',viewport:{width:360,height:800}});
 const page=await ctx.newPage();await page.goto(base); await checkHeroLinks(page);
 await page.locator('[data-study-link]').first().click();assert.match(await page.locator('h1').innerText(),/Sales Performance/);
 await page.locator('.gallery-view').first().click();assert.match(page.url(),/\.webp$/);await ctx.close();
} finally {await browser.close();}
if(problems.length) {console.error(JSON.stringify(problems,null,2));process.exitCode=1;} else console.log('No browser errors, warnings, failed local requests, or WCAG A/AA axe violations. No-JS study links work.');
