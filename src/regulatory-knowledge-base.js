// Comprehensive Regulatory Knowledge Base for HomeLLM
// This file contains federal, state, and local regulations for home health and safety issues

export const regulatoryKnowledgeBase = {
  // Federal Regulations
  federal: {
    airQuality: {
      primaryLaws: [
        'Clean Air Act (42 U.S.C. §7401 et seq.)',
        'Indoor Air Quality standards by EPA',
        'OSHA Indoor Air Quality regulations (29 CFR 1910)',
      ],
      standards: {
        mold: 'EPA does not set federal mold exposure limits, but recommends remediation when visible',
        vocs: 'EPA recommends indoor VOC levels below outdoor levels',
        pm25: 'EPA NAAQS: 12 μg/m³ annual mean, 35 μg/m³ 24-hour',
        pm10: 'EPA NAAQS: 150 μg/m³ 24-hour average',
        carbonMonoxide: 'EPA: 9 ppm (8-hour), 35 ppm (1-hour)',
        formaldehyde: 'HUD standard: 0.016 ppm (composite wood products)',
      },
      agencies: ['EPA', 'HUD', 'OSHA', 'CDC/NIOSH'],
      citations: {
        moldGuidance: 'EPA Mold Remediation in Schools and Commercial Buildings (EPA 402-K-01-001)',
        vocGuidance: 'EPA Indoor Air Quality: Volatile Organic Compounds',
        healthEffects: 'CDC Health Effects of Indoor Air Pollutants',
      },
    },
    waterQuality: {
      primaryLaws: [
        'Safe Drinking Water Act (42 U.S.C. §300f et seq.)',
        'Lead and Copper Rule (40 CFR Part 141)',
        'EPA National Primary Drinking Water Regulations',
      ],
      standards: {
        lead: '15 ppb action level (zero goal)',
        copper: '1.3 ppm action level',
        arsenic: '10 ppb MCL',
        nitrate: '10 ppm MCL',
        fluoride: '4 ppm MCL',
        coliformBacteria: 'Zero total coliforms per 100ml',
        pfas: 'EPA proposed PFOA/PFOS: 4 ppt (2023)',
        tthm: '80 ppb MCL (total trihalomethanes)',
        haa5: '60 ppb MCL (haloacetic acids)',
      },
      agencies: ['EPA', 'State Water Boards', 'Local Water Districts'],
      citations: {
        sdwaOverview: '40 CFR Parts 141-143',
        leadRule: 'Lead and Copper Rule Revisions (LCRR) 2021',
        contaminants: 'EPA National Primary Drinking Water Regulations Table',
      },
    },
    hvacVentilation: {
      primaryLaws: [
        'ASHRAE Standard 62.1 (Ventilation for Acceptable Indoor Air Quality)',
        'ASHRAE Standard 62.2 (Ventilation for Low-Rise Residential Buildings)',
        'International Mechanical Code (IMC)',
        'HUD Housing Quality Standards (24 CFR Part 5)',
      ],
      standards: {
        residentialVentilation: '15 CFM per person + 3 CFM per 100 sq ft (ASHRAE 62.2)',
        outdoorAirRate: '5-10 CFM per person minimum',
        hvacMaintenance: 'Filter changes every 1-3 months',
        ductCleaning: 'As needed when contamination visible',
      },
      agencies: ['HUD', 'Local Building Departments', 'ASHRAE'],
      citations: {
        ashrae62_1: 'ANSI/ASHRAE Standard 62.1-2022',
        ashrae62_2: 'ANSI/ASHRAE Standard 62.2-2022',
        hudStandards: 'HUD Housing Quality Standards (24 CFR §982.401)',
      },
    },
    hazardousMaterials: {
      primaryLaws: [
        'Toxic Substances Control Act (15 U.S.C. §2601 et seq.)',
        'Residential Lead-Based Paint Hazard Reduction Act (42 U.S.C. §4851)',
        'Asbestos Hazard Emergency Response Act (AHERA)',
        'OSHA Asbestos Standards (29 CFR 1926.1101)',
      ],
      standards: {
        leadPaint: 'Required disclosure for homes built before 1978',
        leadDust: '10 μg/ft² (floors), 100 μg/ft² (windowsills) - EPA 2019',
        asbestos: 'Regulated under NESHAP (40 CFR Part 61, Subpart M)',
        radon: '4 pCi/L action level (EPA recommendation)',
        carbonMonoxide: '9 ppm (8-hour average) outdoor standard',
      },
      agencies: ['EPA', 'OSHA', 'HUD', 'State Health Departments'],
      citations: {
        leadDisclosure: '24 CFR Part 35 - Lead-Based Paint Poisoning Prevention',
        radonGuidance: 'EPA Consumer Guide to Radon Reduction',
        asbestosRegulations: '40 CFR Part 61, Subpart M (NESHAP)',
        leadDustStandard: 'EPA Lead Dust Hazard Standards 2020 (40 CFR Part 745)',
      },
    },
    housingRights: {
      primaryLaws: [
        'Fair Housing Act (42 U.S.C. §3601 et seq.)',
        'Implied Warranty of Habitability (state-specific)',
        'HUD Housing Quality Standards (24 CFR Part 982)',
        'Americans with Disabilities Act (42 U.S.C. §12101)',
      ],
      tenantRights: {
        habitability: 'Landlords must provide safe, sanitary housing',
        repairs: 'Landlords must address health and safety hazards promptly',
        retaliation: 'Illegal to retaliate against tenants reporting violations',
        disclosure: 'Required disclosure of known hazards',
      },
      agencies: ['HUD', 'State Housing Authorities', 'Local Code Enforcement'],
      citations: {
        fairHousing: '42 U.S.C. §3604 - Discrimination in Sale or Rental',
        habitability: 'State-specific statutory and common law',
        hudStandards: '24 CFR §982.401 - Housing Quality Standards',
      },
    },
  },

  // State-Specific Regulations
  states: {
    California: {
      airQuality: {
        laws: [
          'California Health and Safety Code §39000-39011 (Air Resources)',
          'California Building Code Title 24, Part 6',
          'Cal/OSHA Indoor Air Quality standards',
        ],
        standards: {
          mold: 'Health & Safety Code §26101-26157 (Toxic Mold Protection Act)',
          vocs: 'CARB regulations for formaldehyde and VOCs',
          ventilation: 'Title 24, Part 6 - residential ventilation requirements',
        },
        agencies: [
          'California Air Resources Board (CARB)',
          'Cal/OSHA',
          'Local Air Quality Management Districts',
        ],
      },
      waterQuality: {
        laws: [
          'California Safe Drinking Water Act (Health & Safety Code §116270 et seq.)',
          'Porter-Cologne Water Quality Control Act',
        ],
        standards: {
          lead: '5 ppb public health goal (stricter than federal)',
          chromium6: '10 ppb MCL (CA-specific)',
          perchlorate: '6 ppb MCL',
        },
        agencies: ['State Water Resources Control Board', 'Division of Drinking Water'],
      },
      tenantRights: {
        laws: [
          'California Civil Code §1941-1942.5 (Habitability)',
          'California Health & Safety Code §17920.3 (Housing Standards)',
          'Green v. Superior Court (warranty of habitability case law)',
        ],
        repairTimelines: '30 days for non-urgent, 48-72 hours for health/safety',
        remedies: 'Repair and deduct, rent withholding, constructive eviction',
      },
    },
    NewYork: {
      airQuality: {
        laws: [
          'NYC Administrative Code §27-2017 et seq. (Housing Maintenance)',
          'NYS Multiple Dwelling Law',
          'NYC Local Law 55 (Mold Remediation)',
        ],
        standards: {
          mold: 'NYC requires licensed mold assessors/remediators for >10 sq ft',
          ventilation: 'NYCRR Title 9, §1200 - ventilation requirements',
        },
        agencies: ['NYC Dept of Health', 'NYS Department of Labor', 'NYC HPD'],
      },
      waterQuality: {
        laws: [
          'NYC Health Code Article 141 (Drinking Water)',
          'NYS Sanitary Code Part 5 (Public Water Systems)',
        ],
        standards: {
          lead: 'NYC Local Law 31 - lead testing in schools',
          legionella: 'NYC cooling tower regulations (Local Law 77)',
        },
      },
      tenantRights: {
        laws: [
          'NYC Housing Maintenance Code',
          'Real Property Law §235-b (Warranty of Habitability)',
          'Multiple Dwelling Law',
        ],
        repairTimelines: 'Emergency (24 hours), hazardous (24 hours), non-hazardous (30 days)',
        remedies: '7A proceedings, HP actions, rent abatement',
      },
    },
    Texas: {
      airQuality: {
        laws: [
          'Texas Health & Safety Code Ch. 382 (Clean Air Act)',
          'Texas Property Code §92.052 (Landlord Duty to Repair)',
        ],
        agencies: ['Texas Commission on Environmental Quality (TCEQ)'],
      },
      waterQuality: {
        laws: ['Texas Health & Safety Code Ch. 341 (Public Drinking Water)', 'Texas Water Code'],
        agencies: ['TCEQ Water Supply Division'],
      },
      tenantRights: {
        laws: [
          'Texas Property Code Ch. 92 (Residential Tenancies)',
          'Texas Property Code §92.056 (Tenant Remedies)',
        ],
        repairTimelines: '7 days after written notice',
        remedies: 'Repair and deduct, terminate lease, civil penalties',
      },
    },
    Florida: {
      airQuality: {
        laws: [
          'Florida Statutes §403.031 et seq. (Air and Water Pollution Control)',
          'Florida Building Code',
        ],
        agencies: ['Florida Department of Environmental Protection'],
      },
      waterQuality: {
        laws: [
          'Florida Safe Drinking Water Act (F.S. Ch. 403)',
          'Florida Administrative Code Ch. 62-550 (Drinking Water Standards)',
        ],
      },
      tenantRights: {
        laws: [
          'Florida Statutes §83.51 (Landlord Obligations)',
          'Florida Statutes §83.60 (Tenant Remedies)',
        ],
        repairTimelines: '7 days for non-emergency, immediate for health/safety',
        remedies: 'Withhold rent, terminate, sue for damages',
      },
    },
    Illinois: {
      airQuality: {
        laws: [
          'Illinois Environmental Protection Act (415 ILCS 5/)',
          'Chicago Municipal Code Ch. 13-196 (Residential Landlord Tenant Ordinance)',
        ],
        standards: {
          mold: 'Chicago requires mold disclosure and remediation',
          carbonMonoxide: 'Illinois Carbon Monoxide Alarm Detector Act (430 ILCS 135/)',
        },
      },
      tenantRights: {
        laws: [
          '765 ILCS 705/ (Residential Tenants Right to Repair Act)',
          '765 ILCS 742/ (Safe Homes Act)',
        ],
        repairTimelines: '14 days after notice',
        remedies: 'Repair and deduct up to $500 or half month rent',
      },
    },
  },

  // Local Code References (common patterns)
  localCodes: {
    building: [
      'International Building Code (IBC)',
      'International Residential Code (IRC)',
      'International Property Maintenance Code (IPMC)',
      'Local municipal codes and ordinances',
    ],
    health: [
      'International Code Council Property Maintenance Code',
      'County health department regulations',
      'Local housing quality standards',
    ],
    utility: [
      'Public Utilities Commission regulations',
      'Municipal utility service standards',
      'Customer service guarantee programs',
    ],
  },

  // HOA Regulations
  hoaRegulations: {
    governingDocuments: [
      'CC&Rs (Covenants, Conditions & Restrictions)',
      'HOA Bylaws',
      'Architectural Guidelines',
      'House Rules and Regulations',
    ],
    stateLaws: {
      uniform: 'Uniform Common Interest Ownership Act (UCIOA)',
      disclosure: 'State-specific HOA disclosure requirements',
      disputeResolution: 'State-mandated mediation/arbitration procedures',
    },
    responsibilities: {
      commonAreas: 'HOA must maintain common area health and safety',
      utilities: 'HOA responsible for shared utility systems',
      hazards: 'Duty to address known hazards in common areas',
    },
  },
};

// Helper function to get relevant regulations based on issue and location
export function getRelevantRegulations(issueType, state, recipientType) {
  const regulations = [];

  // Always include federal regulations
  if (regulatoryKnowledgeBase.federal[issueType]) {
    regulations.push({
      level: 'federal',
      data: regulatoryKnowledgeBase.federal[issueType],
    });
  }

  // Add state-specific regulations if available
  if (
    state &&
    regulatoryKnowledgeBase.states[state] &&
    regulatoryKnowledgeBase.states[state][issueType]
  ) {
    regulations.push({
      level: 'state',
      state: state,
      data: regulatoryKnowledgeBase.states[state][issueType],
    });
  }

  // Add HOA-specific regulations if applicable
  if (recipientType === 'hoa') {
    regulations.push({
      level: 'hoa',
      data: regulatoryKnowledgeBase.hoaRegulations,
    });
  }

  return regulations;
}

// Mapping of issue types to regulatory categories
export const issueTypeMapping = {
  'air-quality': 'airQuality',
  'water-quality': 'waterQuality',
  'hvac-ventilation': 'hvacVentilation',
  'lead-asbestos': 'hazardousMaterials',
  structural: 'housingRights',
  radon: 'hazardousMaterials',
  'carbon-monoxide': 'hazardousMaterials',
  'pest-infestation': 'housingRights',
  'noise-pollution': 'housingRights',
  'utility-access': 'housingRights',
  electromagnetic: 'airQuality',
};

export default regulatoryKnowledgeBase;
