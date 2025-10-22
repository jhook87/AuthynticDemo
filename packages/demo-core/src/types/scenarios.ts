export type SeverityLevel = 'info' | 'warning' | 'critical';

export interface ScenarioEventBase {
  readonly type: string;
  readonly timestampOffset?: number;
  readonly description?: string;
}

export interface SeverityEvent extends ScenarioEventBase {
  readonly severity: SeverityLevel;
  readonly location?: string;
  readonly details?: string;
}

export interface IsolationEvent extends ScenarioEventBase {
  readonly target: string;
  readonly method: string;
}

export interface CountermeasureEvent extends ScenarioEventBase {
  readonly capability: string;
  readonly coverage: string;
}

export interface PatchEvent extends ScenarioEventBase {
  readonly scope: string;
  readonly verification: string;
}

export interface TrustEvent extends ScenarioEventBase {
  readonly method: string;
  readonly confidence: number;
}

export type ScenarioEvent =
  | SeverityEvent
  | IsolationEvent
  | CountermeasureEvent
  | PatchEvent
  | TrustEvent
  | ScenarioEventBase;

export interface ScenarioStage {
  readonly name: string;
  readonly duration: number;
  readonly events: readonly ScenarioEvent[];
}

export interface ScenarioDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly duration: number;
  readonly stages: readonly ScenarioStage[];
}

export interface ScenarioMetricSnapshot {
  readonly timestamp: number;
  readonly metrics: Record<string, number>;
}

export type ScenarioObserver = (snapshot: ScenarioMetricSnapshot) => void;
