import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { environmentsApi } from '../api/environments';
import type { Environment } from '../api/environments';
import { projectsApi } from '../api/projects';
import type { Project } from '../api/projects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function EnvironmentsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newDesc, setNewDesc] = useState('');
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
      const env = await environmentsApi.create(projectId, { name: newName, key: newKey, description: newDesc || undefined });
      setEnvironments(prev => [...prev, env]);
      setNewName('');
      setNewKey('');
      setNewDesc('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create environment');
    } finally {
      setCreating(false);
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
          onClick={() => navigate('/dashboard')}
          className="text-sm text-stone-400 hover:text-stone-700 mb-6 flex items-center gap-1"
        >
          ← Projects
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900">{project?.name}</h1>
          <p className="text-sm text-stone-500 mt-1">Select an environment to manage its feature flags</p>
        </div>

        <form onSubmit={handleCreate} className="flex gap-3 mb-8">
          <Input
            placeholder="Name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            required
            className="bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 max-w-xs"
          />
          <Input
            placeholder="Key (e.g. staging)"
            value={newKey}
            onChange={e => setNewKey(e.target.value.toLowerCase())}
            required
            className="bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 max-w-xs"
          />
          <Input
            placeholder="Description (optional)"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            className="bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 max-w-xs"
          />
          <Button
            type="submit"
            disabled={creating}
            className="bg-stone-800 hover:bg-stone-700 text-white shrink-0"
          >
            {creating ? 'Creating...' : 'Add environment'}
          </Button>
        </form>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {environments.map(env => (
            <Card
              key={env.id}
              onClick={() => navigate(`/projects/${projectId}/environments/${env.id}`)}
              className="bg-white border border-stone-200 shadow-sm cursor-pointer hover:border-stone-400 hover:shadow-md transition-all"
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-stone-800">{env.name}</h2>
                  {env.description && (
                    <p className="text-xs text-stone-400 mt-0.5">{env.description}</p>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs font-mono bg-stone-100 text-stone-500">
                  {env.key}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
