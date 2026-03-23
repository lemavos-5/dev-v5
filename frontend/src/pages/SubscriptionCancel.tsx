import { Link } from 'react-router-dom';

export default function SubscriptionCancel() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-xl font-bold">Payment cancelled</h1>
        <p className="mt-2 text-sm text-muted-foreground">No charges were made. You can try again anytime.</p>
        <Link to="/billing" className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
          Back to Billing
        </Link>
      </div>
    </div>
  );
}
