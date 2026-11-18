import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { projects, stats, coreTools, industries, filters, profiles, CONTACT_EMAIL, SHOW_CV, person, copy, projectLabels } from '../src/data/portfolio.ts';

test('The catalog contains the six supplied studies, with unique slugs and real screenshot files', () => {
  assert.equal(projects.length, 6);
  assert.equal(new Set(projects.map(p=>p.slug)).size, projects.length);
  assert.equal(projects.filter(p=>p.title.startsWith('IVAAN Rice')).length, 1);
  for (const p of projects) {
    assert.match(p.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(p.image, `Supplied preview for ${p.slug}`);
    for (const view of [p.image, ...p.additionalImages]) {
      assert.ok(view.name && view.alt);
      assert.ok(existsSync(new URL(`../src/images/${view.file}`, import.meta.url)),view.file);
    }
    assert.ok(p.overview.includes(p.objective)); assert.ok(p.keyAreas.length);
    for (const url of [p.dashboardUrl,p.reportUrl]) {
      // Optional handoff edits should not require changing this suite.
      if (url !== null) assert.match(url,/^(?:https?:\/\/[^/]+|\/(?!\/).+)/);
    }
  }
});
test('Stats count the catalog, core toolkit and only completed industries', () => {
  assert.deepEqual(coreTools.map(t=>t.short),['Excel','Power BI','SQL']);
  const completed = projects.filter(p=>p.status==='complete');
  assert.deepEqual(stats.map(s=>s.value), [projects.length, coreTools.length, new Set(completed.map(p=>p.industry)).size]);
  assert.equal(completed.length,5); assert.equal(projects.filter(p=>p.status==='in-progress')[0]?.slug,'ict-operations');
  assert.deepEqual(projects.find(p=>p.status==='in-progress')?.businessQuestions,[]);
});
test('Each advertised tool and industry filter matches projects, including Excel aliases', () => {
  assert.deepEqual(filters, ['All','Excel','Power BI','Retail','HR','Finance','Healthcare','Agriculture']);
  for (const f of filters.slice(1)) assert.ok(projects.some(p=>projectLabels(p).includes(f)));
  assert.equal(projects.filter(p=>projectLabels(p).includes('Excel')).length,6);
  assert.equal(projects.filter(p=>projectLabels(p).includes('Power BI')).length,5);
  assert.equal(industries.Healthcare,'Healthcare');
});
test('Healthcare counts are records; the only unique-patient wording is the supplied caveat', () => {
  const p=projects.find(p=>p.industry==='Healthcare')!;
  assert.ok(p.keyAreas.includes('Total Patient Records'));
  assert.equal(p.note,'Counts reflect records in the dataset, not verified unique patients.');
  const text=JSON.stringify({...p,note:undefined}); assert.doesNotMatch(text,/unique patients/i);
});
test('The contact configuration uses the supplied profiles and opt-in email/CV', () => {
  if (CONTACT_EMAIL !== null) assert.match(CONTACT_EMAIL,/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  assert.equal(typeof SHOW_CV,'boolean');
  assert.deepEqual(profiles.map(s=>s.url),['https://www.linkedin.com/in/raphael-adem-578648431','https://x.com/Raphaeladem45','https://www.fiverr.com/s/wbkwRDw']);
  assert.ok(copy.description.length > 130 && copy.description.length <= 160);
});

test('The portrait and dashboard views reference distinct owner-supplied files', () => {
  assert.equal(person.portraitAlt, `Portrait of ${person.name}`);
  assert.ok(existsSync(new URL(`../src/images/${person.headshot}`,import.meta.url)));
  const names = projects.flatMap(p => [p.image,...p.additionalImages].flatMap(v => v ? [v.file] : []));
  assert.equal(new Set(names).size,names.length); assert.ok(!names.includes(person.headshot));
});

test('Brand buttons, links, and secondary text pass WCAG AA for normal text', () => {
  const palette = readFileSync(new URL('../src/styles/palette.css',import.meta.url),'utf8');
  const luminance = (token:string) => {
    const hex = palette.match(new RegExp(`--${token}: (#[0-9a-f]{6});`,'i'))?.[1]; assert.ok(hex,token);
    const [r,g,b] = hex.slice(1).match(/../g)!.map(c=>parseInt(c,16)/255).map(c=> c<=0.04045 ? c/12.92 : ((c+.055)/1.055)**2.4);
    return .2126*r!+.7152*g!+.0722*b!;
  };
  for (const [ink,paper] of [['red','white'],['white','red-hover'],['white','red-pressed'],['red-hover','white'],['red-hover','red-soft'],['red-lift','night'],['red-lift','raised'],['red-lift','red-night-tint'],['secondary','mist'],['night-muted','raised']]) {
    const a=luminance(ink!), b=luminance(paper!); assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,`${ink} on ${paper}`);
  }
});
