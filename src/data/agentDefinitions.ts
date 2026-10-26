/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgentDefinition } from '../types/clinical';

export const AGENT_DEFINITIONS: AgentDefinition[] = [
  {
    id: 'agent1',
    name: 'Dr. Evelyn Reed',
    title: 'Patient Feedback Insight Agent',
    role: 'Analyze patient comments to help healthcare leaders understand experience, operational friction, communication nuances, and emergent risks.',
    roomName: 'Suite 101 · Patient Feedback Insight Lab',
    roomTheme: {
      accentColor: 'teal',
      accentHex: '#0d9488',
      officeType: 'Linguistic Intelligence & Feedback Station',
      decorItem: 'Acoustic waveform monitor, clinical review desk, speech-to-theme console'
    },
    shortDescription: 'Classifies patient comments into primary themes, sentiment polarity, operational breakdowns, and equity or over-automation concerns.',
    tasks: [
      'Step 1: Theme Classification (Communication, Scheduling, Wait Time, Tech/Portal, Billing, Clinical Care, Discharge, Accessibility)',
      'Step 2: Sentiment Assessment (Positive, Negative, Neutral, Mixed)',
      'Step 3: Reasoning & Linguistic Analysis',
      'Step 4: Operational Issue Identification',
      'Step 5: Patient Safety, Accessibility, Fairness & Over-automation Risk Detection',
      'Step 6: Practical Managerial Quality-Improvement Action'
    ],
    constraints: [
      'Professional healthcare quality-improvement tone',
      'Never invent medical facts',
      'Clearly state ambiguities if comments lack context',
      'Do not resolve clinical complaints autonomously'
    ],
    avatarStyle: {
      specialty: 'Clinical Linguist & Experience Analyst',
      accessory: 'Stethoscope & Tablet',
      initials: 'ER',
      gender: 'female'
    }
  },
  {
    id: 'agent2',
    name: 'Dr. Marcus Vance',
    title: 'Patient Experience Monitoring Agent',
    role: 'Monitor longitudinal patient sentiment, identify operational bottlenecks, and safeguard healthcare equity across vulnerable patient demographics.',
    roomName: 'Suite 102 · Experience & Equity Observability Hub',
    roomTheme: {
      accentColor: 'indigo',
      accentHex: '#4f46e5',
      officeType: 'Experience Telemetry & Equity Watchroom',
      decorItem: 'Multi-screen demographic GIS monitors, accessibility review station'
    },
    shortDescription: 'Performs multi-layer theme classification, pinpoints operational bottlenecks, audits equity for older adults & rural patients, and rates organizational risk.',
    tasks: [
      'Step 1: Theme Classification (Primary & secondary themes including Patient Safety)',
      'Step 2: Operational Bottleneck Identification (wait times, scheduling errors, tech failures)',
      'Step 3: Healthcare Equity & Accessibility Review (older adults, rural, disabilities, LEP, low digital literacy)',
      'Step 4: Multi-Category Risk Assessment (Low/Mod/High across Patient Safety, Reputational, Compliance, Equity)',
      'Step 5: Actionable Managerial Quality Recommendations'
    ],
    constraints: [
      'Professional healthcare quality-improvement tone',
      'Specific focus on vulnerable patient populations',
      'Flag accessibility and language disparities with precision',
      'Ground all findings strictly in provided patient records'
    ],
    avatarStyle: {
      specialty: 'Chief Patient Experience Officer',
      accessory: 'Clinical Badge & Smart Clipboard',
      initials: 'MV',
      gender: 'male'
    }
  },
  {
    id: 'agent3',
    name: 'Nurse Director Sarah Lin',
    title: 'Complaint Triage Assistant',
    role: 'Review, prioritize, and route patient grievances and safety incident reports with strict clinical compliance and human oversight.',
    roomName: 'Suite 103 · Rapid Incident & Triage Command',
    roomTheme: {
      accentColor: 'rose',
      accentHex: '#e11d48',
      officeType: 'High-Acuity Routing & Escalation Hub',
      decorItem: 'Emergency triage routing board, escalation status dials, incident log'
    },
    shortDescription: 'Determines what happened, rates severity from Level 1 (Low) to Level 4 (Critical), detects compliance/safety risks, and routes to exact clinical leadership.',
    tasks: [
      'Step 1: Complaint Categorization (Clinical Care, Safety, Privacy, Conduct, Billing, etc.)',
      'Step 2: Severity Level Assignment (Level 1 Low, Level 2 Moderate, Level 3 High, Level 4 Critical)',
      'Step 3: Risk Detection (Patient Safety, Clinical, Compliance, Privacy, Accessibility, Reputational)',
      'Step 4: Escalation Routing (Route to Nursing, Physician Leadership, Risk Management, Executive Review)'
    ],
    constraints: [
      'Triage and route only — do NOT attempt to autonomously resolve complaints',
      'Strict adherence to Level 4 critical emergency safety protocols',
      'Maintain rigorous patient confidentiality and human audit trail',
      'Flag any medication or physical harm concerns immediately'
    ],
    avatarStyle: {
      specialty: 'Patient Safety & Clinical Risk Specialist',
      accessory: 'Trauma Shears & Emergency Pager',
      initials: 'SL',
      gender: 'female'
    }
  },
  {
    id: 'agent4',
    name: 'Director Arthur Sterling',
    title: 'Hospital Manager Decision Support Agent',
    role: 'Transform patient-level data into prioritized operational decisions, detect AI hallucinations, and recommend 2-3 high-leverage hospital management actions.',
    roomName: 'Suite 104 · Hospital Operations & Governance Office',
    roomTheme: {
      accentColor: 'amber',
      accentHex: '#d97706',
      officeType: 'Executive Hospital Management Office',
      decorItem: 'Mahogany desk, hospital service line status monitors, KPI boards'
    },
    shortDescription: 'Analyzes patient personas, readmission risks, and AI risk flags to assign management priorities and construct high-level operational directives.',
    tasks: [
      'Case Breakdown: Identify main operational problem and rate management priority (Low, Med, High)',
      'AI Risk Flag Analysis: Review Hallucination Risks, Bias Flags, and Human Review Triggers',
      'Operational Problem Ranking: Service quality, wait times, follow-up gaps, and readmission exposure',
      'Executive Alerting: Generate top management alert and 2-3 prioritized operational interventions',
      'Human Review Determination: Explicitly delineate which cases require clinical sign-off'
    ],
    constraints: [
      'Focus purely on healthcare management, operational efficiency, and patient safety governance',
      'Do not diagnose medical conditions or prescribe treatments',
      'Pay special scrutiny to AI Hallucination and Bias Flags in EHR notes',
      'Never rely on an AI risk flag in isolation without holistic case context'
    ],
    avatarStyle: {
      specialty: 'Hospital Operations Director',
      accessory: 'Executive Specs & Hospital Lanyard',
      initials: 'AS',
      gender: 'male'
    }
  },
  {
    id: 'agent5',
    name: 'Dr. Priya Chen',
    title: 'Healthcare Analytics Agent',
    role: 'Build interactive C-suite executive dashboards presenting quantitative KPIs, NLP word frequencies, hidden organizational problems, and AI risk monitoring.',
    roomName: 'Suite 105 · C-Suite Executive Analytics Boardroom',
    roomTheme: {
      accentColor: 'blue',
      accentHex: '#2563eb',
      officeType: 'Strategic Data Visualization & Intelligence Suite',
      decorItem: 'Interactive panoramic data wall, statistical modeling workstation'
    },
    shortDescription: 'Generates Section 1-6 executive reports: satisfaction breakdowns by service line, NLP word frequencies, hidden organizational bottlenecks, and AI hallucination monitoring.',
    tasks: [
      'Section 1: Executive Overview (Total comments, Avg satisfaction, Avg communication, Compliance rate, Service lines)',
      'Section 2: Patient Satisfaction Insights (Distributions by service line, visit type, and persona)',
      'Section 3: NLP Analysis (Top themes, keyword frequencies, interactive word cloud)',
      'Section 4: Hidden Organizational Problems (High complaint rates, communication bottlenecks, tech failures)',
      'Section 5: AI Risk Monitoring (Hallucination traps, bias comments, cases needing human review)',
      'Section 6: Executive Recommendations (Top 5 priorities, 3-month quick wins, 6-12 month AI roadmap)'
    ],
    constraints: [
      'Visually appealing and suitable for presentation to healthcare executives and C-suite officers',
      'Do not invent fictitious metrics or unsupported data points',
      'Ensure all tabular numbers use strict tabular figures',
      'Clearly present actionable takeaways alongside visualizations'
    ],
    avatarStyle: {
      specialty: 'Chief Biostatistician & AI Architect',
      accessory: 'Dual Curved Displays & Hologram Lens',
      initials: 'PC',
      gender: 'female'
    }
  },
  {
    id: 'agent6',
    name: 'Elena Rostova, MBA',
    title: 'Business & Strategy Consultant Agent',
    role: 'Connect patient experience metrics to hospital bottom-line performance, financial leakage, value-based reimbursement, and market positioning.',
    roomName: 'Suite 106 · Healthcare Economics & Strategy Advisory',
    roomTheme: {
      accentColor: 'emerald',
      accentHex: '#059669',
      officeType: 'Healthcare Advisory & Strategic Venture Studio',
      decorItem: 'Financial terminal, decision matrix grid, value-based care models'
    },
    shortDescription: 'Evaluates revenue risks, cost of inefficiency (missed appointments, billing leakage, churn), benchmark positioning, and an interactive 3x3 ROI Decision Matrix.',
    tasks: [
      'Step 1: Strategic Impact & Revenue Risk (Value-based care, HCAHPS penalties, retention)',
      'Step 2: Cost of Inefficiency & Waste (Financial leakage from billing friction, missed appointments, patient churn)',
      'Step 3: Market & Competitive Positioning (Regional benchmarks, telehealth access, competitor threats)',
      'Step 4: Strategic Recommendations & ROI (Process optimization, tech stack investment, workforce re-allocation)',
      'Step 5: Business Development & Revenue Generation (Consulting proposals, service line pitches)',
      'Step 6: Decision Matrix & Executive Summary (Ease of Implementation vs Financial/Strategic Impact)'
    ],
    constraints: [
      'Executive management consulting tone (McKinsey / BCG style)',
      'Strictly avoid clinical diagnoses or medical advice',
      'Explicitly state data gaps if financial variables (LTV, overhead, conversion) require deeper telemetry',
      'Ground ROI estimates in realistic healthcare economics frameworks'
    ],
    avatarStyle: {
      specialty: 'Healthcare Strategy Managing Director',
      accessory: 'Executive Portfolio & Economic Index Terminal',
      initials: 'ER',
      gender: 'female'
    }
  }
];
