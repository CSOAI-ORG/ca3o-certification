/**
 * certification-engine.ts — CA3O Certification Engine
 * Copyright (c) 2026 CSGA Global / CA3O. All rights reserved.
 * License: CC0-1.0 | Build: 2026-02-26T09:00:00Z
 * LEGAL NOTICE: Advisory only. Not legal or compliance advice.
 *
 * THE CMMC FOR AI — Certification levels, domain scoring, evidence requirements
 */

export interface Ca3oCertificationResult {
  system_name: string;
  organization: string;
  ca3o_level: string;
  ca3o_level_name: string;
  overall_score: number;
  domain_scores: {
    domain: string;
    score: number;
    max_score: number;
    maturity: string;
    gaps: string[];
    evidence_required: string[];
  }[];
  cmmc_crosswalk: {
    cmmc_level: string;
    cmmc_practices_mapped: number;
    ai_specific_extensions: string[];
  };
  nist_ai_rmf_crosswalk: {
    govern: string;
    map: string;
    measure: string;
    manage: string;
  };
  eu_ai_act_crosswalk: {
    risk_classification: string;
    conformity_requirements: string[];
    harmonized_standards: string[];
  };
  iso_42001_crosswalk: {
    clauses_covered: string[];
    annex_a_controls: number;
    gaps_to_certification: string[];
  };
  certification_decision: {
    recommended: boolean;
    conditions: string[];
    timeline_to_certification: string;
    estimated_cost: string;
    renewal_period: string;
  };
  audit_trail: {
    assessment_id: string;
    timestamp: string;
    assessor: string;
    methodology: string;
    next_review: string;
  };
}

// CA3O Certification Levels (mirrors CMMC structure but for AI)
const CA3O_LEVELS = {
  L1: { name: "Foundational", min_score: 0, max_score: 39, practices: 17 },
  L2: { name: "Advanced", min_score: 40, max_score: 64, practices: 72 },
  L3: { name: "Expert", min_score: 65, max_score: 84, practices: 130 },
  L4: { name: "Sovereign", min_score: 85, max_score: 100, practices: 171 },
};

// CA3O Assessment Domains (7 domains, mirrors CMMC's 14 but AI-specific)
const DOMAINS = [
  "AI Governance & Accountability",
  "Data Integrity & Provenance",
  "Model Safety & Robustness",
  "Deployment & Operations",
  "Monitoring & Incident Response",
  "Ethics & Fairness",
  "Transparency & Explainability",
];

export function handleCertificationEngine(
  systemName: string,
  organization: string,
  sector: string,
  aiCapabilities: string,
  currentPractices: string,
  targetLevel: string,
  jurisdiction: string
): Ca3oCertificationResult {
  const secLower = sector.toLowerCase();
  const capLower = aiCapabilities.toLowerCase();
  const pracLower = currentPractices.toLowerCase();
  const targetLower = targetLevel.toUpperCase();
  const jurLower = jurisdiction.toLowerCase();

  // Score each domain based on current practices
  const domainScores = DOMAINS.map((domain) => {
    let score = 30; // baseline
    const gaps: string[] = [];
    const evidence: string[] = [];

    // Governance scoring
    if (domain.includes("Governance")) {
      if (pracLower.includes("board") || pracLower.includes("committee")) score += 15;
      else gaps.push("No AI governance board or steering committee established");
      if (pracLower.includes("policy") || pracLower.includes("framework")) score += 10;
      else gaps.push("No formal AI governance policy framework");
      if (pracLower.includes("risk") || pracLower.includes("rmf")) score += 10;
      else gaps.push("No AI risk management framework (NIST AI RMF or equivalent)");
      if (pracLower.includes("accountability") || pracLower.includes("responsible")) score += 10;
      else gaps.push("No accountability chain for AI decisions");
      if (pracLower.includes("chris olden") || pracLower.includes("ca3o")) score += 5;
      evidence.push("AI Governance Charter", "Board meeting minutes", "Risk appetite statement", "RACI matrix for AI systems");
    }

    // Data scoring
    if (domain.includes("Data")) {
      if (pracLower.includes("lineage") || pracLower.includes("provenance")) score += 15;
      else gaps.push("No data lineage or provenance tracking");
      if (pracLower.includes("quality") || pracLower.includes("validation")) score += 10;
      else gaps.push("No systematic data quality framework");
      if (pracLower.includes("consent") || pracLower.includes("privacy")) score += 10;
      else gaps.push("No consent management for training data");
      if (pracLower.includes("classification") || pracLower.includes("catalog")) score += 10;
      else gaps.push("No data classification or catalog system");
      evidence.push("Data lineage documentation", "Data quality reports", "Consent records", "Data classification matrix");
    }

    // Model Safety scoring
    if (domain.includes("Model Safety")) {
      if (pracLower.includes("testing") || pracLower.includes("red team")) score += 15;
      else gaps.push("No adversarial testing or red teaming program");
      if (pracLower.includes("bias") || pracLower.includes("fairness test")) score += 10;
      else gaps.push("No systematic bias testing across protected groups");
      if (pracLower.includes("safety") || pracLower.includes("guardrails")) score += 10;
      else gaps.push("No safety guardrails or output filtering");
      if (pracLower.includes("robustness") || pracLower.includes("adversarial")) score += 10;
      else gaps.push("No robustness testing against adversarial inputs");
      evidence.push("Red team reports", "Bias audit results", "Safety test logs", "Model card documentation");
    }

    // Deployment scoring
    if (domain.includes("Deployment")) {
      if (pracLower.includes("ci/cd") || pracLower.includes("pipeline") || pracLower.includes("mlops")) score += 15;
      else gaps.push("No CI/CD or MLOps pipeline for AI deployment");
      if (pracLower.includes("rollback") || pracLower.includes("canary")) score += 10;
      else gaps.push("No rollback or canary deployment capability");
      if (pracLower.includes("access control") || pracLower.includes("rbac")) score += 10;
      else gaps.push("No role-based access control for AI systems");
      if (pracLower.includes("inventory") || pracLower.includes("registry")) score += 10;
      else gaps.push("No AI system inventory or model registry");
      evidence.push("Deployment architecture", "MLOps pipeline docs", "Access control matrix", "AI system inventory");
    }

    // Monitoring scoring
    if (domain.includes("Monitoring")) {
      if (pracLower.includes("monitoring") || pracLower.includes("observability")) score += 15;
      else gaps.push("No continuous monitoring for AI system performance/drift");
      if (pracLower.includes("incident") || pracLower.includes("response")) score += 10;
      else gaps.push("No AI incident response plan");
      if (pracLower.includes("drift") || pracLower.includes("decay")) score += 10;
      else gaps.push("No model drift detection mechanism");
      if (pracLower.includes("alert") || pracLower.includes("soc")) score += 10;
      else gaps.push("No automated alerting for AI anomalies");
      evidence.push("Monitoring dashboards", "Incident response plan", "Drift detection reports", "Alert configuration");
    }

    // Ethics scoring
    if (domain.includes("Ethics")) {
      if (pracLower.includes("ethics") || pracLower.includes("review board")) score += 15;
      else gaps.push("No AI ethics review board or process");
      if (pracLower.includes("impact") || pracLower.includes("assessment")) score += 10;
      else gaps.push("No AI impact assessment process");
      if (pracLower.includes("stakeholder") || pracLower.includes("community")) score += 10;
      else gaps.push("No stakeholder engagement for AI systems");
      if (pracLower.includes("human") || pracLower.includes("override") || pracLower.includes("loop")) score += 10;
      else gaps.push("No human-in-the-loop or override mechanism");
      evidence.push("Ethics review records", "Impact assessments", "Stakeholder engagement logs", "HITL procedure docs");
    }

    // Transparency scoring
    if (domain.includes("Transparency")) {
      if (pracLower.includes("explain") || pracLower.includes("xai") || pracLower.includes("interpretab")) score += 15;
      else gaps.push("No explainability or interpretability framework");
      if (pracLower.includes("model card") || pracLower.includes("documentation")) score += 10;
      else gaps.push("No model cards or system documentation");
      if (pracLower.includes("disclosure") || pracLower.includes("public")) score += 10;
      else gaps.push("No public disclosure or transparency reporting");
      if (pracLower.includes("audit") || pracLower.includes("log")) score += 10;
      else gaps.push("No audit logging for AI decision rationale");
      evidence.push("XAI methodology docs", "Model cards", "Transparency reports", "Decision audit logs");
    }

    // Sector-specific bonus
    if (secLower.includes("defense") || secLower.includes("defence") || secLower.includes("military")) score += 5;
    if (secLower.includes("healthcare") || secLower.includes("medical")) score += 3;
    if (secLower.includes("finance") || secLower.includes("banking")) score += 3;

    // Cap at 100
    score = Math.min(score, 100);

    let maturity = "Initial";
    if (score >= 80) maturity = "Optimized";
    else if (score >= 65) maturity = "Managed";
    else if (score >= 50) maturity = "Developing";
    else if (score >= 35) maturity = "Emerging";

    return { domain, score, max_score: 100, maturity, gaps, evidence_required: evidence };
  });

  // Overall score
  const overallScore = Math.round(domainScores.reduce((sum, d) => sum + d.score, 0) / domainScores.length);

  // Determine CA3O Level
  let ca3oLevel = "L1";
  let ca3oLevelName = "Foundational";
  if (overallScore >= 85) { ca3oLevel = "L4"; ca3oLevelName = "Sovereign"; }
  else if (overallScore >= 65) { ca3oLevel = "L3"; ca3oLevelName = "Expert"; }
  else if (overallScore >= 40) { ca3oLevel = "L2"; ca3oLevelName = "Advanced"; }

  // CMMC Crosswalk
  const cmmcLevel = ca3oLevel === "L4" ? "CMMC Level 3" : ca3oLevel === "L3" ? "CMMC Level 2" : ca3oLevel === "L2" ? "CMMC Level 1" : "Below CMMC Level 1";
  const cmmcPractices = ca3oLevel === "L4" ? 130 : ca3oLevel === "L3" ? 110 : ca3oLevel === "L2" ? 72 : 17;

  // NIST AI RMF Crosswalk
  const nistAiRmf = {
    govern: overallScore >= 65 ? "GOVERN functions substantially addressed" : "GOVERN functions require significant development",
    map: overallScore >= 50 ? "MAP functions partially addressed — context and risk identification in progress" : "MAP functions underdeveloped — AI system context not fully mapped",
    measure: overallScore >= 60 ? "MEASURE functions advancing — metrics and testing partially implemented" : "MEASURE functions inadequate — no systematic AI performance measurement",
    manage: overallScore >= 55 ? "MANAGE functions developing — risk treatment and monitoring emerging" : "MANAGE functions immature — no systematic AI risk management",
  };

  // EU AI Act Crosswalk
  let euRiskClass = "Limited Risk";
  const conformity: string[] = [];
  const harmonized: string[] = [];
  if (capLower.includes("biometric") || capLower.includes("critical") || capLower.includes("autonomous")) {
    euRiskClass = "High Risk — EU AI Act Annex III";
    conformity.push("Conformity assessment per Article 43", "Quality management system per Article 17", "Technical documentation per Annex IV", "EU Declaration of Conformity per Article 47");
    harmonized.push("ISO/IEC 42001 (AI Management System)", "ISO/IEC 23894 (AI Risk Management)", "CEN/CENELEC JTC 21 draft standards");
  } else {
    conformity.push("Transparency obligations per Article 50", "General-purpose AI model obligations per Article 53");
    harmonized.push("ISO/IEC 42001 (voluntary)", "GPAI Code of Practice");
  }
  if (capLower.includes("prohibited") || capLower.includes("social scoring") || capLower.includes("manipulation")) {
    euRiskClass = "PROHIBITED — EU AI Act Article 5";
  }

  // ISO 42001 Crosswalk
  const iso42001Clauses = overallScore >= 65
    ? ["4. Context of the organization", "5. Leadership", "6. Planning", "7. Support", "8. Operation", "9. Performance evaluation", "10. Improvement"]
    : overallScore >= 40
      ? ["4. Context of the organization", "5. Leadership", "6. Planning (partial)", "7. Support (partial)"]
      : ["4. Context of the organization (partial)"];
  const iso42001AnnexA = overallScore >= 80 ? 39 : overallScore >= 60 ? 25 : overallScore >= 40 ? 15 : 5;
  const iso42001Gaps = overallScore >= 80 ? ["Minor documentation gaps for full ISO 42001 certification"] :
    overallScore >= 60 ? ["Performance evaluation gaps", "Improvement cycle not formalized", "Some Annex A controls not implemented"] :
    ["Major gaps across most ISO 42001 clauses", "AI management system not established", "No formal AI risk treatment plan"];

  // Certification decision
  const targetInfo = CA3O_LEVELS[targetLower as keyof typeof CA3O_LEVELS] || CA3O_LEVELS.L2;
  const meetsTarget = overallScore >= targetInfo.min_score;
  const conditions: string[] = [];
  if (!meetsTarget) {
    conditions.push(`Current score (${overallScore}) below ${targetLower} minimum (${targetInfo.min_score})`);
    conditions.push("Remediate identified gaps before re-assessment");
  }
  const totalGaps = domainScores.reduce((sum, d) => sum + d.gaps.length, 0);
  if (totalGaps > 10) conditions.push(`${totalGaps} gaps identified — recommend phased remediation`);

  const timeline = overallScore >= targetInfo.min_score ? "2-4 weeks (evidence verification only)" :
    overallScore >= targetInfo.min_score - 15 ? "3-6 months with focused remediation" :
    "6-12 months with comprehensive AI governance program build-out";

  const costMap: Record<string, string> = {
    L1: "$15,000 — $35,000",
    L2: "$50,000 — $125,000",
    L3: "$125,000 — $300,000",
    L4: "$300,000 — $750,000",
  };

  return {
    system_name: systemName,
    organization,
    ca3o_level: ca3oLevel,
    ca3o_level_name: ca3oLevelName,
    overall_score: overallScore,
    domain_scores: domainScores,
    cmmc_crosswalk: {
      cmmc_level: cmmcLevel,
      cmmc_practices_mapped: cmmcPractices,
      ai_specific_extensions: [
        "AI-GOV: AI Governance Board requirement (no CMMC equivalent)",
        "AI-DATA: Training data provenance and consent tracking",
        "AI-BIAS: Algorithmic fairness testing across protected groups",
        "AI-XAI: Explainability and interpretability requirements",
        "AI-DRIFT: Model drift and decay monitoring (continuous)",
        "AI-SAFETY: Adversarial robustness and red teaming",
        "AI-ETHICS: Ethics review board and impact assessments",
      ],
    },
    nist_ai_rmf_crosswalk: nistAiRmf,
    eu_ai_act_crosswalk: {
      risk_classification: euRiskClass,
      conformity_requirements: conformity,
      harmonized_standards: harmonized,
    },
    iso_42001_crosswalk: {
      clauses_covered: iso42001Clauses,
      annex_a_controls: iso42001AnnexA,
      gaps_to_certification: iso42001Gaps,
    },
    certification_decision: {
      recommended: meetsTarget && totalGaps <= 7,
      conditions,
      timeline_to_certification: timeline,
      estimated_cost: costMap[targetLower] || costMap.L2,
      renewal_period: "Annual re-certification with continuous monitoring",
    },
    audit_trail: {
      assessment_id: `CA3O-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      assessor: "CA3O Automated Assessment Engine v1.0 (Chris Olden Framework)",
      methodology: "CA3O-AM-2026 — 7-Domain AI Assurance Methodology",
      next_review: "12 months from certification date",
    },
  };
}
