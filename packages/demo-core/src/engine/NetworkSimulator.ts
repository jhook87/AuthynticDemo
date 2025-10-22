import { ScenarioDefinition, ScenarioEvent, ScenarioStage } from '../types/scenarios.js';

export interface NetworkNode {
  readonly id: string;
  readonly role: 'operator' | 'device' | 'relay';
  readonly status: 'secure' | 'warning' | 'critical';
}

export interface NetworkLink {
  readonly source: string;
  readonly target: string;
  readonly throughput: number;
}

export interface NetworkSnapshot {
  readonly nodes: readonly NetworkNode[];
  readonly links: readonly NetworkLink[];
}

export class NetworkSimulator {
  public generateSnapshot(_scenario: ScenarioDefinition, stage: ScenarioStage, elapsedRatio: number): NetworkSnapshot {
    const nodes = this.generateNodes(stage, elapsedRatio);
    const links = this.generateLinks(nodes, elapsedRatio);
    return { nodes, links };
  }

  private generateNodes(stage: ScenarioStage, elapsedRatio: number): NetworkNode[] {
    return stage.events.map((event, index) => ({
      id: `${stage.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
      role: this.resolveRole(event.type),
      status: this.resolveStatus(event, elapsedRatio),
    }));
  }

  private generateLinks(nodes: readonly NetworkNode[], elapsedRatio: number): NetworkLink[] {
    if (nodes.length < 2) {
      return [];
    }

    return nodes.slice(1).map((node, index) => ({
      source: nodes[index].id,
      target: node.id,
      throughput: Math.max(0.1, 1 - elapsedRatio * 0.3),
    }));
  }

  private resolveRole(eventType: string): NetworkNode['role'] {
    if (eventType.includes('RELAY')) {
      return 'relay';
    }

    if (eventType.includes('OPERATOR')) {
      return 'operator';
    }

    return 'device';
  }

  private resolveStatus(event: ScenarioEvent, elapsedRatio: number): NetworkNode['status'] {
    if ('severity' in event) {
      if (event.severity === 'critical') {
        return 'critical';
      }

      if (event.severity === 'warning') {
        return 'warning';
      }
    }

    if (elapsedRatio > 0.6) {
      return 'warning';
    }

    return 'secure';
  }
}
