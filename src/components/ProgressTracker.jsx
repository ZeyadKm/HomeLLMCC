import React from 'react';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';

/**
 * Progress Tracker Component
 * Shows the progression of a case through different stages
 */
export default function ProgressTracker({ currentStage, formData }) {
  const stages = [
    {
      id: 'documenting',
      name: 'Documenting Issue',
      description: 'Gather evidence and documentation',
      completed: formData.evidence && formData.measurements
    },
    {
      id: 'timeline',
      name: 'Building Timeline',
      description: 'Create chronological record',
      completed: false // Will be passed as prop
    },
    {
      id: 'calculating',
      name: 'Calculating Damages',
      description: 'Quantify financial impact',
      completed: false // Will be passed as prop
    },
    {
      id: 'drafting',
      name: 'Drafting Email',
      description: 'Create advocacy letter',
      completed: !!formData.generatedEmail
    },
    {
      id: 'verifying',
      name: 'Verifying Regulations',
      description: 'Confirm legal accuracy',
      completed: false // Will be passed as prop
    },
    {
      id: 'sending',
      name: 'Sending Email',
      description: 'Deliver to recipient',
      completed: false
    },
    {
      id: 'following-up',
      name: 'Following Up',
      description: 'Track response',
      completed: false
    }
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(s => s.id === currentStage);
  };

  const currentIndex = getCurrentStageIndex();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Case Progress</h2>
        <div className="text-sm text-gray-600 dark:text-dark-text-secondary">
          Stage {currentIndex + 1} of {stages.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-headspace-orange to-headspace-orange-dark transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / stages.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const isCompleted = stage.completed || index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div
              key={stage.id}
              className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                isCurrent
                  ? 'border-headspace-orange bg-orange-50 dark:bg-orange-900/20'
                  : isCompleted
                  ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                  : 'border-gray-200 bg-gray-50 dark:bg-dark-bg-tertiary dark:border-dark-border'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : isCurrent ? (
                  <Clock className="w-6 h-6 text-headspace-orange animate-pulse" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>

              <div className="flex-1">
                <h3
                  className={`font-semibold ${
                    isCurrent
                      ? 'text-headspace-orange'
                      : isCompleted
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-gray-600 dark:text-dark-text-secondary'
                  }`}
                >
                  {stage.name}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    isCurrent
                      ? 'text-gray-700 dark:text-gray-300'
                      : isCompleted
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-dark-text-secondary'
                  }`}
                >
                  {stage.description}
                </p>

                {isCurrent && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-sm text-headspace-orange dark:text-headspace-orange font-medium">
                      <div className="w-2 h-2 bg-headspace-orange rounded-full animate-pulse" />
                      In Progress
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 text-sm font-medium">
                {isCompleted ? (
                  <span className="text-green-600 dark:text-green-400">✓ Complete</span>
                ) : isCurrent ? (
                  <span className="text-headspace-orange">Current</span>
                ) : (
                  <span className="text-gray-400">Pending</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">
            {stages.filter(s => s.completed).length}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">Completed</div>
        </div>

        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <div className="text-2xl font-bold text-headspace-orange">1</div>
          <div className="text-sm text-headspace-orange-dark dark:text-headspace-orange">In Progress</div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg">
          <div className="text-2xl font-bold text-gray-700 dark:text-dark-text">
            {stages.length - currentIndex - 1}
          </div>
          <div className="text-sm text-gray-600 dark:text-dark-text-secondary">Remaining</div>
        </div>
      </div>

      {/* Helpful Tips */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Next Steps</h4>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              {currentIndex === 0 && 'Complete the issue details form with all evidence and measurements.'}
              {currentIndex === 1 && 'Go to the Timeline tab to document when each event occurred.'}
              {currentIndex === 2 && 'Use the Calculator tab to quantify your damages.'}
              {currentIndex === 3 && 'Review and generate your advocacy email.'}
              {currentIndex === 4 && 'Verify that all regulations cited are current and accurate.'}
              {currentIndex === 5 && 'Copy or download your email and send it to the recipient.'}
              {currentIndex === 6 && 'Set a reminder to follow up if you don\'t receive a response.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
