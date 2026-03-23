import { useEffect } from 'react';
import { useBillingStore } from '../stores/useBillingStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Check, Zap, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Billing() {
  const { subscription, plans, loading, error, fetchSubscription, fetchPlans, checkout, cancelSubscription, clearError } = useBillingStore();
  const { user, fetchMe } = useAuthStore();

  useEffect(() => { 
    fetchSubscription(); 
    fetchPlans(); 
  }, []);

  const handleCheckout = async (priceId: string | null) => {
    if (!priceId) return;
    try {
      clearError?.();
      await checkout(priceId);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    }
  };

  const handleCancel = async () => {
    try {
      clearError?.();
      await cancelSubscription();
      await fetchMe();
      toast.success('Subscription cancelled');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const planPrices: Record<string, string> = { FREE: '$0', PLUS: '$9', PRO: '$29', VISION: '$99' };

  return (
    <div className="max-w-5xl mx-auto p-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-2">Billing</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage your subscription and plan.</p>

      {error && (
        <div className="mb-6 rounded-lg bg-destructive/10 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <div className="text-sm text-destructive">{error}</div>
        </div>
      )}

      {/* Current plan */}
      {loading ? (
        <div className="surface-elevated p-6 mb-8 space-y-4">
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
      ) : subscription ? (
        <div className="surface-elevated p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Current Plan</h2>
                <span className="inline-flex rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                  {subscription.effectivePlan}
                </span>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  subscription.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}>
                  {subscription.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {subscription.currentPeriodEnd && `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
                {subscription.cancelAtPeriodEnd && ' · Will cancel at period end'}
              </p>
            </div>
            {subscription.effectivePlan !== 'FREE' && !subscription.cancelAtPeriodEnd && (
              <button onClick={handleCancel}
                className="rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-smooth hover:bg-destructive/10">
                Cancel plan
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* Plans grid */}
      <div className="grid gap-6 md:grid-cols-4">
        {(['FREE', 'PLUS', 'PRO', 'VISION'] as const).map((planName) => {
          const planInfo = plans.find((p) => p.plan === planName);
          const isCurrent = user?.plan === planName;
          const isHighlight = planName === 'PRO';

          return (
            <div key={planName}
              className={`rounded-xl border p-6 ${isHighlight ? 'border-accent bg-accent/5' : 'border-border bg-card'} ${isCurrent ? 'ring-2 ring-accent' : ''}`}>
              <h3 className="text-base font-semibold">{planName}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold">{planPrices[planName]}</span>
                <span className="text-xs text-muted-foreground">/mo</span>
              </div>
              {planInfo && (
                <ul className="mt-5 space-y-2">
                  <PlanFeature label={`${planInfo.limits.maxEntities === -1 ? '∞' : planInfo.limits.maxEntities} entities`} />
                  <PlanFeature label={`${planInfo.limits.maxNotes === -1 ? '∞' : planInfo.limits.maxNotes} notes`} />
                  <PlanFeature label={`${planInfo.limits.maxHabits === -1 ? '∞' : planInfo.limits.maxHabits} habits`} />
                  {planInfo.limits.advancedMetrics && <PlanFeature label="Advanced metrics" />}
                  {planInfo.limits.dataExport && <PlanFeature label="Data export" />}
                  {planInfo.limits.calendarSync && <PlanFeature label="Calendar sync" />}
                </ul>
              )}
              <button
                disabled={isCurrent || planName === 'FREE'}
                onClick={() => planInfo?.priceId && handleCheckout(planInfo.priceId)}
                className={`mt-6 w-full rounded-lg py-2.5 text-sm font-medium transition-smooth ${
                  isCurrent
                    ? 'bg-muted text-muted-foreground cursor-default'
                    : isHighlight
                    ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                } disabled:opacity-50`}
              >
                {isCurrent ? 'Current plan' : 'Upgrade'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlanFeature({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-2 text-xs text-body">
      <Check className="h-3.5 w-3.5 text-success" strokeWidth={1.5} /> {label}
    </li>
  );
}
