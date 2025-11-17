// Email Template Library for HomeLLM
// Pre-built templates for common scenarios

export const emailTemplates = {
  // Mold Issues
  'mold-initial': {
    name: 'Mold - Initial Request',
    issueType: 'air-quality',
    escalationLevel: 'initial',
    urgencyLevel: 'high',
    description: 'First contact about mold issue',
    template: {
      evidence: 'I have discovered visible mold growth in [LOCATION]. The affected area measures approximately [SIZE]. The mold appears [COLOR/DESCRIPTION]. I first noticed this on [DATE].',
      measurements: 'DIY mold test shows [SPORE COUNT] or professional inspection report attached.',
      healthImpact: '[NUMBER] residents experiencing [SYMPTOMS: respiratory issues, allergic reactions, etc.]',
      desiredOutcome: 'Professional mold inspection within 48-72 hours, followed by certified mold remediation plan within 5 business days. Temporary air purifiers provided during remediation.'
    }
  },

  'mold-followup': {
    name: 'Mold - Follow-up',
    issueType: 'air-quality',
    escalationLevel: 'professional',
    urgencyLevel: 'high',
    description: 'Follow-up when no response received',
    template: {
      evidence: 'This is a follow-up to my initial request sent on [DATE]. The mold problem continues to worsen. The affected area has expanded from [ORIGINAL SIZE] to [CURRENT SIZE].',
      previousContact: 'Initial email sent [DATE], no response received. Phone call on [DATE], left voicemail with [NAME/EXTENSION].',
      healthImpact: 'Health symptoms have worsened: [DETAILS]. Medical consultation on [DATE] confirmed exposure-related issues.',
      desiredOutcome: 'Immediate response within 24 hours. Professional mold inspection scheduled within 48 hours. Clear timeline for remediation.'
    }
  },

  // Water Quality Issues
  'water-contamination': {
    name: 'Water Contamination',
    issueType: 'water-quality',
    escalationLevel: 'initial',
    urgencyLevel: 'high',
    description: 'Water quality concerns',
    template: {
      evidence: 'Water quality report shows elevated levels of [CONTAMINANT]. Testing conducted on [DATE] by [LAB NAME].',
      measurements: '[CONTAMINANT]: [LEVEL] [UNIT] (EPA MCL: [STANDARD])',
      healthImpact: 'Vulnerable populations affected: [children under 6 / pregnant women / elderly / immunocompromised]',
      desiredOutcome: 'Immediate provision of bottled water. Independent water quality testing within 3 days. Remediation plan within 7 days. Monthly testing until resolved.'
    }
  },

  // Lead Paint
  'lead-paint': {
    name: 'Lead Paint Hazard',
    issueType: 'lead-asbestos',
    escalationLevel: 'formal',
    urgencyLevel: 'emergency',
    description: 'Lead paint in pre-1978 housing with children',
    template: {
      evidence: 'Property built in [YEAR, pre-1978]. Peeling/chipping paint observed in [LOCATIONS]. Children under 6 residing in unit.',
      measurements: 'Lead test results: [PPM] or [µg/dL if blood test]',
      healthImpact: 'Child(ren) ages [AGES] at risk of lead poisoning. Developmental delays, learning disabilities, and other serious health effects.',
      desiredOutcome: 'Immediate lead hazard assessment by EPA-certified inspector. Lead-safe work practices for all repairs. Dust clearance testing. Temporary relocation during abatement if needed.'
    }
  },

  // Pest Infestation
  'pest-infestation': {
    name: 'Pest Infestation',
    issueType: 'pest-infestation',
    escalationLevel: 'professional',
    urgencyLevel: 'medium',
    description: 'Rodent or insect infestation',
    template: {
      evidence: 'Evidence of [TYPE] infestation: droppings, damage to [AREAS], sightings of live [PESTS]. Photos attached showing [DETAILS].',
      measurements: 'Approximately [NUMBER] droppings found. Damage to [ITEMS]. Sightings occur [FREQUENCY].',
      healthImpact: 'Health risks include disease transmission, allergens, food contamination. [NUMBER] residents affected.',
      desiredOutcome: 'Licensed pest control service within 48 hours. Follow-up treatments as recommended. Identification and sealing of entry points. Monthly inspections until problem resolved.'
    }
  },

  // HVAC Issues
  'hvac-failure-winter': {
    name: 'Heating Failure - Winter',
    issueType: 'hvac-ventilation',
    escalationLevel: 'initial',
    urgencyLevel: 'emergency',
    description: 'No heat during cold weather',
    template: {
      evidence: 'Heating system failure. System not producing heat since [DATE/TIME]. Thermostat set to [TEMP] but unit not responding.',
      measurements: 'Current indoor temperature: [TEMP]°F. Outdoor temperature: [TEMP]°F. Recommended minimum: 68°F per housing codes.',
      healthImpact: '[NUMBER] residents including [vulnerable populations: elderly, young children, disabled]. Risk of hypothermia.',
      desiredOutcome: 'Emergency repair service within 4 hours per [STATE] landlord-tenant law. Temporary heating units provided immediately if repair delayed. Hotel accommodation reimbursement if uninhabitable.'
    }
  },

  'hvac-failure-summer': {
    name: 'AC Failure - Summer',
    issueType: 'hvac-ventilation',
    escalationLevel: 'initial',
    urgencyLevel: 'high',
    description: 'No cooling during hot weather',
    template: {
      evidence: 'Air conditioning system failure since [DATE/TIME]. Indoor temperature currently [TEMP]°F.',
      measurements: 'Indoor temp: [TEMP]°F. Outdoor temp: [TEMP]°F. Heat index: [VALUE].',
      healthImpact: 'Heat-related health risks for [NUMBER] residents. Elderly/medical conditions present.',
      desiredOutcome: 'AC repair within 24 hours. Portable AC units provided if repair delayed. Temperature maintained at safe levels per habitability standards.'
    }
  },

  // Utility Issues
  'utility-shutoff': {
    name: 'Utility Shut-off Threat',
    issueType: 'utility-access',
    escalationLevel: 'formal',
    urgencyLevel: 'emergency',
    description: 'Threatened or actual utility disconnection',
    template: {
      evidence: 'Received shut-off notice dated [DATE] for [UTILITY TYPE]. Account current/dispute over charges.',
      measurements: 'Account number: [NUMBER]. Amount in dispute: $[AMOUNT].',
      healthImpact: 'Loss of essential service affecting health and safety of [NUMBER] residents including [vulnerable populations].',
      desiredOutcome: 'Immediate halt of disconnection. Payment plan if arrears legitimate. Investigation of billing errors. Restoration of service within 24 hours if already disconnected.'
    }
  },

  // Noise Issues
  'noise-complaint': {
    name: 'Noise Complaint',
    issueType: 'noise-pollution',
    escalationLevel: 'professional',
    urgencyLevel: 'medium',
    description: 'Excessive noise from neighbors or building systems',
    template: {
      evidence: 'Excessive noise from [SOURCE] occurring [FREQUENCY/TIMES]. Log of incidents attached covering [DATE RANGE].',
      measurements: 'Noise level measured at [DECIBELS] dB using [DEVICE]. Local ordinance limit: [LIMIT] dB.',
      healthImpact: 'Sleep deprivation affecting [NUMBER] residents. Work performance, child behavior, stress levels impacted.',
      desiredOutcome: 'Investigation of noise source. Enforcement of quiet hours per lease/local ordinance. Soundproofing improvements. Neighbor mediation if applicable.'
    }
  },

  // Structural Issues
  'structural-hazard': {
    name: 'Structural Safety Hazard',
    issueType: 'structural',
    escalationLevel: 'formal',
    urgencyLevel: 'emergency',
    description: 'Structural integrity concerns',
    template: {
      evidence: 'Structural concerns observed: [CRACKS, SAGGING, SHIFTING, etc.] in [LOCATION]. Problem worsening since first noticed on [DATE].',
      measurements: 'Crack width: [MEASUREMENT]. Area affected: [SIZE]. Photos attached showing progression.',
      healthImpact: 'Immediate safety risk. Risk of collapse, falling debris, or injury. Unit may be uninhabitable.',
      desiredOutcome: 'Immediate professional structural engineering inspection. Temporary evacuation/relocation if unsafe. Comprehensive repair plan with timeline. Code compliance verification.'
    }
  },

  // Radon
  'radon-high': {
    name: 'Elevated Radon Levels',
    issueType: 'radon',
    escalationLevel: 'professional',
    urgencyLevel: 'high',
    description: 'Radon test shows elevated levels',
    template: {
      evidence: 'Radon test conducted [DATE] shows elevated levels. Test conducted by [LAB/DIY KIT].',
      measurements: 'Radon level: [VALUE] pCi/L (EPA action level: 4.0 pCi/L)',
      healthImpact: 'Long-term lung cancer risk for all residents. Second leading cause of lung cancer after smoking.',
      desiredOutcome: 'Professional radon mitigation system installation. Post-mitigation testing to confirm levels below 4.0 pCi/L. Annual testing thereafter.'
    }
  },

  // Carbon Monoxide
  'carbon-monoxide': {
    name: 'Carbon Monoxide Detection',
    issueType: 'carbon-monoxide',
    escalationLevel: 'formal',
    urgencyLevel: 'emergency',
    description: 'CO detector alarm or positive test',
    template: {
      evidence: 'Carbon monoxide detected by [DETECTOR TYPE]. Alarm occurred on [DATE/TIME].',
      measurements: 'CO level: [PPM] (OSHA 8-hr limit: 50 PPM; Immediately dangerous: 70 PPM)',
      healthImpact: 'IMMEDIATE LIFE-THREATENING EMERGENCY. Residents evacuated. Symptoms: [HEADACHE, DIZZINESS, NAUSEA, etc.]',
      desiredOutcome: 'IMMEDIATE emergency response. Gas company inspection. HVAC/furnace/appliance inspection and repair by licensed professional. CO detectors in all units. Clearance testing before re-occupancy.'
    }
  }
};

// Template categories for easy browsing
export const templateCategories = {
  'Air Quality & Mold': ['mold-initial', 'mold-followup'],
  'Water Quality': ['water-contamination'],
  'Hazardous Materials': ['lead-paint', 'radon-high', 'carbon-monoxide'],
  'Pests': ['pest-infestation'],
  'HVAC': ['hvac-failure-winter', 'hvac-failure-summer'],
  'Utilities': ['utility-shutoff'],
  'Noise': ['noise-complaint'],
  'Structural': ['structural-hazard']
};

/**
 * Get template by ID
 */
export function getTemplate(templateId) {
  return emailTemplates[templateId];
}

/**
 * Get all templates for a category
 */
export function getTemplatesByCategory(category) {
  const templateIds = templateCategories[category] || [];
  return templateIds.map(id => ({
    id,
    ...emailTemplates[id]
  }));
}

/**
 * Get all templates
 */
export function getAllTemplates() {
  return Object.keys(emailTemplates).map(id => ({
    id,
    ...emailTemplates[id]
  }));
}

/**
 * Apply template to form data
 */
export function applyTemplate(templateId, currentFormData) {
  const template = emailTemplates[templateId];
  if (!template) return currentFormData;

  return {
    ...currentFormData,
    issueType: template.issueType,
    escalationLevel: template.escalationLevel,
    urgencyLevel: template.urgencyLevel,
    evidence: template.template.evidence || currentFormData.evidence,
    measurements: template.template.measurements || currentFormData.measurements,
    previousContact: template.template.previousContact || currentFormData.previousContact,
    healthImpact: template.template.healthImpact || currentFormData.healthImpact,
    desiredOutcome: template.template.desiredOutcome || currentFormData.desiredOutcome
  };
}

/**
 * Replace variables in template text
 * Variables are in [VARIABLE_NAME] format
 */
export function replaceTemplateVariables(text, variables) {
  let result = text;

  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`\\[${key}\\]`, 'gi');
    result = result.replace(regex, variables[key]);
  });

  return result;
}

export default {
  emailTemplates,
  templateCategories,
  getTemplate,
  getTemplatesByCategory,
  getAllTemplates,
  applyTemplate,
  replaceTemplateVariables
};
