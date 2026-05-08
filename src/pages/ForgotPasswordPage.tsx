import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await authApi.requestPasswordReset(email);
      setSuccess('If your account exists, a password reset link has been sent to your email.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#eeeae6' }}>
      <div className="w-full max-w-md px-4">
        <Card className="border border-stone-200 shadow-sm" style={{ backgroundColor: '#f5f2ee' }}>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-stone-800">Forgot password</CardTitle>
              <CardDescription>Enter your email to receive a reset link.</CardDescription>
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
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              {success && <p className="text-xs text-green-700">{success}</p>}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-0">
              <Button type="submit" className="w-full bg-stone-700 hover:bg-stone-800 text-white" disabled={loading}>
                {loading ? 'Sending link...' : 'Send reset link'}
              </Button>
              <Link to="/login" className="text-xs text-stone-500 underline underline-offset-4 hover:text-stone-700">
                Back to sign in
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
