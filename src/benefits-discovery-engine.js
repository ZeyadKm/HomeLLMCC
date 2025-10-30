// Benefits Discovery Engine for HomeLLM
// Automatically discovers and helps claim benefits from warranties, insurance, HOA, and government programs
// Similar to DoNotPay's benefits finder

import * as API from './api-integration';

// Comprehensive benefits categories
export const benefitsCategories = {
  homeWarranty: {
    commonProviders: [
      'American Home Shield',
      'Choice Home Warranty',
      'Select Home Warranty',
      'Total Home Protection',
      'Cinch Home Services',
      'First American Home Warranty',
      'Old Republic Home Protection',
      'Liberty Home Guard',
      '2-10 Home Buyers Warranty',
    ],
    commonCoverage: [
      'HVAC systems',
      'Plumbing',
      'Electrical',
      'Appliances',
      'Water heater',
      'Garage door opener',
      'Ceiling fans',
      'Built-in microwave',
      'Dishwasher',
      'Oven/range',
      'Refrigerator',
      'Washer/dryer',
    ],
    oftenMissed: [
      'Annual HVAC tune-up (often included but unused)',
      'Recall check service',
      'Guest service line coverage',
      'Code violation coverage',
      'Permit fee reimbursement',
      'Home energy audit',
      'Smart home device coverage',
    ],
  },
  homeInsurance: {
    oftenMissed: [
      'Water damage from appliance leaks',
      'Mold coverage (if sudden)',
      'Additional living expenses during repairs',
      'Ordinance or law coverage (code upgrades)',
      'Sewer/drain backup coverage',
      'Service line protection',
      'Identity theft protection',
      'Credit card/fund transfer fraud',
      'Refrigerated food spoilage',
      'Tree removal after storm',
      'Loss assessment (condo/HOA)',
      'Replacement cost vs actual cash value',
    ],
    claimTriggers: [
      'Water heater leak',
      'Pipe burst',
      'Roof leak',
      'Appliance failure',
      'Storm damage',
      'Theft',
      'Vandalism',
      'Fire/smoke',
    ],
  },
  healthInsurance: {
    homeHealthBenefits: [
      'Home health aide services',
      'Durable medical equipment',
      'Home oxygen',
      'CPAP machine',
      'Air purifiers (with prescription)',
      'Dehumidifiers (for mold allergies)',
      'Allergy testing and treatment',
      'Asthma management programs',
      'Environmental illness evaluation',
      'Indoor air quality assessment (with diagnosis)',
      'Water filtration (with medical necessity)',
      'Lead poisoning testing and treatment',
    ],
  },
  government: {
    federal: [
      'Weatherization Assistance Program (WAP)',
      'Low Income Home Energy Assistance (LIHEAP)',
      'Lead-Based Paint Hazard Reduction Program',
      'HUD Section 504 Home Repair Grants',
      'USDA Rural Development Housing Repair Loans',
      'VA Home Improvement Grants',
      'Energy Efficiency Tax Credits (IRA)',
      'Residential Clean Energy Credit (Solar, etc.)',
    ],
    state: [
      'State weatherization programs',
      'Energy efficiency rebates',
      'Solar incentives',
      'Water conservation rebates',
      'Lead abatement assistance',
      'Radon mitigation grants',
      'Home accessibility modifications',
    ],
    local: [
      'Municipal utility rebates',
      'Property tax exemptions (senior, veteran, disability)',
      'Housing rehabilitation programs',
      'First-time homebuyer assistance',
      'Historic home preservation grants',
    ],
  },
  hoaFees: {
    oftenMissed: [
      'Common area maintenance (landscaping, pool, gym)',
      'Master insurance coverage',
      'Pest control services',
      'Trash/recycling service',
      'Water/sewer (in some HOAs)',
      'Security services',
      'Snow removal',
      'Architectural review',
      'Legal/mediation services',
      'Reserve fund (for major repairs)',
      'Clubhouse/amenity rental',
      'Dispute resolution',
      'Parking space allocation',
    ],
  },
  manufacturer: {
    warranties: [
      'Appliance manufacturer warranties (often 1-5 years)',
      'HVAC equipment warranties (5-10 years)',
      'Water heater warranties (6-12 years)',
      'Roof warranties (10-50 years)',
      'Window warranties (10-20 years)',
      'Siding warranties (lifetime)',
      'Extended warranties on electronics',
    ],
    recalls: [
      'CPSC product recalls',
      'Appliance recalls',
      'HVAC system recalls',
      'Water heater recalls',
      'Smoke detector recalls',
    ],
  },
};

// Analyze home warranty coverage and find unused benefits
export async function analyzeHomeWarranty(apiKey, warrantyDocument, homeIssue = null) {
  const systemPrompt = `You are an expert in home warranty contracts and claims. You know how to maximize warranty benefits and identify coverage that customers don't realize they have.`;

  const userPrompt = `Analyze this home warranty contract and identify all available benefits:

${warrantyDocument ? `**Warranty Document**: See attached` : '**Warranty Provider**: [To be specified]'}
${homeIssue ? `\n**Current Issue**: ${homeIssue}` : ''}

Provide:

## 1. COVERAGE SUMMARY
- What's covered (systems and appliances)
- Coverage limits (per item, annual max)
- Service call fee/deductible
- Contract period

## 2. OFTEN-MISSED BENEFITS
Identify benefits customers typically don't know about or use:
- Free annual HVAC tune-up?
- Recall check service?
- Multi-trade visit discount?
- Refrigerant top-off coverage?
- Code violation coverage?
- Permit fees covered?
- Emergency service availability?

## 3. CURRENT ISSUE COVERAGE (if issue provided)
- Is this issue covered? YES/NO
- Coverage details and limits
- Any exclusions that might apply
- Deductible/service fee
- How to file claim

## 4. PROACTIVE MAINTENANCE
What free or discounted maintenance should customer request:
- Annual HVAC check
- Appliance inspections
- System evaluations

## 5. CLAIM STRATEGY
- When to file warranty claim vs. out-of-pocket repair
- How to maximize coverage
- Common denial reasons to avoid
- Documentation to gather

## 6. UNDERUTILIZED COVERAGE
- Coverage you're paying for but not using
- Services to schedule before contract renewal
- Seasonal maintenance opportunities

## 7. EXCLUSIONS & GAPS
- What's NOT covered that customer should know
- Recommend supplemental coverage or insurance

## 8. MONEY-SAVING TIPS
- How to reduce service fees
- Best time to call for service
- Multi-item service strategies

Provide specific, actionable recommendations.`;

  try {
    const result = await API.generateEmail(
      apiKey,
      systemPrompt,
      userPrompt,
      warrantyDocument ? [warrantyDocument] : []
    );
    return {
      success: true,
      analysis: result.email,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Discover home insurance benefits and potential claims
export async function analyzeHomeInsurance(apiKey, policyDocument, homeIssue = null) {
  const systemPrompt = `You are a licensed public insurance adjuster and consumer advocate. You specialize in helping homeowners understand their coverage and maximize legitimate claims.`;

  const userPrompt = `Analyze this homeowners insurance policy and identify all coverage and claim opportunities:

${policyDocument ? `**Policy Document**: See attached` : '**Insurance Carrier**: [To be specified]'}
${homeIssue ? `\n**Current Issue**: ${homeIssue}` : ''}

Provide:

## 1. COVERAGE OVERVIEW
- Dwelling coverage amount
- Personal property coverage
- Liability coverage
- Additional living expenses (ALE)
- Deductibles

## 2. OFTEN-MISSED COVERAGES
Identify coverages customers don't realize they have:
- Ordinance or law coverage (code upgrades required by city)
- Service line coverage (water/sewer/electrical lines to street)
- Food spoilage (after power outage)
- Tree removal after storm
- Debris removal
- Loss assessment (for condos/HOAs)
- Identity theft protection
- Credit card fraud coverage

## 3. CURRENT ISSUE COVERAGE (if provided)
- Is this issue covered? YES/MAYBE/NO
- Which part of policy applies
- Coverage limits
- Deductible
- What evidence to document
- How to file claim

## 4. POTENTIAL CLAIMS CUSTOMER MIGHT NOT REALIZE
Based on common home issues:
- Old water heater starting to leak → could be covered
- Slow pipe leak causing damage → might be covered
- Storm damage to roof → covered
- Mold from sudden water event → often covered
- Code upgrade required by city → ordinance/law coverage

## 5. CLAIMS STRATEGY
- When to file vs. pay out-of-pocket
- How to document damage (photos, estimates)
- What NOT to say to adjuster
- How to appeal denied claims
- When to hire public adjuster

## 6. ENDORSEMENTS & RIDERS
- Optional coverage customer might want
- Water backup coverage (if not included)
- Scheduled personal property (valuables)
- Earthquake/flood (separate policies)

## 7. DISCOUNT OPPORTUNITIES
- Security system discount
- Multi-policy discount
- New roof discount
- Wind mitigation features
- Claims-free discount
- Pay-in-full discount

## 8. PREVENTIVE MEASURES TO MAINTAIN COVERAGE
- Maintain documentation
- Regular home maintenance
- Security measures
- Update policy for renovations

## 9. RED FLAGS & EXCLUSIONS
- What's NOT covered
- Maintenance-related exclusions
- Wear and tear exclusions

Provide specific guidance and claim potential estimates.`;

  try {
    const result = await API.generateEmail(
      apiKey,
      systemPrompt,
      userPrompt,
      policyDocument ? [policyDocument] : []
    );
    return {
      success: true,
      analysis: result.email,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Discover health insurance benefits related to home health
export async function analyzeHealthInsuranceBenefits(
  apiKey,
  healthCondition,
  homeEnvironmentIssue
) {
  const systemPrompt = `You are a healthcare benefits specialist and environmental health expert. You know how to connect home environmental issues to health insurance benefits.`;

  const userPrompt = `Identify health insurance benefits related to this home health situation:

**Health Condition**: ${healthCondition}
**Home Environment Issue**: ${homeEnvironmentIssue}

Analyze:

## 1. COVERED BENEFITS
What health insurance might cover:
- Doctor visits for environmental illness evaluation
- Allergy testing related to home environment
- Asthma management programs
- Pulmonologist consultations
- Environmental medicine specialists
- Occupational/environmental health clinics

## 2. DURABLE MEDICAL EQUIPMENT (DME)
Equipment that might be covered:
- Air purifiers (with medical necessity letter)
- Dehumidifiers (for mold allergies)
- HEPA vacuum (for asthma)
- Hypoallergenic bedding (sometimes)
- Peak flow meters (asthma)
- Nebulizers

## 3. HOME HEALTH SERVICES
- Home health aide (if medically necessary)
- Nursing visits
- Home safety evaluations

## 4. PREVENTIVE CARE
- Indoor air quality assessments (rare, but some plans)
- Lead testing for children (covered under preventive)
- Environmental health screening

## 5. MEDICAL NECESSITY DOCUMENTATION
How to get coverage:
- What doctor needs to document
- ICD-10 codes to reference
- Letter of medical necessity template
- Prior authorization process

## 6. WATER FILTRATION COVERAGE
- HSA/FSA eligible expenses
- Medical necessity for immune-compromised
- Prescription requirements

## 7. TAX DEDUCTIONS
Even if not covered by insurance:
- Medical expense deductions (> 7.5% AGI)
- Home modifications for medical reasons
- Environmental illness treatment costs

## 8. ACTION PLAN
1. Schedule appropriate doctor appointments
2. Get diagnoses documented
3. Request prescriptions/letters of necessity
4. Submit claims with proper documentation
5. Appeal denials with medical evidence

Provide specific CPT codes, ICD-10 codes, and insurance terminology.`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);
    return {
      success: true,
      benefits: result.email,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Discover government assistance programs
export async function findGovernmentPrograms(apiKey, customerProfile) {
  const {
    address,
    city,
    state,
    zipCode,
    householdIncome,
    householdSize,
    homeOwnershipStatus, // owner/renter
    veteranStatus,
    seniorStatus,
    disabilityStatus,
    homeIssue,
  } = customerProfile;

  const systemPrompt = `You are an expert in government assistance programs, grants, and subsidies. You know how to match people with programs they qualify for but don't know about.`;

  const userPrompt = `Identify all government programs this customer may qualify for:

**Location**: ${city}, ${state} ${zipCode}
**Income**: ${householdIncome} (household of ${householdSize})
**Status**: ${homeOwnershipStatus}${veteranStatus ? ', Veteran' : ''}${seniorStatus ? ', Senior' : ''}${disabilityStatus ? ', Disability' : ''}
${homeIssue ? `**Current Issue**: ${homeIssue}` : ''}

Find ALL applicable programs:

## FEDERAL PROGRAMS

### Energy Assistance
- LIHEAP (Low Income Home Energy Assistance)
- Weatherization Assistance Program (WAP)
- Emergency energy assistance

### Housing Programs
- HUD Section 504 Home Repair Grants (seniors)
- HUD Title I Home Improvement Loans
- USDA Rural Development Housing Loans
- FHA 203(k) Rehabilitation Loans

### Health & Safety
- EPA Lead-Based Paint Hazard Reduction Program
- HUD Lead Hazard Control Grant Program
- CDC Healthy Homes Programs

### Veterans
- VA Home Improvement Grants
- VA Specially Adapted Housing (SAH) Grant
- VA Home Modifications

### Tax Benefits
- Residential Clean Energy Credit (solar, heat pumps)
- Energy Efficient Home Improvement Credit
- Mortgage Interest Deduction

## STATE PROGRAMS (${state})
- State-specific weatherization
- State energy efficiency rebates
- State solar incentives
- State lead abatement programs
- State housing rehabilitation
- State senior/veteran property tax exemptions

## LOCAL PROGRAMS (${city})
- Municipal utility rebates
- Local housing rehabilitation
- City weatherization programs
- Local lead abatement assistance

## INCOME-BASED ELIGIBILITY
Based on income of ${householdIncome}:
- Programs likely eligible for (list)
- Programs possibly eligible for (list)
- Income limits for each program

## APPLICATION GUIDANCE
For each program:
1. Eligibility requirements
2. Application process
3. Required documentation
4. Contact information (phone, website)
5. Processing time
6. Benefit amount/value

## PRIORITY RECOMMENDATIONS
Rank programs by:
1. Highest value
2. Easiest to qualify
3. Quickest processing
4. Address customer's current issue

Provide comprehensive list with specific contact info.`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);
    return {
      success: true,
      programs: result.email,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Analyze HOA fees and discover unused amenities/services
export async function analyzeHOABenefits(apiKey, hoaDocuments, monthlyFee) {
  const systemPrompt = `You are an HOA expert and consumer advocate. You help homeowners understand what they're paying for and maximize the value of their HOA fees.`;

  const userPrompt = `Analyze what this homeowner gets for their HOA fees:

**Monthly HOA Fee**: $${monthlyFee}
**HOA Documents**: ${hoaDocuments ? 'See attached' : 'Not provided'}

Identify:

## 1. WHAT YOU'RE PAYING FOR
Break down typical HOA fee allocation:
- Common area maintenance (landscaping, pool, etc.)
- Master insurance policy
- Reserve fund
- Management fees
- Utilities (if any)
- Amenities
- Services

## 2. OFTEN-MISSED BENEFITS
Services/amenities homeowners forget they have:
- Pool/spa/gym access
- Clubhouse rental (free or discounted)
- Tennis/basketball courts
- Playground equipment
- Pest control services (common areas)
- Landscape services (sometimes includes front yards)
- Trash/recycling service
- Security patrol
- Snow removal
- Parking spaces
- Storage units
- Architectural review (free design review)
- Legal services (dispute mediation)
- Newsletter/directory

## 3. MASTER INSURANCE POLICY
What's covered by HOA's master policy:
- Building exterior
- Roof (in some cases)
- Common structures
- Liability in common areas
- Directors & Officers insurance
→ This reduces your personal insurance needs!

## 4. COST BREAKDOWN ANALYSIS
Is $${monthlyFee} a good value?
- Compare to similar communities
- Calculate value of amenities
- Compare to cost if paying separately

## 5. HOW TO MAXIMIZE VALUE
- Use amenities you're paying for
- Attend HOA meetings (have input)
- Request services you need
- Apply for architectural improvements
- Use clubhouse for events
- Participate in community programs

## 6. POTENTIAL SAVINGS
How HOA membership saves you money:
- Reduced homeowners insurance (master policy)
- Included services vs. paying separately
- Collective bargaining power for services
- Amenities vs. gym/pool memberships

## 7. RESERVE FUND
- What's in reserve fund
- When it's used (major repairs)
- Could avoid special assessments

## 8. REQUEST MORE VALUE
Services to request from HOA:
- Additional community events
- Improved amenities
- Better communication
- More frequent maintenance

Provide specific dollar value estimates where possible.`;

  try {
    const result = await API.generateEmail(
      apiKey,
      systemPrompt,
      userPrompt,
      hoaDocuments ? [hoaDocuments] : []
    );
    return {
      success: true,
      analysis: result.email,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Check for product recalls related to home appliances/systems
export async function checkProductRecalls(apiKey, homeAppliances) {
  const systemPrompt = `You are a consumer safety expert familiar with CPSC recalls and product safety issues. You help homeowners identify potentially dangerous products in their homes.`;

  const userPrompt = `Check for recalls and safety issues on these appliances/systems:

**Home Equipment**:
${homeAppliances}

Provide:

## 1. KNOWN RECALLS
For each item, check knowledge of:
- Recent recalls (last 5 years)
- Common safety issues
- Fire/injury hazards

## 2. HOW TO CHECK
- CPSC.gov recall search
- Manufacturer recall websites
- Product model number lookup

## 3. RECALL REMEDIES
What manufacturers typically offer:
- Free repair
- Free replacement
- Refund
- In-home repair service

## 4. PROACTIVE SAFETY CHECKS
Even without recall:
- Age-based replacement recommendations
- Safety inspection checklist
- Warning signs of failure

## 5. REGISTRATION IMPORTANCE
- Register products for recall notifications
- Where to register each product

Provide specific recall information if known, or guidance on checking.`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);
    return {
      success: true,
      recalls: result.email,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Generate comprehensive benefits audit report
export async function generateBenefitsAuditReport(apiKey, customerData) {
  const results = {
    homeWarranty: null,
    homeInsurance: null,
    healthInsurance: null,
    governmentPrograms: null,
    hoaBenefits: null,
    productRecalls: null,
    estimatedAnnualValue: 0,
    timestamp: new Date().toISOString(),
  };

  try {
    // Home warranty analysis
    if (customerData.homeWarranty) {
      results.homeWarranty = await analyzeHomeWarranty(
        apiKey,
        customerData.homeWarranty,
        customerData.currentIssue
      );
    }

    // Home insurance analysis
    if (customerData.homeInsurance) {
      results.homeInsurance = await analyzeHomeInsurance(
        apiKey,
        customerData.homeInsurance,
        customerData.currentIssue
      );
    }

    // Health insurance benefits
    if (customerData.healthCondition) {
      results.healthInsurance = await analyzeHealthInsuranceBenefits(
        apiKey,
        customerData.healthCondition,
        customerData.currentIssue
      );
    }

    // Government programs
    results.governmentPrograms = await findGovernmentPrograms(apiKey, customerData);

    // HOA benefits
    if (customerData.hoaFee) {
      results.hoaBenefits = await analyzeHOABenefits(
        apiKey,
        customerData.hoaDocuments,
        customerData.hoaFee
      );
    }

    // Product recalls
    if (customerData.appliances) {
      results.productRecalls = await checkProductRecalls(apiKey, customerData.appliances);
    }

    return {
      success: true,
      results: results,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      partialResults: results,
    };
  }
}

export default {
  analyzeHomeWarranty,
  analyzeHomeInsurance,
  analyzeHealthInsuranceBenefits,
  findGovernmentPrograms,
  analyzeHOABenefits,
  checkProductRecalls,
  generateBenefitsAuditReport,
  benefitsCategories,
};
