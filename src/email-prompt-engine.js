// Email Generation Prompt Engine for HomeLLM
// Constructs specialized prompts for Claude API based on issue type, recipient, and escalation level

import { getRelevantRegulations, issueTypeMapping } from './regulatory-knowledge-base';

// System prompt with expert persona
export const systemPrompt = `You are an expert legal and environmental health advocate who specializes in drafting professional correspondence to address home health and safety issues. You have deep expertise in:

- Federal, state, and local housing regulations
- Environmental health standards (EPA, HUD, CDC guidelines)
- Tenant rights and warranty of habitability laws
- HOA governance and responsibilities
- Utility company regulations and customer rights
- Effective advocacy communication strategies

Your role is to draft persuasive, legally-grounded emails that:
1. Clearly articulate the health/safety issue with specific evidence
2. Cite relevant laws, regulations, and standards
3. Establish the recipient's legal obligations and responsibilities
4. Propose specific, actionable remedies with reasonable timelines
5. Maintain appropriate tone based on escalation level
6. Protect the sender's legal rights and document the complaint

Always write in a professional, factual tone. Use regulatory citations to strengthen arguments. Be firm but respectful. Focus on health impacts and legal obligations rather than emotional appeals.`;

// Generate context-specific prompt for email generation
export function generateEmailPrompt(formData, regulations, attachedImages = []) {
  const {
    issueType,
    recipient,
    location,
    city,
    state,
    evidence,
    measurements,
    previousContact,
    healthImpact,
    regulations: userRegulations,
    desiredOutcome,
    escalationLevel,
    affectedResidents,
    propertyAge,
    urgencyLevel,
    senderName,
    senderEmail,
    senderPhone,
    senderAddress
  } = formData;

  // Build regulatory context
  let regulatoryContext = '\n\n## APPLICABLE REGULATIONS AND STANDARDS:\n\n';

  regulations.forEach(reg => {
    if (reg.level === 'federal') {
      regulatoryContext += `### Federal Regulations:\n`;
      regulatoryContext += `Primary Laws: ${reg.data.primaryLaws.join('; ')}\n\n`;
      if (reg.data.standards) {
        regulatoryContext += `Relevant Standards:\n`;
        Object.entries(reg.data.standards).forEach(([key, value]) => {
          regulatoryContext += `- ${key}: ${value}\n`;
        });
      }
      regulatoryContext += `\nEnforcement Agencies: ${reg.data.agencies.join(', ')}\n\n`;
      if (reg.data.citations) {
        regulatoryContext += `Key Citations:\n`;
        Object.entries(reg.data.citations).forEach(([key, value]) => {
          regulatoryContext += `- ${value}\n`;
        });
      }
      regulatoryContext += '\n';
    }

    if (reg.level === 'state') {
      regulatoryContext += `### ${reg.state} State Regulations:\n`;
      regulatoryContext += `State Laws: ${reg.data.laws.join('; ')}\n\n`;
      if (reg.data.standards) {
        regulatoryContext += `State Standards:\n`;
        Object.entries(reg.data.standards).forEach(([key, value]) => {
          regulatoryContext += `- ${key}: ${value}\n`;
        });
      }
      if (reg.data.agencies) {
        regulatoryContext += `\nState Agencies: ${reg.data.agencies.join(', ')}\n`;
      }
      regulatoryContext += '\n';
    }

    if (reg.level === 'hoa') {
      regulatoryContext += `### HOA Governance:\n`;
      regulatoryContext += `Governing Documents: ${reg.data.governingDocuments.join(', ')}\n`;
      regulatoryContext += `State HOA Laws: ${reg.data.stateLaws.uniform}\n\n`;
      regulatoryContext += `HOA Responsibilities:\n`;
      Object.entries(reg.data.responsibilities).forEach(([key, value]) => {
        regulatoryContext += `- ${value}\n`;
      });
      regulatoryContext += '\n';
    }
  });

  // Build image context if images are attached
  let imageContext = '';
  if (attachedImages.length > 0) {
    imageContext = `\n\n## ATTACHED EVIDENCE:\n${attachedImages.length} image(s) provided showing visual evidence of the issue. Reference these images in the email to strengthen the case.\n`;
  }

  // Build escalation-specific guidance
  const escalationGuidance = getEscalationGuidance(escalationLevel, recipientType(recipient));

  // Build recipient-specific guidance
  const recipientGuidance = getRecipientGuidance(recipient);

  // Construct the full prompt
  const prompt = `Draft a professional email to address the following home health/safety issue:

## ISSUE DETAILS:
- **Issue Type**: ${getIssueLabel(issueType)}
- **Recipient**: ${getRecipientLabel(recipient)}
- **Property Location**: ${location}, ${city}, ${state}
- **Property Age**: ${propertyAge || 'Not specified'}
- **Urgency Level**: ${urgencyLevel.toUpperCase()}
- **Affected Residents**: ${affectedResidents || 'Not specified'}

## EVIDENCE AND DOCUMENTATION:
${evidence}

${measurements ? `\n**Measurements/Test Results**:\n${measurements}\n` : ''}

${previousContact ? `\n**Previous Contact History**:\n${previousContact}\n` : ''}

${healthImpact ? `\n**Health Impacts**:\n${healthImpact}\n` : ''}

${userRegulations ? `\n**Additional Regulations/Context**:\n${userRegulations}\n` : ''}

${imageContext}

## DESIRED OUTCOME:
${desiredOutcome}

${regulatoryContext}

## ESCALATION LEVEL: ${escalationLevel.toUpperCase()}
${escalationGuidance}

${recipientGuidance}

## EMAIL REQUIREMENTS:

1. **Subject Line**: Create a clear, professional subject line that conveys urgency and topic

2. **Opening**: Address recipient appropriately and state purpose clearly

3. **Issue Description**:
   - Describe the specific health/safety issue with factual details
   - Reference measurements, test results, and visual evidence
   - Explain health impacts and risks

4. **Legal Framework**:
   - Cite 2-3 most relevant regulations/standards from the list above
   - Explain recipient's legal obligations and responsibilities
   - Reference applicable codes and statutes

5. **Previous Attempts** (if applicable):
   - Document previous communications and their dates
   - Note any inadequate responses or lack of action

6. **Requested Action**:
   - Specify concrete steps the recipient should take
   - Provide reasonable timeline based on urgency (${urgencyLevel})
   - Include inspection, testing, remediation as appropriate

7. **Next Steps**:
   - State what you will do if issue is not resolved
   - Reference relevant agencies, legal options, or escalation paths
   - Maintain professional tone while being clear about consequences

8. **Closing**:
   - Professional sign-off
   - Contact information

9. **Tone**: ${getToneGuidance(escalationLevel)}

## SENDER INFORMATION:
- Name: ${senderName}
- Email: ${senderEmail}
${senderPhone ? `- Phone: ${senderPhone}` : ''}
${senderAddress ? `- Address: ${senderAddress}` : ''}

Generate a complete, ready-to-send email that incorporates all of the above. The email should be persuasive, legally grounded, and appropriate for the escalation level. Format with proper paragraph breaks and structure.`;

  return prompt;
}

// Helper functions for prompt construction

function getIssueLabel(issueType) {
  const labels = {
    'air-quality': 'Air Quality / Mold / VOCs',
    'water-quality': 'Water Quality / Contamination',
    'hvac-ventilation': 'HVAC / Ventilation Issues',
    'lead-asbestos': 'Lead / Asbestos / Hazardous Materials',
    'pest-infestation': 'Pest Infestation',
    'structural': 'Structural / Safety Hazards',
    'noise-pollution': 'Noise Pollution',
    'utility-access': 'Utility Access / Service Issues',
    'radon': 'Radon Detection',
    'carbon-monoxide': 'Carbon Monoxide / Gas Leaks',
    'electromagnetic': 'EMF / Electromagnetic Fields'
  };
  return labels[issueType] || issueType;
}

function getRecipientLabel(recipient) {
  const labels = {
    'hoa': 'Homeowners Association (HOA)',
    'property-mgmt': 'Property Management / Landlord',
    'utility': 'Utility Company',
    'local-govt': 'Local Government / City Council',
    'state-agency': 'State Environmental/Health Agency',
    'federal-agency': 'Federal Agency (EPA, HUD, etc.)',
    'nonprofit': 'Advocacy Nonprofit / Legal Aid'
  };
  return labels[recipient] || recipient;
}

function recipientType(recipient) {
  if (recipient === 'hoa') return 'hoa';
  if (recipient === 'property-mgmt') return 'landlord';
  if (recipient === 'utility') return 'utility';
  if (['local-govt', 'state-agency', 'federal-agency'].includes(recipient)) return 'government';
  if (recipient === 'nonprofit') return 'nonprofit';
  return 'general';
}

function getEscalationGuidance(level, recipientType) {
  const guidance = {
    initial: {
      tone: 'Polite and professional inquiry',
      approach: 'Assume good faith. This is your first contact about the issue. Express concern and request information or action. Be courteous and assume the recipient may not be aware of the problem.',
      consequences: 'Do not mention legal action or escalation. Focus on collaborative problem-solving.',
      timeline: 'Request response within 7-14 days for non-urgent issues, 2-3 days for urgent issues.'
    },
    professional: {
      tone: 'Firm but courteous follow-up',
      approach: 'Reference previous contact if applicable. Clearly state obligations and expectations. Cite relevant regulations to establish the legal framework. Maintain professional courtesy but be direct about the seriousness of the issue.',
      consequences: 'Hint at potential escalation (reporting to agencies, seeking legal counsel) without explicit threats.',
      timeline: 'Request response within 5-7 days for non-urgent issues, 24-48 hours for urgent issues.'
    },
    formal: {
      tone: 'Formal complaint with documented violations',
      approach: 'Document all violations of regulations and standards. Use formal legal language. Reference specific statutes and codes. Make clear that this is an official complaint for the record. State that you are documenting all communications.',
      consequences: 'Clearly state next steps if issue is not resolved: reporting to regulatory agencies, health department complaints, legal action.',
      timeline: 'Demand response within 3-5 days for non-urgent issues, 24 hours for urgent issues. Include specific deadline date.'
    },
    legal: {
      tone: 'Pre-legal notice with explicit consequences',
      approach: 'This is the final notice before legal or regulatory action. Use formal legal language throughout. Document all previous attempts to resolve. Cite specific violations of law. State that you are prepared to pursue all available legal remedies.',
      consequences: 'Explicitly state consequences: filing formal complaints with regulatory agencies (list specific agencies), pursuing legal action, seeking damages, terminating agreements, public records requests, media contact, etc.',
      timeline: 'Final deadline: 48-72 hours for urgent issues, 3-5 days maximum for others. Include exact date and time. State that no further notice will be provided.'
    }
  };

  return guidance[level] ?
    `**Tone**: ${guidance[level].tone}\n**Approach**: ${guidance[level].approach}\n**Consequences**: ${guidance[level].consequences}\n**Timeline**: ${guidance[level].timeline}`
    : '';
}

function getRecipientGuidance(recipient) {
  const guidance = {
    'hoa': `## HOA-SPECIFIC GUIDANCE:
- Reference specific sections of CC&Rs, Bylaws, or other governing documents if known
- Mention HOA's duty to maintain common areas and address hazards
- Reference state HOA laws regarding maintenance responsibilities
- If issue affects common areas or shared systems, emphasize HOA's exclusive control and liability
- Mention board meeting attendance rights and request for agenda inclusion if appropriate
- Reference any HOA inspection duties or architectural standards`,

    'property-mgmt': `## LANDLORD/PROPERTY MANAGEMENT GUIDANCE:
- Lead with warranty of habitability - this is the foundation of landlord obligations
- Reference state-specific habitability statutes and case law
- Cite repair timelines mandated by state law
- Mention rent withholding rights (if applicable in jurisdiction) without threatening to withhold
- Reference retaliation protections - landlord cannot retaliate for requesting repairs
- Mention constructive eviction if issue is severe enough to make unit uninhabitable
- Request access for inspection and remediation
- Document for potential rent abatement, repair-and-deduct, or escrow account`,

    'utility': `## UTILITY COMPANY GUIDANCE:
- Reference utility's service quality standards and customer bill of rights
- Cite Public Utilities Commission regulations
- Mention any service guarantee programs
- Reference utility's duty to provide safe, reliable service
- Request inspection of service lines, meters, or infrastructure
- Mention customer complaint process with PUC
- Reference any rate-payer protections
- If water quality issue: reference Safe Drinking Water Act compliance`,

    'local-govt': `## LOCAL GOVERNMENT GUIDANCE:
- Reference local housing codes, building codes, and health ordinances
- Request code enforcement inspection
- Cite specific municipal code sections if known
- Mention health department jurisdiction over health hazards
- Reference public records of complaints or violations at the property
- Request timeline for inspection and enforcement action
- Mention citizen complaint rights and appeal processes`,

    'state-agency': `## STATE AGENCY GUIDANCE:
- Reference the agency's statutory mandate and jurisdiction
- Cite relevant state environmental or health laws
- Request investigation and enforcement action
- Mention public health protection duty
- Reference any citizen complaint procedures
- Request testing, sampling, or inspection by agency
- Mention inter-agency coordination if multiple agencies have jurisdiction
- Reference any state superfund or remediation programs if applicable`,

    'federal-agency': `## FEDERAL AGENCY GUIDANCE:
- Reference specific federal statute (Clean Air Act, Safe Drinking Water Act, etc.)
- Cite EPA regulations, HUD standards, or other federal rules
- Mention agency's enforcement authority
- Reference any federal grant funding that may include health/safety requirements
- Request investigation under agency's complaint process
- Cite national standards and how local situation violates them
- Mention coordination with state and local agencies`,

    'nonprofit': `## ADVOCACY/LEGAL AID GUIDANCE:
- Explain why you're seeking their help (legal representation, advocacy, testing, etc.)
- Provide comprehensive background on the issue
- Mention any community-wide or class-action potential
- Reference barriers to resolution (financial, power imbalance, etc.)
- Mention vulnerable populations affected (children, elderly, low-income, etc.)
- Request specific assistance: legal advice, representation, testing, advocacy, etc.
- Express willingness to participate in advocacy efforts or public education`
  };

  return guidance[recipient] || '';
}

function getToneGuidance(escalationLevel) {
  const tones = {
    initial: 'Friendly, professional, assumes good faith. Use phrases like "I wanted to bring to your attention," "I would appreciate," "Could you please."',
    professional: 'Professional, firm, direct. Use phrases like "I am writing to formally notify," "It is your responsibility to," "I expect action within."',
    formal: 'Formal, documented, serious. Use phrases like "This letter serves as formal notice," "You are in violation of," "I am documenting this complaint," "Failure to act will result in."',
    legal: 'Legal, final, consequential. Use phrases like "This is final notice," "I am prepared to pursue all legal remedies," "I will be filing complaints with," "You will be held liable for."'
  };
  return tones[escalationLevel] || tones.professional;
}

// Generate prompt for document analysis (water reports, warranties, etc.)
export function generateDocumentAnalysisPrompt(documentType, documentText, analysisGoals) {
  const prompts = {
    waterReport: `You are an expert water quality analyst with deep knowledge of EPA standards, health impacts, and treatment solutions. Analyze this water quality report with extreme thoroughness and provide actionable insights.

WATER QUALITY REPORT:
${documentText}

CRITICAL INSTRUCTIONS:
- Use PLAIN TEXT ONLY - absolutely NO markdown formatting (no **, no ###, no _, no backticks)
- Use the EXACT format shown below with EXACT section headers
- Include ALL detected contaminants, not just the concerning ones
- ALWAYS include verifiable sources (URLs, program names, specific regulations) so information can be double-checked
- Be extremely thorough and detailed
- Include specific website URLs (like EPA.gov, utility websites, etc.) in recommendations

Provide your analysis in this EXACT format:

OVERALL ASSESSMENT:
[Write 2-3 sentences summarizing overall water safety, noting any violations, and mentioning utility programs. Plain text only.]

EPA VIOLATIONS:
- [Violation 1 description]
- [Violation 2 description]
[Continue for all violations. Use simple dashes, not bullet points or other symbols]

AREAS OF CONCERN:
- [Concern 1: Contaminant name - detected value compared to limit]
- [Concern 2: Contaminant name - detected value compared to limit]
[Continue for all concerns. Plain text with dashes only.]

DETECTED CONTAMINANTS (##):
[Replace ## with the actual count. Then list EVERY contaminant in this exact format:]

CONTAMINANT: Lead
DETECTED: 4.0 ppb (90th percentile)
EPA LIMIT: 15 ppb (action level)
HEALTH EFFECTS: Causes developmental delays in children, kidney problems, reproductive issues in adults
SEVERITY: MEDIUM

---

CONTAMINANT: Fluoride
DETECTED: 585-675 ppb average
EPA LIMIT: 4,000 ppb
HEALTH EFFECTS: Prevents tooth decay at optimal levels; can cause fluorosis above 2,000 ppb
SEVERITY: LOW

---

[Continue this EXACT format for EVERY single detected contaminant. Use --- as separator between each contaminant. NO other formatting.]

FILTER RECOMMENDATIONS:

Lead -> NSF-certified lead removal pitcher filter or under-sink system
Lead detected above action level at some sites; filters provide additional protection
Cost: $20-50 for pitcher filters, $200-500 for under-sink systems

Chlorine/Disinfection Byproducts -> Activated carbon filter (pitcher, faucet-mount, or under-sink)
Reduces chlorine taste/odor and helps lower trihalomethanes and haloacetic acids
Cost: $15-30 for pitcher, $30-100 for faucet-mount, $100-300 for under-sink

[Continue for each relevant contaminant. Plain text only, use -> for arrows]

RECOMMENDED ACTIONS:
1. Check if you have a lead service line using the utility's interactive map - Source: Denver Water at denverwater.org/lead or call 303-893-2444
2. Request a free lead test kit if concerned about lead levels - Source: EPA Safe Drinking Water Hotline at 800-426-4791 or water.epa.gov/drink
3. Flush cold water for 5 minutes if water hasn't been used for several hours - Source: CDC Lead Prevention at cdc.gov/lead
4. Replace plumbing fixtures manufactured before 2014 with lead-free components - Source: EPA Lead and Copper Rule at epa.gov/dwreginfo/lead-and-copper-rule
[Continue numbering. ALWAYS include verifiable sources with actual URLs, phone numbers, or specific program names. Make sources as specific as possible.]

ASSISTANCE PROGRAMS:
- Lead Reduction Program: Free replacement of lead service lines with copper, free water filters for affected customers - Contact: denverwater.org/lead or 303-893-2444
- Enhanced Water Treatment: pH adjustment and corrosion control to minimize lead leaching - Contact: Water Quality at denverwater.org/water-quality
- Free Lead Testing: Customers can request free lead test kits - Contact: 303-893-2444 or denverwater.org/leadtest
- Water Quality Monitoring: Over 145,000 tests conducted annually across the system - Source: 2025 Water Quality Report at denverwater.org/ccr
[Continue with dashes. Include specific contact information (phone, website URL, email) for each program. Make it easy for users to access and verify these programs.]

DISCLAIMER:
[Write disclaimer about analysis source, individual results varying by location, and contact information. Plain text.]

REGULATORY CITATIONS:
- Safe Drinking Water Act, 42 U.S.C. Section 300f et seq.
- EPA Lead and Copper Rule, 40 CFR 141.80-141.91
- [Additional relevant citations]
[Use simple dashes. Plain text only.]

IMPORTANT: Use PLAIN TEXT throughout. No asterisks, no hashtags, no underscores, no backticks. This is critical for proper display.`,

    warranty: `You are an expert in consumer warranty law and product warranties. Analyze the following warranty document and provide:

1. **Coverage Summary**: What is covered, coverage period, and conditions
2. **Exclusions**: What is NOT covered and why
3. **Claim Process**: How to file a claim and required documentation
4. **Remedies**: What remedies are available (repair, replacement, refund)
5. **Legal Rights**: Consumer protection rights beyond the warranty (implied warranties, lemon laws, etc.)
6. **Time Sensitivity**: Any time limits for claims or required actions
7. **Recommended Actions**: Steps to preserve warranty rights and document issues

## Warranty Document:
${documentText}

Provide analysis that helps the consumer understand their rights and how to effectively assert warranty claims.`,

    testReport: `You are an expert in environmental health testing and interpretation of laboratory results. Analyze the following test report:

1. **Test Results Summary**: What was tested and what were the findings
2. **Regulatory Comparison**: How do results compare to EPA, OSHA, HUD, or state standards
3. **Health Implications**: What do these results mean for occupant health
4. **Action Levels**: Are any results at or above regulatory action levels
5. **Follow-up Testing**: What additional testing is recommended
6. **Citations**: Provide specific regulatory standards violated or approached
7. **Remediation Priorities**: Rank issues by health risk and regulatory urgency

## Test Report:
${documentText}

${analysisGoals ? `\n## Specific Analysis Goals:\n${analysisGoals}` : ''}

Provide comprehensive analysis suitable for including in advocacy emails or regulatory complaints.`,

    lease: `You are an expert in landlord-tenant law and residential lease agreements. Analyze the following lease document:

1. **Maintenance Responsibilities**: Who is responsible for what maintenance and repairs
2. **Habitability Provisions**: What standards or conditions are promised
3. **Dispute Resolution**: Process for resolving maintenance disputes
4. **Notice Requirements**: How to properly notify landlord of issues
5. **Tenant Remedies**: What remedies are available for breach
6. **Illegal Provisions**: Any provisions that may be unenforceable under state law
7. **Strategic Advice**: How to leverage lease terms in advocacy

## Lease Agreement:
${documentText}

Provide analysis that helps tenant understand their rights and obligations under the lease and applicable law.`
  };

  return prompts[documentType] || prompts.testReport;
}

// Generate subject lines based on context
export function generateSubjectLine(issueType, escalationLevel, location) {
  const urgencyMarkers = {
    initial: '',
    professional: 'Follow-Up: ',
    formal: 'Formal Complaint: ',
    legal: 'FINAL NOTICE: '
  };

  const issueLabels = {
    'air-quality': 'Air Quality and Mold Issue',
    'water-quality': 'Water Contamination Issue',
    'hvac-ventilation': 'HVAC and Ventilation Issue',
    'lead-asbestos': 'Hazardous Materials Issue',
    'radon': 'Radon Detection Issue',
    'carbon-monoxide': 'Carbon Monoxide Issue',
    'pest-infestation': 'Pest Infestation Issue',
    'structural': 'Structural Safety Issue',
    'noise-pollution': 'Excessive Noise Issue',
    'utility-access': 'Utility Service Issue',
    'electromagnetic': 'EMF Exposure Issue'
  };

  const marker = urgencyMarkers[escalationLevel] || '';
  const issue = issueLabels[issueType] || 'Property Issue';
  const loc = location ? ` at ${location}` : '';

  return `${marker}${issue}${loc}`;
}

export default {
  systemPrompt,
  generateEmailPrompt,
  generateDocumentAnalysisPrompt,
  generateSubjectLine
};
