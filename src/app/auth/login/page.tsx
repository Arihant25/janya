'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Button, TextField, LinearProgress } from '@/app/components/MaterialComponents';
import { Sparkles, Mail, Lock, AlertCircle, Clock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--md-sys-color-surface-container-low)' }}>
      <Card variant="elevated" className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-16 h-16" style={{ color: 'var(--md-sys-color-primary)' }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--md-sys-color-on-surface)' }}>
            Welcome back to Janya
          </h1>
          <p className="text-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            Sign in to your journaling space
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isLoading && (
            <LinearProgress indeterminate className="mb-4" />
          )}

          {error && (
            <Card variant="filled" className="p-3 mb-4"
              style={{ backgroundColor: 'var(--md-sys-color-error-container)' }}>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" style={{ color: 'var(--md-sys-color-on-error-container)' }} />
                <span className="text-sm" style={{ color: 'var(--md-sys-color-on-error-container)' }}>
                  {error}
                </span>
              </div>
            </Card>
          )}

          <div className="space-y-4">
            <div className="relative">
              <TextField
                label="Email address"
                type="email"
                required
                value={email}
                onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                hasLeadingIcon
                className="w-full"
              />
              <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }} />
            </div>

            <div className="relative">
              <TextField
                label="Password"
                type="password"
                required
                value={password}
                onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                hasLeadingIcon
                className="w-full"
              />
              <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }} />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="filled"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              Don't have an account?{' '}
              <Link
                href="/auth/register"
                className="font-medium hover:underline"
                style={{ color: 'var(--md-sys-color-primary)' }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}