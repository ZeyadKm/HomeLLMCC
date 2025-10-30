// Utility Report Analyzer for HomeLLM
// Automatically fetches, analyzes, and compares utility company reports (water quality, energy efficiency, etc.)

import * as API from './api-integration';

// Major utility company report databases
export const utilityReportSources = {
  water: {
    nationalDatabases: [
      'https://www.ewg.org/tapwater/', // EWG Tap Water Database
      'https://ofmpub.epa.gov/apex/sfdw/f?p=108:1', // EPA SDWIS
      'https://www.epa.gov/waterdata/water-quality-data', // EPA Water Quality Portal
    ],
    commonProviders: [
      {
        name: 'Denver Water',
        urlPattern: 'denverwater.org/your-water/water-quality/water-quality-reports',
      },
      { name: 'NYC DEP', urlPattern: 'nyc.gov/site/dep/water/drinking-water-quality-report' },
      { name: 'LADWP', urlPattern: 'ladwp.com/water-quality' },
      { name: 'SF PUC', urlPattern: 'sfpuc.org/about-us/our-systems/water-supply/water-quality' },
      {
        name: 'Chicago Water',
        urlPattern: 'chicago.gov/city/en/depts/water/supp_info/water_quality_resultsandreports',
      },
      { name: 'Philadelphia Water', urlPattern: 'phila.gov/water/quality' },
      { name: 'Boston Water', urlPattern: 'mwra.com/water/html/wqual' },
      {
        name: 'Seattle Public Utilities',
        urlPattern: 'seattle.gov/utilities/your-services/water/water-quality',
      },
    ],
  },
  electricity: {
    providers: [
      { name: 'PG&E', urlPattern: 'pge.com', type: 'electricity' },
      { name: 'ConEd', urlPattern: 'coned.com', type: 'electricity' },
      { name: 'Duke Energy', urlPattern: 'duke-energy.com', type: 'electricity' },
      { name: 'Southern California Edison', urlPattern: 'sce.com', type: 'electricity' },
    ],
    programs: [
      'energy efficiency rebates',
      'solar incentives',
      'time-of-use rates',
      'low-income assistance',
    ],
  },
  gas: {
    providers: [
      { name: 'SoCalGas', urlPattern: 'socalgas.com', type: 'natural gas' },
      { name: 'PG&E Gas', urlPattern: 'pge.com/gas', type: 'natural gas' },
      { name: 'Con Edison Gas', urlPattern: 'coned.com/gas', type: 'natural gas' },
    ],
    programs: ['weatherization', 'furnace rebates', 'leak detection'],
  },
};

// Analyze water quality report (EWG or utility company)
export async function analyzeWaterQualityReport(apiKey, reportUrl, userAddress, zipCode) {
  const systemPrompt = `You are an expert water quality analyst specializing in public water systems, EPA standards, and consumer health protection. You analyze water quality reports and identify actionable issues.`;

  const userPrompt = `Analyze the water quality report for the following location and provide a comprehensive consumer-friendly breakdown.

**Location**: ${userAddress}, ZIP: ${zipCode}
**Report Source**: ${reportUrl}

Please provide:

## 1. EXECUTIVE SUMMARY
- Overall water quality rating (Excellent/Good/Fair/Poor)
- Top 3 concerns (if any)
- Is filtration recommended?

## 2. CONTAMINANTS ANALYSIS
For each contaminant detected, provide:
- Contaminant name
- Amount detected
- EPA legal limit (MCL)
- EPA health goal (MCLG)
- Health risks
- Severity: Safe / Concerning / Above Legal Limit

## 3. COMPARISON TO STANDARDS
- How many contaminants are above EPA health goals?
- Any violations of legal limits?
- Comparison to national averages
- State-specific standards (if stricter)

## 4. HEALTH IMPACTS
- Vulnerable populations at risk (children, pregnant women, etc.)
- Specific health effects of detected contaminants
- Long-term vs. short-term exposure risks

## 5. RECOMMENDED ACTIONS
- Specific filtration needs (e.g., "Reverse osmosis for arsenic")
- NSF filter certifications to look for
- Testing recommendations
- Whether to contact water utility

## 6. HIDDEN BENEFITS / PROGRAMS
- Does the utility offer free testing?
- Lead service line replacement programs?
- Low-income assistance programs?
- Water quality alerts or notifications?

## 7. ADVOCACY OPPORTUNITIES
- Should customer file complaint with EPA?
- Request utility improvements?
- Join community action groups?
- Report violations to state agency?

Provide specific numbers, dates, and actionable recommendations. If report URL can't be accessed, explain how to find it.`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);
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

// Fetch and analyze EWG Tap Water Database
export async function analyzeEWGReport(apiKey, zipCode, waterUtility) {
  const systemPrompt = `You are an expert in EWG's Tap Water Database and consumer water quality advocacy. You know how to interpret EWG's ratings and health guidelines.`;

  const userPrompt = `Look up water quality information for:
**ZIP Code**: ${zipCode}
**Water Utility**: ${waterUtility || 'Not specified - please identify'}

Using your knowledge of common water quality issues in this area, provide:

1. **EWG Database Info**:
   - Link to EWG report: https://www.ewg.org/tapwater/
   - How to look up this specific utility

2. **Common Contaminants in This Area**:
   - Based on ZIP ${zipCode}, what are typical regional concerns?
   - Common contaminants in this water system
   - Geographic factors (agricultural runoff, industrial, old pipes, etc.)

3. **EWG Health Guidelines**:
   - EWG's health-based limits (often stricter than EPA)
   - Which contaminants likely exceed EWG guidelines?

4. **Filtration Recommendations**:
   - Specific filter types for this area's concerns
   - NSF certifications needed
   - Estimated cost ranges

5. **Action Items**:
   - Request Consumer Confidence Report (CCR) from utility
   - Consider independent testing for specific contaminants
   - Install specific filtration

6. **Consumer Rights**:
   - Right to annual water quality report
   - How to request historical data
   - Complaint procedures

Provide specific, actionable guidance even without live access to EWG database.`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);
    return {
      success: true,
      analysis: result.email,
      source: 'EWG Knowledge',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Discover utility company benefits and programs
export async function discoverUtilityBenefits(apiKey, utilityName, utilityType, customerAddress) {
  const systemPrompt = `You are an expert in utility company programs, rebates, and customer benefits. You know how to find hidden value in utility services and programs that customers often miss.`;

  const userPrompt = `Analyze available programs and benefits from this utility company:

**Utility**: ${utilityName}
**Type**: ${utilityType} (water/electric/gas)
**Customer Address**: ${customerAddress}

Identify ALL available benefits the customer may be missing, including:

## REBATES & INCENTIVES
- Appliance rebates (water heaters, HVAC, washers, etc.)
- Energy efficiency audits (often FREE)
- Weatherization programs
- Solar/renewable energy incentives
- Smart thermostat programs
- Low-flow fixture rebates
- Insulation rebates

## FREE SERVICES
- Free home energy audit
- Free water quality testing
- Free leak detection
- Free appliance recycling
- Free weatherization (for eligible customers)
- Free smart power strips
- Free water-saving devices

## ASSISTANCE PROGRAMS
- Low-income bill assistance (LIHEAP, CARE, FERA, etc.)
- Senior citizen discounts
- Medical baseline allowances
- Payment plans
- Crisis assistance
- Arrears forgiveness programs

## SPECIAL PROGRAMS
- Time-of-use rates (save money by shifting usage)
- Net metering (solar customers)
- Electric vehicle charging rates
- Budget billing
- Paperless billing discounts
- Auto-pay discounts

## SAFETY & INFRASTRUCTURE
- Lead service line replacement (often FREE for water utilities)
- Gas line safety inspections (FREE)
- Tree trimming near power lines (FREE)
- Emergency generators for medical needs
- Power outage notifications

## HOW TO CLAIM EACH BENEFIT
For each program identified:
1. Eligibility requirements
2. How to apply (phone, online, form)
3. Required documentation
4. Processing time
5. Estimated value/savings

## HIDDEN VALUE CALCULATION
- Total potential annual savings
- One-time rebate opportunities
- Long-term value (10-year projection)

Provide specific program names, phone numbers, and website links. Even without live access to the utility's site, use your knowledge of common utility programs.`;

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

// Analyze energy efficiency opportunities
export async function analyzeEnergyEfficiency(apiKey, utilityBill, homeDetails) {
  const systemPrompt = `You are a certified energy auditor and efficiency expert. You analyze utility bills and home characteristics to identify savings opportunities.`;

  const userPrompt = `Analyze this customer's energy usage and identify savings opportunities:

**Utility Bill Info**:
${utilityBill}

**Home Details**:
${homeDetails}

Provide:

## 1. USAGE ANALYSIS
- Compare to similar homes in area
- Identify usage patterns and anomalies
- Peak usage times
- Seasonal variations

## 2. COST SAVINGS OPPORTUNITIES (Prioritized by ROI)

### Quick Wins (< $100, immediate payback)
- LED bulb replacement
- Smart power strips
- Weatherstripping
- Programmable thermostat

### Medium Investments ($100-$1000, 1-3 year payback)
- Insulation improvements
- Smart thermostat upgrade
- Water heater blanket/timer
- Air sealing

### Major Upgrades ($1000+, 3-10 year payback)
- HVAC replacement
- Window replacement
- Solar panels
- Heat pump installation

## 3. AVAILABLE UTILITY REBATES
Match opportunities above with available rebates

## 4. ESTIMATED ANNUAL SAVINGS
- Per opportunity
- Total if all implemented

## 5. AVAILABLE TAX CREDITS
- Federal energy efficiency tax credits
- State/local incentives
- Inflation Reduction Act benefits

## 6. ACTION PLAN
Step-by-step implementation plan with timeline`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);
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

// Compare customer's costs to alternatives
export async function compareUtilityRates(apiKey, currentProvider, customerAddress, monthlyUsage) {
  const systemPrompt = `You are an energy market analyst specializing in utility rate comparison and customer savings opportunities.`;

  const userPrompt = `Compare utility rates and identify potential savings:

**Current Provider**: ${currentProvider}
**Address**: ${customerAddress}
**Monthly Usage**: ${monthlyUsage}

Analyze:

## 1. RATE STRUCTURE ANALYSIS
- Current rate plan
- Alternative rate plans from same utility
- Time-of-use vs. flat rate
- Tiered pricing impacts

## 2. ALTERNATIVE SUPPLIERS (if deregulated market)
- List of alternative suppliers
- Rate comparison
- Contract terms
- Customer reviews/reliability

## 3. POTENTIAL SAVINGS
- By switching rate plans
- By switching suppliers
- By adjusting usage patterns

## 4. COMMUNITY CHOICE AGGREGATION (CCA)
- Is CCA available in this area?
- CCA vs. incumbent utility comparison
- Renewable energy options

## 5. RECOMMENDATIONS
- Should customer switch?
- Best plan for usage pattern
- Risks/considerations

Provide specific numbers and calculations.`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);
    return {
      success: true,
      comparison: result.email,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Build comprehensive utility optimization report
export async function generateUtilityOptimizationReport(apiKey, customerData) {
  const {
    address,
    zipCode,
    waterUtility,
    electricUtility,
    gasUtility,
    waterBill,
    electricBill,
    gasBill,
    homeDetails,
  } = customerData;

  const results = {
    waterQuality: null,
    waterBenefits: null,
    electricBenefits: null,
    gasBenefits: null,
    energyEfficiency: null,
    totalSavingsOpportunity: 0,
    timestamp: new Date().toISOString(),
  };

  try {
    // Analyze water quality (if water utility provided)
    if (waterUtility) {
      results.waterQuality = await analyzeEWGReport(apiKey, zipCode, waterUtility);
    }

    // Discover water utility benefits
    if (waterUtility) {
      results.waterBenefits = await discoverUtilityBenefits(apiKey, waterUtility, 'water', address);
    }

    // Discover electric utility benefits
    if (electricUtility) {
      results.electricBenefits = await discoverUtilityBenefits(
        apiKey,
        electricUtility,
        'electricity',
        address
      );
    }

    // Discover gas utility benefits
    if (gasUtility) {
      results.gasBenefits = await discoverUtilityBenefits(
        apiKey,
        gasUtility,
        'natural gas',
        address
      );
    }

    // Analyze energy efficiency
    if (electricBill && homeDetails) {
      results.energyEfficiency = await analyzeEnergyEfficiency(
        apiKey,
        `Electric: ${electricBill}, Gas: ${gasBill || 'N/A'}`,
        homeDetails
      );
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

// Extract utility info from uploaded bill image
export async function extractUtilityBillInfo(apiKey, billImage) {
  const systemPrompt = `You are an expert at reading and extracting data from utility bills. You can identify provider information, usage data, charges, and important notices.`;

  const userPrompt = `Extract all relevant information from this utility bill image:

Provide:
1. **Utility Provider**: Company name
2. **Utility Type**: Water/Electric/Gas/Combined
3. **Account Number**: (redact last 4 digits for security)
4. **Service Address**
5. **Billing Period**: Start and end dates
6. **Usage**: Amount and units (kWh, CCF, gallons, etc.)
7. **Charges Breakdown**:
   - Supply charges
   - Delivery charges
   - Taxes and fees
   - Total amount
8. **Rate Plan**: Type of plan/tariff
9. **Usage Comparison**: Current vs. previous year
10. **Important Notices**: Any alerts, programs, or deadlines mentioned
11. **Available Programs**: Any rebates or programs listed on bill
12. **Contact Information**: Customer service numbers

Format as structured JSON for easy parsing.`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, [billImage]);
    return {
      success: true,
      extractedData: result.email,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Find and parse utility's online report (web scraping simulation)
export async function fetchUtilityReport(utilityName, utilityType) {
  // In production, this would actually scrape the utility's website
  // For now, it returns known URLs and guidance

  const knownUrls = {
    'Denver Water': 'https://www.denverwater.org/your-water/water-quality/water-quality-reports',
    'NYC DEP': 'https://www.nyc.gov/site/dep/water/drinking-water-quality-report.page',
    LADWP: 'https://www.ladwp.com/water-quality',
    'PG&E': 'https://www.pge.com/customer-service',
    ConEd: 'https://www.coned.com/customer-service',
  };

  const url = knownUrls[utilityName];

  return {
    utilityName,
    reportUrl:
      url ||
      `https://www.google.com/search?q=${encodeURIComponent(utilityName + ' water quality report')}`,
    instructions: url
      ? `Report available at: ${url}`
      : `Search for "${utilityName} water quality report" or contact utility customer service`,
    fetchable: !!url,
  };
}

// Generate email to request missing reports/info from utility
export function generateUtilityInfoRequestEmail(
  utilityName,
  customerName,
  accountNumber,
  requestedInfo
) {
  const subject = `Request for ${requestedInfo} - Account ${accountNumber}`;

  const body = `Dear ${utilityName} Customer Service,

I am writing to request the following information for my account:

Account Holder: ${customerName}
Account Number: ${accountNumber}
Requested Information: ${requestedInfo}

Specifically, I would like to receive:
${
  requestedInfo.includes('water quality')
    ? `
- Most recent Water Quality Report (Consumer Confidence Report)
- Historical water quality data for my service area
- Information about any detected contaminants
- Available water quality improvement programs
`
    : ''
}
${
  requestedInfo.includes('rebates')
    ? `
- List of all available rebate programs
- Eligibility requirements for each program
- Application forms and procedures
- Current program availability and funding status
`
    : ''
}
${
  requestedInfo.includes('assistance')
    ? `
- Low-income assistance programs
- Medical baseline allowances
- Payment plan options
- Crisis assistance programs
`
    : ''
}

Please provide this information within the timeframe required by law (typically 30 days). I would prefer to receive this information via email, but will accept mail if necessary.

Thank you for your assistance.

Sincerely,
${customerName}

---
This request is made pursuant to my rights as a utility customer and applicable state/federal transparency laws.`;

  return {
    subject,
    body,
    recommendedMethod: 'email', // or 'phone', 'mail', 'web form'
  };
}

export default {
  analyzeWaterQualityReport,
  analyzeEWGReport,
  discoverUtilityBenefits,
  analyzeEnergyEfficiency,
  compareUtilityRates,
  generateUtilityOptimizationReport,
  extractUtilityBillInfo,
  fetchUtilityReport,
  generateUtilityInfoRequestEmail,
};
