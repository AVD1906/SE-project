// Focused regression checks for the browser agent's pure decision logic.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const browser = { window: {} };
vm.runInNewContext(fs.readFileSync('frontend/assets/agent-core.js', 'utf8'), browser);
const { mapScenario, evaluateSDLC } = browser.window.FieldnoteAgents;
let passed = 0;
function check(name, fn) { fn(); passed++; console.log(`PASS ${name}`); }
check('requirements page loads the core decision logic before its UI handler',()=>{const html=fs.readFileSync('frontend/requirements.html','utf8');assert.ok(html.indexOf('assets/agent-core.js')<html.indexOf('assets/requirements.js'));});

const exact = 'Customers should be able to apply for loans online and the bank should check whether they already have an existing loan.';
check('loan example maps to two source-linked requirements', () => {
  const out = mapScenario(exact); assert.equal(out.kind, 'matched-example'); assert.equal(out.requirements.length, 2);
  assert.match(out.requirements[0].source, /chunks 26.*27/); assert.match(out.requirements[1].source, /chunk 32/);
});
for (const [name, text] of [
  ['case-insensitive example', exact.toUpperCase()],
  ['wording variation', 'Applicants can apply online for a loan. The bank checks whether the applicant has an existing loan.'],
  ['web synonym', 'People submit loan applications on the web; identify whether they hold a current loan.'],
  ['existing wording', 'Apply online for a loan and flag applicants who already have a loan.'],
  ['two loans plural', 'Apply online for loans and check for existing loans.']
]) check(name, () => assert.equal(mapScenario(text).kind, 'matched-example'));
for (const [name, text, expected] of [
  ['single online application', 'Apply for a loan online.', ['R1']],
  ['existing-loan check without application', 'Check existing loans in the customer records.', ['R2']],
  ['loan repayment schedule', 'Calculate a loan payment schedule.', ['R11']],
  ['negated existing-loan check retains only positive capability', 'Customers apply for loans online, but the bank must not check whether they already have a current loan.', ['R1']]
]) check(name, () => assert.deepEqual(Array.from(mapScenario(text).requirements,r=>r.id),expected));
for (const [name, text] of [
  ['empty string', ''], ['whitespace only', '  \n '],
  ['online unrelated request', 'Open an online savings account.'],
  ['loan application without source-backed detail', 'Build an online loaning application.'],
  ['markup remains plain text', '<img src=x onerror=alert(1)>']
]) check(name, () => {
  const out = mapScenario(text);
  if (!text.trim()) assert.equal(out.kind, 'empty');
  else { assert.equal(out.kind, 'scenario-only'); assert.equal(out.requirements.length, 1); assert.match(out.requirements[0].source, /not matched/); }
});

const base = { stability:'unknown', change:'unknown', uncertainty:'unknown', complexity:'unknown', users:'unknown', prototype:'unknown', vv:'unknown', timeline:'unknown', modular:'unknown', early:'unknown', risk:'unknown', releases:'unknown' };
const decide = overrides => evaluateSDLC({ ...base, ...overrides });
const winner = overrides => decide(overrides).recommendation?.name;
check('all unknown does not invent a recommendation', () => { const o=decide({}); assert.equal(o.recommendation, null); assert.equal(o.ranked.length, 7); assert.equal(o.unknown.length, 12); });
check('only two known conditions are not enough for a firm recommendation', () => assert.equal(decide({change:'high',users:'high'}).recommendation,null));
check('all seven lifecycle models are compared', () => assert.equal(Array.from(decide({}).ranked, x=>x.name).sort().join('|'), ['Agile','Iterative / Incremental','Prototype','RAD','Spiral','V-Shaped','Waterfall'].sort().join('|')));
check('Waterfall for stable, clear, low-complexity scope', () => assert.equal(winner({stability:'stable',change:'low',uncertainty:'low',complexity:'low',vv:'no'}), 'Waterfall'));
check('V-Shaped when stable scope needs formal V&V', () => assert.equal(winner({stability:'stable',change:'low',uncertainty:'low',complexity:'high',vv:'yes'}), 'V-Shaped'));
check('Prototype when needs are unclear and prototype is needed', () => assert.equal(winner({uncertainty:'high',prototype:'yes',users:'high',change:'low',releases:'no'}), 'Prototype'));
check('RAD for short, modular, changing work with active users', () => assert.equal(winner({change:'high',users:'high',timeline:'short',modular:'yes',releases:'no'}), 'RAD'));
check('Iterative for evolving details and early working software', () => assert.equal(winner({uncertainty:'low',change:'high',early:'yes',risk:'medium',users:'low',releases:'no'}), 'Iterative / Incremental'));
check('Spiral for high-risk, complex, uncertain work', () => assert.equal(winner({risk:'high',complexity:'high',uncertainty:'high',change:'high',prototype:'no',users:'low'}), 'Spiral'));
check('Agile for frequent change, feedback, and releases', () => assert.equal(winner({change:'high',users:'high',releases:'yes',early:'yes',stability:'changing',uncertainty:'low',risk:'low',complexity:'low'}), 'Agile'));
check('unknown criteria are listed and excluded from scoring', () => { const o=decide({change:'high'}); assert.ok(o.unknown.includes('project risk')); assert.ok(o.ranked.every(x=>x.evaluated<=1)); assert.equal(o.recommendation,null); });
check('score is bounded and based on evidence count', () => { const o=decide({stability:'stable',change:'low',uncertainty:'low',complexity:'low',vv:'no'}); assert.ok(o.ranked.every(x=>x.score===null || (x.score>=0 && x.score<=100))); });
check('ties do not produce an arbitrary winner', () => { const o=decide({stability:'stable',uncertainty:'low',change:'low'}); assert.equal(o.recommendation,null); });
check('low risk contradicts Spiral risk fit', () => { const row=decide({risk:'low'}).ranked.find(x=>x.name==='Spiral'); assert.ok(row.bad.includes('low risk')); });
check('high change contradicts Waterfall', () => { const row=decide({change:'high'}).ranked.find(x=>x.name==='Waterfall'); assert.ok(row.bad.includes('frequent changes')); });
check('short delivery timeline is a RAD fit', () => { const row=decide({timeline:'short'}).ranked.find(x=>x.name==='RAD'); assert.ok(row.good.includes('short delivery window')); });
check('non-modular system conflicts with RAD', () => { const row=decide({modular:'no'}).ranked.find(x=>x.name==='RAD'); assert.ok(row.bad.includes('system is not modular')); });

function element(value='') { return { value, textContent:'', innerHTML:'', handlers:{}, addEventListener(type, fn){ this.handlers[type]=fn; } }; }
function requirementsPage(workflow){
  const nodes=Object.fromEntries(['scenario-display','requirements','req-count'].map(id=>['#'+id,element()]));
  const context={document:{querySelector:selector=>nodes[selector]},window:browser.window,localStorage:{getItem:()=>JSON.stringify(workflow)}};
  vm.runInNewContext(fs.readFileSync('frontend/assets/requirements.js','utf8'),context);
  return nodes;
}
const requirementsHTML=fs.readFileSync('frontend/requirements.html','utf8');
const reqPage=requirementsPage({scenario:exact,requirements:mapScenario(exact).requirements});
check('requirements page has no second scenario input',()=>{assert.doesNotMatch(requirementsHTML,/<textarea[^>]+id="scenario"/);assert.doesNotMatch(requirementsHTML,/id="generate"/);});
check('requirements page loads the overview request and linked drafts',()=>{assert.equal(reqPage['#scenario-display'].textContent,exact);assert.match(reqPage['#requirements'].innerHTML,/chunks 26.*27/);assert.match(reqPage['#requirements'].innerHTML,/chunk 32/);assert.equal(reqPage['#req-count'].textContent,'2 REQUIREMENTS');});
const reviewText='<script>alert(1)</script>';
const reviewPage=requirementsPage({scenario:reviewText,requirements:[]});
check('requirements page keeps unmatched input escaped and marked for review',()=>{assert.match(reviewPage['#requirements'].innerHTML,/&lt;script&gt;/);assert.match(reviewPage['#requirements'].innerHTML,/NEEDS REVIEW/);});

const sdlcIds=['stability','change','uncertainty','complexity','users','prototype','vv','timeline','modular','early','risk','releases','models','recommendation','reason','unknown-note','sdlc-status','analyze'];
const nodes=Object.fromEntries(sdlcIds.map(id=>[id,element(base[id]||'')]));
const sdlcContext={document:{getElementById:id=>nodes[id]},window:browser.window};
vm.runInNewContext(fs.readFileSync('frontend/assets/sdlc.js','utf8'),sdlcContext);
check('SDLC UI does not recommend a lifecycle with no evidence',()=>{nodes.analyze.handlers.click();assert.equal(nodes.recommendation.textContent,'Insufficient evidence');assert.match(nodes['unknown-note'].textContent,/requirement stability/);});
check('SDLC UI renders all seven comparisons',()=>{assert.equal((nodes.models.innerHTML.match(/class="model"/g)||[]).length,7);});
check('SDLC UI explains recommendation evidence and conflicts',()=>{for(const [id,value] of Object.entries({stability:'stable',change:'low',uncertainty:'low',complexity:'low',vv:'no'}))nodes[id].value=value;nodes.analyze.handlers.click();assert.equal(nodes.recommendation.textContent,'Waterfall');assert.match(nodes.reason.textContent,/Supporting evidence/);assert.match(nodes.models.innerHTML,/Conflicts:/);});
check('SDLC UI refreshes after a project input changes',()=>{nodes.change.value='high';nodes.change.handlers.change();assert.equal(nodes['sdlc-status'].textContent,'Comparison updated · rule-based fit signals');assert.match(nodes.models.innerHTML,/Agile/);});
console.log(`\n${passed} checks passed.`);
