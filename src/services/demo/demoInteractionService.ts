type DemoActionId =
  | 'media.simulateUpload'
  | 'media.focusHashPanel'
  | 'network.highlightConsensus'
  | 'analytics.scrollToIntelligence';

type DemoActionListener = () => void;

const listeners = new Map<DemoActionId, Set<DemoActionListener>>();

const getListenerSet = (action: DemoActionId) => {
  if (!listeners.has(action)) {
    listeners.set(action, new Set());
  }
  // Non-null assertion safe because just set above when missing.
  return listeners.get(action)!;
};

export const demoInteractionService = {
  on(action: DemoActionId, listener: DemoActionListener) {
    const registry = getListenerSet(action);
    registry.add(listener);
    return () => {
      registry.delete(listener);
      if (registry.size === 0) {
        listeners.delete(action);
      }
    };
  },

  trigger(action: DemoActionId) {
    const registry = listeners.get(action);
    if (!registry || registry.size === 0) {
      return;
    }
    [...registry].forEach((listener) => {
      try {
        listener();
      } catch (error) {
        console.warn('Demo action listener threw', action, error);
      }
    });
  },
};

export type { DemoActionId };
