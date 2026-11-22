const el=id=>document.getElementById(id);
function runWorkflow(){
  const scenario=el('request').value.trim();
  if(!scenario){el('run-status').textContent='Enter a requirement to start.';return;}
  const {requirements,characteristics,comparison,candidate,committed,systemName}=window.FieldnoteAgents.analyzeRequest(scenario);
  const workflow={scenario,requirements,characteristics,sdlc:{candidate:candidate?.name||null,score:candidate?.score??null,evaluated:candidate?.evaluated??0,committed,good:candidate?.good||[],bad:candidate?.bad||[],unknown:comparison.unknown},systemName};
  const draft={scenario,requirements};
  try{localStorage.setItem('fieldnote.workflow',JSON.stringify(workflow));localStorage.setItem('fieldnote.srsDraft',JSON.stringify(draft));el('run-status').textContent='Requirements, SDLC prediction, and SRS draft prepared from this request.';}
  catch(_){el('run-status').textContent='Outputs prepared, but browser storage is unavailable. Keep this page open while continuing.';}
}
el('run-workflow').addEventListener('click',()=>{
  try{runWorkflow();}
  catch(error){console.error('Workflow generation failed:',error);el('run-status').textContent='The workflow hit an error. Refresh the page and try again.';}
});
try{const saved=JSON.parse(localStorage.getItem('fieldnote.workflow')||'null');if(saved?.scenario){el('request').value=saved.scenario;runWorkflow();el('run-status').textContent='Previous request restored. Edit it or run it again.';}}catch(_){}
