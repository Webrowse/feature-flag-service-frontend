import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { rulesApi } from '../api/rules';
import type { Rule } from '../api/rules';
import { flagsApi } from '../api/flags';
import type { Flag } from '../api/flags';

const RULE_TYPES = ['user_id', 'user_email', 'email_domain'];

export default function RulesPage() {
  const { projectId, environmentId, flagId } = useParams<{
    projectId: string;
    environmentId: string;
    flagId: string;
  }>();
  const navigate = useNavigate();

  const [flag, setFlag] = useState<Flag | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ruleType, setRuleType] = useState('user_id');
  const [ruleValue, setRuleValue] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!projectId || !environmentId || !flagId) return;
    Promise.all([
      flagsApi.get(projectId, environmentId, flagId),
      rulesApi.list(projectId, environmentId, flagId),
    ])
      .then(([f, r]) => {
        setFlag(f);
        setRules(r);
      })
      .catch(() => setError('Failed to load rules'))
      .finally(() => setLoading(false));
  }, [projectId, environmentId, flagId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId || !environmentId || !flagId) return;
    setCreating(true);
    try {
      const rule = await rulesApi.create(projectId, environmentId, flagId, {
        rule_type: ruleType,
        rule_value: ruleValue,
      });
      setRules(prev => [...prev, rule]);
      setRuleValue('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create rule');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(ruleId: string) {
    if (!projectId || !environmentId || !flagId) return;
    try {
      await rulesApi.delete(projectId, environmentId, flagId, ruleId);
      setRules(prev => prev.filter(r => r.id !== ruleId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete rule');
    }
  }

  async function handleToggleRule(rule: Rule) {
    if (!projectId || !environmentId || !flagId) return;
    try {
      const updated = await rulesApi.update(projectId, environmentId, flagId, rule.id, {
        enabled: !rule.enabled,
      });
      setRules(prev => prev.map(r => r.id === updated.id ? updated : r));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rule');
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <button onClick={() => navigate(`/projects/${projectId}/environments/${environmentId}`)}>
        Back to flags
      </button>
      <h1>{flag?.name} — Rules</h1>
      <p>Flag key: <code>{flag?.key}</code> — {flag?.enabled ? 'Enabled' : 'Disabled'}</p>

      <h2>Add rule</h2>
      <form onSubmit={handleCreate}>
        <select value={ruleType} onChange={e => { setRuleType(e.target.value); setRuleValue(''); }}>
          {RULE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input
          placeholder={
            ruleType === 'email_domain' ? '@company.com' :
            ruleType === 'user_email' ? 'user@example.com' :
            'user_123'
          }
          value={ruleValue}
          onChange={e => setRuleValue(e.target.value)}
          required
        />
        <button type="submit" disabled={creating}>
          {creating ? 'Adding...' : 'Add rule'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {rules.length === 0 ? (
        <p>No rules yet. This flag applies to all users based on rollout percentage.</p>
      ) : (
        <ul>
          {rules.map(rule => (
            <li key={rule.id}>
              <code>{rule.rule_type}</code>: <strong>{rule.rule_value}</strong>
              <button onClick={() => handleToggleRule(rule)}>
                {rule.enabled ? 'Enabled' : 'Disabled'}
              </button>
              <button onClick={() => handleDelete(rule.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
