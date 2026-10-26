/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PatientRecord {
  patient_id: string;
  persona: string;
  age_group: '18-29' | '30-49' | '50-64' | '65-74' | '75+';
  service_line: 'Emergency Medicine' | 'Cardiovascular Care' | 'Oncology & Infusion' | 'Orthopedics & Sports Medicine' | 'Pediatrics & Family Care' | 'Virtual Care / Telehealth' | 'Outpatient Surgery';
  visit_type: 'Inpatient' | 'Outpatient Clinic' | 'Emergency Dept' | 'Telehealth Visit' | 'Urgent Care' | 'Outpatient Surgery';
  satisfaction_score: number; // 1 to 5
  communication_rating: number; // 1 to 5
  follow_up_compliance: boolean;
  complaint_severity: 'Level 1 - Low' | 'Level 2 - Moderate' | 'Level 3 - High' | 'Level 4 - Critical';
  patient_portal_usage: 'High' | 'Moderate' | 'Low' | 'Non-User';
  readmission_risk: 'Low' | 'Moderate' | 'High';
  ai_risk_flag: 'None' | 'Hallucination Risk' | 'Bias Review' | 'Human Review Required';
  ai_risk_details?: string;
  comment: string;
  date: string;
}

export type AgentId = 'agent1' | 'agent2' | 'agent3' | 'agent4' | 'agent5' | 'agent6';

export type AgentStatus = 'idle' | 'selected' | 'processing' | 'completed' | 'error';

export interface AgentDefinition {
  id: AgentId;
  name: string;
  title: string;
  role: string;
  roomName: string;
  roomTheme: {
    accentColor: string; // e.g., 'teal', 'blue', 'indigo', 'violet', 'cyan', 'amber'
    accentHex: string;
    officeType: string;
    decorItem: string;
  };
  shortDescription: string;
  tasks: string[];
  constraints: string[];
  avatarStyle: {
    specialty: string;
    accessory: string;
    initials: string;
    gender: 'female' | 'male' | 'neutral';
  };
}

export interface AgentProcessingProgress {
  agentId: AgentId;
  status: AgentStatus;
  progressPercent: number;
  currentStepIndex: number;
  currentStepName: string;
  totalSteps: number;
  logs: { timestamp: string; message: string; stepNumber: number }[];
  latestFindingSnippet: string;
  errorMessage?: string;
}

// Agent 1: Patient Feedback Insight Output
export interface Agent1FeedbackItem {
  patient_id: string;
  comment: string;
  theme: 'Communication' | 'Scheduling' | 'Wait Time' | 'Technology / Patient Portal' | 'Billing' | 'Clinical Care' | 'Discharge / Follow-Up' | 'Accessibility / Equity' | 'Mixed or Ambiguous';
  sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
  reasoning: string;
  operationalIssue: string;
  riskOrBiasConcern: string;
  recommendedAction: string;
}

export interface Agent1Result {
  agentId: 'agent1';
  completedAt: string;
  items: Agent1FeedbackItem[];
  themeDistribution: Record<string, number>;
  sentimentDistribution: { Positive: number; Negative: number; Neutral: number; Mixed: number };
  keyRisksIdentified: string[];
  topOperationalIssues: string[];
}

// Agent 2: Patient Experience Monitoring Output
export interface Agent2ExperienceItem {
  patient_id: string;
  comment: string;
  primaryTheme: string;
  secondaryThemes: string[];
  operationalBottleneck: string;
  equityAndAccessibilityFlag: {
    hasConcern: boolean;
    demographicCategory: 'Older Adults' | 'Rural Patients' | 'Disabilities' | 'Limited English' | 'Low Digital Literacy' | 'None';
    details: string;
  };
  riskAssessment: {
    patientSafety: 'Low' | 'Moderate' | 'High';
    reputational: 'Low' | 'Moderate' | 'High';
    compliance: 'Low' | 'Moderate' | 'High';
    equity: 'Low' | 'Moderate' | 'High';
  };
  managerialRecommendation: string;
}

export interface Agent2Result {
  agentId: 'agent2';
  completedAt: string;
  items: Agent2ExperienceItem[];
  bottlenecksSummary: { issue: string; count: number; severity: string }[];
  equityRiskSummary: { category: string; count: number; recommendation: string }[];
  overallRiskProfile: { patientSafetyHigh: number; reputationalHigh: number; complianceHigh: number; equityHigh: number };
}

// Agent 3: Complaint Triage Assistant Output
export interface Agent3TriageItem {
  patient_id: string;
  comment: string;
  primaryCategory: string;
  secondaryCategories: string[];
  severityLevel: 'LEVEL 1 – Low' | 'LEVEL 2 – Moderate' | 'LEVEL 3 – High' | 'LEVEL 4 – Critical';
  severityReasoning: string;
  applicableRisks: {
    riskType: 'Patient Safety Risk' | 'Clinical Risk' | 'Compliance Risk' | 'Privacy Risk' | 'Accessibility Risk' | 'Equity Risk' | 'Reputational Risk' | 'Operational Risk';
    explanation: string;
  }[];
  escalationRoute: 'Patient Experience Team' | 'Nursing Leadership' | 'Physician Leadership' | 'Quality Improvement Team' | 'Compliance Office' | 'Information Technology' | 'Revenue Cycle / Billing' | 'Accessibility Coordinator' | 'Risk Management' | 'Executive Review';
  humanInterventionRequired: boolean;
  triageTimeline: string; // e.g. "Immediate (Within 2 Hours)", "Within 24 Hours", "Routine"
}

export interface Agent3Result {
  agentId: 'agent3';
  completedAt: string;
  items: Agent3TriageItem[];
  severityBreakdown: { low: number; moderate: number; high: number; critical: number };
  routingDistribution: Record<string, number>;
  criticalAttentionItems: Agent3TriageItem[];
}

// Agent 4: Hospital Manager Decision Support Output
export interface Agent4CaseAnalysis {
  patient_id: string;
  persona: string;
  age_group: string;
  service_line: string;
  visit_type: string;
  mainProblem: string;
  managementPriority: 'Low' | 'Medium' | 'High';
  priorityReasoning: string;
  recommendedActions: string[];
  humanReviewNeeded: boolean;
  aiRiskFlagAssessment?: {
    flag: string;
    details: string;
    hallucinationWarning?: string;
  };
}

export interface Agent4Result {
  agentId: 'agent4';
  completedAt: string;
  topManagementAlert: string;
  bottomRecommendedActions: string[];
  cases: Agent4CaseAnalysis[];
  priorityBreakdown: { High: number; Medium: number; Low: number };
  humanReviewCount: number;
}

// Agent 5: Healthcare Analytics Agent Output
export interface Agent5AnalyticsResult {
  agentId: 'agent5';
  completedAt: string;
  section1_executiveOverview: {
    totalCommentsAnalyzed: number;
    avgPatientSatisfaction: number;
    avgCommunicationRating: number;
    followUpComplianceRate: number; // percentage
    numberOfServiceLines: number;
  };
  section2_satisfactionInsights: {
    satisfactionDistribution: { score: number; count: number }[];
    satisfactionByServiceLine: { serviceLine: string; avgScore: number; count: number }[];
    satisfactionByVisitType: { visitType: string; avgScore: number; count: number }[];
    satisfactionByPersona: { persona: string; avgScore: number; count: number }[];
  };
  section3_nlpAnalysis: {
    topThemes: { theme: string; frequency: number; percentage: number }[];
    frequentKeywords: { word: string; count: number; category: string }[];
    wordCloud: { text: string; value: number; sentiment: 'positive' | 'negative' | 'neutral' }[];
  };
  section4_hiddenOrganizationalProblems: {
    highComplaintServiceLines: { serviceLine: string; complaintRate: number; keyDriver: string }[];
    communicationBottlenecks: string[];
    technologyIssues: string[];
    schedulingIssues: string[];
    waitTimeComplaints: string[];
  };
  section5_aiRiskMonitoring: {
    hallucinationTrapComments: { patientId: string; comment: string; note: string }[];
    biasRelatedComments: { patientId: string; comment: string; concern: string }[];
    casesRequiringHumanReview: { patientId: string; reason: string; serviceLine: string }[];
  };
  section6_executiveRecommendations: {
    top5OrganizationalPriorities: string[];
    quickWins3Months: string[];
    longTermAIOpportunities6To12Months: string[];
  };
}

export type Agent5Result = Agent5AnalyticsResult;

// Agent 6: Business & Strategy Consultant Agent Output
export interface Agent6StrategicRecommendation {
  id: string;
  title: string;
  focusArea: string;
  resourceRequirements: string;
  expectedROI: string;
  easeOfImplementation: 'Low' | 'Medium' | 'High';
  financialStrategicImpact: 'Low' | 'Medium' | 'High';
  timeline: string;
}

export interface Agent6Result {
  agentId: 'agent6';
  completedAt: string;
  step1_strategicImpactAndRevenueRisk: {
    revenueImpactSummary: string;
    patientRetentionRisk: string;
    valueBasedCareImpact: string;
    hcahpsImpact: string;
    brandReputationAnalysis: string;
  };
  step2_costOfInefficiencyAndWaste: {
    missedAppointmentsLossEstimate: string;
    billingCodingFrictionEstimate: string;
    patientChurnRiskValue: string;
    underutilizedStaffingAreas: string[];
    portalDropOffCost: string;
    totalEstimatedLeakage: string;
  };
  step3_marketAndCompetitivePositioning: {
    regionalBenchmarkComparison: string;
    digitalAccessEvaluation: string;
    competitorThreats: string[];
    competitiveAdvantages: string[];
  };
  step4_strategicRecommendations: Agent6StrategicRecommendation[];
  step5_businessDevelopmentAndProposals: {
    consultingOpportunities: string[];
    proposalDraftConcept: string;
    strategicPartnershipPitch: string;
  };
  step6_decisionMatrix: {
    quadrants: {
      highImpact_highEase: Agent6StrategicRecommendation[]; // Quick Wins
      highImpact_lowEase: Agent6StrategicRecommendation[];  // Strategic Bets
      lowImpact_highEase: Agent6StrategicRecommendation[];   // Incremental Fill-ins
      lowImpact_lowEase: Agent6StrategicRecommendation[];    // Deprioritize
    };
  };
}

export interface HumanReviewItem {
  id: string;
  patient_id: string;
  service_line: string;
  flaggedByAgents: AgentId[];
  severity: 'Critical' | 'High' | 'Moderate';
  issueDescription: string;
  patientCommentSnippet: string;
  aiObservation: string;
  aiRecommendation: string;
  evidence: string;
  status: 'Pending' | 'Approved' | 'Audited' | 'Overridden';
  reviewedBy?: string;
  reviewTimestamp?: string;
  reviewNotes?: string;
}

export interface CombinedCrossAgentInsights {
  multiAgentCorroboratedFindings: {
    topic: string;
    supportingAgents: AgentId[];
    description: string;
    evidenceData: string;
  }[];
  systemicPatterns: {
    patternName: string;
    impactAreas: string[];
    affectedServiceLines: string[];
    significance: 'Critical' | 'High' | 'Moderate';
    suggestedAction: string;
  }[];
  conflictingInterpretations: {
    topic: string;
    agentA: { id: AgentId; perspective: string };
    agentB: { id: AgentId; perspective: string };
    synthesisRecommendation: string;
  }[];
  humanReviewQueue: HumanReviewItem[];
  prioritizedNextActions: {
    priority: number;
    action: string;
    leadOwner: string;
    targetCompletion: string;
  }[];
}

export interface AppAnalysisState {
  isAnalyzing: boolean;
  activeAgents: Set<AgentId>;
  progressByAgent: Record<AgentId, AgentProcessingProgress>;
  results: {
    agent1?: Agent1Result;
    agent2?: Agent2Result;
    agent3?: Agent3Result;
    agent4?: Agent4Result;
    agent5?: Agent5Result;
    agent6?: Agent6Result;
  };
  combinedInsights?: CombinedCrossAgentInsights;
  lastAnalysisTimestamp?: string;
}
