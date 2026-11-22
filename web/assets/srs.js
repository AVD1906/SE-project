const byId = id => document.getElementById(id);
const missing = 'Not specified in supplied information.';
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const starterRequirements = [
  { id:'R1', title:'Online loan application', description:'The application must enable customers to submit a loan application form online.', rationale:'Allows customers to apply for loans conveniently through an online interface.', exceptions:'Not specified in source evidence.', dependencies:'None explicitly supported by source evidence.', source:'EDF Loan Management System Requirements Specification, chunk 27.', priority:'Medium' },
  { id:'R2', title:'Identify applicants with a current loan', description:'The application should flag clients who have a current loan for special evaluation by the Credit Officer.', rationale:'Ensures that the bank can identify applicants who already have a current loan and route them for special evaluation.', exceptions:'Not specified in source evidence.', dependencies:'R1 — online loan application.', source:'EDF Loan Management System Requirements Specification, chunk 32.', priority:'Medium' }
];
let savedDraft=null;
try { const raw=localStorage.getItem('fieldnote.srsDraft'); if(raw)savedDraft=JSON.parse(raw); } catch (_) { savedDraft=null; }
let savedWorkflow=null;
try { const raw=localStorage.getItem('fieldnote.workflow'); if(raw)savedWorkflow=JSON.parse(raw); } catch (_) { savedWorkflow=null; }
const initialRequirements = savedDraft && Array.isArray(savedDraft.requirements)
  ? savedDraft.requirements.map((r,i)=>({id:r.id||`R${i+1}`,title:r.title||'',description:r.text||r.description||'',rationale:r.rationale||missing,exceptions:r.exceptions||missing,dependencies:r.dependencies||missing,priority:r.priority||missing,source:r.source||'To be confirmed.'}))
  : starterRequirements;

function field(label, key, value, wide=false) {
  return `<div class="fieldwrap"><label class="label">${label}</label><textarea data-field="${key}" ${wide?'':'rows="2"'}>${esc(value)}</textarea></div>`;
}
function requirementCard(item, index) {
  const fields = [
    ['Requirement ID','id',item.id], ['Requirement title','title',item.title],
    ['Requirement description','description',item.description], ['Business rationale','rationale',item.rationale],
    ['Exception scenarios','exceptions',item.exceptions], ['Dependencies','dependencies',item.dependencies],
    ['Priority','priority',item.priority], ['Source evidence','source',item.source]
  ];
  return `<article class="req-edit"><div class="req-edit-head"><b>FUNCTIONAL REQUIREMENT ${index+1}</b><button class="link-btn" type="button" data-remove="${index}">Remove</button></div><div class="req-grid">${fields.map(([label,key,value])=>field(label,key,value,key==='description'||key==='rationale'||key==='exceptions'||key==='dependencies'||key==='source')).join('')}</div></article>`;
}
function requirementsFromForm() {
  return [...document.querySelectorAll('.req-edit')].map(card => Object.fromEntries([...card.querySelectorAll('[data-field]')].map(input=>[input.dataset.field,input.value.trim()])));
}
function renderRequirements() {
  const reqs=requirementsFromForm();
  byId('req-list').innerHTML=reqs.map(requirementCard).join('');
  document.querySelectorAll('[data-remove]').forEach(button=>button.addEventListener('click',()=>{button.closest('.req-edit').remove();renumberAndUpdate();}));
}
function renumberAndUpdate() {
  document.querySelectorAll('#req-list .req-edit').forEach((card,i)=>card.querySelector('.req-edit-head b').textContent=`FUNCTIONAL REQUIREMENT ${i+1}`);
  renderPreview();
}
function value(id) { return byId(id).value.trim() || missing; }
function p(label,text) { return `<p><strong>${esc(label)}:</strong> ${esc(text || missing)}</p>`; }
function section(title, contents) { return `<h2>${esc(title)}</h2>${contents}`; }
function subsection(title, text) { return `<h3>${esc(title)}</h3><p>${esc(text || missing)}</p>`; }
function documentHTML() {
  const name=value('project'), reqs=requirementsFromForm();
  const requirementSections=reqs.length?reqs.map((r,i)=>`<h3>3.2.${i+1} Functional Requirement ${esc(r.id||`FR-${i+1}`)}: ${esc(r.title||'Untitled requirement')}</h3><p><strong>Functional requirement ID:</strong> ${esc(r.id||`FR-${i+1}`)}</p>${p('Requirement title',r.title)}${p('Requirement description',r.description)}${p('Business rationale',r.rationale)}${p('Exception scenarios',r.exceptions)}${p('Dependencies',r.dependencies)}${p('Priority',r.priority)}${p('Source evidence',r.source)}`).join(''):'<p>No functional requirements have been provided.</p>';
  const interfaces=section('3.1 External Interface Requirements',[
    subsection('3.1.1 User Interfaces',value('external-ui')),
    subsection('3.1.2 Hardware Interface',value('external-hardware')),
    subsection('3.1.3 Software Interface',value('external-software')),
    subsection('3.1.4 Communication Interface',value('external-communication'))
  ].join(''));
  const general=section('2. General Description',[
    section('2.1 Product Perspective',`<p>${esc(value('perspective'))}</p>${subsection('2.1.1 System Interface',value('system-interface'))}${subsection('2.1.2 User Interface',value('user-interface'))}${subsection('2.1.3 Hardware Interface',value('hardware-interface'))}${subsection('2.1.4 Software Interface',value('software-interface'))}${subsection('2.1.5 Communication Interface',value('communication-interface'))}${subsection('2.1.6 Operations',value('operations'))}`),
    subsection('2.2 Product Functions',value('product-functions')),
    subsection('2.3 User Characteristics',value('users')),
    subsection('2.4 General Constraints',value('constraints')),
    subsection('2.5 Assumptions and Dependencies',value('assumptions'))
  ].join(''));
  const specific=section('3. Specific Requirements',[
    interfaces,
    section('3.2 Functional Requirements',requirementSections),
    subsection('3.3 Performance Requirements',value('performance')),
    section('3.4 Design Constraints',`<p>${esc(value('design-constraints'))}</p>${subsection('3.4.1 Standards Compliance',value('compliance'))}`),
    subsection('3.5 Logical Database Requirements',value('database')),
    section('3.6 Software System Attributes',`${subsection('3.6.1 Reliability',value('reliability'))}${subsection('3.6.2 Availability',value('availability'))}${subsection('3.6.3 Security',value('security'))}${subsection('3.6.4 Maintainability',value('maintainability'))}`)
  ].join(''));
  const body=`<header><div class="eyebrow">Software Requirements Specification</div><h1>${esc(name)}</h1><p class="meta">Version ${esc(value('version'))}</p></header>${section('1. Introduction',[
    subsection('1.1 Purpose',value('purpose')),
    subsection('1.2 Scope',value('scope')),
    subsection('1.3 Definitions, Acronyms and Abbreviations',value('definitions')),
    subsection('1.4 References',`${value('references')} ${[...new Set(reqs.map(r=>r.source).filter(Boolean))].join(' ')}`),
    subsection('1.5 Overview of the Rest of the SRS',value('overview'))
  ].join(''))}${general}${specific}${section('Appendices',value('appendix'))}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(name)} — SRS</title><style>
    @page{size:A4;margin:22mm}body{font:11pt/1.55 Arial,Helvetica,sans-serif;color:#1c2924;max-width:850px;margin:40px auto;padding:0 36px}h1{font-size:25pt;color:#245d4b;margin:8px 0}h2{font-size:16pt;color:#245d4b;border-bottom:1px solid #dce4dd;padding:15px 0 5px;margin:25px 0 10px;break-after:avoid}h3{font-size:12pt;margin:17px 0 6px;break-after:avoid}p{margin:5px 0 10px;white-space:pre-wrap}.meta{color:#687872}.eyebrow{font-size:9pt;letter-spacing:1.4px;text-transform:uppercase;color:#718078}strong{color:#263c32}header{border-bottom:2px solid #245d4b;padding-bottom:18px;margin-bottom:20px}.note{font-size:9pt;color:#758079;margin-top:30px;border-top:1px solid #ddd;padding-top:8px}@media print{body{max-width:none;margin:0;padding:0}h2,h3{page-break-after:avoid}}
    </style></head><body>${body}<p class="note">Generated from project information supplied by the user. Fields marked “Not specified in supplied information” require stakeholder input.</p></body></html>`;
}
function renderPreview() { const html=documentHTML();byId('preview').srcdoc=html;byId('srs-status').textContent='Preview updated';return html; }
function pdfSafeText(text) {
  return String(text).replace(/[–—−]/g,'-').replace(/·/g,'-').replace(/→/g,'->').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/…/g,'...').replace(/\u00a0/g,' ').replace(/[^\x20-\x7e]/g,'?');
}
function wrapPdfText(text,limit) {
  const words=pdfSafeText(text).split(/\s+/).filter(Boolean),lines=[];let line='';
  for(const word of words){if(!line){line=word;continue;}if((line+' '+word).length<=limit)line+=' '+word;else{lines.push(line);line=word;}}
  if(line)lines.push(line);return lines.length?lines:[''];
}
function makePdfBytes(html) {
  const parsed=new DOMParser().parseFromString(html,'text/html'),blocks=[];
  function walk(node){for(const child of node.children){const tag=child.tagName.toLowerCase();if(['h1','h2','h3','p'].includes(tag)){blocks.push({tag,text:child.textContent.trim()});}else walk(child);}}
  walk(parsed.body);
  const pageW=595,pageH=842,left=56,right=539,bottom=58,top=774;
  const pages=[];let commands='',y=top,pageNum=1;
  const pageHeader=()=>{commands+=`0.34 0.39 0.36 rg\nBT /F1 9 Tf 1 0 0 1 ${left} 811 Tm (${pdfEscape(pdfSafeText(byId('project').value||'Software Requirements Specification'))}) Tj ET\n0.82 0.86 0.82 RG 0.6 w ${left} 802 m ${right} 802 l S\n`;};
  const finishPage=()=>{commands+=`0.82 0.86 0.82 RG 0.6 w ${left} 44 m ${right} 44 l S\n0.34 0.39 0.36 rg\nBT /F1 8 Tf 1 0 0 1 ${right-48} 29 Tm (Page ${pageNum}) Tj ET\n`;pages.push(commands);};
  const newPage=()=>{finishPage();pageNum++;commands='';y=top;pageHeader();};
  pageHeader();
  function draw(text,size,bold,color='242D28'){
    const limit=Math.max(35,Math.floor((right-left)/(size*.51))),lines=wrapPdfText(text,limit),leading=size*1.38,gap=size>=15?9:5;
    for(const line of lines){if(y-leading<bottom)newPage();commands+=`${pdfColor(color)} rg\nBT /${bold?'F2':'F1'} ${size} Tf 1 0 0 1 ${left} ${y.toFixed(1)} Tm (${pdfEscape(line)}) Tj ET\n`;y-=leading;}
    y-=gap;
  }
  function pdfColor(hex){const n=parseInt(hex,16);return `${((n>>16)&255)/255} ${((n>>8)&255)/255} ${(n&255)/255}`;}
  function pdfEscape(text){return text.replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');}
  for(const block of blocks){const h=block.tag==='h1'?22:block.tag==='h2'?15:block.tag==='h3'?11:9.5;draw(block.text,h,block.tag!=='p',block.tag==='p'?'26332D':'245D4B');}
  finishPage();
  const maxObject=4+pages.length*2,objects=new Array(maxObject+1);
  objects[1]='<< /Type /Catalog /Pages 2 0 R >>';
  objects[2]=`<< /Type /Pages /Kids [${pages.map((_,i)=>`${5+i*2} 0 R`).join(' ')}] /Count ${pages.length} >>`;
  objects[3]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objects[4]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
  pages.forEach((content,i)=>{const pageObj=5+i*2,streamObj=pageObj+1;objects[pageObj]=`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${streamObj} 0 R >>`;objects[streamObj]=`<< /Length ${new TextEncoder().encode(content).length} >>\nstream\n${content}endstream`;});
  let output='%PDF-1.4\n',offsets=[0];
  for(let id=1;id<objects.length;id++){offsets[id]=new TextEncoder().encode(output).length;output+=`${id} 0 obj\n${objects[id]}\nendobj\n`;}
  const xref=new TextEncoder().encode(output).length;output+=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for(let id=1;id<objects.length;id++)output+=`${String(offsets[id]).padStart(10,'0')} 00000 n \n`;
  output+=`trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(output);
}

if(savedDraft){
  byId('import-note').textContent=initialRequirements.length
    ? `Imported ${initialRequirements.length} source-matched requirement${initialRequirements.length===1?'':'s'} from the Requirements agent. Review each draft before treating it as approved.`
    : 'The last scenario was not matched to source evidence. No unverified requirement has been added. Review the scenario or add a verified requirement manually.';
  if(savedDraft.scenario)byId('scope').value=`Customer scenario: ${savedDraft.scenario}\n\nScope boundaries and exclusions: ${missing}`;
  byId('product-functions').value=initialRequirements.length?initialRequirements.map(r=>r.description).join('\n'):'No source-matched product functions have been added.';
}
if(savedWorkflow){
  const {scenario,characteristics,sdlc}=savedWorkflow;
  byId('edit-details').open=false;
  byId('project').value=savedWorkflow.systemName||'Software System';
  byId('purpose').value=`Specify the software requirements for ${savedWorkflow.systemName||'the proposed system'} based on the customer request and source-matched capabilities.`;
  byId('scope').value=`Customer statement: ${scenario}\n\nMatched source-backed capabilities: ${initialRequirements.length}. Scope boundaries, exclusions, and acceptance criteria require stakeholder review.`;
  byId('perspective').value=`The product scope is derived from the customer statement. Interfaces with other products and operational ownership are to be confirmed.`;
  byId('product-functions').value=initialRequirements.length?initialRequirements.map(r=>r.description).join('\n'):'No source-matched product functions have been added. The request is listed for review.';
  byId('assumptions').value=`Requirements are matched only against the source material included with this project. Unknown deployment, integration, security, and operational details require stakeholder confirmation.\n\nAutomatically inferred SDLC characteristics: ${characteristics.inferenceNotes.join('; ')}.`;
  byId('references').value=`IGNOU BCS-051, Introduction to Software Engineering, Block 1, Unit 1 — IEEE 830-1998 SRS outline (user-provided Block-1.pdf).${initialRequirements.length?'\nEDF Loan Management System Requirements Specification; source references are listed with each functional requirement.':''}`;
  const modelText=sdlc.candidate?`${sdlc.committed?'Best-supported fit':'Provisional candidate'}: ${sdlc.candidate} (fit signal ${sdlc.score}/100, ${sdlc.evaluated} evaluated conditions). This is not a probability. Supporting signals: ${sdlc.good.join('; ')||'none recorded'}. Conflicts: ${sdlc.bad.join('; ')||'none recorded'}. Unknown characteristics: ${sdlc.unknown.join(', ')||'none'}. Confirm this rule-based prediction with the project team.`:'No SDLC candidate could be supported from the supplied request. Stakeholder clarification is needed.';
  byId('appendix').value=`Appendix A: Requirement-to-source traceability is included with each functional requirement.\nAppendix B: Open questions and unspecified details are identified in the relevant sections.\nAppendix C: SDLC prediction\n${modelText}`;
  byId('import-note').textContent=`Automatically prepared from the one-time workflow input. ${initialRequirements.length} source-matched requirement${initialRequirements.length===1?'':'s'} imported; inferred SDLC details are documented in Appendix C.`;
}
byId('req-list').innerHTML=initialRequirements.map(requirementCard).join('')||'<div class="empty">No requirements imported. Use “Add a requirement” after reviewing source evidence.</div>';
byId('req-list').addEventListener('click',event=>{
  const button=event.target.closest('[data-remove]');
  if(button){button.closest('.req-edit').remove();renumberAndUpdate();}
});
byId('add-req').addEventListener('click',()=>{
  byId('req-list').querySelector('.empty')?.remove();
  const count=document.querySelectorAll('#req-list .req-edit').length;
  const used=[...document.querySelectorAll('#req-list [data-field="id"]')].map(input=>Number((input.value.match(/\d+/)||[])[0])).filter(Number.isFinite);
  const newId=`R${Math.max(0,...used)+1}`;
  byId('req-list').insertAdjacentHTML('beforeend',requirementCard({id:newId,title:'',description:'',rationale:'',exceptions:missing,dependencies:'None specified.',priority:'Not assigned.',source:'To be added.'},count));
  renderPreview();
});
byId('generate-srs').addEventListener('click',renderPreview);
byId('download-srs').addEventListener('click',()=>{
  const html=renderPreview(),bytes=makePdfBytes(html),safeName=(byId('project').value.trim()||'software-requirements').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase();
  const blob=new Blob([bytes],{type:'application/pdf'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=`${safeName}-srs.pdf`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  byId('srs-status').textContent='PDF downloaded';
});
byId('print-srs').addEventListener('click',()=>{renderPreview();byId('preview').contentWindow.print();});
document.querySelectorAll('.srs-form textarea,.srs-form input').forEach(input=>input.addEventListener('input',()=>{byId('srs-status').textContent='Changes not yet previewed';}));
byId('req-list').addEventListener('input',()=>{byId('srs-status').textContent='Changes not yet previewed';});
renderPreview();
