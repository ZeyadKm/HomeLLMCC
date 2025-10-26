import React, { useState, useEffect } from 'react';
import { Send, FileText, AlertCircle, CheckCircle, Loader2, Copy, Download, Droplet, Shield, FileCheck, Mail, Upload, X, Eye, EyeOff, Save, Clock, ExternalLink, Search, Info, Sparkles } from 'lucide-react';
import { getRelevantRegulations, issueTypeMapping } from './regulatory-knowledge-base';
import { systemPrompt, generateEmailPrompt, generateDocumentAnalysisPrompt, generateSubjectLine } from './email-prompt-engine';
import * as API from './api-integration';
import * as WebVerify from './web-verification';
import WaterAnalysisResults from './components/WaterAnalysisResults';
import { InputField, SelectField, TextareaField, LoadingState, Alert, Card, Badge, Tooltip, SectionHeader } from './components/UIComponents';

export default function HomeLLM() {
  const [activeTab, setActiveTab] = useState('email');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyError, setApiKeyError] = useState('');

  // Email Generator State
  const [formData, setFormData] = useState({
    issueType: '',
    recipient: '',
    location: '',
    city: '',
    state: '',
    evidence: '',
    measurements: '',
    previousContact: '',
    healthImpact: '',
    regulations: '',
    desiredOutcome: '',
    escalationLevel: 'professional',
    affectedResidents: '',
    propertyAge: '',
    urgencyLevel: 'medium',
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderAddress: ''
  });

  const [generatedEmail, setGeneratedEmail] = useState('');
  const [generatedSubject, setGeneratedSubject] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [attachedImages, setAttachedImages] = useState([]);
  const [isLookingUpCodes, setIsLookingUpCodes] = useState(false);
  const [copied, setCopied] = useState(false);
  const [urgencyAlert, setUrgencyAlert] = useState(null);
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [verificationReport, setVerificationReport] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  // Document Analysis State
  const [waterReport, setWaterReport] = useState(null);
  const [waterAnalysis, setWaterAnalysis] = useState(null);
  const [isAnalyzingWater, setIsAnalyzingWater] = useState(false);
  const [warrantyDoc, setWarrantyDoc] = useState(null);
  const [warrantyAnalysis, setWarrantyAnalysis] = useState(null);
  const [isAnalyzingWarranty, setIsAnalyzingWarranty] = useState(false);

  // Load saved drafts on mount
  useEffect(() => {
    setSavedDrafts(API.loadEmailDrafts());
  }, []);

  // Load API key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('homellm_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // Save API key to localStorage when it changes
  const handleApiKeyChange = (e) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    setApiKeyError('');

    if (newKey.trim()) {
      const validation = API.validateApiKey(newKey);
      if (!validation.valid) {
        setApiKeyError(validation.error);
      } else {
        localStorage.setItem('homellm_api_key', newKey);
      }
    }
  };

  const issueTypes = [
    { value: 'air-quality', label: 'Air Quality / Mold / VOCs' },
    { value: 'water-quality', label: 'Water Quality / Contamination' },
    { value: 'hvac-ventilation', label: 'HVAC / Ventilation Issues' },
    { value: 'lead-asbestos', label: 'Lead / Asbestos / Hazardous Materials' },
    { value: 'pest-infestation', label: 'Pest Infestation' },
    { value: 'structural', label: 'Structural / Safety Hazards' },
    { value: 'noise-pollution', label: 'Noise Pollution' },
    { value: 'utility-access', label: 'Utility Access / Service Issues' },
    { value: 'radon', label: 'Radon Detection' },
    { value: 'carbon-monoxide', label: 'Carbon Monoxide / Gas Leaks' },
    { value: 'electromagnetic', label: 'EMF / Electromagnetic Fields' }
  ];

  const recipients = [
    { value: 'hoa', label: 'Homeowners Association (HOA)' },
    { value: 'property-mgmt', label: 'Property Management / Landlord' },
    { value: 'utility', label: 'Utility Company' },
    { value: 'local-govt', label: 'Local Government / City Council' },
    { value: 'state-agency', label: 'State Environmental/Health Agency' },
    { value: 'federal-agency', label: 'Federal Agency (EPA, HUD, etc.)' },
    { value: 'nonprofit', label: 'Advocacy Nonprofit / Legal Aid' }
  ];

  const escalationLevels = [
    { value: 'initial', label: 'Initial Request', description: 'Polite inquiry, first contact' },
    { value: 'professional', label: 'Professional Follow-up', description: 'Firm but courteous, cite obligations' },
    { value: 'formal', label: 'Formal Complaint', description: 'Document violations, demand action' },
    { value: 'legal', label: 'Legal Notice', description: 'Pre-legal action, indicate consequences' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', description: 'Non-urgent, quality of life issue' },
    { value: 'medium', label: 'Medium', description: 'Needs attention, affecting comfort/health' },
    { value: 'high', label: 'High', description: 'Serious health risk, requires prompt action' },
    { value: 'emergency', label: 'Emergency', description: 'Immediate safety hazard' }
  ];

  const statesList = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Check urgency when measurements or health impact change
    if (name === 'measurements' || name === 'healthImpact') {
      const alert = API.assessUrgency(formData.issueType,
        name === 'measurements' ? value : formData.measurements,
        name === 'healthImpact' ? value : formData.healthImpact
      );
      if (alert.emergency || alert.highUrgency) {
        setUrgencyAlert(alert);
      } else {
        setUrgencyAlert(null);
      }
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve({
          name: file.name,
          data: event.target.result,
          type: file.type
        });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setAttachedImages(prev => [...prev, ...images]);
    }).catch(err => {
      setError('Failed to load images: ' + err.message);
    });
  };

  const removeImage = (index) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleLookupCodes = async () => {
    if (!formData.city || !formData.state || !formData.issueType) {
      setError('Please select issue type, city, and state first');
      return;
    }

    const validation = API.validateApiKey(apiKey);
    if (!validation.valid) {
      setApiKeyError(validation.error);
      return;
    }

    setIsLookingUpCodes(true);
    setError('');

    try {
      const result = await API.lookupBuildingCodes(apiKey, formData.city, formData.state, formData.issueType);

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          regulations: (prev.regulations ? prev.regulations + '\n\n' : '') +
                       '=== AUTO-LOOKED UP CODES ===\n' + result.codes
        }));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to lookup codes: ' + err.message);
    } finally {
      setIsLookingUpCodes(false);
    }
  };

  const validateForm = () => {
    const required = ['issueType', 'recipient', 'location', 'city', 'state', 'evidence', 'desiredOutcome', 'senderName', 'senderEmail'];
    const errors = {};

    required.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });

    // Validate email format
    if (formData.senderEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.senderEmail)) {
      errors.senderEmail = 'Please enter a valid email address';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError('Please fill in all required fields correctly');
      return false;
    }

    return true;
  };

  const handleGenerateEmail = async () => {
    if (!validateForm()) {
      return;
    }

    const validation = API.validateApiKey(apiKey);
    if (!validation.valid) {
      setApiKeyError(validation.error);
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedEmail('');
    setVerificationReport(null);

    try {
      // Get relevant regulations
      const categoryKey = issueTypeMapping[formData.issueType];
      const regulations = getRelevantRegulations(categoryKey, formData.state, formData.recipient);

      // Generate prompt
      const userPrompt = generateEmailPrompt(formData, regulations, attachedImages);

      // Generate subject line
      const subject = generateSubjectLine(formData.issueType, formData.escalationLevel, formData.location);
      setGeneratedSubject(subject);

      // Call API
      const result = await API.generateEmail(apiKey, systemPrompt, userPrompt, attachedImages);

      if (result.success) {
        setGeneratedEmail(result.email);
      } else {
        setError('Failed to generate email');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerifyRegulations = async () => {
    if (!formData.issueType || !formData.state || !formData.city) {
      setError('Please select issue type, state, and city first');
      return;
    }

    if (!generatedEmail) {
      setError('Please generate an email first before verifying');
      return;
    }

    const validation = API.validateApiKey(apiKey);
    if (!validation.valid) {
      setApiKeyError(validation.error);
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // Verify current regulations via web research
      const verification = await WebVerify.verifyRegulations(
        apiKey,
        formData.issueType,
        formData.state,
        formData.city
      );

      if (verification.success) {
        // Cross-check generated email against verified sources
        const crossCheck = await WebVerify.crossCheckEmail(
          apiKey,
          generatedEmail,
          formData.issueType,
          formData.state,
          formData.city
        );

        if (crossCheck.success) {
          setVerificationReport(crossCheck);
          setShowVerification(true);
        } else {
          setError('Verification completed but cross-check failed: ' + crossCheck.error);
          setVerificationReport(verification);
          setShowVerification(true);
        }
      } else {
        setError('Failed to verify regulations: ' + verification.error);
      }
    } catch (err) {
      setError('Verification error: ' + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyEmail = async () => {
    const fullEmail = `Subject: ${generatedSubject}\n\n${generatedEmail}`;
    const result = await API.copyToClipboard(fullEmail);

    if (result.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setError(result.error);
    }
  };

  const handleDownloadEmail = () => {
    try {
      const fullEmail = `Subject: ${generatedSubject}\n\n${generatedEmail}`;
      const filename = `email_${formData.issueType}_${Date.now()}.txt`;
      API.exportEmail(fullEmail, 'txt', filename);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveDraft = () => {
    const draftId = `draft_${Date.now()}`;
    const result = API.saveEmailDraft(draftId, generatedEmail, formData);

    if (result.success) {
      setSavedDrafts(API.loadEmailDrafts());
      alert('Draft saved successfully!');
    } else {
      setError(result.error);
    }
  };

  const handleLoadDraft = (draft) => {
    setFormData(draft.formData);
    setGeneratedEmail(draft.email);
    setActiveTab('email');
  };

  const handleDeleteDraft = (draftId) => {
    API.deleteEmailDraft(draftId);
    setSavedDrafts(API.loadEmailDrafts());
  };

  // Water Report Analysis
  const handleWaterReportUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 32MB for PDFs, 5MB for images)
      const maxSize = file.type === 'application/pdf' ? 32 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(`File too large. Maximum size: ${file.type === 'application/pdf' ? '32MB' : '5MB'}`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setWaterReport({
          name: file.name,
          data: event.target.result,
          type: file.type,
          size: file.size
        });
        setError(''); // Clear any previous errors
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeWaterReport = async () => {
    if (!waterReport) {
      setError('Please upload a water report first');
      return;
    }

    const validation = API.validateApiKey(apiKey);
    if (!validation.valid) {
      setApiKeyError(validation.error);
      return;
    }

    setIsAnalyzingWater(true);
    setError('');
    setWaterAnalysis(null);

    try {
      console.log('[Water Analysis] Starting analysis...');
      console.log('[Water Analysis] Document type:', waterReport.type);
      console.log('[Water Analysis] Document size:', waterReport.size);
      console.log('[Water Analysis] API key present:', !!apiKey);

      // Generate analysis prompt
      const documentTypeDesc = waterReport.type === 'application/pdf'
        ? 'See attached water quality report PDF'
        : 'See attached water quality report image';
      const analysisPrompt = generateDocumentAnalysisPrompt('waterReport', documentTypeDesc);

      console.log('[Water Analysis] Prompt generated, length:', analysisPrompt.length);

      // Analyze the document with vision/PDF support
      const systemPrompt = 'You are an expert water quality analyst with deep knowledge of EPA drinking water standards, state regulations, and health effects of water contaminants.';

      console.log('[Water Analysis] Calling API...');

      // Claude API supports both images and PDFs
      const result = await API.analyzeDocument(
        apiKey,
        systemPrompt,
        analysisPrompt,
        [waterReport] // Send document regardless of type
      );

      console.log('[Water Analysis] API response received:', result.success);

      if (result.success) {
        console.log('[Water Analysis] Analysis successful, length:', result.email?.length);
        setWaterAnalysis(result.email);
      } else {
        console.error('[Water Analysis] Analysis failed');
        setError('Failed to analyze water report');
      }
    } catch (err) {
      console.error('[Water Analysis] Error:', err);
      console.error('[Water Analysis] Error stack:', err.stack);
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setIsAnalyzingWater(false);
      console.log('[Water Analysis] Analysis complete');
    }
  };

  // Warranty Analysis
  const handleWarrantyUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 32MB for PDFs, 5MB for images)
      const maxSize = file.type === 'application/pdf' ? 32 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(`File too large. Maximum size: ${file.type === 'application/pdf' ? '32MB' : '5MB'}`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setWarrantyDoc({
          name: file.name,
          data: event.target.result,
          type: file.type,
          size: file.size
        });
        setError(''); // Clear any previous errors
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeWarranty = async () => {
    if (!warrantyDoc) {
      setError('Please upload a warranty document first');
      return;
    }

    const validation = API.validateApiKey(apiKey);
    if (!validation.valid) {
      setApiKeyError(validation.error);
      return;
    }

    setIsAnalyzingWarranty(true);
    setError('');
    setWarrantyAnalysis(null);

    try {
      // Generate analysis prompt
      const documentTypeDesc = warrantyDoc.type === 'application/pdf'
        ? 'See attached warranty document PDF'
        : 'See attached warranty document image';
      const analysisPrompt = generateDocumentAnalysisPrompt('warranty', documentTypeDesc);

      // Analyze the document with vision/PDF support
      const systemPrompt = 'You are an expert in consumer warranty law and product warranties with knowledge of consumer protection rights, implied warranties, and claim procedures.';

      // Claude API supports both images and PDFs
      const result = await API.analyzeDocument(
        apiKey,
        systemPrompt,
        analysisPrompt,
        [warrantyDoc] // Send document regardless of type
      );

      if (result.success) {
        setWarrantyAnalysis(result.email);
      } else {
        setError('Failed to analyze warranty');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzingWarranty(false);
    }
  };

  const handleUseAnalysisInEmail = (analysis) => {
    setFormData(prev => ({
      ...prev,
      evidence: (prev.evidence ? prev.evidence + '\n\n' : '') +
                '=== FROM DOCUMENT ANALYSIS ===\n' + analysis
    }));
    setActiveTab('email');
  };

  const handleExportWaterAnalysis = () => {
    if (waterAnalysis) {
      try {
        const filename = `water_analysis_${Date.now()}.txt`;
        API.exportEmail(waterAnalysis, 'txt', filename);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handlePrintWaterAnalysis = () => {
    if (waterAnalysis) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Water Quality Analysis Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
            }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            h2 { color: #4b5563; margin-top: 30px; }
            .header { text-align: center; margin-bottom: 40px; }
            .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; color: #666; font-size: 12px; }
            pre { white-space: pre-wrap; font-family: inherit; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Water Quality Analysis Report</h1>
            <p>Generated by HomeLLM | ${new Date().toLocaleDateString()}</p>
          </div>
          <pre>${waterAnalysis}</pre>
          <div class="footer">
            <p>HomeLLM - AI-Powered Home Health Advocacy Platform</p>
            <p>This analysis is for informational purposes only. Consult qualified professionals for health and legal advice.</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl shadow-2xl p-8 mb-6 text-white fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3 slide-in">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Shield className="w-10 h-10" />
                </div>
                <span>HomeLLM</span>
              </h1>
              <p className="text-blue-100 mt-2 text-lg font-medium">AI-Powered Home Health Advocacy Platform</p>
              <p className="text-blue-200 text-sm mt-1">Empowering residents with data-driven advocacy tools</p>
            </div>
            {apiKey && !apiKeyError && (
              <Badge variant="success" className="bg-green-100/90 text-green-800 px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-1" />
                Connected
              </Badge>
            )}
          </div>

          {/* API Key Input - Only show if not set or has error */}
          {(!apiKey || apiKeyError) ? (
            <div className="mt-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Anthropic API Key *
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    placeholder="sk-ant-..."
                    className={`w-full px-4 py-3 border-2 rounded-lg bg-white/95 focus:ring-2 focus:ring-white focus:border-white transition-all ${
                      apiKeyError ? 'border-red-300' : 'border-white/50'
                    }`}
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {apiKeyError && (
                <p className="mt-2 text-sm text-red-200 bg-red-500/20 rounded px-3 py-1">{apiKeyError}</p>
              )}
              <p className="mt-2 text-sm text-blue-100">
                Get your API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:underline">console.anthropic.com</a>
              </p>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-100">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">API Key Connected</span>
              </div>
              <button
                onClick={() => setApiKey('')}
                className="text-xs text-blue-100 hover:text-white underline transition-colors"
              >
                Change API Key
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-xl mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-2 p-3">
              <button
                onClick={() => setActiveTab('email')}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'email'
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Mail className="w-5 h-5" />
                Email Generator
              </button>
              <button
                onClick={() => setActiveTab('water')}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'water'
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Droplet className="w-5 h-5" />
                Water Analysis
              </button>
              <button
                onClick={() => setActiveTab('warranty')}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'warranty'
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <FileCheck className="w-5 h-5" />
                Warranty
              </button>
              <button
                onClick={() => setActiveTab('drafts')}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'drafts'
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Clock className="w-5 h-5" />
                Drafts ({savedDrafts.length})
              </button>
            </div>
          </div>

          {/* Email Generator Tab */}
          {activeTab === 'email' && (
            <div className="p-6">
              {/* Urgency Alert */}
              {urgencyAlert && (
                <div className={`mb-6 p-4 rounded-lg ${
                  urgencyAlert.emergency ? 'bg-red-100 border-2 border-red-500' : 'bg-yellow-100 border-2 border-yellow-500'
                }`}>
                  <div className="flex items-start gap-3">
                    <AlertCircle className={`w-6 h-6 flex-shrink-0 ${urgencyAlert.emergency ? 'text-red-600' : 'text-yellow-600'}`} />
                    <div>
                      <h3 className={`font-bold ${urgencyAlert.emergency ? 'text-red-800' : 'text-yellow-800'}`}>
                        {urgencyAlert.emergency ? '⚠️ EMERGENCY' : '⚠️ HIGH URGENCY'}
                      </h3>
                      <p className={urgencyAlert.emergency ? 'text-red-700' : 'text-yellow-700'}>
                        {urgencyAlert.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <Alert type="error" onClose={() => setError('')} className="mb-6">
                  <p className="font-medium">{error}</p>
                </Alert>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Form */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Issue Details</h2>

                  {/* Issue Type */}
                  <SelectField
                    name="issueType"
                    label="Issue Type"
                    value={formData.issueType}
                    onChange={handleInputChange}
                    error={fieldErrors.issueType}
                    required
                    tooltip="Select the primary health or safety issue affecting your property"
                  >
                    <option value="">Select issue type...</option>
                    {issueTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </SelectField>

                  {/* Recipient */}
                  <SelectField
                    name="recipient"
                    label="Send To"
                    value={formData.recipient}
                    onChange={handleInputChange}
                    error={fieldErrors.recipient}
                    required
                    tooltip="Who will receive this advocacy email?"
                  >
                    <option value="">Select recipient...</option>
                    {recipients.map(recipient => (
                      <option key={recipient.value} value={recipient.value}>
                        {recipient.label}
                      </option>
                    ))}
                  </SelectField>

                  {/* Location */}
                  <InputField
                    type="text"
                    name="location"
                    label="Property Address"
                    value={formData.location}
                    onChange={handleInputChange}
                    error={fieldErrors.location}
                    placeholder="123 Main St, Apt 4B"
                    required
                    tooltip="The full street address of the affected property"
                  />

                  {/* City and State */}
                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      type="text"
                      name="city"
                      label="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      error={fieldErrors.city}
                      placeholder="City"
                      required
                    />
                    <SelectField
                      name="state"
                      label="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      error={fieldErrors.state}
                      required
                    >
                      <option value="">State</option>
                      {statesList.map(state => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </SelectField>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property Age
                      </label>
                      <input
                        type="text"
                        name="propertyAge"
                        value={formData.propertyAge}
                        onChange={handleInputChange}
                        placeholder="Built in 1985"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Affected Residents
                      </label>
                      <input
                        type="text"
                        name="affectedResidents"
                        value={formData.affectedResidents}
                        onChange={handleInputChange}
                        placeholder="Family of 4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Escalation Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Escalation Level
                    </label>
                    <div className="space-y-2">
                      {escalationLevels.map(level => (
                        <label key={level.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="escalationLevel"
                            value={level.value}
                            checked={formData.escalationLevel === level.value}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                          <div>
                            <div className="font-medium text-gray-800">{level.label}</div>
                            <div className="text-sm text-gray-600">{level.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Urgency Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Urgency Level
                    </label>
                    <div className="space-y-2">
                      {urgencyLevels.map(level => (
                        <label key={level.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="urgencyLevel"
                            value={level.value}
                            checked={formData.urgencyLevel === level.value}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                          <div>
                            <div className="font-medium text-gray-800">{level.label}</div>
                            <div className="text-sm text-gray-600">{level.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Evidence */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Evidence & Description *
                    </label>
                    <textarea
                      name="evidence"
                      value={formData.evidence}
                      onChange={handleInputChange}
                      placeholder="Describe the issue in detail. Include dates, locations, observations, etc."
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Measurements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Measurements / Test Results
                    </label>
                    <textarea
                      name="measurements"
                      value={formData.measurements}
                      onChange={handleInputChange}
                      placeholder="E.g., Mold test: 50,000 spores/m³, Lead: 25 ppb, CO: 45 ppm"
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Health Impact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Health Impact
                    </label>
                    <textarea
                      name="healthImpact"
                      value={formData.healthImpact}
                      onChange={handleInputChange}
                      placeholder="Respiratory issues, headaches, children affected, doctor visits, etc."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Previous Contact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Previous Contact History
                    </label>
                    <textarea
                      name="previousContact"
                      value={formData.previousContact}
                      onChange={handleInputChange}
                      placeholder="Email on 1/15/24, phone call on 1/20/24, no response received..."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Regulations */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Regulations / Context
                    </label>
                    <textarea
                      name="regulations"
                      value={formData.regulations}
                      onChange={handleInputChange}
                      placeholder="Any additional regulations, codes, or context..."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleLookupCodes}
                      disabled={isLookingUpCodes}
                      className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center gap-2"
                    >
                      {isLookingUpCodes ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Looking up codes...
                        </>
                      ) : (
                        'Auto-Lookup Local Codes'
                      )}
                    </button>
                  </div>

                  {/* Desired Outcome */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Desired Outcome *
                    </label>
                    <textarea
                      name="desiredOutcome"
                      value={formData.desiredOutcome}
                      onChange={handleInputChange}
                      placeholder="Professional mold inspection within 5 days, remediation plan within 10 days..."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Image Attachments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attach Evidence Photos
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {attachedImages.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {attachedImages.map((img, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{img.name}</span>
                            <button
                              onClick={() => removeImage(idx)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sender Information */}
                  <div className="pt-4 border-t">
                    <h3 className="font-bold text-gray-800 mb-3">Your Contact Information</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="senderName"
                        value={formData.senderName}
                        onChange={handleInputChange}
                        placeholder="John Smith"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        name="senderEmail"
                        value={formData.senderEmail}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Phone
                      </label>
                      <input
                        type="tel"
                        name="senderPhone"
                        value={formData.senderPhone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Address
                      </label>
                      <input
                        type="text"
                        name="senderAddress"
                        value={formData.senderAddress}
                        onChange={handleInputChange}
                        placeholder="Same as property address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerateEmail}
                    disabled={isGenerating}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating Email...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Email</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Right Column - Generated Email */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Generated Email</h2>

                  {generatedEmail ? (
                    <div className="space-y-4">
                      {/* Subject */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm font-medium text-blue-800 mb-1">Subject:</div>
                        <div className="text-blue-900 font-medium">{generatedSubject}</div>
                      </div>

                      {/* Email Body */}
                      <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg min-h-[500px]">
                        <pre className="whitespace-pre-wrap font-sans text-gray-800">
                          {generatedEmail}
                        </pre>
                      </div>

                      {/* Verification Badge */}
                      {verificationReport && (
                        <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="font-bold text-green-800 mb-1">✓ Regulations Verified</h3>
                              <p className="text-sm text-green-700 mb-2">
                                This email has been cross-checked against current regulations and standards.
                              </p>
                              <button
                                onClick={() => setShowVerification(!showVerification)}
                                className="text-sm text-green-600 hover:text-green-800 underline"
                              >
                                {showVerification ? 'Hide' : 'View'} Verification Report
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Verification Report Details */}
                      {showVerification && verificationReport && (
                        <div className="p-4 bg-white border border-gray-300 rounded-lg max-h-[400px] overflow-y-auto">
                          <h3 className="font-bold text-gray-800 mb-3">Accuracy Verification Report</h3>
                          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
                            {verificationReport.accuracyReport}
                          </pre>
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold text-gray-800 mb-2">Sources Consulted:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {verificationReport.verifiedRegulations?.map((v, idx) => (
                                <li key={idx}>• {v.query}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 flex-wrap">
                        <button
                          onClick={handleCopyEmail}
                          className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                          {copied ? (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-5 h-5" />
                              Copy to Clipboard
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleDownloadEmail}
                          className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                          <Download className="w-5 h-5" />
                          Download
                        </button>
                        <button
                          onClick={handleSaveDraft}
                          className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"
                        >
                          <Save className="w-5 h-5" />
                          Save Draft
                        </button>
                      </div>

                      {/* Verify Regulations Button */}
                      {!verificationReport && (
                        <button
                          onClick={handleVerifyRegulations}
                          disabled={isVerifying}
                          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center justify-center gap-2 border-2 border-purple-700"
                        >
                          {isVerifying ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Verifying Regulations...
                            </>
                          ) : (
                            <>
                              <Search className="w-5 h-5" />
                              Verify Regulations Against Current Laws
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Fill out the form and click "Generate Email" to create your advocacy letter
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Water Report Analysis Tab */}
          {activeTab === 'water' && (
            <div className={waterAnalysis ? '' : 'p-8'}>
              {!waterAnalysis && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Droplet className="w-7 h-7 text-blue-600" />
                    Water Quality Report Analysis
                  </h2>
                  <p className="text-gray-600">Upload your water quality report for comprehensive EPA standards analysis</p>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className={`mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 ${waterAnalysis ? 'mx-8 mt-8' : ''}`}>
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {!waterAnalysis ? (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 bg-blue-50/50 hover:bg-blue-50 transition-colors">
                      <label className="block text-center cursor-pointer">
                        <Upload className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                        <span className="block text-lg font-semibold text-gray-800 mb-1">
                          Upload Water Quality Report
                        </span>
                        <span className="block text-sm text-gray-600 mb-4">
                          PDF files (max 32MB) • Images (JPG, PNG - max 5MB)
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleWaterReportUpload}
                          className="hidden"
                        />
                        <span className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                          Choose File
                        </span>
                      </label>
                    </div>

                    {waterReport && (
                      <div className="p-5 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-xl">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-green-800">File Ready for Analysis</p>
                            <p className="text-sm text-green-700 truncate">{waterReport.name}</p>
                            <p className="text-xs text-green-600 mt-1">
                              {waterReport.type === 'application/pdf' ? 'PDF Document' : 'Image File'} •
                              {(waterReport.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleAnalyzeWaterReport}
                      disabled={!waterReport || isAnalyzingWater}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl hover:from-blue-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:transform-none"
                    >
                      {isAnalyzingWater ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Analyzing Report...
                        </>
                      ) : (
                        <>
                          <Shield className="w-6 h-6" />
                          Analyze Water Quality
                        </>
                      )}
                    </button>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        What We Analyze
                      </h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Contaminant levels vs EPA standards</li>
                        <li>• Health risk assessment</li>
                        <li>• Vulnerable population impacts</li>
                        <li>• Actionable recommendations</li>
                        <li>• Regulatory citations for advocacy</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-center min-h-[600px]">
                    <div className="p-12 bg-gradient-to-br from-gray-50 to-blue-50/30 border-2 border-dashed border-gray-300 rounded-2xl text-center w-full">
                      <Droplet className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                      <p className="text-gray-500 text-lg font-medium">Analysis will appear here</p>
                      <p className="text-gray-400 text-sm mt-2">Upload and analyze your water quality report to see detailed results</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="-mx-4 lg:-mx-8 xl:-mx-12 px-4 lg:px-8 xl:px-12 py-8 bg-white">
                  <WaterAnalysisResults
                    analysis={waterAnalysis}
                    onExport={handleExportWaterAnalysis}
                    onPrint={handlePrintWaterAnalysis}
                    onUseInEmail={() => handleUseAnalysisInEmail(waterAnalysis)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Warranty Analysis Tab */}
          {activeTab === 'warranty' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Warranty Document Analysis</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Warranty Document
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Supports PDF files (max 32MB) and images (JPG, PNG - max 5MB)
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleWarrantyUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  {warrantyDoc && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 inline mr-2" />
                      File uploaded: {warrantyDoc.name}
                    </div>
                  )}

                  <button
                    onClick={handleAnalyzeWarranty}
                    disabled={!warrantyDoc || isAnalyzingWarranty}
                    className="mt-4 w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    {isAnalyzingWarranty ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <FileCheck className="w-5 h-5" />
                        Analyze Warranty
                      </>
                    )}
                  </button>
                </div>

                <div>
                  {warrantyAnalysis ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg max-h-[600px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-sans text-gray-800 text-sm">
                          {warrantyAnalysis}
                        </pre>
                      </div>
                      <button
                        onClick={() => handleUseAnalysisInEmail(warrantyAnalysis)}
                        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Use in Email Generator
                      </button>
                    </div>
                  ) : (
                    <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Analysis will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Saved Drafts Tab */}
          {activeTab === 'drafts' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Saved Drafts</h2>

              {savedDrafts.length === 0 ? (
                <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No saved drafts yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedDrafts.map(draft => (
                    <div key={draft.id} className="p-4 border border-gray-300 rounded-lg hover:border-indigo-500">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium text-gray-800">
                            {draft.formData.issueType} - {draft.formData.recipient}
                          </div>
                          <div className="text-sm text-gray-600">
                            {draft.formData.location}, {draft.formData.city}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Saved: {new Date(draft.savedAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleLoadDraft(draft)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleDeleteDraft(draft.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
            <p className="text-gray-700 font-medium">
              HomeLLM - Powered by <span className="text-blue-600 font-semibold">Claude AI</span>
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Empowering residents with data-driven advocacy tools for home health and environmental safety
            </p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-500 text-xs flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                This tool provides information only. Consult qualified legal and medical professionals for advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
