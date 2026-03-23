import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Check } from 'lucide-react';

export default function SubscriptionSuccess() {
  const { fetchMe } = useAuthStore();
  useEffect(() => { fetchMe(); }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
          <Check className="h-6 w-6 text-success" strokeWidth={2} />
        </div>
        <h1 className="text-xl font-bold">Subscription active!</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your plan has been upgraded. Enjoy the new features.</p>
        <Link to="/dashboard" className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
