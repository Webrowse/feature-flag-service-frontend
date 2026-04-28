import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F2EC' }}>
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded bg-stone-800 flex items-center justify-center">
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <span className="text-stone-700 font-medium text-sm tracking-wide">Feature Flag Service</span>
          </div>
          <h1 className="text-2xl font-semibold text-stone-800 mb-1">Create an account</h1>
          <p className="text-stone-500 text-sm">Start controlling your features today</p>
        </div>

        <Card className="border border-stone-200 shadow-sm bg-white">
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-2">
              <CardTitle className="sr-only">Register</CardTitle>
              <CardDescription className="sr-only">Create a new account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-stone-600 text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="bg-stone-50 border-stone-300 text-stone-900 placeholder:text-stone-400 focus-visible:ring-stone-400"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-stone-600 text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="bg-stone-50 border-stone-300 text-stone-900 focus-visible:ring-stone-400"
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-0">
              <Button
                type="submit"
                className="w-full bg-stone-800 hover:bg-stone-700 text-white"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
              <p className="text-xs text-stone-400 text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-stone-600 underline underline-offset-4 hover:text-stone-800">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
