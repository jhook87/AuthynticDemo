import React from 'react';
import { ScenarioStage } from '@authyntic/demo-core';
import { authynticTheme } from '../theme/authynticTheme.js';

export interface AlertSystemProps {
  readonly stage: ScenarioStage;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({ stage }) => {
  return (
    <section style={styles.container} aria-live="assertive">
      <h2 style={styles.heading}>Active Alerts</h2>
      <ul style={styles.list}>
        {stage.events.map((event) => (
          <li key={`${event.type}-${event.timestampOffset ?? 0}`} style={styles.listItem}>
            <span style={{ ...styles.badge, backgroundColor: resolveBadgeColor(event) }}>{event.type}</span>
            <span style={styles.description}>{event.description ?? 'Operational event detected.'}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

const styles = {
  container: {
    background: '#0b1625',
    border: `1px solid ${authynticTheme.colors.warning}`,
    borderRadius: 12,
    padding: '1.5rem',
    color: '#ecf0f1',
  },
  heading: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: '0.75rem',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    background: '#0f1e33',
    padding: '0.75rem',
    borderRadius: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    padding: '0.25rem 0.75rem',
    borderRadius: 9999,
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: '#0b1625',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: '0.875rem',
    lineHeight: 1.4,
  },
} as const;

function resolveBadgeColor(event: ScenarioStage['events'][number]): string {
  if ('severity' in event) {
    if (event.severity === 'critical') {
      return authynticTheme.colors.critical;
    }

    if (event.severity === 'warning') {
      return authynticTheme.colors.warning;
    }
  }

  return authynticTheme.colors.secure;
}
