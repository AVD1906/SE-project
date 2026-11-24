const $ = id => document.getElementById(id);
const ids = ['stability', 'change', 'uncertainty', 'complexity', 'users', 'prototype', 'vv', 'timeline', 'modular', 'early', 'risk', 'releases'];
const blurbs = {
  'Waterfall': 'Staged development fits a clear, stable, well understood scope.',
  'V-Shaped': 'Stable, well-defined requirements and planned verification fit this model.',
  'Prototype': 'Prototyping helps clarify uncertain needs and user interactions.',
  'RAD': 'Short iterations, modular work, and high user involvement support rapid delivery.',
  'Iterative / Incremental': 'Known major requirements can be delivered in increments as details evolve.',
  'Spiral': 'Repeated risk analysis and prototyping suit high-risk or uncertain work.',
  'Agile': 'Frequent feedback, releases, and changing priorities suit adaptive development.'
};
function analyze(options={}) {
  const result = window.FieldnoteAgents.evaluateSDLC(Object.fromEntries(ids.map(id => [id, $(id).value])));
  const best = result.recommendation;
  const candidate=best||result.ranked.find(row=>row.evaluated>0)||null;
  const qualified=result.ranked.filter(row=>row.evaluated>=3);
  const tiedTop=qualified.length>1&&qualified[0].score===qualified[1].score&&qualified[0].evaluated===qualified[1].evaluated;
  const tiedNames=tiedTop?qualified.filter(row=>row.score===qualified[0].score&&row.evaluated===qualified[0].evaluated).map(row=>row.name):[];
  $('recommendation').textContent = best ? best.name : tiedTop ? 'No clear winner yet' : candidate ? `Provisional: ${candidate.name}` : 'Insufficient evidence';
  $('reason').textContent = tiedTop
    ? `The top fit signals are tied (${tiedNames.join(', ')}), each at ${qualified[0].score}% across ${qualified[0].evaluated} evaluated conditions. Add or clarify project details to distinguish them.`
    : candidate
    ? `${best?'Recommended model':'Leading model'}: ${candidate.good.length} of ${candidate.evaluated} known signals match (${candidate.score}% fit). ${candidate.good.length ? `Supporting evidence: ${candidate.good.join(', ')}.` : ''} ${candidate.bad.length ? `Conflicts: ${candidate.bad.join(', ')}.` : ''} ${best?'':'More project facts are needed before committing to a model.'}`
    : 'No model has evidence to compare yet. Enter the requirement once on the overview page to prepare all three outputs.';
  $('models').innerHTML = result.ranked.map((item, i) => {
    const isTiedTop=tiedTop&&item.score===qualified[0].score&&item.evaluated===qualified[0].evaluated;
    const isWinner=Boolean(best&&item.name===best.name);
    const score = item.score === null ? 'No known signals' : `${item.score}% fit · ${item.good.length}/${item.evaluated} match`;
    const detail = item.evaluated
      ? `${item.good.length ? `Fits: ${item.good.join(', ')}.` : 'No known conditions match.'} ${item.bad.length ? `Conflicts: ${item.bad.join(', ')}.` : ''}`
      : 'Provide relevant project characteristics to evaluate this model.';
    return `<div class="model"><div class="modelline"><b>${item.name}${isWinner ? ' · recommended' : isTiedTop ? ' · tied top fit' : ''}</b><span class="score">${score}</span></div><div class="bar"><i style="width:${item.score ?? 0}%"></i></div><small>${escapeHTML(blurbs[item.name])} ${escapeHTML(detail)}</small></div>`;
  }).join('');
  $('sdlc-status').textContent = options.loaded ? 'Project characteristics loaded automatically from your overview request.' : 'Comparison updated · rule-based fit signals';
  if(options.persist){
    try{
      const current=JSON.parse(localStorage.getItem('fieldnote.workflow')||'null');
      if(current){current.characteristics=Object.fromEntries(ids.map(id=>[id,$(id).value]));current.sdlc={candidate:candidate?.name||null,score:candidate?.score??null,evaluated:candidate?.evaluated??0,committed:Boolean(best),good:candidate?.good||[],bad:candidate?.bad||[],unknown:result.unknown};localStorage.setItem('fieldnote.workflow',JSON.stringify(current));}
    }catch(_){}
  }
}
function escapeHTML(s) { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
 $('analyze').addEventListener('click', ()=>analyze({persist:true}));
for (const id of ids) $(id).addEventListener('change', ()=>analyze({persist:true}));
try{
  const workflow=JSON.parse(localStorage.getItem('fieldnote.workflow')||'null');
  if(workflow?.scenario&&workflow.characteristics){for(const id of ids){const select=$(id),value=workflow.characteristics[id];if(value&&[...select.options].some(option=>option.value===value))select.value=value;}analyze({loaded:true});}
  else $('sdlc-status').textContent='Enter your requirement once on the overview page to prefill this comparison.';
}catch(_){$('sdlc-status').textContent='Enter your requirement once on the overview page to prefill this comparison.';}
