// Draft offline benchmark: never treat its labels as reviewed ground truth.
const fs = require('node:fs');
const vm = require('node:vm');
const benchmark = JSON.parse(fs.readFileSync('evaluation/benchmark/benchmark.json', 'utf8'));
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('frontend/assets/agent-core.js', 'utf8'), context);
const { mapScenario, evaluateSDLC } = context.window.FieldnoteAgents;
const chunkText = fs.readFileSync('data/processed/chunks.txt', 'utf8');
const availableChunks = new Map([...chunkText.matchAll(/CHUNK_ID:\s*(\d+)\r?\nSOURCE:\s*([^\r\n]+)/g)].map(m=>[Number(m[1]),m[2].trim()]));
const ids=[...benchmark.requirements_cases,...benchmark.sdlc_cases].map(row=>row.id);
if(new Set(ids).size!==ids.length) throw new Error('Duplicate benchmark case IDs found.');
const sourceIssues=[];
for(const row of benchmark.requirements_cases) for(const ref of row.sources){
  const match=ref.match(/^(.*)#chunk-(\d+)$/);
  if(!match || availableChunks.get(Number(match[2]))!==match[1]) sourceIssues.push(`${row.id}: invalid source reference ${ref}`);
}
if(sourceIssues.length) throw new Error(`Invalid benchmark source references:\n${sourceIssues.join('\n')}`);

function setMetrics(rows, expectedFor, predictedFor) {
  let tp=0, fp=0, fn=0, exact=0;
  for (const row of rows) {
    const expected = expectedFor(row), predicted = predictedFor(row);
    const remaining = [...expected];
    for (const id of predicted) { const at=remaining.indexOf(id); if(at>=0){tp++;remaining.splice(at,1);}else fp++; }
    fn += remaining.length;
    if (expected.length === predicted.length && expected.every((id,i)=>id===predicted[i])) exact++;
  }
  const precision=tp+fp ? tp/(tp+fp) : 0, recall=tp+fn ? tp/(tp+fn) : 0;
  return {cases:rows.length, exactSet:exact, exactSetRate:exact/rows.length, tp, fp, fn, precision, recall, f1:precision+recall?2*precision*recall/(precision+recall):0};
}
const reqOutputs = new Map(benchmark.requirements_cases.map(row => [row.id, mapScenario(row.scenario).requirements.filter(r=>r.confidence!=='review').map(r=>r.id)]));
const reqMetrics = setMetrics(benchmark.requirements_cases, row=>row.expected_requirement_ids, row=>reqOutputs.get(row.id));
const sdlcRows = benchmark.sdlc_cases.map(row => ({...row, result:evaluateSDLC(row.characteristics)}));
const sdlcCorrect = sdlcRows.filter(row => (row.result.recommendation?.name ?? null) === row.expected_model).length;
const sdlcExpectedDecisions = sdlcRows.filter(row => row.expected_model !== null);
const sdlcAbstained = sdlcRows.filter(row => row.result.recommendation === null).length;
const unsupportedErrors = benchmark.requirements_cases.filter(row=>row.expected_requirement_ids.length===0 && reqOutputs.get(row.id).length>0).map(row=>row.id);
const sdlcErrors = sdlcRows.filter(row => (row.result.recommendation?.name ?? null) !== row.expected_model);

console.log(`Benchmark: ${benchmark.metadata.name}`);
console.log(`Label status: ${benchmark.metadata.status}`);
console.log(`\nRequirements (${reqMetrics.cases} cases)`);
console.log(`  Exact requirement-set match: ${reqMetrics.exactSet}/${reqMetrics.cases} (${(100*reqMetrics.exactSetRate).toFixed(1)}%)`);
console.log(`  Draft-label precision / recall / F1: ${(100*reqMetrics.precision).toFixed(1)}% / ${(100*reqMetrics.recall).toFixed(1)}% / ${(100*reqMetrics.f1).toFixed(1)}%`);
console.log(`  Requirement IDs: TP ${reqMetrics.tp}, FP ${reqMetrics.fp}, FN ${reqMetrics.fn}`);
console.log(`  Unsupported-request false positives: ${unsupportedErrors.length}${unsupportedErrors.length?` (${unsupportedErrors.join(', ')})`:''}`);
console.log(`  Source references checked against data/processed/chunks.txt: ${benchmark.requirements_cases.reduce((n,row)=>n+row.sources.length,0)} valid`);
console.log(`\nSDLC (${sdlcRows.length} cases)`);
console.log(`  Draft expected-decision agreement: ${sdlcRows.length ? (100*sdlcCorrect/sdlcRows.length).toFixed(1):'0.0'}% (${sdlcCorrect}/${sdlcRows.length})`);
console.log(`  Recommendation coverage: ${(100*(sdlcRows.length-sdlcAbstained)/sdlcRows.length).toFixed(1)}% (${sdlcRows.length-sdlcAbstained}/${sdlcRows.length})`);
console.log(`  Correctly abstained cases: ${sdlcRows.filter(row=>row.expected_model===null && row.result.recommendation===null).length}/${sdlcRows.filter(row=>row.expected_model===null).length}`);
console.log(`  Mismatches: ${sdlcErrors.map(row=>`${row.id} expected=${row.expected_model??'abstain'} got=${row.result.recommendation?.name??'abstain'}`).join('; ')||'none'}`);
console.log('\nDraft-label metrics are diagnostic only. Review every label with an instructor or peer before publishing accuracy claims.');
