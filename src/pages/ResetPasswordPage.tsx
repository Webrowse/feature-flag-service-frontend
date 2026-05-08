import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Missing password reset token in URL.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, newPassword);
      setSuccess('Password reset successful. You can now sign in with your new password.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
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
              <CardTitle className="text-stone-800">Reset password</CardTitle>
              <CardDescription>Choose a new password for your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-password" className="text-stone-600 text-sm">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-stone-600 text-sm">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              {success && <p className="text-xs text-green-700">{success}</p>}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-0">
              <Button type="submit" className="w-full bg-stone-700 hover:bg-stone-800 text-white" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset password'}
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
