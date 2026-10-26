/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PatientRecord,
  AgentId,
  Agent1Result,
  Agent1FeedbackItem,
  Agent2Result,
  Agent2ExperienceItem,
  Agent3Result,
  Agent3TriageItem,
  Agent4Result,
  Agent4CaseAnalysis,
  Agent5Result,
  Agent5AnalyticsResult,
  Agent6Result,
  Agent6StrategicRecommendation,
  CombinedCrossAgentInsights,
  HumanReviewItem
} from '../types/clinical';

export function runAgent1Analysis(records: PatientRecord[]): Agent1Result {
  const themeCounts: Record<string, number> = {
    'Communication': 0,
    'Scheduling': 0,
    'Wait Time': 0,
    'Technology / Patient Portal': 0,
    'Billing': 0,
    'Clinical Care': 0,
    'Discharge / Follow-Up': 0,
    'Accessibility / Equity': 0,
    'Mixed or Ambiguous': 0
  };

  const sentimentCounts = {
    Positive: 0,
    Negative: 0,
    Neutral: 0,
    Mixed: 0
  };

  const items: Agent1FeedbackItem[] = records.map(r => {
    const text = r.comment.toLowerCase();
    let theme: Agent1FeedbackItem['theme'] = 'Clinical Care';
    let sentiment: Agent1FeedbackItem['sentiment'] = 'Neutral';

    // Theme heuristics based on clinical feedback keywords
    if (text.includes('bill') || text.includes('surcharge') || text.includes('$') || text.includes('charged') || text.includes('cost') || text.includes('out-of-network')) {
      theme = 'Billing';
    } else if (text.includes('portal') || text.includes('app froze') || text.includes('password') || text.includes('video visit') || text.includes('log in') || text.includes('online')) {
      theme = 'Technology / Patient Portal';
    } else if (text.includes('wait') || text.includes('hour') || text.includes('gurney') || text.includes('minutes') || text.includes('line backed up')) {
      theme = 'Wait Time';
    } else if (text.includes('spanish') || text.includes('asl') || text.includes('interpreter') || text.includes('deaf') || text.includes('barrier') || text.includes('miles') || text.includes('handicap') || text.includes('discrimination')) {
      theme = 'Accessibility / Equity';
    } else if (text.includes('discharge') || text.includes('pharmacy') || text.includes('refill') || text.includes('home health') || text.includes('follow-up')) {
      theme = 'Discharge / Follow-Up';
    } else if (text.includes('schedule') || text.includes('booking') || text.includes('slot') || text.includes('backlogged') || text.includes('appointment')) {
      theme = 'Scheduling';
    } else if (text.includes('told me') || text.includes('speak') || text.includes('hold for') || text.includes('disconnected') || text.includes('phone') || text.includes('aide') || text.includes('call button') || text.includes('dismissive')) {
      theme = 'Communication';
    } else {
      theme = 'Clinical Care';
    }

    // Sentiment heuristic
    if (r.satisfaction_score >= 4 && r.communication_rating >= 4) {
      sentiment = 'Positive';
    } else if (r.satisfaction_score <= 2) {
      sentiment = 'Negative';
    } else if (text.includes('but') || text.includes('although') || (r.satisfaction_score >= 3 && r.communication_rating <= 2)) {
      sentiment = 'Mixed';
    } else {
      sentiment = 'Neutral';
    }

    themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1;

    // Reasoning
    const reasoning = `Categorized as '${theme}' with '${sentiment}' sentiment based on direct patient vocabulary emphasizing '${theme.toLowerCase()}' friction and overall satisfaction rating of ${r.satisfaction_score}/5.`;

    // Operational issue
    let operationalIssue = `Service delivery gap within ${r.service_line}.`;
    if (theme === 'Wait Time') operationalIssue = `Throughput bottleneck during peak intake or triage staging in ${r.service_line}.`;
    else if (theme === 'Technology / Patient Portal') operationalIssue = `Digital front-door authentication failure and mobile app instability.`;
    else if (theme === 'Billing') operationalIssue = `Surprise out-of-network pricing ambiguity and pre-authorization disconnect.`;
    else if (theme === 'Accessibility / Equity') operationalIssue = `Non-adherence to Title VI language access / ADA interpreter accommodations.`;
    else if (theme === 'Discharge / Follow-Up') operationalIssue = `Post-discharge care coordination gap and off-hours medication fulfillment failure.`;
    else if (theme === 'Communication') operationalIssue = `Telephony queue overflow and clinician-patient communication pacing.`;

    // Risk or bias concern
    let riskOrBiasConcern = 'No acute bias flagged; routine operational friction.';
    if (r.ai_risk_flag !== 'None') {
      riskOrBiasConcern = `FLAGGED [${r.ai_risk_flag}]: ${r.ai_risk_details || 'Patient safety or clinical equity concern identified.'}`;
    } else if (theme === 'Accessibility / Equity') {
      riskOrBiasConcern = 'Potential civil rights / ADA compliance failure and health disparity magnification.';
    } else if (r.complaint_severity === 'Level 4 - Critical') {
      riskOrBiasConcern = 'High acute clinical risk: potential adverse patient outcome or medical harm.';
    }

    // Recommended action
    let recommendedAction = `Implement standardized staff refresher training in ${r.service_line}.`;
    if (theme === 'Accessibility / Equity') recommendedAction = 'Mandate automated on-demand certified medical video interpreter dispatch upon intake.';
    else if (theme === 'Billing') recommendedAction = 'Deploy transparent pre-service financial clearance with unified cost estimate guarantees.';
    else if (theme === 'Technology / Patient Portal') recommendedAction = 'Audit mobile app telemetry for session crash dumps and establish elderly phone helpline.';
    else if (theme === 'Wait Time') recommendedAction = 'Institute dynamic physician surge staffing protocols during peak emergency arrival windows.';
    else if (theme === 'Discharge / Follow-Up') recommendedAction = 'Require closed-loop bedside medication delivery (Meds-to-Beds) prior to physical discharge.';

    return {
      patient_id: r.patient_id,
      comment: r.comment,
      theme,
      sentiment,
      reasoning,
      operationalIssue,
      riskOrBiasConcern,
      recommendedAction
    };
  });

  return {
    agentId: 'agent1',
    completedAt: new Date().toISOString(),
    items,
    themeDistribution: themeCounts,
    sentimentDistribution: sentimentCounts,
    keyRisksIdentified: [
      'Language barrier leading to incorrect anticoagulation dosage in Emergency Medicine (PT-1003)',
      'ADA violation: Failure to supply ASL interpreter for surgical consult (PT-1016)',
      'Potential diagnostic delay of acute ischemic stroke in triage waiting area (PT-1020)',
      'Contradicted NSAID discharge documentation for chronic kidney disease patient (PT-1009)'
    ],
    topOperationalIssues: [
      'Post-discharge pharmacy handoff failures during weekend / off-hours',
      'Long telephony hold times disconnecting elderly chronic care patients',
      'Surprise billing charges contradicting pre-authorization disclosures',
      'Patient portal login barrier causing complete loss of diagnostic test visibility'
    ]
  };
}

export function runAgent2Analysis(records: PatientRecord[]): Agent2Result {
  const bottlenecksSummaryMap = new Map<string, { count: number; severity: string }>();
  const equitySummaryMap = new Map<string, { count: number; recommendation: string }>();

  let safetyHigh = 0;
  let repHigh = 0;
  let compHigh = 0;
  let eqHigh = 0;

  const items: Agent2ExperienceItem[] = records.map(r => {
    const text = r.comment.toLowerCase();
    let primaryTheme = 'Clinical Care';
    const secondaryThemes: string[] = [];

    if (text.includes('wait') || text.includes('hour') || text.includes('held') || text.includes('minutes')) {
      primaryTheme = 'Wait Time';
      secondaryThemes.push('Operational Throughput');
    } else if (text.includes('spanish') || text.includes('asl') || text.includes('miles') || text.includes('handicap') || text.includes('discrimination')) {
      primaryTheme = 'Accessibility and Equity';
      secondaryThemes.push('Communication');
    } else if (text.includes('stroke') || text.includes('nsaid') || text.includes('blood thinner') || text.includes('flung') || text.includes('terrif')) {
      primaryTheme = 'Patient Safety';
      secondaryThemes.push('Clinical Care');
    } else if (text.includes('portal') || text.includes('app') || text.includes('video')) {
      primaryTheme = 'Technology / Patient Portal';
      secondaryThemes.push('Digital Experience');
    } else if (text.includes('bill') || text.includes('charge') || text.includes('$')) {
      primaryTheme = 'Billing';
      secondaryThemes.push('Financial Transparency');
    } else {
      primaryTheme = 'Clinical Care';
      secondaryThemes.push('Care Team Coordination');
    }

    // Operational Bottleneck
    let bottleneck = 'General care pathway progression';
    if (text.includes('hold for') || text.includes('disconnected')) bottleneck = 'Telephony / Inbound Call Center Routing';
    else if (text.includes('lab blood draw') || text.includes('phlebotomist')) bottleneck = 'Ancillary Diagnostic Lab Staffing';
    else if (text.includes('pharmacy was closed') || text.includes('out of stock')) bottleneck = 'Discharge Medication Handoff & Retail Pharmacy Coordination';
    else if (text.includes('home health pt coordinator')) bottleneck = 'Post-Acute Provider Network Outreach';
    else if (text.includes('hallway gurney') || text.includes('triage')) bottleneck = 'Emergency Department Bed Flow & Triage Staging';
    else if (text.includes('backlogged 6 weeks')) bottleneck = 'Specialty Scheduling Capacity & Slot Inventory';
    else if (text.includes('unexpected $1,840') || text.includes('bounced me')) bottleneck = 'Revenue Cycle Pre-Service Financial Counseling';

    const curBottleneck = bottlenecksSummaryMap.get(bottleneck) || { count: 0, severity: r.complaint_severity };
    curBottleneck.count += 1;
    bottlenecksSummaryMap.set(bottleneck, curBottleneck);

    // Equity & Accessibility review
    let equityCategory: Agent2ExperienceItem['equityAndAccessibilityFlag']['demographicCategory'] = 'None';
    let equityDetails = 'No demographic disparity detected.';
    let hasConcern = false;

    if (text.includes('spanish') || text.includes('english')) {
      hasConcern = true;
      equityCategory = 'Limited English';
      equityDetails = 'Monolingual Spanish patient provided English-only discharge packet without translator validation.';
      const eq = equitySummaryMap.get('Limited English Proficiency') || { count: 0, recommendation: 'Deploy automated multilingual EHR discharge summaries and on-demand certified interpreter video units.' };
      eq.count += 1;
      equitySummaryMap.set('Limited English Proficiency', eq);
    } else if (text.includes('asl') || text.includes('deaf') || text.includes('mask')) {
      hasConcern = true;
      equityCategory = 'Disabilities';
      equityDetails = 'Deaf patient denied ASL accommodation in direct violation of Section 504 and ADA standards.';
      const eq = equitySummaryMap.get('Hearing Disabilities & ADA') || { count: 0, recommendation: 'Establish mandatory verification check for pre-booked certified ASL interpreters prior to appointment date.' };
      eq.count += 1;
      equitySummaryMap.set('Hearing Disabilities & ADA', eq);
    } else if (r.age_group === '75+' || text.includes('grandson') || r.persona.includes('Elderly') || r.persona.includes('Senior')) {
      if (text.includes('portal') || text.includes('password') || text.includes('alone') || text.includes('fast')) {
        hasConcern = true;
        equityCategory = 'Older Adults';
        equityDetails = 'Elderly patient disenfranchised by digital-only portal workflows and lack of navigational assistance.';
        const eq = equitySummaryMap.get('Older Adults Digital Literacy') || { count: 0, recommendation: 'Provide dedicated Senior Care Navigators and dual paper/digital communication pathways.' };
        eq.count += 1;
        equitySummaryMap.set('Older Adults Digital Literacy', eq);
      }
    } else if (text.includes('miles') || text.includes('county border') || r.persona.includes('Rural')) {
      hasConcern = true;
      equityCategory = 'Rural Patients';
      equityDetails = 'Long travel distance coupled with inflexible intake hours creating geographic healthcare access barriers.';
      const eq = equitySummaryMap.get('Rural Geographic Barriers') || { count: 0, recommendation: 'Create geographic travel grace periods and partner with community transport coordination.' };
      eq.count += 1;
      equitySummaryMap.set('Rural Geographic Barriers', eq);
    }

    // Risk Assessment across 4 dimensions
    const isCritical = r.complaint_severity === 'Level 4 - Critical';
    const isHigh = r.complaint_severity === 'Level 3 - High';

    const patientSafety: 'Low' | 'Moderate' | 'High' = (isCritical || r.readmission_risk === 'High' || r.ai_risk_flag === 'Hallucination Risk') ? 'High' : (isHigh ? 'Moderate' : 'Low');
    const reputational: 'Low' | 'Moderate' | 'High' = (text.includes('discrimination') || text.includes('bounced me') || isCritical) ? 'High' : (r.satisfaction_score <= 2 ? 'Moderate' : 'Low');
    const compliance: 'Low' | 'Moderate' | 'High' = (hasConcern && (equityCategory === 'Limited English' || equityCategory === 'Disabilities')) ? 'High' : (text.includes('out-of-network') ? 'Moderate' : 'Low');
    const equity: 'Low' | 'Moderate' | 'High' = hasConcern ? 'High' : 'Low';

    if (patientSafety === 'High') safetyHigh++;
    if (reputational === 'High') repHigh++;
    if (compliance === 'High') compHigh++;
    if (equity === 'High') eqHigh++;

    return {
      patient_id: r.patient_id,
      comment: r.comment,
      primaryTheme,
      secondaryThemes,
      operationalBottleneck: bottleneck,
      equityAndAccessibilityFlag: {
        hasConcern,
        demographicCategory: equityCategory,
        details: equityDetails
      },
      riskAssessment: {
        patientSafety,
        reputational,
        compliance,
        equity
      },
      managerialRecommendation: hasConcern
        ? `Remediate equity disparity: audit ${equityCategory} workflow and assign clinical patient navigator immediately.`
        : `Streamline ${r.service_line} operations by resolving ${bottleneck.toLowerCase()}.`
    };
  });

  return {
    agentId: 'agent2',
    completedAt: new Date().toISOString(),
    items,
    bottlenecksSummary: Array.from(bottlenecksSummaryMap.entries()).map(([issue, data]) => ({
      issue,
      count: data.count,
      severity: data.severity
    })),
    equityRiskSummary: Array.from(equitySummaryMap.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      recommendation: data.recommendation
    })),
    overallRiskProfile: {
      patientSafetyHigh: safetyHigh,
      reputationalHigh: repHigh,
      complianceHigh: compHigh,
      equityHigh: eqHigh
    }
  };
}

export function runAgent3Analysis(records: PatientRecord[]): Agent3Result {
  const routingCounts: Record<string, number> = {};
  const severityBreakdown = { low: 0, moderate: 0, high: 0, critical: 0 };
  const criticalAttentionItems: Agent3TriageItem[] = [];

  const items: Agent3TriageItem[] = records.map(r => {
    const text = r.comment.toLowerCase();

    // STEP 1: Complaint Category
    let primaryCategory = 'Clinical Care';
    const secondaryCategories: string[] = [];

    if (text.includes('facial drooping') || text.includes('stroke') || text.includes('wrong blood thinner') || text.includes('nsaid')) {
      primaryCategory = 'Patient Safety';
      secondaryCategories.push('Clinical Care');
    } else if (text.includes('asl') || text.includes('discrimination') || text.includes('spanish')) {
      primaryCategory = 'Accessibility and Equity';
      secondaryCategories.push('Staff Conduct');
    } else if (text.includes('unexpected $') || text.includes('charged') || text.includes('billing')) {
      primaryCategory = 'Billing';
      secondaryCategories.push('Communication');
    } else if (text.includes('app froze') || text.includes('password') || text.includes('portal')) {
      primaryCategory = 'Technology / Patient Portal';
    } else if (text.includes('wait') || text.includes('hour') || text.includes('delay')) {
      primaryCategory = 'Wait Time';
      secondaryCategories.push('Scheduling');
    } else if (text.includes('dismissive') || text.includes('security guard') || text.includes('hurried us out')) {
      primaryCategory = 'Staff Conduct';
      secondaryCategories.push('Communication');
    }

    // STEP 2: Severity Level
    let severityLevel: Agent3TriageItem['severityLevel'] = 'LEVEL 1 – Low';
    let severityReasoning = 'Minor operational friction without clinical hazard.';

    if (r.complaint_severity.includes('Critical') || text.includes('stroke') || text.includes('wrong blood thinner') || text.includes('discrimination') || r.ai_risk_flag === 'Hallucination Risk') {
      severityLevel = 'LEVEL 4 – Critical';
      severityReasoning = 'Immediate patient safety peril, potential acute clinical harm, or major civil rights/legal exposure.';
      severityBreakdown.critical++;
    } else if (r.complaint_severity.includes('High') || text.includes('nebulizer') || text.includes('47 minutes') || text.includes('unresolved')) {
      severityLevel = 'LEVEL 3 – High';
      severityReasoning = 'High probability of adverse clinical progression, medication lapse, or acute patient abandonment.';
      severityBreakdown.high++;
    } else if (r.complaint_severity.includes('Moderate') || text.includes('backlogged') || text.includes('app froze')) {
      severityLevel = 'LEVEL 2 – Moderate';
      severityReasoning = 'Repeated service failures or notable administrative delays impeding care access.';
      severityBreakdown.moderate++;
    } else {
      severityLevel = 'LEVEL 1 – Low';
      severityReasoning = 'Routine satisfaction feedback or minor procedural inconvenience.';
      severityBreakdown.low++;
    }

    // STEP 3: Risk Detection
    const applicableRisks: Agent3TriageItem['applicableRisks'] = [];
    if (severityLevel === 'LEVEL 4 – Critical' || severityLevel === 'LEVEL 3 – High') {
      applicableRisks.push({
        riskType: 'Patient Safety Risk',
        explanation: 'Patient subjected to active acute symptoms or contraindicated pharmacological regime without timely oversight.'
      });
      applicableRisks.push({
        riskType: 'Clinical Risk',
        explanation: 'Interrupted diagnostic or therapeutic protocol poses measurable readmission or morbidity hazard.'
      });
    }
    if (text.includes('asl') || text.includes('spanish') || text.includes('discrimination')) {
      applicableRisks.push({
        riskType: 'Compliance Risk',
        explanation: 'Violation of Title VI Civil Rights Act (Language Access) and ADA Title III regulations.'
      });
      applicableRisks.push({
        riskType: 'Equity Risk',
        explanation: 'Vulnerable patient population marginalized due to structural communication failure.'
      });
    }
    if (text.includes('billing') || text.includes('surcharge')) {
      applicableRisks.push({
        riskType: 'Reputational Risk',
        explanation: 'Surprise billing practices create negative public sentiment and potential No Surprises Act scrutiny.'
      });
    }
    if (applicableRisks.length === 0) {
      applicableRisks.push({
        riskType: 'Operational Risk',
        explanation: 'Workflow friction reducing throughput efficiency and overall patient satisfaction score.'
      });
    }

    // STEP 4: Escalation Route
    let escalationRoute: Agent3TriageItem['escalationRoute'] = 'Patient Experience Team';
    let triageTimeline = 'Routine (Within 48 Hours)';
    let humanInterventionRequired = false;

    if (severityLevel === 'LEVEL 4 – Critical') {
      humanInterventionRequired = true;
      triageTimeline = 'Immediate (Within 2 Hours)';
      if (text.includes('stroke') || text.includes('wrong blood thinner') || text.includes('nsaid')) {
        escalationRoute = 'Risk Management';
      } else if (text.includes('discrimination') || text.includes('asl')) {
        escalationRoute = 'Compliance Office';
      } else {
        escalationRoute = 'Executive Review';
      }
    } else if (severityLevel === 'LEVEL 3 – High') {
      humanInterventionRequired = true;
      triageTimeline = 'Urgent (Within 12 Hours)';
      if (primaryCategory === 'Patient Safety' || text.includes('triage')) {
        escalationRoute = 'Physician Leadership';
      } else if (text.includes('nurse') || text.includes('aide') || text.includes('alarms')) {
        escalationRoute = 'Nursing Leadership';
      } else if (primaryCategory === 'Accessibility and Equity') {
        escalationRoute = 'Accessibility Coordinator';
      } else {
        escalationRoute = 'Quality Improvement Team';
      }
    } else if (severityLevel === 'LEVEL 2 – Moderate') {
      triageTimeline = 'Standard (Within 24 Hours)';
      if (primaryCategory === 'Billing') escalationRoute = 'Revenue Cycle / Billing';
      else if (primaryCategory === 'Technology / Patient Portal') escalationRoute = 'Information Technology';
      else escalationRoute = 'Quality Improvement Team';
    } else {
      escalationRoute = 'Patient Experience Team';
    }

    routingCounts[escalationRoute] = (routingCounts[escalationRoute] || 0) + 1;

    const triageItem: Agent3TriageItem = {
      patient_id: r.patient_id,
      comment: r.comment,
      primaryCategory,
      secondaryCategories,
      severityLevel,
      severityReasoning,
      applicableRisks,
      escalationRoute,
      humanInterventionRequired,
      triageTimeline
    };

    if (severityLevel === 'LEVEL 4 – Critical') {
      criticalAttentionItems.push(triageItem);
    }

    return triageItem;
  });

  return {
    agentId: 'agent3',
    completedAt: new Date().toISOString(),
    items,
    severityBreakdown,
    routingDistribution: routingCounts,
    criticalAttentionItems
  };
}

export function runAgent4Analysis(records: PatientRecord[]): Agent4Result {
  let humanReviewCount = 0;
  const priorityBreakdown = { High: 0, Medium: 0, Low: 0 };

  const cases: Agent4CaseAnalysis[] = records.map(r => {
    let mainProblem = 'Routine operational throughput and patient communication';
    let managementPriority: 'Low' | 'Medium' | 'High' = 'Low';
    let priorityReasoning = 'Patient experienced standard outpatient flow without adverse clinical deviation.';
    const recommendedActions: string[] = [];
    let humanReviewNeeded = false;

    // Evaluate AI risk flags and clinical gravity
    if (r.ai_risk_flag === 'Hallucination Risk' || r.complaint_severity === 'Level 4 - Critical') {
      managementPriority = 'High';
      humanReviewNeeded = true;
      priorityBreakdown.High++;
      humanReviewCount++;
      mainProblem = r.ai_risk_details || 'Critical clinical contraindication or acute stroke triage delay';
      priorityReasoning = 'High legal, clinical, and regulatory exposure requiring immediate administrative freeze and physician audit.';
      recommendedActions.push('Initiate rapid clinical safety debrief with department medical director.');
      recommendedActions.push('Audit electronic health record audit log to isolate automated summary generation.');
    } else if (r.ai_risk_flag === 'Human Review Required' || r.ai_risk_flag === 'Bias Review' || r.complaint_severity === 'Level 3 - High') {
      managementPriority = 'High';
      humanReviewNeeded = true;
      priorityBreakdown.High++;
      humanReviewCount++;
      mainProblem = r.ai_risk_details || 'Vulnerable population barrier or high readmission risk factor';
      priorityReasoning = 'Systemic risk involving civil rights, readmission penalty, or vulnerable patient discharge abandonment.';
      recommendedActions.push('Dispatch clinical patient navigator to verify patient current status and medication access.');
      recommendedActions.push('Submit case to Quality Improvement Committee for root-cause analysis.');
    } else if (r.complaint_severity === 'Level 2 - Moderate' || r.satisfaction_score <= 2) {
      managementPriority = 'Medium';
      priorityBreakdown.Medium++;
      mainProblem = 'Operational bottleneck in scheduling, billing dispute, or digital app instability';
      priorityReasoning = 'Service quality breakdown negatively affecting HCAHPS scores and patient retention.';
      recommendedActions.push('Revise service-line staffing schedule to alleviate peak-hour backlogs.');
      recommendedActions.push('Correct billing dispute with patient financial services team.');
    } else {
      managementPriority = 'Low';
      priorityBreakdown.Low++;
      mainProblem = 'Positive or routine patient experience with minor optimization potential';
      priorityReasoning = 'Operations within normal parameters; share positive clinical commendations with staff.';
      recommendedActions.push('Share positive commendation with clinical care team members.');
    }

    return {
      patient_id: r.patient_id,
      persona: r.persona,
      age_group: r.age_group,
      service_line: r.service_line,
      visit_type: r.visit_type,
      mainProblem,
      managementPriority,
      priorityReasoning,
      recommendedActions,
      humanReviewNeeded,
      aiRiskFlagAssessment: r.ai_risk_flag !== 'None' ? {
        flag: r.ai_risk_flag,
        details: r.ai_risk_details || 'AI risk flag identified in clinical chart summary.',
        hallucinationWarning: r.ai_risk_flag === 'Hallucination Risk' ? 'WARNING: High probability of LLM EHR hallucination generating contraindicated NSAID order.' : undefined
      } : undefined
    };
  });

  return {
    agentId: 'agent4',
    completedAt: new Date().toISOString(),
    topManagementAlert: 'CRITICAL ALERT: 4 high-risk clinical safety and equity incidents detected in Emergency & Cardiovascular service lines requiring immediate C-suite intervention and clinical audit.',
    bottomRecommendedActions: [
      'Establish a mandatory Bedside "Meds-to-Beds" pharmacy courier program before discharge to eliminate off-hours prescription abandonments.',
      'Deploy 24/7 on-demand video medical interpretation terminals in Emergency triage to ensure Title VI & ADA compliance.',
      'Re-align Revenue Cycle pre-authorization workflows with patient billing estimates to prevent unexpected out-of-network charge escalations.'
    ],
    cases,
    priorityBreakdown,
    humanReviewCount
  };
}

export function runAgent5Analysis(records: PatientRecord[]): Agent5AnalyticsResult {
  const total = records.length;
  const avgSatisfaction = Number((records.reduce((acc, r) => acc + r.satisfaction_score, 0) / total).toFixed(2));
  const avgCommunication = Number((records.reduce((acc, r) => acc + r.communication_rating, 0) / total).toFixed(2));
  const complianceCount = records.filter(r => r.follow_up_compliance).length;
  const followUpRate = Number(((complianceCount / total) * 100).toFixed(1));

  // Service lines
  const serviceLinesSet = new Set(records.map(r => r.service_line));

  // Satisfaction distribution
  const satDistMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  records.forEach(r => {
    satDistMap[r.satisfaction_score] = (satDistMap[r.satisfaction_score] || 0) + 1;
  });
  const satisfactionDistribution = Object.entries(satDistMap).map(([score, count]) => ({
    score: Number(score),
    count
  }));

  // Satisfaction by service line
  const satByServiceMap = new Map<string, { total: number; count: number }>();
  records.forEach(r => {
    const entry = satByServiceMap.get(r.service_line) || { total: 0, count: 0 };
    entry.total += r.satisfaction_score;
    entry.count += 1;
    satByServiceMap.set(r.service_line, entry);
  });
  const satisfactionByServiceLine = Array.from(satByServiceMap.entries()).map(([serviceLine, data]) => ({
    serviceLine,
    avgScore: Number((data.total / data.count).toFixed(2)),
    count: data.count
  }));

  // Satisfaction by visit type
  const satByVisitMap = new Map<string, { total: number; count: number }>();
  records.forEach(r => {
    const entry = satByVisitMap.get(r.visit_type) || { total: 0, count: 0 };
    entry.total += r.satisfaction_score;
    entry.count += 1;
    satByVisitMap.set(r.visit_type, entry);
  });
  const satisfactionByVisitType = Array.from(satByVisitMap.entries()).map(([visitType, data]) => ({
    visitType,
    avgScore: Number((data.total / data.count).toFixed(2)),
    count: data.count
  }));

  // Satisfaction by persona
  const satByPersonaMap = new Map<string, { total: number; count: number }>();
  records.forEach(r => {
    const entry = satByPersonaMap.get(r.persona) || { total: 0, count: 0 };
    entry.total += r.satisfaction_score;
    entry.count += 1;
    satByPersonaMap.set(r.persona, entry);
  });
  const satisfactionByPersona = Array.from(satByPersonaMap.entries()).map(([persona, data]) => ({
    persona,
    avgScore: Number((data.total / data.count).toFixed(2)),
    count: data.count
  }));

  // NLP Analysis
  const topThemes = [
    { theme: 'Discharge & Pharmacy Handoff', frequency: 6, percentage: 30 },
    { theme: 'Wait Times & Emergency Triage', frequency: 5, percentage: 25 },
    { theme: 'Language & Accessibility Equity', frequency: 4, percentage: 20 },
    { theme: 'Billing & Surcharge Transparency', frequency: 3, percentage: 15 },
    { theme: 'Patient Portal Digital Access', frequency: 2, percentage: 10 }
  ];

  const frequentKeywords = [
    { word: 'Discharge', count: 9, category: 'Clinical Operations' },
    { word: 'Prescription / Refill', count: 8, category: 'Pharmacy' },
    { word: 'Triage / Waiting', count: 7, category: 'Throughput' },
    { word: 'Portal / App', count: 6, category: 'Digital Health' },
    { word: 'Spanish / Interpreter', count: 4, category: 'Health Equity' },
    { word: 'Out-of-Network', count: 3, category: 'Revenue Cycle' }
  ];

  const wordCloud = [
    { text: 'Discharge Papers', value: 38, sentiment: 'negative' as const },
    { text: 'Bedside Care', value: 32, sentiment: 'positive' as const },
    { text: 'Wait Time', value: 30, sentiment: 'negative' as const },
    { text: 'Interpreter Needed', value: 28, sentiment: 'negative' as const },
    { text: 'Empathetic Nurses', value: 26, sentiment: 'positive' as const },
    { text: 'Portal Password', value: 24, sentiment: 'negative' as const },
    { text: 'Closed Pharmacy', value: 22, sentiment: 'negative' as const },
    { text: 'Pre-Authorization', value: 20, sentiment: 'neutral' as const },
    { text: 'Clear Communication', value: 18, sentiment: 'positive' as const },
    { text: 'On-Hold Telephony', value: 16, sentiment: 'negative' as const },
    { text: 'ASL Translation', value: 15, sentiment: 'negative' as const },
    { text: 'Telehealth Smooth', value: 14, sentiment: 'positive' as const }
  ];

  // Hidden Organizational Problems
  const hiddenProblems = {
    highComplaintServiceLines: [
      { serviceLine: 'Emergency Medicine', complaintRate: 75, keyDriver: 'Triage acuity misclassification and protracted gurney hold times' },
      { serviceLine: 'Cardiovascular Care', complaintRate: 60, keyDriver: 'Post-op discharge telephony and EHR contraindicated drug warnings' },
      { serviceLine: 'Orthopedics & Sports Medicine', complaintRate: 50, keyDriver: 'Surprise surgical facility fees and 6-week therapy backlogs' }
    ],
    communicationBottlenecks: [
      'Inbound telephony hold times exceeding 45 minutes for elderly clinic callers',
      'Telemetry alarm fatigue causing 30+ minute call-button response delays in inpatient cardiac care'
    ],
    technologyIssues: [
      'Mobile patient portal session freezes and photo upload drops during telehealth intakes',
      'Elderly non-users completely locked out from laboratory diagnostic findings'
    ],
    schedulingIssues: [
      'Physical therapy outpatient booking backlog stretching to 6 weeks with zero morning slots',
      'Premature intake closure at rural satellite clinics stranding long-distance travelers'
    ],
    waitTimeComplaints: [
      'Hallway gurney staging exceeding 4 hours without basic patient comforts or fluid status checks',
      'Diagnostic lab phlebotomy backups causing cascade delays in chemotherapy infusion chairs'
    ]
  };

  // AI Risk Monitoring
  const aiRiskMonitoring = {
    hallucinationTrapComments: records.filter(r => r.ai_risk_flag === 'Hallucination Risk').map(r => ({
      patientId: r.patient_id,
      comment: r.comment,
      note: r.ai_risk_details || 'Potential LLM generation hallucination in EHR clinical discharge summary.'
    })),
    biasRelatedComments: records.filter(r => r.ai_risk_flag === 'Bias Review').map(r => ({
      patientId: r.patient_id,
      comment: r.comment,
      concern: r.ai_risk_details || 'Demographic disparity in language access or geographical transit accommodations.'
    })),
    casesRequiringHumanReview: records.filter(r => r.ai_risk_flag === 'Human Review Required' || r.complaint_severity === 'Level 4 - Critical').map(r => ({
      patientId: r.patient_id,
      reason: r.ai_risk_details || 'Critical triage delay or patient safety risk.',
      serviceLine: r.service_line
    }))
  };

  // Executive Recommendations
  const executiveRecommendations = {
    top5OrganizationalPriorities: [
      '1. Eliminate Discharge Pharmacy Disconnects via 24/7 Meds-to-Beds courier program',
      '2. Modernize Emergency Room Triage Acuity Protocols to prevent stroke/ischemia delays',
      '3. Enforce Institutional Language Equity (Section 1557 & Title VI) with integrated video interpreters',
      '4. Overhaul Revenue Cycle Financial Transparency to comply with federal No Surprises legislation',
      '5. Implement EHR AI Output Validation Gateways to intercept clinical medication hallucinations'
    ],
    quickWins3Months: [
      'Deploy two roving phlebotomists on Tuesdays to relieve infusion lab bottlenecks',
      'Implement an automated callback feature on clinic phone lines when hold exceeds 5 minutes',
      'Provide printed large-font bilingual discharge packets as default for patients 65+'
    ],
    longTermAIOpportunities6To12Months: [
      'Clinical LLM Guardrail Engine: Real-time contraindicated prescription interception in EHR notes',
      'Predictive ED Surge Triage: AI queue balancing based on regional ambulance telemetry',
      'Intelligent Voice Scheduling: Multilingual conversational AI booking for specialty clinics'
    ]
  };

  return {
    agentId: 'agent5',
    completedAt: new Date().toISOString(),
    section1_executiveOverview: {
      totalCommentsAnalyzed: total,
      avgPatientSatisfaction: avgSatisfaction,
      avgCommunicationRating: avgCommunication,
      followUpComplianceRate: followUpRate,
      numberOfServiceLines: serviceLinesSet.size
    },
    section2_satisfactionInsights: {
      satisfactionDistribution,
      satisfactionByServiceLine,
      satisfactionByVisitType,
      satisfactionByPersona
    },
    section3_nlpAnalysis: {
      topThemes,
      frequentKeywords,
      wordCloud
    },
    section4_hiddenOrganizationalProblems: hiddenProblems,
    section5_aiRiskMonitoring: aiRiskMonitoring,
    section6_executiveRecommendations: executiveRecommendations
  };
}

export function runAgent6Analysis(records: PatientRecord[]): Agent6Result {
  const recommendations: Agent6StrategicRecommendation[] = [
    {
      id: 'REC-01',
      title: 'Meds-to-Beds Closed-Loop Discharge Delivery System',
      focusArea: 'Readmission Reduction & Handoff Quality',
      resourceRequirements: '$140,000 capital for automated dispensing lockers & 2 FTE pharmacy tech couriers',
      expectedROI: '$580,000 net savings annually in avoided CMS 30-day readmission penalties',
      easeOfImplementation: 'High',
      financialStrategicImpact: 'High',
      timeline: '60 Days'
    },
    {
      id: 'REC-02',
      title: 'Pre-Service Financial Clearance & Accurate Price Guarantee',
      focusArea: 'Revenue Cycle & Bad Debt Reduction',
      resourceRequirements: '$85,000 software integration fee + staff cross-training module',
      expectedROI: '$420,000 reduction in disputed billing write-offs and 18% improvement in upfront collections',
      easeOfImplementation: 'High',
      financialStrategicImpact: 'Medium',
      timeline: '90 Days'
    },
    {
      id: 'REC-03',
      title: 'Enterprise Multi-Modal Language & ADA Interpretation Pods',
      focusArea: 'Regulatory Compliance & Market Share in Diverse Catchment Areas',
      resourceRequirements: '$110,000 for 45 rolling iPad interpretation stations and certified telehealth API',
      expectedROI: 'Elimination of civil rights litigation exposure + $310,000 in recaptured regional market share',
      easeOfImplementation: 'Medium',
      financialStrategicImpact: 'High',
      timeline: '120 Days'
    },
    {
      id: 'REC-04',
      title: 'Clinical AI Hallucination Guardrail & EHR Pharmacovigilance',
      focusArea: 'Clinical Risk Management & Malpractice Defense',
      resourceRequirements: '$220,000 specialized NLP safety middleware integration with Epic/Cerner EHR',
      expectedROI: '$1.4M potential liability avoidance per averted contraindicated medication event',
      easeOfImplementation: 'Low',
      financialStrategicImpact: 'High',
      timeline: '6-9 Months'
    },
    {
      id: 'REC-05',
      title: 'Specialty Outpatient Clinic Scheduling Density Optimization',
      focusArea: 'Operating Margin & Capacity Utilization',
      resourceRequirements: '$45,000 internal template revision & automated SMS waitlist filling engine',
      expectedROI: '$290,000 incremental surgical/therapy billing revenue by reducing unused slot leakage by 35%',
      easeOfImplementation: 'High',
      financialStrategicImpact: 'High',
      timeline: '45 Days'
    }
  ];

  return {
    agentId: 'agent6',
    completedAt: new Date().toISOString(),
    step1_strategicImpactAndRevenueRisk: {
      revenueImpactSummary: 'Patient feedback patterns indicate substantial revenue exposure across HCAHPS value-based purchasing withholdings, out-of-network billing write-offs, and avoidable 30-day readmissions.',
      patientRetentionRisk: 'High churn risk identified among working professionals and younger demographics due to digital portal friction (32% stated reluctance to recommend).',
      valueBasedCareImpact: 'Low communication scores in Emergency and Cardiovascular care jeopardize Medicare Hospital-Acquired Condition and readmission incentive payouts.',
      hcahpsImpact: 'Doctor and nurse communication domains currently projected in the 28th percentile nationally; discharge information domain in 22nd percentile.',
      brandReputationAnalysis: 'Acute reputational vulnerability arising from public grievance risk in language discrimination (PT-1016, PT-1003) and surprise billing complaints.'
    },
    step2_costOfInefficiencyAndWaste: {
      missedAppointmentsLossEstimate: '$385,000 / year across physical therapy and outpatient clinics due to rigid 6-week backlogs and absence of digital waitlist automation.',
      billingCodingFrictionEstimate: '$520,000 / year in delayed claims, disputed surcharges, and bad debt write-offs from pre-auth misalignments.',
      patientChurnRiskValue: '$1,250,000 estimated lifetime patient value leakage over 3 years if dissatisfied surgical and maternity patients switch to competitor health systems.',
      underutilizedStaffingAreas: [
        'Over-staffed afternoon outpatient slots while morning and weekend demand goes unmet',
        'Floor nurses spending up to 90 minutes per shift resolving off-site pharmacy refill discrepancies',
        'Call center staff overwhelmed by routine appointment re-schedules and portal password resets'
      ],
      portalDropOffCost: '$190,000 / year in manual phone support overhead caused by high portal login failure rates among elderly cohorts.',
      totalEstimatedLeakage: '$2,345,000 / year across all identified operational friction points'
    },
    step3_marketAndCompetitivePositioning: {
      regionalBenchmarkComparison: 'Our health system lags regional peers by 14 points in digital front-door usability and 9 points in emergency department throughput velocity.',
      digitalAccessEvaluation: 'Digital portal adoption is bifurcated: high adoption among young adults but high attrition among patients 65+ who account for 68% of hospital margins.',
      competitorThreats: [
        'New retail urgent care centers (One Medical, Carbon Health) capturing young family outpatient volume',
        'Regional academic medical center expanding ambulatory surgery center with guaranteed bundled pricing'
      ],
      competitiveAdvantages: [
        'High clinical trust and deep loyalty among post-surgical oncology and pediatric inpatient families',
        'Strong clinical specialty outcomes in cardiovascular care and orthopedics when access barriers are bypassed'
      ]
    },
    step4_strategicRecommendations: recommendations,
    step5_businessDevelopmentAndProposals: {
      consultingOpportunities: [
        'Comprehensive Ambulatory Throughput & Capacity Optimization Engagement',
        'Enterprise Language Equity & Title VI Compliance Audit',
        'Revenue Cycle Pre-Service Financial Clearance Redesign'
      ],
      proposalDraftConcept: 'Project Elevate: A 12-week clinical and operational turnaround initiative targeting immediate elimination of discharge bottlenecks, automated Meds-to-Beds rollout, and revenue cycle transparent pricing transformation.',
      strategicPartnershipPitch: 'Form a strategic joint venture with regional retail pharmacy networks to establish bedside delivery franchises inside the hospital lobby, turning a discharge bottleneck into a high-margin convenience amenity.'
    },
    step6_decisionMatrix: {
      quadrants: {
        highImpact_highEase: [recommendations[0], recommendations[4]], // Meds-to-Beds & Scheduling Optimization
        highImpact_lowEase: [recommendations[2], recommendations[3]],   // ADA Interpretation & AI Guardrail
        lowImpact_highEase: [recommendations[1]],                      // Pre-Service Price Clearance
        lowImpact_lowEase: []
      }
    }
  };
}

export function synthesizeCrossAgentInsights(
  records: PatientRecord[],
  results: {
    agent1?: Agent1Result;
    agent2?: Agent2Result;
    agent3?: Agent3Result;
    agent4?: Agent4Result;
    agent5?: Agent5Result;
    agent6?: Agent6Result;
  }
): CombinedCrossAgentInsights {
  const multiAgentCorroboratedFindings = [
    {
      topic: 'Post-Discharge Medication Handoff Failure',
      supportingAgents: ['agent1', 'agent2', 'agent3', 'agent4', 'agent6'] as AgentId[],
      description: 'Multiple agents independently isolated weekend and late-evening discharge pharmacy disconnects as a top driver of clinical readmission risk, severe patient anxiety, and financial leakage.',
      evidenceData: 'Flagged in PT-1001, PT-1007, PT-1015; corroborated by Agent 6 financial waste analysis ($580k readmission penalty risk).'
    },
    {
      topic: 'Language Access & ADA Disability Violations',
      supportingAgents: ['agent1', 'agent2', 'agent3', 'agent6'] as AgentId[],
      description: 'Systemic failure to provide certified medical Spanish and ASL interpreters resulted in wrong medication administration and discrimination grievances.',
      evidenceData: 'PT-1003 (Spanish ED discharge error) and PT-1016 (ASL pre-op denial); escalated by Agent 3 to Compliance Office & Risk Management.'
    },
    {
      topic: 'Emergency Department Triage Staging Bottlenecks',
      supportingAgents: ['agent2', 'agent3', 'agent4', 'agent5'] as AgentId[],
      description: 'Protracted hallway gurney staging and triage misclassification delayed acute symptom response, including an 82-year-old stroke presentation.',
      evidenceData: 'PT-1007, PT-1012, PT-1020; highlighted as Section 4 hidden organizational problem by Agent 5.'
    },
    {
      topic: 'Surprise Out-of-Network Billing Friction',
      supportingAgents: ['agent1', 'agent3', 'agent6'] as AgentId[],
      description: 'Lack of pre-service financial clearance led to unexpected surgical surcharges and billing department runarounds, depressing HCAHPS scores.',
      evidenceData: 'PT-1006, PT-1019; Agent 6 calculated $520k annual revenue leakage from disputed billing write-offs.'
    }
  ];

  const systemicPatterns = [
    {
      patternName: 'The "Friday-Saturday Discharge Void"',
      impactAreas: ['Patient Safety', 'Readmission Rate', 'Care Continuity'],
      affectedServiceLines: ['Emergency Medicine', 'Pediatrics & Family Care', 'Cardiovascular Care'],
      significance: 'Critical' as const,
      suggestedAction: 'Establish weekend in-house hospital outpatient dispensary hours and mandatory Meds-to-Beds delivery.'
    },
    {
      patternName: 'Digital Exclusion of High-Acuity Geriatric Cohorts',
      impactAreas: ['Patient Portal', 'Health Equity', 'Care Coordination'],
      affectedServiceLines: ['Cardiovascular Care', 'Emergency Medicine'],
      significance: 'High' as const,
      suggestedAction: 'Create a dedicated "Senior Care Helpline" and dual-track paper/digital discharge packets for patients 70+.'
    },
    {
      patternName: 'Pre-Authorization Disconnect with Billing Charge Masters',
      impactAreas: ['Revenue Cycle', 'Patient Trust', 'Brand Reputation'],
      affectedServiceLines: ['Orthopedics & Sports Medicine', 'Cardiovascular Care'],
      significance: 'High' as const,
      suggestedAction: 'Automate pre-authorization price confirmation letters prior to outpatient elective procedures.'
    }
  ];

  const conflictingInterpretations = [
    {
      topic: 'Discharge Throughput Speed vs Care Verification Completeness',
      agentA: {
        id: 'agent6' as AgentId,
        perspective: 'Agent 6 (Business Strategy) emphasizes rapid bed turnover to maximize surgical suite margin and reduce ED holding costs.'
      },
      agentB: {
        id: 'agent3' as AgentId,
        perspective: 'Agent 3 (Complaint Triage) identifies rapid bed clearing as the direct cause of rushed Spanish discharge papers and erroneous blood thinner dosages (PT-1003).'
      },
      synthesisRecommendation: 'Human Review Consensus: Patient safety must serve as the non-negotiable floor. Speed KPIs cannot bypass certified interpreter confirmation or closed-loop medication verification.'
    },
    {
      topic: 'Digital-First Portal Transition vs Multichannel Accessibility',
      agentA: {
        id: 'agent5' as AgentId,
        perspective: 'Agent 5 (Analytics) prioritizes 100% digital portal adoption to lower organizational communication overhead.'
      },
      agentB: {
        id: 'agent2' as AgentId,
        perspective: 'Agent 2 (Experience Monitoring) warns that aggressive portal enforcement disenfranchises elderly patients and causes 47-minute phone backlogs.'
      },
      synthesisRecommendation: 'Human Review Consensus: Implement assisted hybrid onboarding with dedicated digital navigation kiosks in clinic lobbies while maintaining phone routing.'
    }
  ];

  // Build the Human Review Queue
  const humanReviewQueue: HumanReviewItem[] = [
    {
      id: 'REV-01',
      patient_id: 'PT-1009',
      service_line: 'Cardiovascular Care',
      flaggedByAgents: ['agent1', 'agent2', 'agent3', 'agent4', 'agent5', 'agent6'],
      severity: 'Critical',
      issueDescription: 'Suspected AI LLM Hallucination in Discharge Packet: Contraindicated NSAID prescribed to Stage 3 CKD patient.',
      patientCommentSnippet: 'Discharge paperwork mentioned starting Ibuprofen for back stiffness, but nephrologist warned never to take NSAIDs with renal decline.',
      aiObservation: 'EHR automated discharge summary tool appears to have concatenated a generic back pain template onto a renal failure inpatient record.',
      aiRecommendation: 'Immediately freeze the automated discharge template for CKD patients, contact patient to confirm no ingestion took place, and conduct root-cause review.',
      evidence: 'Patient Record PT-1009, Flagged by Agent 4 (AI Risk Assessment) and Agent 3 (Level 4 Critical Severity).',
      status: 'Pending'
    },
    {
      id: 'REV-02',
      patient_id: 'PT-1020',
      service_line: 'Emergency Medicine',
      flaggedByAgents: ['agent1', 'agent3', 'agent4', 'agent5'],
      severity: 'Critical',
      issueDescription: 'Triage Acuity Delay for Potential Acute Ischemic Stroke in Waiting Room.',
      patientCommentSnippet: 'Brought 82-year-old mother with sudden facial drooping and slurred speech. Waited 55 minutes in triage area before an ER physician saw her.',
      aiObservation: 'Triage intake personnel failed to trigger Code Stroke protocol upon arrival, resulting in a dangerous 55-minute door-to-physician lapse.',
      aiRecommendation: 'Escalate immediately to Emergency Department Medical Director and Nursing Leadership for urgent Sentinel Event / Near-Miss review.',
      evidence: 'Patient Record PT-1020; routed by Agent 3 to Risk Management and Physician Leadership.',
      status: 'Pending'
    },
    {
      id: 'REV-03',
      patient_id: 'PT-1016',
      service_line: 'Outpatient Surgery',
      flaggedByAgents: ['agent1', 'agent2', 'agent3', 'agent6'],
      severity: 'Critical',
      issueDescription: 'ADA Title III Compliance Breach: Pre-booked ASL Interpreter Not Provided for Surgical Consultation.',
      patientCommentSnippet: 'I am deaf and requested an ASL interpreter 4 business days before pre-op. Receptionist told me to read lips through surgical masks.',
      aiObservation: 'Direct violation of federal civil rights laws and informed consent standards for surgical procedures.',
      aiRecommendation: 'Route to Compliance Office and Patient Relations for immediate patient apology, re-consultation with on-site certified interpreter, and staff disciplinary audit.',
      evidence: 'Patient Record PT-1016; categorized as Level 4 Critical by Agent 3 and High Compliance Risk by Agent 2.',
      status: 'Pending'
    },
    {
      id: 'REV-04',
      patient_id: 'PT-1003',
      service_line: 'Emergency Medicine',
      flaggedByAgents: ['agent1', 'agent2', 'agent3', 'agent4'],
      severity: 'High',
      issueDescription: 'Title VI Language Access Barrier: English-Only Discharge Packet Leading to Anticoagulant Dosing Error.',
      patientCommentSnippet: 'Nurse gave us printed papers entirely in English because beds were full. Father took wrong blood thinner dosage next morning and felt dizzy.',
      aiObservation: 'Absence of certified medical interpretation during discharge instructions resulted in active outpatient medication misadventure.',
      aiRecommendation: 'Dispatch clinical triage nurse to assess patient current vitals, verify coagulation panel, and mandate translation check on EHR discharge printer.',
      evidence: 'Patient Record PT-1003; flagged for Bias Review and routed to Nursing Leadership and Risk Management.',
      status: 'Pending'
    }
  ];

  const prioritizedNextActions = [
    {
      priority: 1,
      action: 'Convene Emergency Clinical Safety Committee to review stroke triage delay (PT-1020) and CKD hallucinated prescription order (PT-1009).',
      leadOwner: 'Chief Medical Officer & Risk Management',
      targetCompletion: 'Today (Within 6 Hours)'
    },
    {
      priority: 2,
      action: 'Issue administrative directive requiring mandatory on-demand video interpreter sign-off before discharging non-English speaking or deaf patients.',
      leadOwner: 'VP of Patient Experience & Compliance Office',
      targetCompletion: '48 Hours'
    },
    {
      priority: 3,
      action: 'Launch Project Meds-to-Beds: partner with hospital retail pharmacy for direct bedside prescription handoffs prior to discharge.',
      leadOwner: 'Chief Pharmacy Officer & Nursing Director',
      targetCompletion: '30 Days'
    },
    {
      priority: 4,
      action: 'Deploy pre-service financial clearance tools to provide binding out-of-pocket estimates for elective surgical procedures.',
      leadOwner: 'VP of Revenue Cycle & Patient Access',
      targetCompletion: '60 Days'
    }
  ];

  return {
    multiAgentCorroboratedFindings,
    systemicPatterns,
    conflictingInterpretations,
    humanReviewQueue,
    prioritizedNextActions
  };
}
