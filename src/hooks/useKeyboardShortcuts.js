// Keyboard shortcuts hook for HomeLLM
import { useEffect } from 'react';

/**
 * Keyboard shortcuts configuration
 */
export const shortcuts = {
  // Tab navigation
  'alt+1': { description: 'Go to Email Generator', action: 'tab-email' },
  'alt+2': { description: 'Go to Water Analysis', action: 'tab-water' },
  'alt+3': { description: 'Go to Lease Analyzer', action: 'tab-lease' },
  'alt+4': { description: 'Go to Inspection', action: 'tab-inspection' },
  'alt+5': { description: 'Go to Insurance', action: 'tab-insurance' },
  'alt+6': { description: 'Go to Utility', action: 'tab-utility' },
  'alt+7': { description: 'Go to Timeline', action: 'tab-timeline' },
  'alt+8': { description: 'Go to Calculator', action: 'tab-calculator' },
  'alt+9': { description: 'Go to Drafts', action: 'tab-drafts' },

  // Actions
  'ctrl+enter': { description: 'Generate Email', action: 'generate-email' },
  'ctrl+s': { description: 'Save Draft', action: 'save-draft' },
  'ctrl+shift+c': { description: 'Copy Email', action: 'copy-email' },
  'ctrl+shift+d': { description: 'Download Email', action: 'download-email' },
  'ctrl+shift+p': { description: 'Export as PDF', action: 'export-pdf' },
  'ctrl+shift+e': { description: 'Export Evidence Packet', action: 'export-evidence' },

  // UI controls
  'ctrl+k': { description: 'Open Command Palette', action: 'command-palette' },
  'ctrl+/': { description: 'Show Keyboard Shortcuts', action: 'show-shortcuts' },
  'alt+t': { description: 'Toggle Dark Mode', action: 'toggle-theme' },
  'alt+l': { description: 'Toggle Language', action: 'toggle-language' },
  'esc': { description: 'Close Modals', action: 'close-modal' },

  // Form controls
  'ctrl+shift+v': { description: 'Start/Stop Voice Input', action: 'toggle-voice' },
  'ctrl+shift+t': { description: 'Load Template', action: 'load-template' },
  'ctrl+shift+r': { description: 'Clear Form', action: 'reset-form' }
};

/**
 * Check if key combination matches
 */
function matchesShortcut(event, shortcut) {
  const keys = shortcut.toLowerCase().split('+');

  const needsCtrl = keys.includes('ctrl');
  const needsAlt = keys.includes('alt');
  const needsShift = keys.includes('shift');
  const key = keys[keys.length - 1];

  const ctrlMatch = needsCtrl ? (event.ctrlKey || event.metaKey) : !(event.ctrlKey || event.metaKey);
  const altMatch = needsAlt ? event.altKey : !event.altKey;
  const shiftMatch = needsShift ? event.shiftKey : !event.shiftKey;

  let keyMatch = false;
  if (key === 'enter') {
    keyMatch = event.key === 'Enter';
  } else if (key === 'esc') {
    keyMatch = event.key === 'Escape';
  } else {
    keyMatch = event.key.toLowerCase() === key;
  }

  return ctrlMatch && altMatch && shiftMatch && keyMatch;
}

/**
 * Keyboard shortcuts hook
 * @param {Object} handlers - Map of action names to handler functions
 * @param {boolean} enabled - Whether shortcuts are enabled
 */
export function useKeyboardShortcuts(handlers, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in inputs (except specific ones)
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName);

      // Allow certain shortcuts even in inputs
      const allowedInInputs = ['ctrl+s', 'ctrl+enter', 'ctrl+k', 'esc', 'ctrl+/'];
      const shortcutKey = Object.keys(shortcuts).find(key => matchesShortcut(event, key));

      if (isInput && !allowedInInputs.includes(shortcutKey)) {
        return;
      }

      // Check each shortcut
      for (const [key, config] of Object.entries(shortcuts)) {
        if (matchesShortcut(event, key)) {
          event.preventDefault();

          const handler = handlers[config.action];
          if (handler) {
            handler(event);
          } else {
            console.warn(`No handler found for action: ${config.action}`);
          }

          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers, enabled]);
}

/**
 * Get grouped shortcuts for display
 */
export function getShortcutGroups() {
  return {
    'Navigation': {
      'alt+1-9': 'Switch between tabs',
      'esc': 'Close modals'
    },
    'Email Actions': {
      'ctrl+enter': 'Generate Email',
      'ctrl+s': 'Save Draft',
      'ctrl+shift+c': 'Copy Email',
      'ctrl+shift+d': 'Download Email',
      'ctrl+shift+p': 'Export as PDF',
      'ctrl+shift+e': 'Export Evidence Packet'
    },
    'Form Controls': {
      'ctrl+shift+v': 'Start/Stop Voice Input',
      'ctrl+shift+t': 'Load Template',
      'ctrl+shift+r': 'Clear Form'
    },
    'UI Controls': {
      'ctrl+k': 'Open Command Palette',
      'ctrl+/': 'Show Keyboard Shortcuts',
      'alt+t': 'Toggle Dark Mode',
      'alt+l': 'Toggle Language'
    }
  };
}

export default useKeyboardShortcuts;
