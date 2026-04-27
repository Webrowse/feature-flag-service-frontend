import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { environmentsApi } from '../api/environments';
import type { Environment } from '../api/environments';
import { projectsApi } from '../api/projects';
import type { Project } from '../api/projects';

export default function EnvironmentsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [newKey, setNewKey] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    Promise.all([
      projectsApi.get(projectId),
      environmentsApi.list(projectId),
    ])
      .then(([proj, envs]) => {
        setProject(proj);
        setEnvironments(envs);
      })
      .catch(() => setError('Failed to load environments'))
      .finally(() => setLoading(false));
  }, [projectId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId) return;
    setCreating(true);
    try {
      const env = await environmentsApi.create(projectId, { name: newName, key: newKey });
      setEnvironments(prev => [...prev, env]);
      setNewName('');
      setNewKey('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create environment');
    } finally {
      setCreating(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <button onClick={() => navigate('/')}>Back to projects</button>
      <h1>{project?.name}</h1>
      <h2>Environments</h2>

      <form onSubmit={handleCreate}>
        <input
          placeholder="Name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          required
        />
        <input
          placeholder="Key (e.g. staging)"
          value={newKey}
          onChange={e => setNewKey(e.target.value.toLowerCase())}
          required
        />
        <button type="submit" disabled={creating}>
          {creating ? 'Creating...' : 'Add environment'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul>
        {environments.map(env => (
          <li
            key={env.id}
            onClick={() => navigate(`/projects/${projectId}/environments/${env.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <strong>{env.name}</strong> <code>{env.key}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}
