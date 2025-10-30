// Automated Claim Filing Assistant for HomeLLM
// Helps customers file claims and applications for warranties, insurance, rebates, and government programs
// Similar to DoNotPay's automated claim filing

import * as API from './api-integration';

// Generate home warranty claim
export async function generateWarrantyClaim(apiKey, claimData) {
  const {
    warrantyProvider,
    accountNumber,
    customerName,
    customerPhone,
    customerEmail,
    serviceAddress,
    issueDescription,
    affectedItem, // "HVAC", "Water heater", etc.
    issueDate,
    urgency, // "Emergency", "Urgent", "Standard"
    photos,
    preferredServiceDate,
  } = claimData;

  const systemPrompt = `You are an expert at filing home warranty claims. You know how to describe issues in ways that maximize approval chances and minimize denials.`;

  const userPrompt = `Generate a complete home warranty claim submission:

**WARRANTY INFORMATION**
Provider: ${warrantyProvider}
Account/Policy Number: ${accountNumber}

**CUSTOMER INFORMATION**
Name: ${customerName}
Phone: ${customerPhone}
Email: ${customerEmail}
Service Address: ${serviceAddress}

**ISSUE INFORMATION**
Affected Item: ${affectedItem}
Issue Description: ${issueDescription}
Date Issue Started: ${issueDate}
Urgency: ${urgency}
Preferred Service Date: ${preferredServiceDate || 'As soon as possible'}

Generate:

## 1. CLAIM DESCRIPTION (for warranty company)
Write a clear, professional description that:
- Focuses on covered issues (not maintenance)
- Uses terminology from warranty contract
- Emphasizes sudden failure (not gradual wear)
- Mentions safety concerns if applicable
- Avoids words that trigger denials ("old", "dirty filter", "maintenance")

Example good phrasing:
- "System stopped functioning" NOT "System is old"
- "Sudden loss of cooling" NOT "Gradually getting worse"
- "No hot water" NOT "Water heater needs maintenance"

## 2. PHONE SCRIPT
What to say when calling to file claim:
- Opening statement
- Key information to provide
- What NOT to mention
- How to handle common questions
- Push for faster service if emergency

## 3. ONLINE CLAIM FORM ANSWERS
If filing online, provide:
- Exact wording for "Issue Description" field
- Category selection recommendations
- Urgency level to select
- Any optional fields to complete

## 4. DOCUMENTATION CHECKLIST
What to have ready:
- Photos needed
- Model/serial numbers
- Purchase date (if asked)
- Previous service records (if helpful)

## 5. SERVICE TECHNICIAN COMMUNICATION
What to tell the technician:
- Explain issue clearly
- Mention safety concerns
- Don't speculate on cause
- Ask for detailed diagnosis in writing

## 6. DENIAL PREVENTION
Common denial reasons and how to avoid:
- Lack of maintenance → Emphasize sudden failure
- Pre-existing condition → Clear date of onset
- Excluded item → Verify coverage first
- Inspection reveals different issue → Stick to observable symptoms

## 7. APPEAL TEMPLATE (if denied)
Pre-written appeal letter template

## 8. EXPECTED TIMELINE
- When to expect contractor contact
- When to expect service
- When to follow up

Provide all content ready to copy/paste.`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, photos || []);
    return {
      success: true,
      claimPackage: result.email,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Generate homeowners insurance claim
export async function generateInsuranceClaim(apiKey, claimData) {
  const {
    insuranceCarrier,
    policyNumber,
    customerName,
    customerPhone,
    customerEmail,
    propertyAddress,
    lossDate,
    lossType, // "Water damage", "Storm damage", etc.
    damageDescription,
    estimatedLoss,
    policeReport, // if applicable
    emergencyRepairs,
    photos,
    witnesses,
  } = claimData;

  const systemPrompt = `You are a licensed public insurance adjuster. You know how to file insurance claims that get paid fairly and quickly.`;

  const userPrompt = `Generate a complete homeowners insurance claim submission:

**POLICY INFORMATION**
Insurance Carrier: ${insuranceCarrier}
Policy Number: ${policyNumber}

**INSURED INFORMATION**
Name: ${customerName}
Phone: ${customerPhone}
Email: ${customerEmail}
Property Address: ${propertyAddress}

**LOSS INFORMATION**
Date of Loss: ${lossDate}
Type of Loss: ${lossType}
Description: ${damageDescription}
Estimated Loss: ${estimatedLoss || 'To be determined'}
${policeReport ? `Police Report: ${policeReport}` : ''}
${emergencyRepairs ? `Emergency Repairs Needed: ${emergencyRepairs}` : ''}

Generate:

## 1. FIRST NOTICE OF LOSS (FNOL)
Complete claim report including:
- Date and time of incident
- Cause of loss
- Extent of damage
- Affected areas/items
- Immediate actions taken
- Whether property is habitable

Use language that:
- Triggers coverage (not exclusions)
- Emphasizes "sudden and accidental"
- Documents all damage thoroughly
- Mentions code upgrade needs (ordinance/law coverage)

## 2. PHONE SCRIPT FOR CLAIM FILING
What to say when calling insurer:
- How to describe incident
- What information they'll ask for
- What NOT to say (never admit fault, don't speculate, don't minimize)
- How to request emergency advance

## 3. DAMAGE DOCUMENTATION GUIDE
How to document everything:
- Photo/video requirements (before repairs)
- What to photograph (wide shots, close-ups, serial numbers)
- Itemized damage list
- Contents inventory
- Emergency repair receipts to save

## 4. STATEMENT OF LOSS
Written account of incident for adjuster

## 5. CONTENTS CLAIM (if applicable)
Room-by-room inventory:
- Item descriptions
- Purchase dates (estimate if unknown)
- Replacement cost estimates
- Proof of ownership (photos, receipts, credit card statements)

## 6. ADDITIONAL LIVING EXPENSES (ALE)
If displaced from home:
- How to claim hotel, meals, etc.
- What receipts to save
- How long coverage lasts

## 7. CONTRACTOR ESTIMATES
Guidance on:
- Getting 2-3 estimates
- What estimates should include
- How detailed to be
- Choosing contractor

## 8. ADJUSTER MEETING PREP
How to prepare for adjuster visit:
- What to show them
- What to say (and not say)
- What to request
- How to handle low offer

## 9. NEGOTIATION TACTICS
If settlement offer is too low:
- How to dispute valuation
- Request itemized breakdown
- Get independent appraisal
- Cite policy language

## 10. APPEAL PROCESS
If claim denied:
- Denial letter analysis
- Appeal letter template
- Additional evidence to gather
- When to hire public adjuster

## 11. IMPORTANT DEADLINES
- Report claim within X days
- File proof of loss within X days
- Cooperate with investigation
- Keep damaged items until adjuster sees

Provide complete claim package ready to submit.`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, photos || []);
    return {
      success: true,
      claimPackage: result.email,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Generate utility rebate application
export async function generateRebateApplication(apiKey, rebateData) {
  const {
    utilityName,
    rebateProgram,
    customerName,
    accountNumber,
    serviceAddress,
    equipmentPurchased,
    purchaseDate,
    purchasePrice,
    installerName,
    modelNumber,
    serialNumber,
    energyStarRating,
    invoice,
    beforePhoto,
    afterPhoto,
  } = rebateData;

  const systemPrompt = `You are an expert at utility rebate applications. You know exactly what documentation utilities require and how to maximize rebate amounts.`;

  const userPrompt = `Generate a complete utility rebate application:

**UTILITY INFORMATION**
Utility: ${utilityName}
Rebate Program: ${rebateProgram}
Customer Account: ${accountNumber}

**CUSTOMER INFORMATION**
Name: ${customerName}
Service Address: ${serviceAddress}

**EQUIPMENT INFORMATION**
Equipment: ${equipmentPurchased}
Purchase Date: ${purchaseDate}
Purchase Price: $${purchasePrice}
Installer: ${installerName}
Model Number: ${modelNumber}
Serial Number: ${serialNumber}
${energyStarRating ? `Energy Star Rating: ${energyStarRating}` : ''}

Generate:

## 1. REBATE APPLICATION FORM
Complete filled-out application including:
- All customer information
- Equipment specifications
- Purchase details
- Installer information
- Bank account for direct deposit (if applicable)

## 2. REQUIRED DOCUMENTATION CHECKLIST
✓ Itemized sales receipt/invoice
✓ Proof of payment
✓ Product model/serial number (photo)
✓ Energy Star certificate (if required)
✓ Installation certificate
✓ Before/after photos (if required)
✓ Utility account number verification
✓ W-9 form (for large rebates)

## 3. EQUIPMENT VERIFICATION
Details to extract from documentation:
- Exact model number matches eligible list
- SEER/EER/AFUE rating meets requirements
- Installation date within program period
- Proper disposal of old equipment (if required)

## 4. INSTALLER CERTIFICATION
What installer needs to provide:
- License number
- Certification that installation meets code
- Signature and date
- Contact information

## 5. MAXIMIZATION STRATEGIES
How to get maximum rebate:
- Stack utility + manufacturer rebates
- Combine with tax credits
- Apply for low-income enhanced rebates (if eligible)
- Bundle multiple upgrades for bonus incentives

## 6. SUBMISSION INSTRUCTIONS
- Where to submit (online portal vs. mail)
- Required format (PDF, photos, etc.)
- Submission deadline
- Confirmation process

## 7. FOLLOW-UP PROTOCOL
- When to expect processing
- How to check status
- Who to contact if delayed
- Resubmission process if rejected

## 8. COMMON REJECTION REASONS
How to avoid:
- Missing documentation
- Ineligible equipment model
- Installation outside program dates
- Incorrect form completion
- Missing signatures

## 9. APPEAL PROCESS
If application denied:
- Request detailed reason
- Gather additional documentation
- Resubmit with corrections
- Escalation contacts

Provide complete application package ready to submit.`;

  try {
    const result = await API.generateEmail(
      apiKey,
      systemPrompt,
      userPrompt,
      [invoice, beforePhoto, afterPhoto].filter(Boolean)
    );
    return {
      success: true,
      application: result.email,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Generate government program application
export async function generateGovernmentProgramApplication(apiKey, programData) {
  const {
    programName,
    programType, // "Weatherization", "LIHEAP", "Lead Abatement", etc.
    applicantName,
    address,
    householdSize,
    householdIncome,
    veteranStatus,
    seniorStatus,
    disabilityStatus,
    supportingDocuments,
  } = programData;

  const systemPrompt = `You are an expert in government assistance programs. You know how to complete applications correctly and maximize approval chances.`;

  const userPrompt = `Generate a complete government program application:

**PROGRAM**
Program: ${programName}
Type: ${programType}

**APPLICANT INFORMATION**
Name: ${applicantName}
Address: ${address}
Household Size: ${householdSize}
Annual Income: $${householdIncome}
${veteranStatus ? 'Veteran: Yes' : ''}
${seniorStatus ? 'Senior (60+): Yes' : ''}
${disabilityStatus ? 'Disability: Yes' : ''}

Generate:

## 1. ELIGIBILITY CONFIRMATION
- Income requirements: PASS/FAIL
- Household size qualification: PASS/FAIL
- Property ownership requirements: PASS/FAIL
- Other requirements: [list]

## 2. APPLICATION FORM COMPLETION
Complete all sections:
- Personal information
- Household composition
- Income documentation
- Property information
- Current energy/housing costs
- Special circumstances

## 3. REQUIRED DOCUMENTATION
✓ Proof of income (last 30 days of pay stubs OR tax return)
✓ Utility bills (last 3 months)
✓ Proof of property ownership OR lease
✓ Photo ID
✓ Social Security cards for all household members
✓ Proof of veteran status (DD-214)
✓ Disability documentation (if applicable)
✓ Birth certificates for dependents

## 4. INCOME CALCULATION
How to calculate qualifying income:
- Include: wages, SS, pension, unemployment, child support
- Exclude: SNAP, WIC, SSI, foster care payments
- Gross vs. net income
- Self-employment income calculation

## 5. PRIORITY SCORING
Factors that increase priority:
- Elderly household member (60+)
- Disabled household member
- Children under 6
- High energy burden (>6% of income)
- Health/safety issue
- Veteran status

## 6. SUBMISSION PROCESS
- Where to submit (office address, online portal)
- Required appointment (or walk-in hours)
- Processing timeline
- How to check status

## 7. INTERVIEW PREPARATION
If interview required:
- Questions they'll ask
- Documents to bring
- What to emphasize
- Rights during interview

## 8. BENEFIT SCOPE
What this program covers:
- Specific services/improvements
- Maximum benefit amount
- Timeline for service delivery
- Maintenance requirements

## 9. MULTIPLE PROGRAM STACKING
Other programs to apply for simultaneously:
- [List complementary programs]
- How to apply for multiple
- Coordination between agencies

## 10. DENIAL PREVENTION
Common reasons applications are denied:
- Incomplete documentation
- Income too high
- Property ineligible
- Already received services
- How to address each

## 11. APPEAL RIGHTS
If denied:
- Right to appeal
- Appeal deadline
- Appeal process
- Additional documentation to provide

Provide complete application package with all forms and documentation guidance.`;

  try {
    const result = await API.generateEmail(
      apiKey,
      systemPrompt,
      userPrompt,
      supportingDocuments || []
    );
    return {
      success: true,
      application: result.email,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Generate dispute letter for denied claim/application
export async function generateDisputeLetter(apiKey, disputeData) {
  const {
    organization, // warranty company, insurer, utility, etc.
    claimNumber,
    denialReason,
    policyLanguage, // relevant contract/policy language
    supportingEvidence,
    customerName,
    accountNumber,
  } = disputeData;

  const systemPrompt = `You are an expert at writing dispute and appeal letters. You know how to cite policy language, regulations, and leverage consumer rights to overturn denials.`;

  const userPrompt = `Generate a formal dispute/appeal letter:

**ORGANIZATION**: ${organization}
**CLAIM/APPLICATION NUMBER**: ${claimNumber}
**DENIAL REASON STATED**: ${denialReason}
**CUSTOMER**: ${customerName}
**ACCOUNT**: ${accountNumber}

${policyLanguage ? `**RELEVANT POLICY LANGUAGE**: ${policyLanguage}` : ''}
${supportingEvidence ? `**SUPPORTING EVIDENCE**: ${supportingEvidence}` : ''}

Generate:

## 1. FORMAL DISPUTE LETTER

Structure:
- Professional letterhead format
- Reference to claim/application number
- Clear statement of dispute
- Point-by-point rebuttal of denial reasons
- Citation of policy/program language
- Reference to regulations (if applicable)
- Request for specific remedy
- Deadline for response
- Next steps if not resolved

Tone:
- Professional but firm
- Cite specific contract language
- Use "I am entitled to" not "I believe"
- Reference consumer protection laws
- Mention regulatory complaints if applicable

## 2. KEY ARGUMENTS

Address each denial reason:
- Quote policy language that supports coverage
- Provide evidence contradicting denial
- Cite similar approved claims (if known)
- Reference industry standards
- Note any bad faith indicators

## 3. SUPPORTING DOCUMENTATION

Documents to attach:
- Original claim documentation
- Policy/contract pages showing coverage
- Expert opinions (if applicable)
- Photos/evidence
- Comparable claims examples
- Regulatory guidance

## 4. REGULATORY LEVERAGE

Regulations to reference:
- State insurance regulations
- Consumer protection laws
- Federal programs requirements
- Industry standards
- Bad faith statutes

## 5. ESCALATION PATH

If dispute fails:
- State insurance commissioner complaint
- BBB complaint
- Small claims court
- State attorney general
- Federal agency (FTC, CFPB, HUD, etc.)
- Social media/reviews (mention as last resort)

## 6. TIMELINE

- Demand response within 15-30 days
- Note statutory deadlines if applicable
- State intention to escalate if no response

## 7. PROFESSIONAL LANGUAGE TEMPLATES

Use phrases like:
- "I am writing to formally dispute the denial of claim #..."
- "The policy language clearly states..."
- "I am entitled to coverage under Section..."
- "I request immediate reconsideration of this claim."
- "I am prepared to file a complaint with [regulatory body]."
- "The denial contradicts the explicit terms of the policy."

Generate complete letter ready to send via certified mail.`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);
    return {
      success: true,
      disputeLetter: result.email,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Track claim status and automate follow-ups
export function generateFollowUpSchedule(claimType, filedDate) {
  const schedule = [];
  const filed = new Date(filedDate);

  switch (claimType) {
    case 'warranty':
      schedule.push({
        date: new Date(filed.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
        action: 'Confirm claim received and contractor assigned',
        script:
          'I filed a claim on [date] (#[claim number]). Can you confirm it was received and when a contractor will contact me?',
      });
      schedule.push({
        date: new Date(filed.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week
        action: 'Follow up if no contractor contact',
        script:
          'It has been one week since I filed claim #[number]. No contractor has contacted me. Please escalate this to a supervisor.',
      });
      break;

    case 'insurance':
      schedule.push({
        date: new Date(filed.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
        action: 'Confirm adjuster assigned',
        script:
          'I filed claim #[number] on [date]. Can you confirm an adjuster has been assigned and when they will contact me?',
      });
      schedule.push({
        date: new Date(filed.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
        action: 'Request status update',
        script:
          'I filed claim #[number] two weeks ago. What is the status? When can I expect an initial settlement offer?',
      });
      schedule.push({
        date: new Date(filed.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
        action: 'Escalate to supervisor/file complaint',
        script:
          'My claim filed 30 days ago has not been resolved. I request immediate escalation and will file a complaint with the state insurance commissioner if not resolved within 5 business days.',
      });
      break;

    case 'rebate':
      schedule.push({
        date: new Date(filed.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week
        action: 'Confirm application received',
        script:
          'I submitted a rebate application on [date] (confirmation #[number]). Can you confirm it was received and is being processed?',
      });
      schedule.push({
        date: new Date(filed.getTime() + 45 * 24 * 60 * 60 * 1000), // 6 weeks
        action: 'Request status update',
        script:
          'I submitted a rebate application 6 weeks ago. What is the status? When can I expect payment?',
      });
      break;

    case 'government':
      schedule.push({
        date: new Date(filed.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
        action: 'Confirm application received',
        script:
          'I submitted an application for [program] on [date]. Can you confirm it was received and what the next steps are?',
      });
      schedule.push({
        date: new Date(filed.getTime() + 60 * 24 * 60 * 60 * 1000), // 2 months
        action: 'Request status update',
        script: 'I applied for [program] two months ago. What is the status of my application?',
      });
      break;
  }

  return schedule;
}

export default {
  generateWarrantyClaim,
  generateInsuranceClaim,
  generateRebateApplication,
  generateGovernmentProgramApplication,
  generateDisputeLetter,
  generateFollowUpSchedule,
};
