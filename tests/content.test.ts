import test from 'node:test';
import assert from 'node:assert/strict';
import { projects, stats, coreTools, industries, filters, profiles, CONTACT_EMAIL, SHOW_CV, copy, projectLabels } from '../src/data/portfolio.ts';

test('The catalog contains the six supplied studies, with unique slugs and screenshot slots', () => {
  assert.equal(projects.length, 6);
  assert.equal(new Set(projects.map(p=>p.slug)).size, projects.length);
  assert.equal(projects.filter(p=>p.title.startsWith('IVAAN Rice')).length, 1);
  for (const p of projects) {
    assert.match(p.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(p.image,`/projects/${p.slug}.png`);
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
