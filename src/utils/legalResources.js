// Legal Resources Database for HomeLLM
// Contextual links to relevant laws, standards, and resources

export const legalResources = {
  // Federal Resources
  federal: {
    'air-quality': [
      {
        name: 'EPA Indoor Air Quality',
        url: 'https://www.epa.gov/indoor-air-quality-iaq',
        description: 'EPA standards and guidance for indoor air quality'
      },
      {
        name: 'OSHA Air Contaminants Standard',
        url: 'https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1000',
        description: 'Occupational exposure limits for air contaminants'
      },
      {
        name: 'HUD Healthy Homes',
        url: 'https://www.hud.gov/program_offices/healthy_homes',
        description: 'HUD guidance on healthy housing and indoor air quality'
      }
    ],
    'water-quality': [
      {
        name: 'EPA Safe Drinking Water Act',
        url: 'https://www.epa.gov/sdwa',
        description: 'Federal standards for public water systems'
      },
      {
        name: 'EPA National Primary Drinking Water Regulations',
        url: 'https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations',
        description: 'Maximum contaminant levels for drinking water'
      },
      {
        name: 'Consumer Confidence Reports',
        url: 'https://www.epa.gov/ccr',
        description: 'How to read and understand water quality reports'
      }
    ],
    'lead-asbestos': [
      {
        name: 'EPA Lead-Based Paint Disclosure Rule',
        url: 'https://www.epa.gov/lead/real-estate-disclosure',
        description: 'Requirements for lead paint disclosure in pre-1978 housing'
      },
      {
        name: 'HUD Lead Safe Housing Rule',
        url: 'https://www.hud.gov/program_offices/healthy_homes/lbp/hudlshr',
        description: 'Requirements for lead hazard evaluation and control'
      },
      {
        name: 'EPA Asbestos Regulations',
        url: 'https://www.epa.gov/asbestos',
        description: 'Federal regulations on asbestos in buildings'
      },
      {
        name: 'OSHA Asbestos Standards',
        url: 'https://www.osha.gov/asbestos',
        description: 'Worker protection standards for asbestos'
      }
    ],
    'pest-infestation': [
      {
        name: 'EPA Pest Control',
        url: 'https://www.epa.gov/managing-pests-schools',
        description: 'Safe and effective pest control practices'
      },
      {
        name: 'CDC Vector Control',
        url: 'https://www.cdc.gov/rodents/',
        description: 'Health risks and prevention of pest-borne diseases'
      }
    ],
    'hvac-ventilation': [
      {
        name: 'ASHRAE Ventilation Standards',
        url: 'https://www.ashrae.org/technical-resources/standards-and-guidelines',
        description: 'Industry standards for ventilation and indoor air quality'
      },
      {
        name: 'DOE Energy Efficiency',
        url: 'https://www.energy.gov/energysaver',
        description: 'HVAC efficiency and maintenance guidance'
      }
    ],
    'radon': [
      {
        name: 'EPA Radon Information',
        url: 'https://www.epa.gov/radon',
        description: 'EPA action levels and mitigation guidance for radon'
      },
      {
        name: 'Surgeon General Radon Health Advisory',
        url: 'https://www.epa.gov/radon/health-risk-radon',
        description: 'Health risks of radon exposure'
      }
    ],
    'carbon-monoxide': [
      {
        name: 'CPSC Carbon Monoxide Information',
        url: 'https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/Carbon-Monoxide-Information-Center',
        description: 'CO detector requirements and safety information'
      },
      {
        name: 'CDC Carbon Monoxide Poisoning',
        url: 'https://www.cdc.gov/co/default.htm',
        description: 'Health effects and prevention of CO poisoning'
      }
    ],
    'structural': [
      {
        name: 'International Building Code (ICC)',
        url: 'https://www.iccsafe.org/products-and-services/i-codes/code-books/',
        description: 'Model building codes adopted by most jurisdictions'
      },
      {
        name: 'OSHA Construction Standards',
        url: 'https://www.osha.gov/construction',
        description: 'Safety standards for building construction and repair'
      }
    ]
  },

  // State Resources (sample - would be expanded for all states)
  state: {
    California: {
      general: [
        {
          name: 'CA Civil Code - Landlord-Tenant',
          url: 'https://leginfo.legislature.ca.gov/faces/codes_displayexpandedbranch.xhtml?tocCode=CIV&division=3.&title=5.&part=4.&chapter=2.&article=',
          description: 'California landlord-tenant laws and habitability standards'
        },
        {
          name: 'CA Dept of Consumer Affairs - Tenants',
          url: 'https://www.dca.ca.gov/publications/landlordbook/catenant.pdf',
          description: 'California Tenants Rights handbook'
        }
      ],
      'lead-asbestos': [
        {
          name: 'CA Health & Safety Code §17920',
          url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=17920',
          description: 'California lead hazard standards'
        }
      ]
    },
    NewYork: {
      general: [
        {
          name: 'NY Real Property Law',
          url: 'https://www.nysenate.gov/legislation/laws/RPP',
          description: 'New York landlord-tenant law'
        },
        {
          name: 'NYC Housing Maintenance Code',
          url: 'https://www1.nyc.gov/site/hpd/about/hmc.page',
          description: 'NYC housing standards and violations'
        }
      ]
    },
    Texas: {
      general: [
        {
          name: 'TX Property Code',
          url: 'https://statutes.capitol.texas.gov/Docs/PR/htm/PR.92.htm',
          description: 'Texas residential tenancies law'
        }
      ]
    }
  },

  // National Organizations
  organizations: {
    'tenant-rights': [
      {
        name: 'National Housing Law Project',
        url: 'https://www.nhlp.org/',
        description: 'Legal advocacy for housing justice'
      },
      {
        name: 'Legal Services Corporation',
        url: 'https://www.lsc.gov/what-legal-aid/find-legal-aid',
        description: 'Find free legal aid in your area'
      },
      {
        name: 'National Low Income Housing Coalition',
        url: 'https://nlihc.org/',
        description: 'Affordable housing advocacy and resources'
      }
    ],
    'health': [
      {
        name: 'National Center for Healthy Housing',
        url: 'https://nchh.org/',
        description: 'Research and resources on housing-related health hazards'
      },
      {
        name: 'Healthy Homes Partnership',
        url: 'https://nchh.org/tools-and-data/',
        description: 'Tools and data for healthy housing'
      }
    ],
    'environmental': [
      {
        name: 'Environmental Working Group',
        url: 'https://www.ewg.org/',
        description: 'Consumer guides and advocacy on environmental health'
      },
      {
        name: 'Natural Resources Defense Council',
        url: 'https://www.nrdc.org/',
        description: 'Environmental law and advocacy'
      }
    ]
  },

  // Standards Organizations
  standards: [
    {
      name: 'American Society of Heating, Refrigerating and Air-Conditioning Engineers (ASHRAE)',
      url: 'https://www.ashrae.org/',
      description: 'HVAC and IAQ standards'
    },
    {
      name: 'American Industrial Hygiene Association (AIHA)',
      url: 'https://www.aiha.org/',
      description: 'Occupational and environmental health standards'
    },
    {
      name: 'National Fire Protection Association (NFPA)',
      url: 'https://www.nfpa.org/',
      description: 'Fire and safety codes'
    }
  ]
};

/**
 * Get relevant resources for an issue type
 */
export function getResourcesForIssue(issueType, state = null) {
  const resources = {
    federal: legalResources.federal[issueType] || [],
    state: [],
    organizations: legalResources.organizations['tenant-rights'] || []
  };

  // Add state-specific resources if available
  if (state && legalResources.state[state]) {
    resources.state = [
      ...(legalResources.state[state].general || []),
      ...(legalResources.state[state][issueType] || [])
    ];
  }

  return resources;
}

/**
 * Get all organizations
 */
export function getAllOrganizations() {
  return legalResources.organizations;
}

/**
 * Get standards organizations
 */
export function getStandards() {
  return legalResources.standards;
}

export default {
  legalResources,
  getResourcesForIssue,
  getAllOrganizations,
  getStandards
};
