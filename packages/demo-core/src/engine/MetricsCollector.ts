import { ScenarioMetricSnapshot, ScenarioObserver } from '../types/scenarios.js';

export interface MetricsCollectorOptions {
  readonly bufferSize?: number;
}

export class MetricsCollector {
  private readonly bufferSize: number;
  private readonly snapshots: ScenarioMetricSnapshot[] = [];
  private latest?: ScenarioMetricSnapshot;

  constructor(options: MetricsCollectorOptions = {}) {
    this.bufferSize = options.bufferSize ?? 120;
  }

  public readonly observer: ScenarioObserver = (snapshot) => {
    this.latest = snapshot;
    this.snapshots.push(snapshot);
    if (this.snapshots.length > this.bufferSize) {
      this.snapshots.shift();
    }
  };

  public getLatestSnapshot(): ScenarioMetricSnapshot | undefined {
    return this.latest;
  }

  public getSnapshotHistory(): readonly ScenarioMetricSnapshot[] {
    return [...this.snapshots];
  }
}
