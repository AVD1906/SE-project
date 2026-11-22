const list=document.querySelector('#requirements');
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function renderRequirements(rows){
  list.innerHTML=rows.map(item=>item.confidence==='review'
    ? `<article class="req"><div class="req-top"><span class="req-id">REQUEST · NEEDS REVIEW</span><span class="tag">NOT SOURCE-MATCHED</span></div><p>No source-backed requirement was identified. Review this customer request and add verified requirements before using it in the SRS: ${escapeHTML(item.text)}</p><div class="req-foot"><span>${escapeHTML(item.source)}</span><span>Human review required</span></div></article>`
    : `<article class="req"><div class="req-top"><span class="req-id">${escapeHTML(item.id)} · FUNCTIONAL</span><span class="tag">DRAFT · ${escapeHTML(item.priority||'UNPRIORITIZED')}</span></div><p>${escapeHTML(item.text)}</p><div class="req-foot"><span>${escapeHTML(item.source)}</span><span>Confidence ${escapeHTML(item.confidence)}</span></div></article>`).join('');
}

try{
  const workflow=JSON.parse(localStorage.getItem('fieldnote.workflow')||'null');
  if(workflow?.scenario){
    const requirements=Array.isArray(workflow.requirements)?workflow.requirements:[];
    document.querySelector('#scenario-display').textContent=workflow.scenario;
    document.querySelector('#req-count').textContent=`${requirements.length} REQUIREMENT${requirements.length===1?'':'S'}`;
    if(requirements.length)renderRequirements(requirements);
    else renderRequirements([{text:workflow.scenario,source:'Customer statement · source evidence not matched',confidence:'review'}]);
  }
}catch(_){
  document.querySelector('#scenario-display').textContent='Unable to load the saved request. Return to the overview and submit it again.';
}
