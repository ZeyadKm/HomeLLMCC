import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { getShortcutGroups } from '../hooks/useKeyboardShortcuts';

/**
 * Keyboard Shortcuts Help Modal
 */
export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcutGroups = getShortcutGroups();

  // Detect OS for display
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  const formatShortcut = (shortcut) => {
    return shortcut
      .replace('ctrl', modKey)
      .replace('alt', isMac ? '⌥' : 'Alt')
      .replace('shift', isMac ? '⇧' : 'Shift')
      .split('+')
      .map((key) => {
        // Capitalize first letter
        return key.charAt(0).toUpperCase() + key.slice(1);
      })
      .join(isMac ? ' ' : ' + ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-dark-border bg-gradient-to-r from-headspace-orange to-headspace-orange-dark text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Keyboard className="w-7 h-7" />
              <div>
                <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
                <p className="text-sm text-orange-100 mt-1">Work faster with keyboard commands</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {Object.entries(shortcutGroups).map(([groupName, shortcuts]) => (
              <div key={groupName} className="space-y-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-headspace-orange rounded-full"></div>
                  {groupName}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(shortcuts).map(([shortcut, description]) => (
                    <div
                      key={shortcut}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg border border-gray-200 dark:border-dark-border hover:border-headspace-orange dark:hover:border-headspace-orange transition-colors"
                    >
                      <span className="text-sm text-gray-700 dark:text-dark-text">
                        {description}
                      </span>
                      <kbd className="px-3 py-1 bg-white dark:bg-dark-bg border-2 border-gray-300 dark:border-dark-border rounded shadow-sm font-mono text-sm font-semibold text-gray-800 dark:text-white whitespace-nowrap">
                        {formatShortcut(shortcut)}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pro Tip */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
              💡 Pro Tip
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Press <kbd className="px-2 py-1 bg-white dark:bg-dark-bg border border-blue-300 dark:border-blue-700 rounded text-xs font-mono font-semibold mx-1">
                {formatShortcut('ctrl+/')}
              </kbd> anytime to view this shortcuts guide.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-center">
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
            Keyboard shortcuts work throughout the entire application
          </p>
        </div>
      </div>
    </div>
  );
}
