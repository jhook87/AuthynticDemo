import { useMemo, useState } from 'react';
import {
  useOperatorStore,
  acknowledgeAlert,
  pushActivity,
} from '../../store';
import { randomId } from '../../utils/random';

interface TimelineEntry {
  id: string;
  type: 'registration' | 'activity' | 'alert' | 'scenario';
  title: string;
  description: string;
  timestamp: number;
  meta?: string;
  acknowledged?: boolean;
}

const TYPE_FILTERS: TimelineEntry['type'][] = ['registration', 'activity', 'alert', 'scenario'];

export const ActivityMonitor = () => {
  const { registrations, activityFeed, alerts, scenarioMoments, scenarioPlayer } = useOperatorStore((state) => ({
    registrations: state.registrations,
    activityFeed: state.activityFeed,
    alerts: state.alerts,
    scenarioMoments: state.scenarioMoments,
    scenarioPlayer: state.scenarioPlayer,
  }));

  const [enabledTypes, setEnabledTypes] = useState<Record<TimelineEntry['type'], boolean>>({
    registration: true,
    activity: true,
    alert: true,
    scenario: true,
  });

  const timeline = useMemo<TimelineEntry[]>(() => {
    const entries: TimelineEntry[] = [];
    registrations.forEach((registration) => {
      entries.push({
        id: registration.id,
        type: 'registration',
        title: registration.name,
        description: `Joined ${registration.organization} as ${registration.role}`,
        timestamp: registration.registeredAt,
      });
    });
    activityFeed.forEach((activity) => {
      entries.push({
        id: activity.id,
        type: 'activity',
        title: activity.summary,
        description: `Channel: ${activity.channel}`,
        timestamp: activity.occurredAt,
      });
    });
    alerts.forEach((alert) => {
      entries.push({
        id: alert.id,
        type: 'alert',
        title: alert.title,
        description: alert.message,
        timestamp: alert.createdAt,
        acknowledged: alert.acknowledged,
      });
    });
    scenarioMoments.forEach((moment) => {
      entries.push({
        id: moment.id,
        type: 'scenario',
        title: moment.headline,
        description: moment.details,
        timestamp: moment.occurredAt,
        meta: moment.impact,
      });
    });
    return entries
      .filter((entry) => enabledTypes[entry.type])
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 15);
  }, [registrations, activityFeed, alerts, scenarioMoments, enabledTypes]);

  const activeHighlight = scenarioPlayer.highlightedEventId;

  const simulateResponse = () => {
    if (!activeHighlight) {
      return;
    }
    pushActivity({
      id: randomId('activity'),
      summary: `Response automation acknowledged ${activeHighlight}`,
      occurredAt: Date.now(),
      channel: 'system',
    });
  };

  return (
    <section className="activity-monitor">
      <header>
        <div>
          <h3>User activity stream</h3>
          <span>Registrations, alerts, and scenario beats converge here.</span>
        </div>
        <div className="activity-controls">
          <div className="filter-group">
            {TYPE_FILTERS.map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={enabledTypes[type]}
                  onChange={(event) =>
                    setEnabledTypes((current) => ({ ...current, [type]: event.target.checked }))
                  }
                />
                <span className={`tag tag-${type}`}>{type}</span>
              </label>
            ))}
          </div>
          <button type="button" className="btn btn-secondary" onClick={simulateResponse} disabled={!activeHighlight}>
            Simulate response
          </button>
        </div>
      </header>

      {timeline.length === 0 ? (
        <p className="placeholder">No recent events yet. Trigger a scenario to watch the stream animate.</p>
      ) : (
        <ul>
          {timeline.map((entry) => (
            <li key={entry.id} className={`timeline-entry entry-${entry.type}`}>
              <div>
                <strong>{entry.title}</strong>
                <p>{entry.description}</p>
                {entry.meta && <span className={`impact impact-${entry.meta}`}>{entry.meta}</span>}
              </div>
              {entry.type === 'alert' && !entry.acknowledged && (
                <button type="button" onClick={() => acknowledgeAlert(entry.id)}>
                  Acknowledge
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ActivityMonitor;

