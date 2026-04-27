import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../api/projects';
import type { Project } from '../api/projects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

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

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <p className="text-stone-400 text-sm">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">Projects</h1>
            <p className="text-sm text-stone-500 mt-1">Select a project to manage its feature flags</p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="flex gap-3 mb-8">
          <Input
            placeholder="Project name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
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
            {creating ? 'Creating...' : 'New project'}
          </Button>
        </form>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {projects.length === 0 ? (
          <div className="text-center py-24 text-stone-400">
            <p className="text-4xl mb-4">⚑</p>
            <p className="font-medium text-stone-500">No projects yet</p>
            <p className="text-sm mt-1">Create your first project above to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map(p => (
              <Card
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="bg-white border border-stone-200 shadow-sm cursor-pointer hover:border-stone-400 hover:shadow-md transition-all"
              >
                <CardContent className="p-5">
                  <h2 className="font-semibold text-stone-800 mb-1">{p.name}</h2>
                  {p.description && (
                    <p className="text-sm text-stone-500">{p.description}</p>
                  )}
                  <p className="text-xs text-stone-400 mt-3">
                    Created {new Date(p.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
