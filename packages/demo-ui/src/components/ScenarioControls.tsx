import React from 'react';
import { ScenarioDefinition } from '@authyntic/demo-core';

export interface ScenarioControlsProps {
  readonly scenarios: readonly ScenarioDefinition[];
  readonly activeScenarioId?: string;
  readonly onSelectScenario: (scenarioId: string) => void;
  readonly onStart: () => void;
  readonly onStop: () => void;
}

export const ScenarioControls: React.FC<ScenarioControlsProps> = ({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  onStart,
  onStop,
}) => {
  return (
    <section style={styles.container}>
      <h2 style={styles.heading}>Scenario Controls</h2>
      <label style={styles.label} htmlFor="scenario-select">
        Active Scenario
      </label>
      <select
        id="scenario-select"
        style={styles.select}
        value={activeScenarioId ?? ''}
        onChange={(event) => onSelectScenario(event.target.value)}
      >
        <option value="" disabled>
          Choose a scenario
        </option>
        {scenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.name}
          </option>
        ))}
      </select>

      <div style={styles.buttonGroup}>
        <button type="button" style={styles.primaryButton} onClick={onStart}>
          Initiate Scenario
        </button>
        <button type="button" style={styles.secondaryButton} onClick={onStop}>
          Halt Scenario
        </button>
      </div>
    </section>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    background: '#0f1e33',
    padding: '1.5rem',
    borderRadius: 16,
    color: '#ecf0f1',
  },
  heading: {
    fontSize: '1.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  label: {
    fontSize: '0.875rem',
    letterSpacing: '0.05em',
  },
  select: {
    padding: '0.75rem 1rem',
    background: '#091123',
    borderRadius: 12,
    border: '1px solid #1c2a44',
    color: '#ecf0f1',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.75rem',
  },
  primaryButton: {
    flex: 1,
    padding: '0.75rem 1rem',
    borderRadius: 12,
    border: 'none',
    background: '#1abc9c',
    color: '#0b1625',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
  secondaryButton: {
    flex: 1,
    padding: '0.75rem 1rem',
    borderRadius: 12,
    border: '1px solid #1c2a44',
    background: 'transparent',
    color: '#ecf0f1',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
} as const;
