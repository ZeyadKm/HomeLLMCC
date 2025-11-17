import React, { useState } from 'react';
import { FileText, Search, X, ChevronRight, Star } from 'lucide-react';
import { templateCategories, getTemplate, applyTemplate } from '../utils/templates';

/**
 * Template Library Component
 * Browse and apply pre-built email templates
 */
export default function TemplateLibrary({ onApplyTemplate, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = Object.keys(templateCategories);

  const handleSelectTemplate = (templateId) => {
    const template = getTemplate(templateId);
    setSelectedTemplate({ id: templateId, ...template });
  };

  const handleApply = () => {
    if (selectedTemplate) {
      onApplyTemplate(selectedTemplate.id);
      onClose();
    }
  };

  const filteredCategories = searchQuery
    ? categories.filter(cat =>
        cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        templateCategories[cat].some(tid => {
          const template = getTemplate(tid);
          return (
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        })
      )
    : categories;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FileText className="w-7 h-7 text-headspace-orange" />
              Template Library
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-dark-text" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg-tertiary dark:text-white focus:ring-2 focus:ring-headspace-orange focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Categories Sidebar */}
          <div className="w-1/3 border-r border-gray-200 dark:border-dark-border overflow-y-auto p-4">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-dark-text-secondary uppercase mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              {filteredCategories.map((category) => {
                const templateIds = templateCategories[category];
                const filteredTemplates = searchQuery
                  ? templateIds.filter(tid => {
                      const template = getTemplate(tid);
                      return (
                        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        template.description.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                    })
                  : templateIds;

                if (searchQuery && filteredTemplates.length === 0) return null;

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === category
                        ? 'bg-headspace-orange text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary text-gray-700 dark:text-dark-text'
                    }`}
                  >
                    <span className="font-medium">{category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{filteredTemplates.length}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Templates List */}
          <div className="w-2/3 overflow-y-auto p-4">
            {!selectedCategory ? (
              <div className="flex items-center justify-center h-full text-gray-400 dark:text-dark-text-secondary">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a category to browse templates</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  {selectedCategory}
                </h3>

                {templateCategories[selectedCategory]
                  .filter((templateId) => {
                    if (!searchQuery) return true;
                    const template = getTemplate(templateId);
                    return (
                      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      template.description.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                  })
                  .map((templateId) => {
                    const template = getTemplate(templateId);
                    const isSelected = selectedTemplate?.id === templateId;

                    return (
                      <button
                        key={templateId}
                        onClick={() => handleSelectTemplate(templateId)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-headspace-orange bg-orange-50 dark:bg-orange-900/20'
                            : 'border-gray-200 dark:border-dark-border hover:border-headspace-orange hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-800 dark:text-white">
                            {template.name}
                          </h4>
                          {isSelected && (
                            <Star className="w-5 h-5 text-headspace-orange fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-2">
                          {template.description}
                        </p>
                        <div className="flex gap-2 text-xs">
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                            {template.issueType}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                            {template.escalationLevel}
                          </span>
                          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded">
                            {template.urgencyLevel}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-border">
                            <p className="text-sm text-gray-700 dark:text-dark-text font-medium mb-2">
                              Template Preview:
                            </p>
                            <div className="text-xs text-gray-600 dark:text-dark-text-secondary space-y-2 bg-white dark:bg-dark-bg p-3 rounded">
                              {template.template.evidence && (
                                <div>
                                  <span className="font-semibold">Evidence: </span>
                                  {template.template.evidence.substring(0, 100)}...
                                </div>
                              )}
                              {template.template.desiredOutcome && (
                                <div>
                                  <span className="font-semibold">Outcome: </span>
                                  {template.template.desiredOutcome.substring(0, 100)}...
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-dark-text-secondary">
              {selectedTemplate ? (
                <span>
                  Selected: <span className="font-semibold">{selectedTemplate.name}</span>
                </span>
              ) : (
                <span>Select a template to preview and apply</span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!selectedTemplate}
                className="px-6 py-2 bg-gradient-to-r from-headspace-orange to-headspace-orange-dark text-white rounded-lg hover:from-headspace-orange-dark hover:to-headspace-orange disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold shadow-lg"
              >
                Apply Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
