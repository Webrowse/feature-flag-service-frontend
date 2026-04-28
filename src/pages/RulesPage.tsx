import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { rulesApi } from '../api/rules';
import type { Rule } from '../api/rules';
import { flagsApi } from '../api/flags';
import type { Flag } from '../api/flags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      .then(([f, r]) => { setFlag(f); setRules(r); })
      .catch(() => setError('Failed to load rules'))
      .finally(() => setLoading(false));
  }, [projectId, environmentId, flagId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId || !environmentId || !flagId) return;
    setCreating(true);
    try {
      const rule = await rulesApi.create(projectId, environmentId, flagId, { rule_type: ruleType, rule_value: ruleValue });
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
      const updated = await rulesApi.update(projectId, environmentId, flagId, rule.id, { enabled: !rule.enabled });
      setRules(prev => prev.map(r => r.id === updated.id ? updated : r));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rule');
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <p className="text-stone-400 text-sm">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(`/projects/${projectId}/environments/${environmentId}`)}
          className="text-sm text-stone-400 hover:text-stone-700 mb-6 flex items-center gap-1"
        >
          ← Flags
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-stone-900">{flag?.name}</h1>
            <Badge variant="secondary" className="font-mono text-xs bg-stone-100 text-stone-500">
              {flag?.key}
            </Badge>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${flag?.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
              {flag?.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <p className="text-sm text-stone-500">Targeting rules for this flag</p>
        </div>

        <Card className="bg-white border border-stone-200 shadow-sm mb-8">
          <CardContent className="p-5">
            <h2 className="text-sm font-medium text-stone-700 mb-4">Add targeting rule</h2>
            <form onSubmit={handleCreate} className="flex gap-3">
              <select
                value={ruleType}
                onChange={e => { setRuleType(e.target.value); setRuleValue(''); }}
                className="text-sm border border-stone-300 rounded-md px-3 py-2 bg-stone-50 text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400"
              >
                {RULE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <Input
                placeholder={
                  ruleType === 'email_domain' ? '@company.com' :
                  ruleType === 'user_email' ? 'user@example.com' :
                  'user_123'
                }
                value={ruleValue}
                onChange={e => setRuleValue(e.target.value)}
                required
                className="bg-stone-50 border-stone-300 text-stone-900 placeholder:text-stone-400"
              />
              <Button
                type="submit"
                disabled={creating}
                className="bg-stone-800 hover:bg-stone-700 text-white shrink-0"
              >
                {creating ? 'Adding...' : 'Add rule'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {rules.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <p className="font-medium text-stone-500">No rules yet</p>
            <p className="text-sm mt-1">This flag applies to all users based on rollout percentage</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map(rule => (
              <Card key={rule.id} className="bg-white border border-stone-200 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="font-mono text-xs bg-stone-100 text-stone-500">
                      {rule.rule_type}
                    </Badge>
                    <span className="text-stone-800 text-sm font-medium">{rule.rule_value}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRule(rule)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        rule.enabled ? 'bg-stone-800' : 'bg-stone-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                        rule.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(rule.id)}
                      className="text-stone-400 hover:text-red-500 hover:bg-red-50 text-xs"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
