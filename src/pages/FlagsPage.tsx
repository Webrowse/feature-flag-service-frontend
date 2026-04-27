import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { flagsApi } from '../api/flags';
import type { Flag } from '../api/flags';
import { environmentsApi } from '../api/environments';
import type { Environment } from '../api/environments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FlagsPage() {
  const { projectId, environmentId } = useParams<{ projectId: string; environmentId: string }>();
  const navigate = useNavigate();

  const [environment, setEnvironment] = useState<Environment | null>(null);
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [newKey, setNewKey] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!projectId || !environmentId) return;
    Promise.all([
      environmentsApi.get(projectId, environmentId),
      flagsApi.list(projectId, environmentId),
    ])
      .then(([env, f]) => {
        setEnvironment(env);
        setFlags(f);
      })
      .catch(() => setError('Failed to load flags'))
      .finally(() => setLoading(false));
  }, [projectId, environmentId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId || !environmentId) return;
    setCreating(true);
    try {
      const flag = await flagsApi.create(projectId, environmentId, { name: newName, key: newKey });
      setFlags(prev => [flag, ...prev]);
      setNewName('');
      setNewKey('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create flag');
    } finally {
      setCreating(false);
    }
  }

  async function handleToggle(flag: Flag) {
    if (!projectId || !environmentId) return;
    try {
      const updated = await flagsApi.update(projectId, environmentId, flag.id, { enabled: !flag.enabled });
      setFlags(prev => prev.map(f => f.id === updated.id ? updated : f));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle flag');
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
          onClick={() => navigate(`/projects/${projectId}`)}
          className="text-sm text-stone-400 hover:text-stone-700 mb-6 flex items-center gap-1"
        >
          ← Environments
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-stone-900">{environment?.name}</h1>
            <Badge variant="secondary" className="font-mono text-xs bg-stone-100 text-stone-500">
              {environment?.key}
            </Badge>
          </div>
          <p className="text-sm text-stone-500 mt-1">Manage feature flags for this environment</p>
        </div>

        <form onSubmit={handleCreate} className="flex gap-3 mb-8">
          <Input
            placeholder="Flag name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            required
            className="bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 max-w-xs"
          />
          <Input
            placeholder="Key (e.g. dark_mode)"
            value={newKey}
            onChange={e => setNewKey(e.target.value.toLowerCase())}
            required
            className="bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 max-w-xs"
          />
          <Button
            type="submit"
            disabled={creating}
            className="bg-stone-800 hover:bg-stone-700 text-white shrink-0"
          >
            {creating ? 'Creating...' : 'Add flag'}
          </Button>
        </form>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {flags.length === 0 ? (
          <div className="text-center py-24 text-stone-400">
            <p className="text-4xl mb-4">⚑</p>
            <p className="font-medium text-stone-500">No flags yet</p>
            <p className="text-sm mt-1">Create your first flag above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {flags.map(flag => (
              <Card key={flag.id} className="bg-white border border-stone-200 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div
                    className="cursor-pointer flex-1"
                    onClick={() => navigate(`/projects/${projectId}/environments/${environmentId}/flags/${flag.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-800">{flag.name}</span>
                      <Badge variant="secondary" className="font-mono text-xs bg-stone-100 text-stone-500">
                        {flag.key}
                      </Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(flag)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      flag.enabled ? 'bg-stone-800' : 'bg-stone-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                        flag.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
