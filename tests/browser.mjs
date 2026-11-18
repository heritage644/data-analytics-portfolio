/** Run against the production preview. Browser/a11y tooling is development-only. */
import { chromium } from 'playwright-core';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { CONTACT_EMAIL, SHOW_CV, person, projects, filters, projectLabels } from '../src/data/portfolio.ts';
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
try {
 for(const [width,height] of [[360,800],[768,1024],[1440,900]]) for(const scheme of ['light','dark']) {
  const ctx=await browser.newContext({viewport:{width,height},colorScheme:scheme,reducedMotion:width===1440?'no-preference':'reduce'});
  const p=await ctx.newPage();
  p.on('pageerror',e=>problems.push({where:'Page exception',message:e.message}));
  p.on('console',m=>{if(['warning','error'].includes(m.type())) problems.push({where:'Browser console',message:m.text()});});
  p.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)problems.push({where:'HTTP error',message:`${r.status()} ${r.url()}`});});
  await p.goto(base,{waitUntil:'networkidle'});
  assert.equal(await p.locator('html').getAttribute('data-theme'),scheme);
  assert.equal(await p.locator('h1').count(),1);
  assert.ok(await p.locator('.scroll-cue svg').evaluate(el=>el.getBoundingClientRect().width>=12),'Visible scroll cue');
  assert.equal(await p.locator('.project-card').count(),projects.length);
  assert.equal(await p.locator('form').count(),0);
  assert.equal(await p.locator('.contact-actions a[href^="mailto:"]').count(),Number(Boolean(CONTACT_EMAIL)));
  assert.equal(await p.locator('.contact-actions a[download]').count(),Number(cvExpected));
  assert.equal(await p.locator('.portrait img').count(),Number(supplied(person.headshot)));
  for (const [i,project] of projects.entries()) {
    const card = p.locator('.project-card').nth(i);
    assert.equal(await card.locator('.thumbnail img').count(),Number(supplied(project.image)));
    assert.equal(await card.locator('.preview-label').count(),Number(!supplied(project.image)));
    assert.equal(await card.locator('.card-resources a').count(),[project.dashboardUrl,project.reportUrl].filter(Boolean).length);
  }
  await p.keyboard.press('Tab'); assert.equal(await p.locator(':focus').getAttribute('class'),'skip-link');
  await p.keyboard.press('Enter'); assert.equal(await p.locator(':focus').getAttribute('id'),'top');
  for(const id of ['overview','about','skills','projects','contact']) {
    const section=p.locator(`#${id}`); await section.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false,`${width} ${scheme} ${id} overflows`);
  }
  await audit(p,`${width} ${scheme} home`);
  const theme=p.locator('.theme-control');await theme.click();await p.reload({waitUntil:'networkidle'});
  assert.equal(await theme.getAttribute('aria-checked'),String(scheme==='light'));await theme.click();
  if(width<1024) {
    await p.getByRole('button',{name:'Navigation menu'}).click();assert.equal(await p.locator('main').evaluate(e=>e.inert),true);
    await p.keyboard.press('Escape');assert.equal(await p.locator('.nav__toggle').getAttribute('aria-expanded'),'false');
    await p.locator('.nav__toggle').click();await p.locator('.nav__link[href="#projects"]').click();
    assert.equal(await p.locator('main').evaluate(e=>e.inert),false);assert.equal(new URL(p.url()).hash,'#projects');
  }
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
    const lastControl=p.locator('dialog a[href],dialog button').last();
    await lastControl.focus();await p.keyboard.press('Tab');assert.equal(await p.locator(':focus').getAttribute('data-full-page'),'');
    await p.keyboard.press('Shift+Tab');assert.equal(await lastControl.evaluate(el=>el===document.activeElement),true);
    await p.keyboard.press('Escape');await p.waitForSelector('dialog[open]',{state:'hidden'});
    assert.equal(await p.locator(':focus').getAttribute('href'),href);
  }
  for(const a of await p.locator('.social-link').all()){assert.equal(await a.getAttribute('target'),'_blank');assert.equal(await a.getAttribute('rel'),'noopener noreferrer');}
  await p.goto(new URL('projects/healthcare-operations/',base).href,{waitUntil:'networkidle'});assert.equal(await p.locator('h1').count(),1);
  await audit(p,`${width} ${scheme} standalone study`);
  console.log(`Checked ${width}×${height}, ${scheme}: sections, optional assets/links, theme persistence, ${filters.length} filters, ${projects.length} dialogs, focus return, static study and axe.`);
  await ctx.close();
 }
 const ctx=await browser.newContext({javaScriptEnabled:false});const page=await ctx.newPage();await page.goto(base);await page.locator('[data-study-link]').first().click();assert.match(await page.locator('h1').innerText(),/Sales Performance/);await ctx.close();
} finally {await browser.close();}
if(problems.length) {console.error(JSON.stringify(problems,null,2));process.exitCode=1;} else console.log('No browser errors, warnings, failed local requests, or WCAG A/AA axe violations. No-JS study links work.');
