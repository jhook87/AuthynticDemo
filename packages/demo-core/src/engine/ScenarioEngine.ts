import { ScenarioDefinition, ScenarioMetricSnapshot, ScenarioObserver, ScenarioStage } from '../types/scenarios.js';

interface ScenarioEngineOptions {
  readonly tickInterval?: number;
}

export class ScenarioEngine {
  private readonly observers: Set<ScenarioObserver> = new Set();
  private readonly tickInterval: number;
  private activeScenario?: ScenarioDefinition;
  private currentStageIndex = 0;
  private startTimestamp = 0;
  private timer?: ReturnType<typeof setInterval>;

  constructor(options: ScenarioEngineOptions = {}) {
    this.tickInterval = options.tickInterval ?? 1000;
  }

  public loadScenario(scenario: ScenarioDefinition): void {
    this.stop();
    this.activeScenario = scenario;
    this.currentStageIndex = 0;
  }

  public start(): void {
    if (!this.activeScenario) {
      throw new Error('Scenario must be loaded before starting the engine.');
    }

    this.stop();
    this.startTimestamp = Date.now();
    this.emitSnapshot();
    this.timer = setInterval(() => {
      this.emitSnapshot();
      this.advanceStageIfNeeded();
    }, this.tickInterval);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  public onMetrics(observer: ScenarioObserver): () => void {
    this.observers.add(observer);
    return () => {
      this.observers.delete(observer);
    };
  }

  private emitSnapshot(): void {
    if (!this.activeScenario) {
      return;
    }

    const elapsed = Date.now() - this.startTimestamp;
    const stage = this.activeScenario.stages[this.currentStageIndex];

    const metrics: ScenarioMetricSnapshot = {
      timestamp: elapsed,
      metrics: {
        readiness: this.calculateReadiness(stage, elapsed),
        stability: this.calculateStability(stage),
      },
    };

    for (const observer of this.observers) {
      observer(metrics);
    }
  }

  private calculateReadiness(stage: ScenarioStage, elapsed: number): number {
    const duration = stage.duration === 0 ? 1 : stage.duration;
    const progress = Math.min(elapsed / duration, 1);
    return Math.round(progress * 100);
  }

  private calculateStability(stage: ScenarioStage): number {
    const baseline = 100 - stage.events.length * 5;
    return Math.max(baseline, 10);
  }

  private advanceStageIfNeeded(): void {
    if (!this.activeScenario) {
      return;
    }

    const stage = this.activeScenario.stages[this.currentStageIndex];
    const elapsed = Date.now() - this.startTimestamp;

    if (elapsed >= stage.duration && this.currentStageIndex < this.activeScenario.stages.length - 1) {
      this.currentStageIndex += 1;
      this.startTimestamp = Date.now();
    }
  }
}
