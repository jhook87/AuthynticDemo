import { useCallback } from 'react';
import { useOperatorStore } from '../../store';
import { formatTimestamp } from '../../utils/formatters';
import type { OperatorState } from '../../types';

export const ConfigurationCenter = () => {
  const selectConfigurationState = useCallback(
    (state: OperatorState) => ({
      webhooks: state.webhooks,
      integrations: state.integrations,
      tasks: state.tasks,
      disasterPlans: state.disasterPlans,
      upgrades: state.upgrades,
    }),
    [],
  );
  const { webhooks, integrations, tasks, disasterPlans, upgrades } = useOperatorStore(selectConfigurationState);

  return (
    <section className="panel settings-panel">
      <header>
        <h2>Operations & configuration</h2>
        <p>Manage automation, policies, and readiness across the Authyntic platform.</p>
      </header>
      <div className="settings-grid">
        <section>
          <h3>Incident tasks</h3>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <strong>{task.title}</strong>
                <span>{task.status}</span>
                <span>SLA {task.slaMinutes} minutes</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Integrations</h3>
          <ul>
            {integrations.map((integration) => (
              <li key={integration.id}>
                <strong>{integration.name}</strong>
                <span>{integration.type}</span>
                <span>{integration.enabled ? 'Enabled' : 'Disabled'}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Webhooks</h3>
          <ul>
            {webhooks.map((webhook) => (
              <li key={webhook.id}>
                <strong>{webhook.targetUrl}</strong>
                <span>Events {webhook.events.join(', ')}</span>
                <span>Last invocation {webhook.lastInvocation ? formatTimestamp(webhook.lastInvocation) : 'Never'}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Disaster recovery</h3>
          <ul>
            {disasterPlans.map((plan) => (
              <li key={plan.id}>
                <strong>{plan.name}</strong>
                <span>Status {plan.status}</span>
                <span>RTO {plan.rtoMinutes} min · RPO {plan.rpoMinutes} min</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Upgrade schedule</h3>
          <ul>
            {upgrades.map((upgrade) => (
              <li key={upgrade.id}>
                <strong>{upgrade.component}</strong>
                <span>{formatTimestamp(upgrade.scheduledFor)}</span>
                <span>Duration {upgrade.durationMinutes} minutes</span>
                <span>Impact {upgrade.impactLevel}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
};
