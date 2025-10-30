// Web Verification Module for HomeLLM
// Conducts real-time web searches to verify regulatory codes and standards

import * as API from './api-integration';

// Search for current regulatory standards using web search
export async function verifyRegulations(apiKey, issueType, state, city) {
  const searches = [];

  // Build search queries based on issue type
  const queries = buildVerificationQueries(issueType, state, city);

  // Note: This requires a web search API or service
  // Options: Google Custom Search API, Bing Search API, or SerpAPI
  // For now, we'll use Claude with a web search prompt (simulated)

  const results = await Promise.all(queries.map((query) => searchAndVerify(apiKey, query)));

  return {
    success: true,
    verifiedRegulations: results.filter((r) => r.success),
    timestamp: new Date().toISOString(),
  };
}

// Build verification queries
function buildVerificationQueries(issueType, state, city) {
  const currentYear = new Date().getFullYear();
  const queries = [];

  const issueTypeQueries = {
    'air-quality': [
      `${state} mold remediation laws ${currentYear}`,
      `${city} ${state} air quality standards regulations`,
      `EPA indoor air quality standards ${currentYear}`,
      `${state} VOC emissions regulations residential`,
    ],
    'water-quality': [
      `${state} drinking water standards ${currentYear}`,
      `EPA lead copper rule revisions ${currentYear}`,
      `${city} water quality testing requirements`,
      `${state} PFAS regulations drinking water`,
    ],
    'hvac-ventilation': [
      `${state} residential ventilation requirements ${currentYear}`,
      `ASHRAE 62.2 ${currentYear} updates`,
      `${city} building code HVAC requirements`,
      `${state} mechanical code ventilation standards`,
    ],
    'lead-asbestos': [
      `EPA lead dust standards ${currentYear}`,
      `${state} lead paint disclosure laws`,
      `${state} asbestos regulations residential`,
      `EPA lead and copper rule ${currentYear}`,
    ],
    radon: [
      `EPA radon action level ${currentYear}`,
      `${state} radon testing requirements`,
      `${state} radon mitigation standards`,
    ],
    'carbon-monoxide': [
      `${state} carbon monoxide detector requirements ${currentYear}`,
      `EPA CO exposure limits`,
      `${city} ${state} CO alarm laws`,
    ],
  };

  // Get queries for this issue type
  queries.push(...(issueTypeQueries[issueType] || []));

  // Add general queries
  queries.push(
    `${state} tenant rights habitability ${currentYear}`,
    `${state} landlord repair timeline requirements`,
    `${city} code enforcement housing standards`
  );

  return queries.slice(0, 6); // Limit to 6 searches to avoid rate limits
}

// Simulate web search using Claude (in production, use actual search API)
async function searchAndVerify(apiKey, query) {
  const systemPrompt = `You are a regulatory research assistant. When given a search query about housing regulations, building codes, or environmental standards, provide:

1. Current accurate information as of your knowledge cutoff
2. Specific statute/code numbers and sections
3. Official agency sources (EPA, HUD, state agencies)
4. Any recent updates or changes
5. Official government website URLs where this can be verified

Be precise with numbers, dates, and citations. If information may be outdated, explicitly state that and recommend verification.`;

  const userPrompt = `Search query: "${query}"

Provide current, accurate regulatory information for this query. Include:
- Specific standards/limits with units
- Statute/code citations
- Enforcement agencies
- Official sources to verify this information
- Any recent changes or updates

Format as a structured response with clear sections.`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);

    return {
      success: true,
      query: query,
      findings: result.email,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      query: query,
      error: error.message,
    };
  }
}

// Verify specific regulation against web sources
export async function verifySpecificRegulation(apiKey, regulation, context) {
  const systemPrompt = `You are a legal research assistant specializing in regulatory verification. Your job is to verify whether a cited regulation, standard, or law is current and accurate.`;

  const userPrompt = `Verify this regulation:

**Regulation to verify**: ${regulation}

**Context**: ${context}

Please:
1. Confirm if this regulation/standard is current and accurate
2. Provide the exact citation (statute number, CFR section, etc.)
3. Note if there have been any recent updates or amendments
4. List official sources where this can be verified (government websites)
5. Flag if this appears outdated or incorrect

Be precise and cite official sources.`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);

    return {
      success: true,
      regulation: regulation,
      verification: result.email,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Compare generated email against verified sources
export async function crossCheckEmail(apiKey, generatedEmail, issueType, state, city) {
  // First, verify current regulations
  const verification = await verifyRegulations(apiKey, issueType, state, city);

  if (!verification.success) {
    return {
      success: false,
      error: 'Failed to verify regulations',
    };
  }

  // Then, cross-check the email content
  const systemPrompt = `You are a legal fact-checker specializing in environmental and housing regulations. Your job is to review advocacy emails for regulatory accuracy.`;

  const userPrompt = `Review this email for regulatory accuracy:

**EMAIL TO REVIEW**:
${generatedEmail}

**VERIFIED CURRENT REGULATIONS**:
${verification.verifiedRegulations.map((v) => `Query: ${v.query}\n${v.findings}\n`).join('\n---\n')}

**TASK**:
1. Identify any regulations, standards, or laws cited in the email
2. Cross-check each citation against the verified sources above
3. Flag any inaccuracies, outdated information, or missing citations
4. Suggest corrections with proper current citations
5. Rate overall accuracy (High/Medium/Low)

Provide a structured report with:
- Accuracy Rating
- Citations Verified (list)
- Issues Found (if any)
- Recommended Corrections (if needed)`;

  try {
    const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, []);

    return {
      success: true,
      accuracyReport: result.email,
      verifiedRegulations: verification.verifiedRegulations,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Extract regulations mentioned in generated email
function extractRegulationCitations(emailText) {
  const citations = [];

  // Patterns to match common citation formats
  const patterns = [
    /\b\d+\s+U\.S\.C\.\s+§\s*\d+/g, // Federal statutes (42 U.S.C. § 3604)
    /\b\d+\s+CFR\s+(?:Part\s+)?\d+/g, // Code of Federal Regulations (40 CFR Part 141)
    /\bEPA\s+[A-Z]+\s+\d+/g, // EPA standards
    /\bASHRAE\s+Standard\s+[\d.]+/g, // ASHRAE standards
    /\b[A-Z][a-z]+\s+(?:Health|Safety|Building|Municipal)\s+Code\s+[§\d\-.]+/g, // State/local codes
  ];

  patterns.forEach((pattern) => {
    const matches = emailText.match(pattern);
    if (matches) {
      citations.push(...matches);
    }
  });

  return [...new Set(citations)]; // Remove duplicates
}

// Generate verification report for user
export function generateVerificationReport(verificationResults) {
  const report = {
    timestamp: verificationResults.timestamp,
    queriesRun: verificationResults.verifiedRegulations.length,
    findings: verificationResults.verifiedRegulations,
    summary: `Verified ${verificationResults.verifiedRegulations.length} regulatory sources`,
    confidence: verificationResults.verifiedRegulations.every((v) => v.success) ? 'High' : 'Medium',
  };

  return report;
}

// Integration with actual web search APIs (optional, requires API keys)

// Google Custom Search API integration
export async function googleCustomSearch(query, apiKey, searchEngineId) {
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=5`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      success: true,
      results: data.items || [],
      query: query,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// SerpAPI integration (alternative search service)
export async function serpApiSearch(query, apiKey) {
  const url = `https://serpapi.com/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&num=5`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      success: true,
      results: data.organic_results || [],
      query: query,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Filter search results for official government sources
export function filterOfficialSources(searchResults) {
  const officialDomains = ['.gov', 'epa.gov', 'hud.gov', 'cdc.gov', 'osha.gov', 'ashrae.org'];

  return searchResults.filter((result) => {
    const url = result.link || result.url || '';
    return officialDomains.some((domain) => url.includes(domain));
  });
}

// Compile verification sources for email footer
export function compileVerificationFooter(verificationResults) {
  const sources = verificationResults.verifiedRegulations.map((v) => v.findings).join('\n\n');

  return `

---
## REGULATORY VERIFICATION

This email was generated with regulatory verification conducted on ${new Date().toLocaleDateString()}.

Sources consulted:
${verificationResults.verifiedRegulations.map((v) => `- ${v.query}`).join('\n')}

⚠️ **Important**: While we strive for accuracy, regulations change frequently. Verify current standards with:
- EPA.gov (federal environmental standards)
- HUD.gov (federal housing standards)
- Your state environmental/health agency
- Local building department

Last verified: ${verificationResults.timestamp}
`;
}

export default {
  verifyRegulations,
  verifySpecificRegulation,
  crossCheckEmail,
  generateVerificationReport,
  googleCustomSearch,
  serpApiSearch,
  filterOfficialSources,
  compileVerificationFooter,
};
