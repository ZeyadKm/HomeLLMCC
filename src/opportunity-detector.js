// Opportunity Detector for HomeLLM
// Proactively identifies money-saving opportunities, unclaimed benefits, and actionable improvements
// Combines all analysis modules to find hidden value

import * as UtilityAnalyzer from './utility-report-analyzer';
import * as BenefitsEngine from './benefits-discovery-engine';
import * as ClaimAssistant from './automated-claim-assistant';
import * as API from './api-integration';

// Comprehensive opportunity scan
export async function scanAllOpportunities(apiKey, customerProfile) {
  const {
    address,
    city,
    state,
    zipCode,
    homeOwnership, // "owner" or "renter"
    householdIncome,
    householdSize,
    propertyAge,
    homeDetails, // square footage, HVAC age, etc.

    // Utilities
    waterUtility,
    electricUtility,
    gasUtility,
    monthlyWaterBill,
    monthlyElectricBill,
    monthlyGasBill,

    // Coverage
    homeWarranty,
    homeWarrantyProvider,
    homeInsurance,
    homeInsuranceProvider,
    healthInsurance,

    // HOA
    hoaFee,
    hoaDocuments,

    // Current issues
    currentIssues, // Array of problems

    // Appliances
    appliances, // List of equipment
  } = customerProfile;

  const opportunities = {
    immediate: [], // Act now
    shortTerm: [], // Within 3 months
    longTerm: [], // Planning horizon
    totalEstimatedValue: 0,
    timestamp: new Date().toISOString(),
  };

  try {
    // 1. UTILITY OPPORTUNITIES
    if (waterUtility || electricUtility || gasUtility) {
      const utilityOpps = await detectUtilityOpportunities(apiKey, {
        waterUtility,
        electricUtility,
        gasUtility,
        address,
        zipCode,
        monthlyWaterBill,
        monthlyElectricBill,
        monthlyGasBill,
        homeDetails,
      });

      opportunities.immediate.push(...utilityOpps.immediate);
      opportunities.shortTerm.push(...utilityOpps.shortTerm);
      opportunities.totalEstimatedValue += utilityOpps.estimatedValue;
    }

    // 2. WARRANTY OPPORTUNITIES
    if (homeWarranty && currentIssues && currentIssues.length > 0) {
      const warrantyOpps = await detectWarrantyOpportunities(apiKey, {
        warrantyProvider: homeWarrantyProvider,
        currentIssues,
        appliances,
      });

      opportunities.immediate.push(...warrantyOpps.immediate);
      opportunities.totalEstimatedValue += warrantyOpps.estimatedValue;
    }

    // 3. INSURANCE OPPORTUNITIES
    if (homeInsurance && currentIssues) {
      const insuranceOpps = await detectInsuranceOpportunities(apiKey, {
        insuranceProvider: homeInsuranceProvider,
        currentIssues,
        propertyAge,
      });

      opportunities.immediate.push(...insuranceOpps.immediate);
      opportunities.totalEstimatedValue += insuranceOpps.estimatedValue;
    }

    // 4. GOVERNMENT PROGRAM OPPORTUNITIES
    const govOpps = await detectGovernmentOpportunities(apiKey, {
      address,
      city,
      state,
      zipCode,
      householdIncome,
      householdSize,
      homeOwnership,
      currentIssues,
    });

    opportunities.immediate.push(...govOpps.immediate);
    opportunities.shortTerm.push(...govOpps.shortTerm);
    opportunities.longTerm.push(...govOpps.longTerm);
    opportunities.totalEstimatedValue += govOpps.estimatedValue;

    // 5. HOA OPPORTUNITIES
    if (hoaFee) {
      const hoaOpps = await detectHOAOpportunities(apiKey, {
        hoaFee,
        hoaDocuments,
        currentIssues,
      });

      opportunities.immediate.push(...hoaOpps.immediate);
      opportunities.totalEstimatedValue += hoaOpps.estimatedValue;
    }

    // 6. PRODUCT RECALL OPPORTUNITIES
    if (appliances) {
      const recallOpps = await detectRecallOpportunities(apiKey, appliances);
      opportunities.immediate.push(...recallOpps.immediate);
      opportunities.totalEstimatedValue += recallOpps.estimatedValue;
    }

    // 7. TAX BENEFIT OPPORTUNITIES
    const taxOpps = await detectTaxOpportunities(apiKey, {
      homeOwnership,
      householdIncome,
      currentIssues,
      homeImprovements: [], // Could track improvements made
    });

    opportunities.shortTerm.push(...taxOpps.shortTerm);
    opportunities.longTerm.push(...taxOpps.longTerm);
    opportunities.totalEstimatedValue += taxOpps.estimatedValue;

    // Sort by value
    opportunities.immediate.sort((a, b) => b.estimatedValue - a.estimatedValue);
    opportunities.shortTerm.sort((a, b) => b.estimatedValue - a.estimatedValue);
    opportunities.longTerm.sort((a, b) => b.estimatedValue - a.estimatedValue);

    return {
      success: true,
      opportunities: opportunities,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      partialOpportunities: opportunities,
    };
  }
}

// Detect utility-related opportunities
async function detectUtilityOpportunities(apiKey, utilityData) {
  const systemPrompt = `You are an expert at finding utility savings and benefit opportunities. Identify specific, actionable opportunities with dollar value estimates.`;

  const userPrompt = `Identify all utility savings opportunities:

**UTILITIES**
Water: ${utilityData.waterUtility || 'Unknown'}
Electric: ${utilityData.electricUtility || 'Unknown'}
Gas: ${utilityData.gasUtility || 'Unknown'}

**MONTHLY COSTS**
Water: $${utilityData.monthlyWaterBill || '?'}
Electric: $${utilityData.monthlyElectricBill || '?'}
Gas: $${utilityData.monthlyGasBill || '?'}

**LOCATION**: ${utilityData.zipCode}
**HOME**: ${utilityData.homeDetails}

List opportunities in this format:

IMMEDIATE (ACT NOW):
1. [Opportunity name]
   - Action: [What to do]
   - Estimated value: $[amount]/year
   - Time required: [hours/days]
   - Difficulty: Easy/Medium/Hard
   - Priority: High/Medium/Low

SHORT TERM (0-3 MONTHS):
[Same format]

Include:
- Free utility programs (audits, testing, devices)
- Rebates for appliances/upgrades
- Rate plan optimizations
- Low-income assistance (if bills > 6% of income)
- Lead line replacement (if applicable)
- Water quality testing programs
- Energy efficiency rebates
- Solar/renewable incentives
- Budget billing to smooth costs

Be specific with dollar amounts and program names.`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);
    return parseOpportunities(result.email);
  } catch (error) {
    return { immediate: [], shortTerm: [], estimatedValue: 0 };
  }
}

// Detect warranty claim opportunities
async function detectWarrantyOpportunities(apiKey, warrantyData) {
  const systemPrompt = `You are a home warranty expert. Identify which current issues might be covered by warranty and estimate value.`;

  const userPrompt = `Identify warranty claim opportunities:

**WARRANTY PROVIDER**: ${warrantyData.warrantyProvider}
**CURRENT ISSUES**:
${warrantyData.currentIssues.join('\n')}

**APPLIANCES/SYSTEMS**:
${warrantyData.appliances}

For each issue, determine:
1. Likely covered by warranty? YES/MAYBE/NO
2. Estimated repair cost (without warranty): $[amount]
3. Warranty service fee: $[typical fee]
4. Net savings: $[amount - fee]
5. Recommended action

Format:
IMMEDIATE (FILE CLAIM NOW):
1. [Issue]
   - Coverage: Likely covered under [contract section]
   - Out-of-pocket repair cost: $[amount]
   - Warranty fee: $[fee]
   - Net savings: $[savings]
   - Action: File claim immediately, mention [key phrases]
   - Priority: High

Only include issues likely to be covered.`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);
    return parseOpportunities(result.email);
  } catch (error) {
    return { immediate: [], estimatedValue: 0 };
  }
}

// Detect insurance claim opportunities
async function detectInsuranceOpportunities(apiKey, insuranceData) {
  const systemPrompt = `You are a public insurance adjuster. Identify potential insurance claims homeowners don't realize they can file.`;

  const userPrompt = `Identify potential insurance claims:

**INSURANCE PROVIDER**: ${insuranceData.insuranceProvider}
**CURRENT ISSUES**:
${insuranceData.currentIssues.join('\n')}

**PROPERTY AGE**: ${insuranceData.propertyAge}

For each issue, analyze:
1. Potential coverage under homeowners policy
2. Estimated claim value
3. Whether it exceeds typical deductible ($1000-$2500)
4. Documentation needed
5. Whether to file

Format:
IMMEDIATE (CONSIDER FILING):
1. [Issue]
   - Coverage: [Type of coverage that applies]
   - Estimated loss: $[amount]
   - Typical deductible: $[amount]
   - Net benefit: $[loss - deductible]
   - Documentation: [Photos, receipts, etc.]
   - Risk of premium increase: Low/Medium/High
   - Recommendation: File / Don't file / Borderline
   - Priority: High/Medium

Include hidden coverages like:
- Ordinance/law (code upgrades)
- Service line (pipes to street)
- Water backup
- Food spoilage
- Tree removal
- Loss of use`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);
    return parseOpportunities(result.email);
  } catch (error) {
    return { immediate: [], estimatedValue: 0 };
  }
}

// Detect government assistance opportunities
async function detectGovernmentOpportunities(apiKey, customerData) {
  const systemPrompt = `You are an expert in government assistance programs. Identify programs the customer likely qualifies for with specific value estimates.`;

  const userPrompt = `Identify government program opportunities:

**LOCATION**: ${customerData.city}, ${customerData.state} ${customerData.zipCode}
**INCOME**: $${customerData.householdIncome} (household of ${customerData.householdSize})
**HOME**: ${customerData.homeOwnership}
**ISSUES**: ${customerData.currentIssues?.join(', ') || 'General maintenance'}

List programs in priority order:

IMMEDIATE (APPLY NOW - Limited funding):
1. [Program name]
   - Benefit: $[value] or [description]
   - Eligibility: [Likely eligible / Possibly eligible]
   - Application: [How to apply]
   - Deadline: [If time-sensitive]
   - Priority: High

SHORT TERM (0-3 months):
[Programs available year-round]

LONG TERM (Future planning):
[Programs to watch for or plan ahead]

Include:
- Weatherization (WAP) - up to $8000 value
- LIHEAP - $200-$1500/year
- Lead abatement - up to $10,000
- HUD home repair grants
- Energy efficiency rebates
- Solar tax credits (30% of cost)
- State-specific programs`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);
    return parseOpportunities(result.email);
  } catch (error) {
    return { immediate: [], shortTerm: [], longTerm: [], estimatedValue: 0 };
  }
}

// Detect HOA benefit opportunities
async function detectHOAOpportunities(apiKey, hoaData) {
  const systemPrompt = `You are an HOA expert. Identify services and amenities the homeowner is paying for but not using.`;

  const userPrompt = `Identify unused HOA benefits:

**MONTHLY FEE**: $${hoaData.hoaFee}
**ANNUAL COST**: $${hoaData.hoaFee * 12}

${hoaData.currentIssues ? `**CURRENT ISSUES**: ${hoaData.currentIssues.join(', ')}` : ''}

List opportunities:

IMMEDIATE (USE NOW):
1. [Service/amenity]
   - What it is: [Description]
   - Value: $[monthly equivalent or comparable cost]
   - How to access: [Instructions]
   - Estimated usage value: $[amount]/year
   - Priority: High

Include:
- Free services HOA provides (pest control, landscaping)
- Amenities (pool, gym, clubhouse)
- Master insurance coverage (reduces personal insurance needs)
- Free dispute mediation
- Architectural review (free design consultation)
- Community events
- Bulk service discounts HOA negotiates
- Security services`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);
    return parseOpportunities(result.email);
  } catch (error) {
    return { immediate: [], estimatedValue: 0 };
  }
}

// Detect product recall opportunities
async function detectRecallOpportunities(apiKey, appliances) {
  const systemPrompt = `You are a consumer safety expert. Identify potential recalls and manufacturer warranty opportunities.`;

  const userPrompt = `Check for recall and warranty opportunities:

**EQUIPMENT**:
${appliances}

Identify:

IMMEDIATE (CHECK FOR RECALLS):
1. [Appliance/system]
   - Potential issues: [Common recall reasons]
   - How to check: CPSC.gov or [manufacturer site]
   - Potential remedy: Free repair/replacement worth $[value]
   - Safety concern: Yes/No
   - Priority: High (if safety) / Medium

Include:
- Recent recalls (last 5 years)
- Common failure items (water heaters, HVAC, dishwashers)
- Manufacturer warranties still in effect
- Extended warranty opportunities`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);
    return parseOpportunities(result.email);
  } catch (error) {
    return { immediate: [], estimatedValue: 0 };
  }
}

// Detect tax benefit opportunities
async function detectTaxOpportunities(apiKey, taxData) {
  const systemPrompt = `You are a tax professional specializing in home-related deductions and credits.`;

  const userPrompt = `Identify tax opportunities:

**HOMEOWNERSHIP**: ${taxData.homeOwnership}
**INCOME**: $${taxData.householdIncome}
**ISSUES/IMPROVEMENTS**: ${taxData.currentIssues?.join(', ') || 'None'}

Identify:

SHORT TERM (Current/Next Tax Year):
1. [Credit/Deduction]
   - Value: $[amount]
   - Requirements: [What's needed]
   - How to claim: [Tax form]
   - Priority: High/Medium

LONG TERM (Future Planning):
[Long-term strategies]

Include:
- Mortgage interest deduction
- Property tax deduction
- Home office deduction (if applicable)
- Energy efficiency credits (IRA 2022)
  - Heat pumps: up to $2000
  - Insulation: up to $1200
  - Windows: up to $600
  - Solar: 30% of cost (no limit)
- Medical expense deductions (home modifications)
- Casualty loss deductions (disasters)`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);
    return parseOpportunities(result.email);
  } catch (error) {
    return { shortTerm: [], longTerm: [], estimatedValue: 0 };
  }
}

// Parse opportunities from AI response
function parseOpportunities(responseText) {
  const result = {
    immediate: [],
    shortTerm: [],
    longTerm: [],
    estimatedValue: 0,
  };

  // Extract dollar amounts and sum them
  const dollarMatches = responseText.match(/\$[\d,]+/g) || [];
  const values = dollarMatches.map((m) => parseInt(m.replace(/[$,]/g, '')));
  result.estimatedValue = values.reduce((sum, val) => sum + val, 0);

  // Parse opportunities (simplified - in production, use more robust parsing)
  const sections = {
    IMMEDIATE: 'immediate',
    'SHORT TERM': 'shortTerm',
    'LONG TERM': 'longTerm',
  };

  for (const [sectionName, key] of Object.entries(sections)) {
    const sectionMatch = responseText.match(
      new RegExp(`${sectionName}[^]*?(?=(?:IMMEDIATE|SHORT TERM|LONG TERM|$))`, 's')
    );
    if (sectionMatch) {
      const items = sectionMatch[0].split(/\d+\.\s/).slice(1);
      result[key] = items.map((item) => ({
        description: item.split('\n')[0],
        fullDetails: item,
        category: key,
      }));
    }
  }

  return result;
}

// Generate prioritized action plan
export async function generateActionPlan(apiKey, opportunities) {
  const systemPrompt = `You are a financial advisor and home management expert. Create a prioritized, step-by-step action plan.`;

  const userPrompt = `Create an action plan from these opportunities:

**IMMEDIATE OPPORTUNITIES** (${opportunities.immediate.length}):
${opportunities.immediate.map((o, i) => `${i + 1}. ${o.description}`).join('\n')}

**SHORT TERM** (${opportunities.shortTerm.length}):
${opportunities.shortTerm.map((o, i) => `${i + 1}. ${o.description}`).join('\n')}

**LONG TERM** (${opportunities.longTerm.length}):
${opportunities.longTerm.map((o, i) => `${i + 1}. ${o.description}`).join('\n')}

**TOTAL ESTIMATED VALUE**: $${opportunities.totalEstimatedValue.toLocaleString()}

Create a 90-day action plan:

## WEEK 1 PRIORITIES (Highest ROI, Easiest Wins)
Monday: [Task 1]
Tuesday: [Task 2]
...

## MONTH 1 GOALS
...

## MONTH 2-3 GOALS
...

For each task:
- Time required
- Expected outcome
- Dependencies
- Who to contact
- Forms/documents needed

Prioritize by:
1. Time-sensitive (deadlines, limited funding)
2. High value / low effort
3. Prerequisite for other opportunities
4. Safety concerns`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);
    return {
      success: true,
      actionPlan: result.email,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Generate opportunity dashboard summary
export function generateOpportunitySummary(opportunities) {
  const summary = {
    totalOpportunities:
      opportunities.immediate.length +
      opportunities.shortTerm.length +
      opportunities.longTerm.length,
    totalEstimatedValue: opportunities.totalEstimatedValue,
    highPriority: opportunities.immediate.length,
    categories: {
      utility: 0,
      warranty: 0,
      insurance: 0,
      government: 0,
      hoa: 0,
      tax: 0,
      recall: 0,
    },
    quickWins: [], // High value, low effort
    bigTicketItems: [], // High value, may require effort
  };

  // Categorize all opportunities
  const allOpps = [
    ...opportunities.immediate,
    ...opportunities.shortTerm,
    ...opportunities.longTerm,
  ];

  allOpps.forEach((opp) => {
    const desc = opp.description.toLowerCase();
    if (desc.includes('utility') || desc.includes('rebate') || desc.includes('energy')) {
      summary.categories.utility++;
    } else if (desc.includes('warranty')) {
      summary.categories.warranty++;
    } else if (desc.includes('insurance') || desc.includes('claim')) {
      summary.categories.insurance++;
    } else if (
      desc.includes('government') ||
      desc.includes('assistance') ||
      desc.includes('grant')
    ) {
      summary.categories.government++;
    } else if (desc.includes('hoa')) {
      summary.categories.hoa++;
    } else if (desc.includes('tax') || desc.includes('credit')) {
      summary.categories.tax++;
    } else if (desc.includes('recall')) {
      summary.categories.recall++;
    }

    // Extract value estimate
    const valueMatch = opp.fullDetails.match(/\$[\d,]+/);
    const value = valueMatch ? parseInt(valueMatch[0].replace(/[$,]/g, '')) : 0;

    // Categorize as quick win or big ticket
    const isEasy = opp.fullDetails.includes('Easy') || opp.fullDetails.includes('free');
    if (value > 100 && isEasy) {
      summary.quickWins.push(opp);
    } else if (value > 1000) {
      summary.bigTicketItems.push(opp);
    }
  });

  return summary;
}

export default {
  scanAllOpportunities,
  generateActionPlan,
  generateOpportunitySummary,
};
