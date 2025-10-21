import { useMemo, useState } from 'react';
import {
  useOperatorStore,
  startScenario,
  pauseScenario,
  resumeScenario,
  resetScenarioPlayer,
  setScenarioSpeed,
  setScenarioScrubber,
  setScenarioHighlight,
} from '../../store';
import { getScenarioDefinition, SCENARIO_LIBRARY } from '../../constants/scenarios';
import type { ScenarioImpact } from '../../types';

const IMPACT_FILTERS: ScenarioImpact[] = ['info', 'success', 'warning', 'critical'];

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60_000);
  const seconds = Math.round((ms % 60_000) / 1_000);
  if (minutes === 0) {
    return `${seconds}s`;
  }
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
};

const formatPercentage = (value: number) => `${Math.min(100, Math.max(0, value)).toFixed(0)}%`;

export const ScenarioPlayer = () => {
  const { scenarioPlayer, scenarios, scenarioMoments } = useOperatorStore((state) => ({
    scenarioPlayer: state.scenarioPlayer,
    scenarios: state.scenarios,
    scenarioMoments: state.scenarioMoments,
  }));

  const [filters, setFilters] = useState<Record<ScenarioImpact, boolean>>({
    info: true,
    success: true,
    warning: true,
    critical: true,
  });

  const activeDefinition = useMemo(() => {
    if (!scenarioPlayer.activeScenarioId) {
      return undefined;
    }
    return getScenarioDefinition(scenarioPlayer.activeScenarioId);
  }, [scenarioPlayer.activeScenarioId]);

  const highlightMoment = useMemo(
    () => scenarioMoments.find((moment) => moment.id === scenarioPlayer.highlightedEventId),
    [scenarioMoments, scenarioPlayer.highlightedEventId],
  );

  const highlightDefinition = useMemo(() => {
    if (highlightMoment || !activeDefinition || !scenarioPlayer.highlightedEventId) {
      return undefined;
    }
    return activeDefinition.events.find((event) => event.id === scenarioPlayer.highlightedEventId);
  }, [activeDefinition, highlightMoment, scenarioPlayer.highlightedEventId]);

  const highlightCheckpoint = useMemo(() => {
    if (!activeDefinition || !scenarioPlayer.highlightedEventId) {
      return undefined;
    }
    return activeDefinition.checkpoints.find(
      (checkpoint) => checkpoint.id === scenarioPlayer.highlightedEventId,
    );
  }, [activeDefinition, scenarioPlayer.highlightedEventId]);

  const progressPercent = scenarioPlayer.durationMs
    ? (scenarioPlayer.elapsedMs / scenarioPlayer.durationMs) * 100
    : 0;

  const filteredMoments = useMemo(() => {
    const relevant = scenarioPlayer.activeScenarioId
      ? scenarioMoments.filter((moment) => moment.scenarioId === scenarioPlayer.activeScenarioId)
      : scenarioMoments;
    return relevant
      .filter((moment) => filters[moment.impact])
      .slice()
      .sort((a, b) => a.occurredAt - b.occurredAt);
  }, [scenarioMoments, scenarioPlayer.activeScenarioId, filters]);

  const selectedScenarioStatus = scenarios.find(
    (scenario) => scenario.id === scenarioPlayer.activeScenarioId,
  )?.status;

  const handleSelectScenario = (scenarioId: string) => {
    startScenario(scenarioId);
  };

  const handleScrub = (value: number) => {
    setScenarioScrubber(value);
    if (!activeDefinition) return;
    const target = activeDefinition.events
      .filter((event) => event.timing.delayMs <= value)
      .sort((a, b) => b.timing.delayMs - a.timing.delayMs)[0];
    if (target) {
      setScenarioHighlight(target.id);
    }
  };

  return (
    <section className="scenario-player">
      <header className="scenario-player__header">
        <div>
          <p className="eyebrow">Scenario deck</p>
          <h2>Scripted AuthynticOne walkthroughs</h2>
          <span>
            Launch curated simulations that orchestrate onboarding, hardening, and resilience exercises while
            visualising live telemetry.
          </span>
        </div>
        <div className="scenario-player__controls">
          <div className="control-group">
            <span>Status</span>
            <strong>{selectedScenarioStatus ?? scenarioPlayer.status}</strong>
          </div>
          <div className="control-group">
            <span>Speed</span>
            <div className="speed-control">
              <input
                type="range"
                min={0.5}
                max={4}
                step={0.5}
                value={scenarioPlayer.speed}
                onChange={(event) => setScenarioSpeed(Number(event.target.value))}
              />
              <span>{`${scenarioPlayer.speed.toFixed(1)}x`}</span>
            </div>
          </div>
          <div className="control-buttons">
            <button
              type="button"
              className="btn"
              onClick={() => {
                if (scenarioPlayer.status === 'running') {
                  pauseScenario();
                } else if (scenarioPlayer.status === 'paused') {
                  resumeScenario();
                } else if (scenarioPlayer.activeScenarioId) {
                  startScenario(scenarioPlayer.activeScenarioId);
                }
              }}
              disabled={!scenarioPlayer.activeScenarioId && scenarioPlayer.status !== 'running'}
            >
              {scenarioPlayer.status === 'running'
                ? 'Pause'
                : scenarioPlayer.status === 'paused'
                ? 'Resume'
                : 'Start'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (scenarioPlayer.status === 'running' || scenarioPlayer.status === 'paused') {
                  pauseScenario();
                }
                resetScenarioPlayer();
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      <div className="scenario-player__grid">
        {SCENARIO_LIBRARY.map((definition) => {
          const scenarioStatus = scenarios.find((scenario) => scenario.id === definition.id)?.status ?? 'pending';
          return (
            <article
              key={definition.id}
              className={`scenario-card scenario-card--${scenarioStatus}`}
              data-active={scenarioPlayer.activeScenarioId === definition.id}
            >
              <header>
                <div>
                  <h3>{definition.name}</h3>
                  <p>{definition.expectedOutcomes[0]}</p>
                </div>
                <span className={`scenario-card__complexity complexity-${definition.complexity.toLowerCase()}`}>
                  {definition.complexity}
                </span>
              </header>
              <div className="scenario-card__preview">
                <strong>{definition.preview}</strong>
                <span>Preview snapshot</span>
              </div>
              <dl className="scenario-card__meta">
                <div>
                  <dt>Duration</dt>
                  <dd>{formatDuration(definition.durationMs)}</dd>
                </div>
                <div>
                  <dt>Expected outcomes</dt>
                  <dd>
                    <ul>
                      {definition.expectedOutcomes.map((outcome) => (
                        <li key={outcome}>{outcome}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
              <footer>
                <button
                  type="button"
                  className="btn"
                  onClick={() => handleSelectScenario(definition.id)}
                >
                  {scenarioPlayer.activeScenarioId === definition.id ? 'Restart scenario' : 'Play scenario'}
                </button>
                <span className="scenario-card__status">{scenarioStatus}</span>
              </footer>
            </article>
          );
        })}
      </div>

      <section className="scenario-timeline">
        <header>
          <h3>Timeline</h3>
          <span>{formatPercentage(progressPercent)} complete</span>
        </header>
        <div className="timeline-track">
          <div className="timeline-progress" style={{ width: formatPercentage(progressPercent) }} />
          {scenarioPlayer.checkpoints.map((checkpoint) => (
            <button
              key={checkpoint.id}
              type="button"
              className={`timeline-checkpoint ${checkpoint.reached ? 'reached' : ''}`}
              title={checkpoint.description}
              style={{
                left: `${Math.min(
                  100,
                  Math.max(
                    0,
                    scenarioPlayer.durationMs
                      ? (checkpoint.offsetMs / scenarioPlayer.durationMs) * 100
                      : 0,
                  ),
                )}%`,
              }}
              onClick={() => setScenarioHighlight(checkpoint.id)}
            >
              <span />
              <small>{checkpoint.label}</small>
            </button>
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={scenarioPlayer.durationMs || 1}
          step={500}
          value={scenarioPlayer.scrubberMs}
          onChange={(event) => handleScrub(Number(event.target.value))}
          disabled={!scenarioPlayer.durationMs}
        />
      </section>

      <section className="scenario-insights">
        <div className="insight-panel">
          <header>
            <h4>Highlighted event</h4>
          </header>
          {highlightMoment ? (
            <div className={`highlight highlight-${highlightMoment.impact}`}>
              <h5>{highlightMoment.headline}</h5>
              <p>{highlightMoment.details}</p>
            </div>
          ) : highlightDefinition ? (
            <div className={`highlight highlight-${highlightDefinition.payload.impact}`}>
              <h5>{highlightDefinition.payload.headline}</h5>
              <p>{highlightDefinition.payload.details}</p>
            </div>
          ) : highlightCheckpoint ? (
            <div className="highlight highlight-checkpoint">
              <h5>{highlightCheckpoint.label}</h5>
              <p>{highlightCheckpoint.description}</p>
            </div>
          ) : (
            <p className="placeholder">Select a checkpoint or event to inspect details.</p>
          )}
        </div>
        <div className="insight-panel">
          <header>
            <h4>Event filters</h4>
          </header>
          <div className="impact-filters">
            {IMPACT_FILTERS.map((impact) => (
              <label key={impact}>
                <input
                  type="checkbox"
                  checked={filters[impact]}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, [impact]: event.target.checked }))
                  }
                />
                <span className={`tag impact-${impact}`}>{impact}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="scenario-feed">
        <header>
          <h3>Scenario activity stream</h3>
          <span>
            {scenarioPlayer.activeScenarioId
              ? `Streaming events for ${activeDefinition?.name ?? 'selected scenario'}`
              : 'Select a scenario to begin playback.'}
          </span>
        </header>
        {filteredMoments.length === 0 ? (
          <p className="placeholder">No scenario events yet. Start a scenario to populate the timeline.</p>
        ) : (
          <ul>
            {filteredMoments.map((moment) => (
              <li key={moment.id} className={`scenario-event scenario-${moment.impact}`}>
                <button type="button" onClick={() => setScenarioHighlight(moment.id)}>
                  <strong>{moment.headline}</strong>
                  <p>{moment.details}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
};

export default ScenarioPlayer;

