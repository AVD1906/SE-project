(() => {
  const requirementCatalog = [
    {id:'R1',title:'Online loan application',text:'The application must enable customers to submit a loan application form online.',rationale:'Allows customers to apply for loans conveniently through an online interface.',dependencies:'None explicitly supported by source evidence.',priority:'Medium',source:'EDF Loan Management SRS · chunks 26–27',confidence:'0.90',match:t=>/\b(?:apply|application|applications|loan form)\b/i.test(t)&&/\b(?:online|web|website|digital)\b/i.test(t)&&/\b(?:loan|loans)\b/i.test(t)},
    {id:'R2',title:'Identify applicants with a current loan',text:'The application should flag clients who have a current loan for special evaluation by the Credit Officer.',rationale:'Ensures that the bank can identify applicants who already have a current loan and route them for special evaluation.',dependencies:'None explicitly supported by source evidence.',priority:'Medium',source:'EDF Loan Management SRS · chunk 32',confidence:'1.00',match:t=>/\b(?:existing|current|previous|prior|already)\b/i.test(t)&&/\b(?:loan|loans|borrowing)\b/i.test(t)&&/\b(?:check|identify|flag|detect|whether|already|hold|holds|have|has|applicant)\b/i.test(t)},
    {id:'R3',title:'Capture applicant details',text:'The loan application form should record the applicant and client details specified in the source requirements.',rationale:'Captures information listed for loan application processing.',dependencies:'R1 — online loan application.',priority:'Medium',source:'EDF Loan Management SRS · chunks 27–28',confidence:'source matched',match:t=>/\b(?:applicant|client|customer|personal)\b/i.test(t)&&/\b(?:details|information|income|identity|identification|employer|contact|form fields)\b/i.test(t)},
    {id:'R4',title:'Attach supporting documents',text:'The loan application form should allow users to attach digital copies of required documents, photos, and images.',rationale:'Supports attaching the materials required for the loan application.',dependencies:'R1 — online loan application.',priority:'Medium',source:'EDF Loan Management SRS · chunk 32',confidence:'source matched',match:t=>/\b(?:attach|attachment|upload|document|documents|photos|images)\b/i.test(t)&&/\b(?:loan|application|form|file|files|supporting)\b/i.test(t)},
    {id:'R5',title:'Calculate effective interest rate',text:'The application should calculate and indicate the Effective Interest Rate (EIR).',rationale:'Presents the effective interest rate for loan evaluation.',dependencies:'Loan product and interest inputs are to be specified.',priority:'Medium',source:'EDF Loan Management SRS · chunk 32',confidence:'source matched',match:t=>/\b(?:effective interest rate|\bEIR\b)\b/i.test(t)},
    {id:'R6',title:'Assess collateral and guarantee adequacy',text:'The application should indicate whether the collateral provided is sufficient and whether the guarantee provided is adequate.',rationale:'Supports credit review of collateral and guarantees.',dependencies:'Loan and collateral information are to be specified.',priority:'Medium',source:'EDF Loan Management SRS · chunk 33',confidence:'source matched',match:t=>/\b(?:collateral|guarantee|guarantor)\b/i.test(t)&&/\b(?:adequate|sufficient|sufficiency|adequacy|assess|assessment|value)\b/i.test(t)},
    {id:'R7',title:'Configure loan workflow',text:'The application should enable a user to define loan workflow processes such as application, verification, approval, and disbursement.',rationale:'Allows the bank to define the workflow used to process loan applications.',dependencies:'Loan process stages are to be specified.',priority:'Medium',source:'EDF Loan Management SRS · chunk 33',confidence:'source matched',match:t=>/\b(?:workflows?|work flow|process stages?|process steps?)\b/i.test(t)},
    {id:'R8',title:'Configure approval levels by amount',text:'The application should support multiple loan approval levels based on configured transaction amount limits.',rationale:'Supports approval workflows aligned to transaction amount limits.',dependencies:'Approval roles and amount limits are to be specified.',priority:'Medium',source:'EDF Loan Management SRS · chunks 33–34',confidence:'source matched',match:t=>/\b(?:approval level|approval levels|approval limit|approval limits|amount limit|amount limits|transaction limit|authority matrix)\b/i.test(t)},
    {id:'R9',title:'Maintain an application change trail',text:'The application should keep a trail of changes made after submission, including the user who made each change.',rationale:'Makes post-submission changes traceable.',dependencies:'User identity and application history are required.',priority:'Medium',source:'EDF Loan Management SRS · chunk 34',confidence:'source matched',match:t=>/\b(?:audit trail|change trail|change history|history of changes|record edits|track changes)\b/i.test(t)},
    {id:'R10',title:'Notify users of application progress',text:'The application should send email and dashboard alerts when applications are submitted, sent for verification, approved, or rejected.',rationale:'Keeps customers and staff informed about application progress.',dependencies:'Notification channels and recipients are to be specified.',priority:'Medium',source:'EDF Loan Management SRS · chunks 34–35',confidence:'source matched',match:t=>/\b(?:notification|notifications|notify|alert|alerts)\b/i.test(t)&&/\b(?:application|submitted|verification|approved|rejected|status|progress)\b/i.test(t)},
    {id:'R11',title:'Generate repayment schedule',text:'The application should generate a loan repayment schedule with due dates and installment amounts.',rationale:'Provides the repayment plan for a loan.',dependencies:'Loan terms and repayment frequency are to be specified.',priority:'Medium',source:'EDF Loan Management SRS · chunks 35–36',confidence:'source matched',match:t=>/\b(?:repayment|loan)\b/i.test(t)&&/\b(?:schedules?|installments?|instalments?|due dates?|repayment plans?)\b/i.test(t)},
    {id:'R12',title:'Support group lending',text:'The application must support loan applications for recognized groups and track group and individual obligations.',rationale:'Supports the group lending process described in the source requirements.',dependencies:'Group and member records are required.',priority:'Medium',source:'EDF Loan Management SRS · chunk 40',confidence:'source matched',match:t=>/\b(?:group lending|group loan|group loans|recognized group)\b/i.test(t)},
    {id:'R13',title:'Record each group member amount',text:'The application must indicate the loan amount applied for by each individual group member.',rationale:'Distinguishes member-level loan amounts within a group application.',dependencies:'R12 — group lending.',priority:'Medium',source:'EDF Loan Management SRS · chunk 41',confidence:'source matched',match:t=>/\b(?:group|member)\b/i.test(t)&&/\b(?:individual amount|amount per member|each (?:individual )?member|member amount)\b/i.test(t)},
    {id:'R14',title:'Register collateral and verify ownership',text:'The application should record collateral details and support verification of the collateral ownership or authenticity.',rationale:'Records and verifies collateral used to secure loans.',dependencies:'Collateral records and verification source are to be specified.',priority:'Medium',source:'EDF Loan Management SRS · chunk 42',confidence:'source matched',match:t=>/\bcollateral\b/i.test(t)&&/\b(?:register|registration|ownership|owner|authenticity|verify|verification)\b/i.test(t)},
    {id:'R15',title:'Capture guarantor consent',text:'The application must require an attached guarantor consent letter when collateral used does not belong to the applicant.',rationale:'Records guarantor consent for the stated collateral situation.',dependencies:'R1 — loan application; guarantor and collateral details.',priority:'Medium',source:'EDF Loan Management SRS · chunk 50',confidence:'source matched',match:t=>/\bguarantor\b/i.test(t)&&/\b(?:consent|letter|collateral)\b/i.test(t)}
  ];

  function mapScenario(input) {
    const text = String(input || '').trim();
    if (!text) return { kind: 'empty', requirements: [] };
    const negation=/\b(?:not|never|without|no longer|doesn't|does not|don't|do not|cannot|can't|shouldn't|should not|mustn't|must not)\b/i;
    const clauses=text.split(/(?:[.;\n]+|\bbut\b|\bhowever\b|\bwhereas\b)/i).map(part=>part.trim()).filter(Boolean);
    const requirements=requirementCatalog.filter(item=>clauses.some(clause=>item.match(clause)&&!negation.test(clause))).map(({match,...item})=>({...item}));
    if(requirements.length)return {kind:'matched-example',requirements,unmapped:[]};
    return { kind: 'scenario-only', requirements: [{
      id: 'REVIEW',
      text,
      source: 'Customer statement · source evidence not matched',
      confidence: 'review'
    }],unmapped:[text] };
  }

  function evaluateSDLC(v) {
    const specs = {
      'Waterfall': { good: [], bad: [] },
      'V-Shaped': { good: [], bad: [] },
      'Prototype': { good: [], bad: [] },
      'RAD': { good: [], bad: [] },
      'Iterative / Incremental': { good: [], bad: [] },
      'Spiral': { good: [], bad: [] },
      'Agile': { good: [], bad: [] }
    };
    const add = (name, fit, evidence) => specs[name][fit ? 'good' : 'bad'].push(evidence);

    if (v.stability !== 'unknown') { add('Waterfall', v.stability === 'stable', v.stability === 'stable' ? 'stable requirements' : 'changing requirements'); add('V-Shaped', v.stability === 'stable', v.stability === 'stable' ? 'stable requirements' : 'changing requirements'); }
    if (v.uncertainty !== 'unknown') { const clear = v.uncertainty === 'low'; add('Waterfall', clear, clear ? 'low uncertainty' : 'uncertain requirements'); add('V-Shaped', clear, clear ? 'low uncertainty' : 'uncertain requirements'); add('Prototype', !clear, !clear ? 'uncertainty can benefit from prototyping' : 'requirements are already clear'); add('Spiral', v.uncertainty === 'high', v.uncertainty === 'high' ? 'high uncertainty' : 'uncertainty is not high'); add('Iterative / Incremental', clear, clear ? 'major requirements are known' : 'major requirements remain unclear'); }
    if (v.complexity !== 'unknown') { add('Waterfall', v.complexity === 'low', v.complexity === 'low' ? 'small or well-understood project' : 'high project complexity'); add('Spiral', v.complexity === 'high', v.complexity === 'high' ? 'complex project' : 'project complexity is low'); }
    if (v.change !== 'unknown') { const frequent = v.change === 'high'; add('Waterfall', !frequent, frequent ? 'frequent changes' : 'limited requirement change'); add('V-Shaped', !frequent, frequent ? 'frequent changes' : 'limited requirement change'); add('RAD', frequent, frequent ? 'requirements may change' : 'requirements are stable'); add('Iterative / Incremental', frequent, frequent ? 'details may evolve' : 'requirements are stable'); add('Spiral', frequent, frequent ? 'significant changes expected' : 'limited requirement change'); add('Agile', frequent, frequent ? 'frequent changes' : 'requirements are stable'); }
    if (v.users !== 'unknown') { const high = v.users === 'high'; add('Prototype', high, high ? 'high user involvement' : 'user involvement is not high'); add('RAD', high, high ? 'high user involvement' : 'user involvement is not high'); add('Agile', high, high ? 'continuous user involvement' : 'user involvement is not continuous'); }
    if (v.prototype !== 'unknown') add('Prototype', v.prototype === 'yes', v.prototype === 'yes' ? 'prototype is needed' : 'prototype is not needed');
    if (v.vv !== 'unknown') add('V-Shaped', v.vv === 'yes', v.vv === 'yes' ? 'formal verification and validation required' : 'formal V&V not required');
    if (v.timeline !== 'unknown') add('RAD', v.timeline === 'short', v.timeline === 'short' ? 'short delivery window' : 'timeline is not short');
    if (v.modular !== 'unknown') add('RAD', v.modular === 'yes', v.modular === 'yes' ? 'system can be modularized' : 'system is not modular');
    if (v.early !== 'unknown') add('Iterative / Incremental', v.early === 'yes', v.early === 'yes' ? 'early working functionality needed' : 'early working functionality not required');
    if (v.risk !== 'unknown') { const elevated = v.risk === 'medium' || v.risk === 'high'; add('Spiral', elevated, elevated ? 'medium or high risk' : 'low risk'); add('Iterative / Incremental', elevated, elevated ? 'risk benefits from incremental evaluation' : 'risk is low'); }
    if (v.releases !== 'unknown') add('Agile', v.releases === 'yes', v.releases === 'yes' ? 'frequent releases required' : 'frequent releases not required');
    if (v.early === 'yes') add('Agile', true, 'early working delivery useful');

    const ranked = Object.entries(specs).map(([name, s]) => {
      const total = s.good.length + s.bad.length;
      const score = total ? Math.round(s.good.length / total * 100) : null;
      return { name, score, good: s.good, bad: s.bad, evaluated: total };
    });
    ranked.sort((a, b) => b.evaluated - a.evaluated || (b.score ?? -1) - (a.score ?? -1) || a.name.localeCompare(b.name));
    const supported = ranked.filter(row => row.evaluated > 0);
    const qualified = supported.filter(row => row.evaluated >= 3);
    const leader = qualified[0] || null;
    const recommendation = leader && (!qualified[1] || leader.evaluated > qualified[1].evaluated || (leader.evaluated === qualified[1].evaluated && leader.score > qualified[1].score)) ? leader : null;
    const unknown = [];
    if (v.stability === 'unknown') unknown.push('requirement stability');
    if (v.change === 'unknown') unknown.push('requirement change frequency');
    if (v.users === 'unknown') unknown.push('user involvement');
    if (v.uncertainty === 'unknown') unknown.push('requirement uncertainty');
    if (v.complexity === 'unknown') unknown.push('project complexity');
    if (v.prototype === 'unknown') unknown.push('need for a prototype');
    if (v.vv === 'unknown') unknown.push('formal verification and validation');
    if (v.timeline === 'unknown') unknown.push('project duration');
    if (v.modular === 'unknown') unknown.push('modularization');
    if (v.early === 'unknown') unknown.push('need for early working functionality');
    if (v.risk === 'unknown') unknown.push('project risk');
    if (v.releases === 'unknown') unknown.push('frequent release need');
    return { ranked, recommendation, unknown };
  }

  function inferCharacteristics(scenario, requirements) {
    const t=String(scenario||'').toLowerCase(), count=requirements.length;
    const infer=(value,reason)=>({value,reason});
    const change=/\b(frequently|frequent changes|evolving requirements|changing requirements)\b/.test(t)?infer('high','the request says requirements change frequently'):/\b(fixed scope|stable requirements|will not change|rarely change)\b/.test(t)?infer('low','the request says scope is stable'):infer('unknown','change frequency was not stated');
    const uncertainty=/\b(unclear|uncertain|explore|discover|prototype|proof of concept)\b/.test(t)?infer('high','the request describes uncertainty or prototyping'):count?infer('low','source-backed requirement matches were found'):infer('unknown','no source-backed requirements were matched');
    const complexity=/\b(complex|enterprise|large scale)\b/.test(t)?infer('high','the request explicitly describes high scope'):count>=8?infer('high',`${count} source-backed capabilities were matched`):count>0&&count<=3?infer('low',`${count} source-backed capabilities were matched`):infer('unknown','project complexity was not stated');
    const user=/\b(continuous user|frequent stakeholder feedback|co-design with users)\b/.test(t)?'high':/\b(limited user involvement|users unavailable)\b/.test(t)?'low':'unknown';
    const vv=/\b(formal v&v|formal verification|rigorous validation)\b/.test(t)?'yes':/\b(no formal v&v|formal v&v not required)\b/.test(t)?'no':'unknown';
    const risk=/\b(high risk|significant risk)\b/.test(t)?'high':/\b(medium risk)\b/.test(t)?'medium':/\b(low risk)\b/.test(t)?'low':'unknown';
    return {
      stability:/\b(stable requirements|fixed requirements|fixed scope)\b/.test(t)?'stable':/\b(changing requirements|frequently changing)\b/.test(t)?'changing':'unknown',
      change:change.value,uncertainty:uncertainty.value,complexity:complexity.value,users:user,
      prototype:/\b(no prototype|prototype not needed)\b/.test(t)?'no':/\b(prototype|proof of concept)\b/.test(t)?'yes':'unknown',
      vv,timeline:/\b(2[- ]?3 months|two to three months|short timeline)\b/.test(t)?'short':/\b(long timeline|more than six months)\b/.test(t)?'normal':'unknown',
      modular:/\b(modular|independent modules|independent components)\b/.test(t)?'yes':/\b(monolithic|cannot be modularized)\b/.test(t)?'no':'unknown',
      early:/\b(mvp|early working|working version early|early release|pilot release)\b/.test(t)?'yes':/\b(no early release|early version not needed)\b/.test(t)?'no':'unknown',
      risk,releases:/\b(frequent releases|frequent updates|continuous releases)\b/.test(t)?'yes':/\b(no frequent releases|infrequent releases)\b/.test(t)?'no':'unknown',
      inferenceNotes:[uncertainty.reason,complexity.reason]
    };
  }

  function analyzeRequest(scenario) {
    const mapped=mapScenario(scenario),requirements=mapped.requirements.filter(item=>item.confidence!=='review');
    const characteristics=inferCharacteristics(scenario,requirements),comparison=evaluateSDLC(characteristics);
    const candidate=comparison.recommendation||comparison.ranked.find(row=>row.evaluated>0)||null;
    return {mapped,requirements,characteristics,comparison,candidate,committed:Boolean(comparison.recommendation),systemName:/\bloan\b/i.test(scenario)?'Digital Loan Application System':'Software System'};
  }

  window.FieldnoteAgents = { mapScenario, evaluateSDLC, inferCharacteristics, analyzeRequest };
})();
