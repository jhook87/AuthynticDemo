import { ScenarioDefinition } from '@authyntic/demo-core';

export type DemoScenario = ScenarioDefinition;

export interface ScenarioCatalog {
  readonly primary: DemoScenario;
  readonly supporting: readonly DemoScenario[];
}
