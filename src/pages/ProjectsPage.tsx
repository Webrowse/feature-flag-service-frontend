import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../api/projects';
import type { Project } from '../api/projects';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    projectsApi.list()
      .then(setProjects)
      .catch(() => setError('Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const project = await projectsApi.create(newName, newDesc || undefined);
      setProjects(prev => [project, ...prev]);
      setNewName('');
      setNewDesc('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setCreating(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Projects</h1>

      <form onSubmit={handleCreate}>
        <input
          placeholder="Project name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          required
        />
        <input
          placeholder="Description (optional)"
          value={newDesc}
          onChange={e => setNewDesc(e.target.value)}
        />
        <button type="submit" disabled={creating}>
          {creating ? 'Creating...' : 'Create project'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {projects.length === 0 ? (
        <p>No projects yet. Create one above.</p>
      ) : (
        <ul>
          {projects.map(p => (
            <li key={p.id} onClick={() => navigate(`/projects/${p.id}`)} style={{ cursor: 'pointer' }}>
              <strong>{p.name}</strong>
              {p.description && <span> — {p.description}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
