import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { flagsApi } from '../api/flags';
import type { Flag } from '../api/flags';
import { environmentsApi } from '../api/environments';
import type { Environment } from '../api/environments';

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
      const flag = await flagsApi.create(projectId, environmentId, {
        name: newName,
        key: newKey,
      });
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
      const updated = await flagsApi.update(projectId, environmentId, flag.id, {
        enabled: !flag.enabled,
      });
      setFlags(prev => prev.map(f => f.id === updated.id ? updated : f));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle flag');
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <button onClick={() => navigate(`/projects/${projectId}`)}>Back to environments</button>
      <h1>{environment?.name} — Flags</h1>

      <form onSubmit={handleCreate}>
        <input
          placeholder="Flag name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          required
        />
        <input
          placeholder="Key (e.g. dark_mode)"
          value={newKey}
          onChange={e => setNewKey(e.target.value.toLowerCase())}
          required
        />
        <button type="submit" disabled={creating}>
          {creating ? 'Creating...' : 'Add flag'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {flags.length === 0 ? (
        <p>No flags yet. Create one above.</p>
      ) : (
        <ul>
          {flags.map(flag => (
            <li key={flag.id}>
              <span
                onClick={() => navigate(`/projects/${projectId}/environments/${environmentId}/flags/${flag.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <strong>{flag.name}</strong> <code>{flag.key}</code>
              </span>
              <button onClick={() => handleToggle(flag)}>
                {flag.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
