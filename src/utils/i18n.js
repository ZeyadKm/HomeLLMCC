// Internationalization utilities
// Supports English and Spanish

const translations = {
  en: {
    // Header
    appTitle: 'HomeLLM - AI-Powered Home Advocacy',
    appSubtitle: 'Generate professional emails • Analyze documents • Discover benefits',
    apiKeyPlaceholder: 'Enter your Anthropic API key',
    apiKeyLink: 'Get API Key',

    // Tabs
    tabEmail: 'Email',
    tabWater: 'Water',
    tabWarranty: 'Warranty',
    tabLease: 'Lease',
    tabInspection: 'Inspection',
    tabInsurance: 'Insurance',
    tabUtility: 'Utility',
    tabTimeline: 'Timeline',
    tabCalculator: 'Calculator',
    tabDrafts: 'Drafts',

    // Buttons
    btnGenerate: 'Generate Email',
    btnAnalyze: 'Analyze',
    btnCopy: 'Copy',
    btnDownload: 'Download',
    btnSave: 'Save Draft',
    btnVerify: 'Verify Regulations',
    btnLookupCodes: 'Lookup Building Codes',
    btnUseInEmail: 'Use in Email',
    btnStartVoice: 'Start Voice Input',
    btnStopVoice: 'Stop Voice Input',

    // Common
    loading: 'Loading...',
    generating: 'Generating...',
    analyzing: 'Analyzing...',
    copied: 'Copied!',
    error: 'Error',
    success: 'Success',

    // Issue Types
    issueAirQuality: 'Air Quality / Mold / VOCs',
    issueWaterQuality: 'Water Quality / Contamination',
    issueHVAC: 'HVAC / Ventilation Issues',
    issueLeadAsbestos: 'Lead / Asbestos / Hazardous Materials',
    issuePest: 'Pest Infestation',
    issueStructural: 'Structural / Safety Hazards',
    issueNoise: 'Noise Pollution',
    issueUtility: 'Utility Access / Service Issues',
    issueRadon: 'Radon Detection',
    issueCO: 'Carbon Monoxide / Gas Leaks',
    issueEMF: 'EMF / Electromagnetic Fields',

    // Form Labels
    labelIssueType: 'Issue Type',
    labelRecipient: 'Who are you contacting?',
    labelLocation: 'Property Address',
    labelCity: 'City',
    labelState: 'State',
    labelEvidence: 'Evidence Description',
    labelMeasurements: 'Measurements/Test Results',
    labelPreviousContact: 'Previous Communication',
    labelHealthImpact: 'Health Impact',
    labelDesiredOutcome: 'Desired Outcome',
    labelEscalation: 'Escalation Level',
    labelUrgency: 'Urgency Level',
    labelSenderName: 'Your Name',
    labelSenderEmail: 'Your Email',
    labelSenderPhone: 'Your Phone',
    labelSenderAddress: 'Your Address',

    // Escalation Levels
    escalationInitial: 'Initial Request',
    escalationProfessional: 'Professional Follow-up',
    escalationFormal: 'Formal Complaint',
    escalationLegal: 'Legal Notice',

    // Urgency Levels
    urgencyLow: 'Low',
    urgencyMedium: 'Medium',
    urgencyHigh: 'High',
    urgencyEmergency: 'Emergency',

    // Messages
    msgEmergency: 'This appears to be an emergency situation. Consider calling 911 or local emergency services immediately.',
    msgHighUrgency: 'This issue requires urgent attention.',
    msgNoApiKey: 'Please enter your Anthropic API key to use this feature.',
    msgInvalidApiKey: 'Invalid API key format. Must start with "sk-ant-"',
    msgNoDrafts: 'No saved drafts yet',
    msgGenerateSuccess: 'Email generated successfully!',
    msgAnalysisComplete: 'Analysis complete!',

    // Cost Calculator
    calcTitle: 'Damage & Cost Calculator',
    calcRepairCost: 'Estimated Repair Cost',
    calcMedicalCost: 'Medical Expenses',
    calcLostWages: 'Lost Wages/Work',
    calcPropertyDamage: 'Property Damage',
    calcTemporaryHousing: 'Temporary Housing',
    calcOther: 'Other Costs',
    calcTotal: 'Total Estimated Damages',

    // Timeline
    timelineTitle: 'Incident Timeline',
    timelineAddEvent: 'Add Event',
    timelineDate: 'Date',
    timelineEvent: 'Event Description',
    timelineDelete: 'Delete',

    // Help
    helpTooltipApiKey: 'Your Anthropic API key is required to use AI features. Get one at console.anthropic.com',
    helpTooltipVoice: 'Click to use voice input for describing your issue',
    helpTooltipAttachments: 'Attach photos or documents as evidence (max 5MB per image, 32MB for PDFs)',
  },

  es: {
    // Header
    appTitle: 'HomeLLM - Defensa del Hogar con IA',
    appSubtitle: 'Genera correos profesionales • Analiza documentos • Descubre beneficios',
    apiKeyPlaceholder: 'Ingrese su clave API de Anthropic',
    apiKeyLink: 'Obtener Clave API',

    // Tabs
    tabEmail: 'Correo',
    tabWater: 'Agua',
    tabWarranty: 'Garantía',
    tabLease: 'Contrato',
    tabInspection: 'Inspección',
    tabInsurance: 'Seguro',
    tabUtility: 'Servicios',
    tabTimeline: 'Cronología',
    tabCalculator: 'Calculadora',
    tabDrafts: 'Borradores',

    // Buttons
    btnGenerate: 'Generar Correo',
    btnAnalyze: 'Analizar',
    btnCopy: 'Copiar',
    btnDownload: 'Descargar',
    btnSave: 'Guardar Borrador',
    btnVerify: 'Verificar Regulaciones',
    btnLookupCodes: 'Buscar Códigos',
    btnUseInEmail: 'Usar en Correo',
    btnStartVoice: 'Iniciar Voz',
    btnStopVoice: 'Detener Voz',

    // Common
    loading: 'Cargando...',
    generating: 'Generando...',
    analyzing: 'Analizando...',
    copied: '¡Copiado!',
    error: 'Error',
    success: 'Éxito',

    // Issue Types
    issueAirQuality: 'Calidad del Aire / Moho / COVs',
    issueWaterQuality: 'Calidad del Agua / Contaminación',
    issueHVAC: 'HVAC / Problemas de Ventilación',
    issueLeadAsbestos: 'Plomo / Amianto / Materiales Peligrosos',
    issuePest: 'Infestación de Plagas',
    issueStructural: 'Peligros Estructurales / de Seguridad',
    issueNoise: 'Contaminación Acústica',
    issueUtility: 'Acceso a Servicios Públicos',
    issueRadon: 'Detección de Radón',
    issueCO: 'Monóxido de Carbono / Fugas de Gas',
    issueEMF: 'CEM / Campos Electromagnéticos',

    // Form Labels
    labelIssueType: 'Tipo de Problema',
    labelRecipient: '¿A quién está contactando?',
    labelLocation: 'Dirección de la Propiedad',
    labelCity: 'Ciudad',
    labelState: 'Estado',
    labelEvidence: 'Descripción de Evidencia',
    labelMeasurements: 'Mediciones/Resultados',
    labelPreviousContact: 'Comunicación Previa',
    labelHealthImpact: 'Impacto en la Salud',
    labelDesiredOutcome: 'Resultado Deseado',
    labelEscalation: 'Nivel de Escalación',
    labelUrgency: 'Nivel de Urgencia',
    labelSenderName: 'Su Nombre',
    labelSenderEmail: 'Su Correo',
    labelSenderPhone: 'Su Teléfono',
    labelSenderAddress: 'Su Dirección',

    // Escalation Levels
    escalationInitial: 'Solicitud Inicial',
    escalationProfessional: 'Seguimiento Profesional',
    escalationFormal: 'Queja Formal',
    escalationLegal: 'Aviso Legal',

    // Urgency Levels
    urgencyLow: 'Baja',
    urgencyMedium: 'Media',
    urgencyHigh: 'Alta',
    urgencyEmergency: 'Emergencia',

    // Messages
    msgEmergency: 'Esta parece ser una situación de emergencia. Considere llamar al 911 o servicios de emergencia locales.',
    msgHighUrgency: 'Este problema requiere atención urgente.',
    msgNoApiKey: 'Por favor ingrese su clave API de Anthropic para usar esta función.',
    msgInvalidApiKey: 'Formato de clave API inválido. Debe comenzar con "sk-ant-"',
    msgNoDrafts: 'No hay borradores guardados',
    msgGenerateSuccess: '¡Correo generado exitosamente!',
    msgAnalysisComplete: '¡Análisis completo!',

    // Cost Calculator
    calcTitle: 'Calculadora de Daños y Costos',
    calcRepairCost: 'Costo Estimado de Reparación',
    calcMedicalCost: 'Gastos Médicos',
    calcLostWages: 'Salarios Perdidos',
    calcPropertyDamage: 'Daño a la Propiedad',
    calcTemporaryHousing: 'Alojamiento Temporal',
    calcOther: 'Otros Costos',
    calcTotal: 'Total de Daños Estimados',

    // Timeline
    timelineTitle: 'Cronología del Incidente',
    timelineAddEvent: 'Agregar Evento',
    timelineDate: 'Fecha',
    timelineEvent: 'Descripción del Evento',
    timelineDelete: 'Eliminar',

    // Help
    helpTooltipApiKey: 'Se requiere su clave API de Anthropic para usar funciones de IA. Obtenga una en console.anthropic.com',
    helpTooltipVoice: 'Haga clic para usar entrada de voz para describir su problema',
    helpTooltipAttachments: 'Adjunte fotos o documentos como evidencia (máx. 5MB por imagen, 32MB para PDFs)',
  }
};

export function useTranslation() {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('homellm_language');
    if (saved) return saved;

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    return translations[browserLang] ? browserLang : 'en';
  });

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('homellm_language', lang);
    }
  };

  return { t, language, changeLanguage, availableLanguages: Object.keys(translations) };
}

export default { useTranslation, translations };
