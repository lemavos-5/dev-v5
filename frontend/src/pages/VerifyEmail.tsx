import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import { Zap } from 'lucide-react';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [email, setEmail] = useState('');
  const [resendMsg, setResendMsg] = useState('');

  useEffect(() => {
    if (token) {
      apiClient.get('/auth/verify-email', { params: { token } })
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, [token]);

  const handleResend = async () => {
    if (!email) return;
    try {
      await apiClient.post('/auth/resend-verification', { email });
      setResendMsg('Verification email sent!');
    } catch {
      setResendMsg('Failed to send. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
          <Zap className="h-5 w-5 text-accent-foreground" strokeWidth={1.5} />
        </div>
        {status === 'loading' && <p className="text-sm text-muted-foreground">Verifying your email...</p>}
        {status === 'success' && (
          <>
            <h1 className="text-xl font-bold">Email verified!</h1>
            <p className="mt-2 text-sm text-muted-foreground">Your account is ready.</p>
            <Link to="/login" className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
              Sign in
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-xl font-bold">Verification failed</h1>
            <p className="mt-2 text-sm text-muted-foreground">The link may be expired. Request a new one below.</p>
            <div className="mt-4 space-y-3">
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
              />
              <button onClick={handleResend} className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground">
                Resend verification
              </button>
              {resendMsg && <p className="text-sm text-muted-foreground">{resendMsg}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
