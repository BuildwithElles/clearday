import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  preventDefault?: boolean;
}

export interface KeyboardShortcutsConfig {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export function useKeyboardShortcuts(config: KeyboardShortcutsConfig) {
  const { shortcuts, enabled = true } = config;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Find matching shortcut
    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatches = shortcut.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatches = !!shortcut.ctrlKey === event.ctrlKey;
      const shiftMatches = !!shortcut.shiftKey === event.shiftKey;
      const altMatches = !!shortcut.altKey === event.altKey;
      const metaMatches = !!shortcut.metaKey === event.metaKey;

      return keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches;
    });

    if (matchingShortcut) {
      if (matchingShortcut.preventDefault !== false) {
        event.preventDefault();
      }
      matchingShortcut.action();
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, enabled]);

  // Return shortcuts for documentation/display purposes
  return {
    shortcuts,
    enabled,
  };
}

// Predefined shortcut configurations for common actions
export const taskShortcuts: KeyboardShortcut[] = [
  {
    key: 'n',
    ctrlKey: true,
    action: () => {
      // This will be implemented when we integrate with the AddTaskDialog
      console.log('New task shortcut triggered');
      // Focus the add task button or open dialog
      const addButton = document.querySelector('[data-testid="add-task-button"]') as HTMLElement;
      if (addButton) {
        addButton.click();
      }
    },
    description: 'Create new task',
    preventDefault: true,
  },
  {
    key: 'Enter',
    action: () => {
      // Submit current form if in a dialog
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.closest('[role="dialog"]')) {
        const submitButton = activeElement.closest('form')?.querySelector('button[type="submit"]') as HTMLElement;
        if (submitButton) {
          submitButton.click();
        }
      }
    },
    description: 'Submit form',
    preventDefault: true,
  },
  {
    key: 'Escape',
    action: () => {
      // Close current dialog or modal
      const closeButton = document.querySelector('[data-testid="close-dialog"], [aria-label="Close"]') as HTMLElement;
      if (closeButton) {
        closeButton.click();
      }
    },
    description: 'Close dialog',
    preventDefault: true,
  },
];

export const navigationShortcuts: KeyboardShortcut[] = [
  {
    key: '1',
    ctrlKey: true,
    action: () => {
      // Navigate to Today page
      window.location.href = '/today';
    },
    description: 'Go to Today',
    preventDefault: true,
  },
  {
    key: '2',
    ctrlKey: true,
    action: () => {
      // Navigate to Calendar page
      window.location.href = '/calendar';
    },
    description: 'Go to Calendar',
    preventDefault: true,
  },
  {
    key: '3',
    ctrlKey: true,
    action: () => {
      // Navigate to Tasks page
      window.location.href = '/tasks';
    },
    description: 'Go to Tasks',
    preventDefault: true,
  },
  {
    key: '4',
    ctrlKey: true,
    action: () => {
      // Navigate to Settings page
      window.location.href = '/settings';
    },
    description: 'Go to Settings',
    preventDefault: true,
  },
];

export const globalShortcuts: KeyboardShortcut[] = [
  {
    key: '/',
    action: () => {
      // Focus search input
      const searchInput = document.querySelector('input[type="search"], [data-testid="search-input"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    description: 'Focus search',
    preventDefault: true,
  },
  {
    key: '?',
    shiftKey: true,
    action: () => {
      // Show keyboard shortcuts help
      console.log('Show keyboard shortcuts help');
      // This could open a modal with all available shortcuts
    },
    description: 'Show keyboard shortcuts',
    preventDefault: true,
  },
];

// Helper function to format shortcut for display
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];

  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.metaKey) parts.push('Cmd');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.shiftKey) parts.push('Shift');

  parts.push(shortcut.key.toUpperCase());

  return parts.join(' + ');
}

// Helper hook for common task-related shortcuts
export function useTaskKeyboardShortcuts(onNewTask?: () => void, onSearch?: () => void) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'n',
      ctrlKey: true,
      action: () => onNewTask?.(),
      description: 'Create new task',
      preventDefault: true,
    },
    {
      key: '/',
      action: () => onSearch?.(),
      description: 'Focus search',
      preventDefault: true,
    },
  ];

  return useKeyboardShortcuts({ shortcuts });
}

// Helper hook for navigation shortcuts
export function useNavigationKeyboardShortcuts() {
  return useKeyboardShortcuts({ shortcuts: navigationShortcuts });
}

// Helper hook for global shortcuts
export function useGlobalKeyboardShortcuts() {
  return useKeyboardShortcuts({ shortcuts: globalShortcuts });
}



