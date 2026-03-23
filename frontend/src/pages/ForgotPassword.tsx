import { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import { Zap } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/account/password/forgot', { email });
      setSent(true);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
            <Zap className="h-5 w-5 text-accent-foreground" strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-bold">{sent ? 'Check your email' : 'Reset password'}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {sent ? 'We sent a password reset link to your email.' : 'Enter your email to receive a reset link.'}
          </p>
        </div>
        {!sent && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
              placeholder="you@example.com"
            />
            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-smooth hover:bg-primary/90 disabled:opacity-50">
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}
        <p className="mt-6 text-center">
          <Link to="/login" className="text-sm text-accent hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
