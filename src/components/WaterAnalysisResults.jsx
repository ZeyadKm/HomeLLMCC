import {
  Download,
  Printer,
  Droplet,
  Shield,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';

/**
 * WaterAnalysisResults Component - Optimized for maximum screen space usage
 * Beautiful colored cards with intelligent grid layout
 */
export default function WaterAnalysisResults({ analysis, onExport, onPrint, onUseInEmail }) {
  // Strip all markdown formatting from text
  const stripMarkdown = (text) => {
    if (!text) return text;

    return text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/`(.+?)`/g, '$1')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/~~(.+?)~~/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .replace(/!\[.+?\]\(.+?\)/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/\*/g, '')
      .replace(/\b_|_\b/g, '');
  };

  // Parse the analysis
  const parseAnalysis = (text) => {
    const cleanText = stripMarkdown(text);

    const sections = {
      overallAssessment: '',
      epaViolations: [],
      areasOfConcern: [],
      detectedContaminants: [],
      filterRecommendations: [],
      recommendedActions: [],
      assistancePrograms: [],
      disclaimer: '',
      regulatoryCitations: [],
      rawText: cleanText,
    };

    // Parse Overall Assessment
    const overallMatch = cleanText.match(
      /OVERALL ASSESSMENT:(.*?)(?=EPA VIOLATIONS:|AREAS OF CONCERN:|DETECTED CONTAMINANTS|$)/is
    );
    if (overallMatch) {
      sections.overallAssessment = overallMatch[1].trim();
    }

    // Parse EPA Violations
    const violationsMatch = cleanText.match(
      /EPA VIOLATIONS:(.*?)(?=AREAS OF CONCERN:|DETECTED CONTAMINANTS|$)/is
    );
    if (violationsMatch) {
      sections.epaViolations = violationsMatch[1]
        .split('\n')
        .filter((line) => line.trim() && (line.includes('•') || line.includes('-')))
        .map((line) => line.replace(/^[•\-]\s*/, '').trim());
    }

    // Parse Areas of Concern
    const concernsMatch = cleanText.match(/AREAS OF CONCERN:(.*?)(?=DETECTED CONTAMINANTS|$)/is);
    if (concernsMatch) {
      sections.areasOfConcern = concernsMatch[1]
        .split('\n')
        .filter(
          (line) => line.trim() && (line.includes('•') || line.includes('-') || line.includes(':'))
        )
        .map((line) => line.replace(/^[•\-]\s*/, '').trim());
    }

    // Parse Detected Contaminants
    const contaminantsMatch = cleanText.match(
      /DETECTED CONTAMINANTS[^:]*:\s*(.*?)(?=\n\s*(?:FILTER RECOMMENDATIONS|RECOMMENDED ACTIONS|ASSISTANCE PROGRAMS|DISCLAIMER)|$)/is
    );
    if (contaminantsMatch) {
      const contaminantText = contaminantsMatch[1];
      const blocks = contaminantText.split(/\n---\n|\n\nCONTAMINANT:/);

      blocks.forEach((block, index) => {
        if (!block.trim() || block.length < 20) return;
        const fullBlock = index === 0 ? block : 'CONTAMINANT:' + block;

        const nameMatch = fullBlock.match(/CONTAMINANT:\s*(.+?)(?=\n|$)/i);
        const detectedMatch = fullBlock.match(/DETECTED:\s*(.+?)(?=\n|$)/i);
        const limitMatch = fullBlock.match(/EPA LIMIT:\s*(.+?)(?=\n|$)/i);
        const healthMatch = fullBlock.match(/HEALTH EFFECTS:\s*(.+?)(?=\nSEVERITY:|$)/is);
        const severityMatch = fullBlock.match(/SEVERITY:\s*(HIGH|MEDIUM|LOW|INFORMATIONAL)/i);

        if (nameMatch) {
          sections.detectedContaminants.push({
            name: nameMatch[1].trim(),
            detected: detectedMatch ? detectedMatch[1].trim() : '',
            epaLimit: limitMatch ? limitMatch[1].trim() : '',
            healthEffects: healthMatch ? healthMatch[1].trim() : '',
            severity: severityMatch ? severityMatch[1].toUpperCase() : 'MEDIUM',
          });
        }
      });
    }

    // Parse Filter Recommendations
    const filterMatch = cleanText.match(
      /FILTER RECOMMENDATIONS[:\s]+(.*?)(?=\n\s*(?:RECOMMENDED ACTIONS|ASSISTANCE PROGRAMS|DISCLAIMER|REGULATORY CITATIONS)|$)/is
    );
    if (filterMatch) {
      const filterText = filterMatch[1];
      const filterBlocks = filterText.split(/\n\n+/);

      filterBlocks.forEach((block) => {
        if (!block.trim() || block.length < 20) return;

        const arrowMatch = block.match(/^(.+?)\s*(?:->|→|>=|=>)\s*(.+?)$/m);
        if (arrowMatch) {
          const contaminant = arrowMatch[1].trim();
          const filterType = arrowMatch[2].trim();

          const lines = block.split('\n');
          const descLine = lines.find((line, idx) => idx > 0 && !line.startsWith('Cost:'));
          const costLine = lines.find((line) => line.startsWith('Cost:'));

          sections.filterRecommendations.push({
            contaminant,
            filterType,
            description: descLine ? descLine.trim() : '',
            cost: costLine ? costLine.replace('Cost:', '').trim() : '',
          });
        }
      });
    }

    // Parse Recommended Actions
    const actionsMatch = cleanText.match(
      /RECOMMENDED ACTIONS[:\s]+(.*?)(?=\n\s*(?:ASSISTANCE PROGRAMS|DISCLAIMER|REGULATORY CITATIONS)|$)/is
    );
    if (actionsMatch) {
      const actionLines = actionsMatch[1]
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && (/^\d+[\.\)]\s/.test(line) || /^\d+\s*[-–—]\s/.test(line)))
        .map((line) =>
          line
            .replace(/^\d+[\.\)]\s*/, '')
            .replace(/^\d+\s*[-–—]\s*/, '')
            .trim()
        );

      sections.recommendedActions = actionLines;
    }

    // Parse Assistance Programs
    const programsMatch = cleanText.match(
      /ASSISTANCE PROGRAMS[:\s]+(.*?)(?=\n\s*(?:DISCLAIMER|REGULATORY CITATIONS)|$)/is
    );
    if (programsMatch) {
      const programLines = programsMatch[1]
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && (/^[-•*]\s/.test(line) || /^\d+[\.\)]\s/.test(line)))
        .map((line) =>
          line
            .replace(/^[-•*]\s*/, '')
            .replace(/^\d+[\.\)]\s*/, '')
            .trim()
        );

      sections.assistancePrograms = programLines;
    }

    return sections;
  };

  const sections = parseAnalysis(analysis);

  // Calculate water quality status
  const getWaterQualityStatus = () => {
    if (sections.epaViolations.length > 0) {
      return {
        status: 'POOR',
        color: 'text-red-600',
        bg: 'bg-red-50',
        icon: AlertTriangle,
      };
    }
    if (
      sections.areasOfConcern.length > 0 ||
      sections.detectedContaminants.some((c) => c.severity === 'HIGH')
    ) {
      return {
        status: 'FAIR',
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        icon: AlertCircle,
      };
    }
    return {
      status: 'GOOD',
      color: 'text-green-600',
      bg: 'bg-green-50',
      icon: CheckCircle,
    };
  };

  const waterStatus = getWaterQualityStatus();

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH':
        return {
          bg: 'bg-gradient-to-br from-red-50 to-red-100/70',
          border: 'border-red-300',
          text: 'text-red-700',
          badge: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-gradient-to-br from-yellow-50 to-amber-100/70',
          border: 'border-yellow-300',
          text: 'text-yellow-700',
          badge: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white',
        };
      case 'LOW':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-emerald-100/70',
          border: 'border-green-300',
          text: 'text-green-700',
          badge: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
        };
      case 'INFORMATIONAL':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-sky-100/70',
          border: 'border-blue-300',
          text: 'text-blue-700',
          badge: 'bg-gradient-to-r from-blue-500 to-sky-500 text-white',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-slate-100/70',
          border: 'border-gray-300',
          text: 'text-gray-700',
          badge: 'bg-gradient-to-r from-gray-500 to-slate-500 text-white',
        };
    }
  };

  const hasStructuredData =
    sections.detectedContaminants.length > 0 ||
    sections.overallAssessment ||
    sections.filterRecommendations.length > 0;

  return (
    <div className="space-y-8">
      {/* Header - Full width with actions */}
      <div className="flex justify-between items-start pb-6 border-b-2 border-headspace-orange relative">
        <div className="flex-1">
          <h3 className="text-3xl font-bold text-headspace-slate flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-headspace-orange to-headspace-orange-dark rounded-xl shadow-lg">
              <Droplet className="w-8 h-8 text-white" />
            </div>
            Water Quality Results
          </h3>
          <div
            className={`mt-3 inline-flex items-center gap-3 px-5 py-2.5 ${waterStatus.bg} rounded-full shadow-sm border-2 ${waterStatus.color === 'text-red-600' ? 'border-red-300' : waterStatus.color === 'text-yellow-600' ? 'border-yellow-300' : 'border-green-300'}`}
          >
            <waterStatus.icon className={`w-6 h-6 ${waterStatus.color}`} />
            <span className={`text-base font-bold ${waterStatus.color}`}>
              Water Quality: {waterStatus.status}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onPrint}
            className="group px-5 py-2.5 text-sm bg-white text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-all font-semibold shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 transform hover:-translate-y-0.5"
          >
            <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Print
          </button>
          <button
            onClick={onExport}
            className="group px-5 py-2.5 text-sm bg-white text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-all font-semibold shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Download
          </button>
        </div>
      </div>

      {hasStructuredData ? (
        <div className="space-y-7">
          {/* Overall Assessment */}
          {sections.overallAssessment && (
            <div className="group bg-gradient-to-br from-headspace-cream to-orange-50 border-l-4 border-headspace-blue p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <h4 className="font-bold text-headspace-slate mb-3 text-xl flex items-center gap-3">
                <div className="p-2 bg-headspace-blue rounded-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Overall Assessment
              </h4>
              <p className="text-gray-800 leading-relaxed text-base">
                {sections.overallAssessment}
              </p>
            </div>
          )}

          {/* EPA Violations */}
          {sections.epaViolations.length > 0 && (
            <div className="group bg-gradient-to-br from-red-50 to-red-100/50 border-l-4 border-red-500 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <h4 className="font-bold text-red-900 mb-4 text-xl flex items-center gap-3">
                <div className="p-2 bg-red-500 rounded-lg group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                EPA Violations ({sections.epaViolations.length})
              </h4>
              <ul className="space-y-3">
                {sections.epaViolations.map((violation, idx) => (
                  <li
                    key={idx}
                    className="text-gray-800 flex items-start gap-3 p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors"
                  >
                    <span className="text-red-600 font-bold text-lg mt-0.5">•</span>
                    <span className="flex-1">{violation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas of Concern */}
          {sections.areasOfConcern.length > 0 && (
            <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-l-4 border-yellow-500 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <h4 className="font-bold text-yellow-900 mb-4 text-xl flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-lg group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                Areas of Concern ({sections.areasOfConcern.length})
              </h4>
              <ul className="space-y-3">
                {sections.areasOfConcern.map((concern, idx) => (
                  <li
                    key={idx}
                    className="text-gray-800 flex items-start gap-3 p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors"
                  >
                    <span className="text-yellow-600 font-bold text-lg mt-0.5">•</span>
                    <span className="flex-1">{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detected Contaminants - Grid Layout for better space usage */}
          {sections.detectedContaminants.length > 0 && (
            <div>
              <h4 className="font-bold text-headspace-slate mb-5 text-2xl flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-headspace-blue to-blue-600 rounded-xl shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                Detected Contaminants ({sections.detectedContaminants.length})
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {sections.detectedContaminants.map((contaminant, idx) => {
                  const colors = getSeverityColor(contaminant.severity);
                  return (
                    <div
                      key={idx}
                      className={`group p-6 border-2 ${colors.border} ${colors.bg} rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="font-bold text-xl text-gray-900 flex-1">
                          {contaminant.name}
                        </h5>
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-bold ${colors.badge} shadow-sm`}
                        >
                          {contaminant.severity}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {contaminant.detected && (
                          <p className={`${colors.text} font-semibold text-base`}>
                            <span className="text-gray-600 font-normal">Detected:</span>{' '}
                            {contaminant.detected}
                          </p>
                        )}
                        {contaminant.epaLimit && (
                          <p className={`${colors.text} text-base`}>
                            <span className="text-gray-600 font-semibold">EPA Limit:</span>{' '}
                            {contaminant.epaLimit}
                          </p>
                        )}
                        {contaminant.healthEffects && (
                          <div className="mt-3 pt-3 border-t-2 border-current border-opacity-20">
                            <p className="text-gray-800 text-sm leading-relaxed bg-white/50 p-3 rounded-lg">
                              {contaminant.healthEffects}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filter Recommendations - Grid Layout */}
          {sections.filterRecommendations.length > 0 && (
            <div>
              <h4 className="font-bold text-headspace-slate mb-5 text-2xl flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-headspace-orange to-headspace-orange-dark rounded-xl shadow-lg">
                  <Droplet className="w-6 h-6 text-white" />
                </div>
                Filter Recommendations ({sections.filterRecommendations.length})
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {sections.filterRecommendations.map((filter, idx) => (
                  <div
                    key={idx}
                    className="group p-5 bg-gradient-to-br from-white to-green-50/30 border-2 border-green-200 rounded-2xl shadow-md hover:shadow-xl hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="font-bold text-green-900 text-lg mb-3 flex items-center gap-2 flex-wrap">
                      <span className="text-green-700 bg-green-100 px-3 py-1 rounded-lg">
                        {filter.contaminant}
                      </span>
                      <span className="text-gray-400 text-2xl">→</span>
                      <span className="text-green-800 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                        {filter.filterType}
                      </span>
                    </div>
                    {filter.description && (
                      <p className="text-gray-700 text-sm mb-3 leading-relaxed bg-white/60 p-3 rounded-lg">
                        {filter.description}
                      </p>
                    )}
                    {filter.cost && (
                      <p className="text-green-800 font-bold text-sm flex items-center gap-2 mt-3 pt-3 border-t border-green-200">
                        <span className="text-gray-600 font-normal">Cost:</span> {filter.cost}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Actions */}
          {sections.recommendedActions.length > 0 && (
            <div className="group bg-gradient-to-br from-orange-50 to-orange-100/50 border-l-4 border-headspace-orange p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <h4 className="font-bold text-headspace-slate mb-4 text-xl flex items-center gap-3">
                <div className="p-2 bg-headspace-orange rounded-lg group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                Recommended Actions ({sections.recommendedActions.length})
              </h4>
              <ol className="space-y-3">
                {sections.recommendedActions.map((action, idx) => (
                  <li
                    key={idx}
                    className="text-gray-800 flex items-start gap-4 p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors"
                  >
                    <span className="font-bold text-headspace-orange text-xl min-w-[2rem] flex items-center justify-center h-8 w-8 bg-orange-100 rounded-lg">
                      {idx + 1}
                    </span>
                    <span className="flex-1 pt-1.5 leading-relaxed">{action}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Assistance Programs */}
          {sections.assistancePrograms.length > 0 && (
            <div className="group bg-gradient-to-br from-headspace-cream to-sky-50 border-l-4 border-headspace-blue p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <h4 className="font-bold text-headspace-slate mb-4 text-xl flex items-center gap-3">
                <div className="p-2 bg-headspace-blue rounded-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Assistance Programs ({sections.assistancePrograms.length})
              </h4>
              <ul className="space-y-3">
                {sections.assistancePrograms.map((program, idx) => (
                  <li
                    key={idx}
                    className="text-gray-800 flex items-start gap-3 p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors"
                  >
                    <span className="text-headspace-blue font-bold text-lg mt-0.5">•</span>
                    <span className="flex-1 leading-relaxed">{program}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        // Fallback: Display raw analysis if parsing didn't work
        <div className="p-6 bg-gray-50 border border-gray-300 rounded-lg">
          <pre className="whitespace-pre-wrap font-sans text-gray-800 text-sm leading-relaxed">
            {analysis}
          </pre>
        </div>
      )}

      {/* Use in Email Generator Button */}
      <div className="pt-6 border-t-2 border-gray-300 mt-2">
        <button
          onClick={onUseInEmail}
          className="group w-full py-5 bg-gradient-to-r from-headspace-orange via-headspace-orange-dark to-headspace-orange text-white rounded-2xl hover:from-headspace-orange-dark hover:via-headspace-orange hover:to-headspace-orange-dark flex items-center justify-center gap-3 transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <FileText className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
          <span className="relative z-10">Use Analysis in Email Generator</span>
        </button>
      </div>
    </div>
  );
}
