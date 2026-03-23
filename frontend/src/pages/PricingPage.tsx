import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useEffect } from 'react';
import { useBillingStore } from '../stores/useBillingStore';
import { useAuthStore } from '../stores/useAuthStore';
import { PlanInfo } from '../types/api';

export default function PricingPage() {
  const { plans, fetchPlans } = useBillingStore();

  useEffect(() => { fetchPlans(); }, []);

  const planPrices: Record<string, string> = { FREE: '$0', PLUS: '$9', PRO: '$29', VISION: '$99' };

  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold md:text-4xl">Pricing</h1>
          <p className="mt-3 text-body">Start free. Scale when you're ready.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {(['FREE', 'PLUS', 'PRO', 'VISION'] as const).map((planName) => {
            const info = plans.find((p) => p.plan === planName);
            const highlight = planName === 'PRO';
            return (
              <div key={planName} className={`rounded-xl border p-6 ${highlight ? 'border-accent bg-accent/5 shadow-md' : 'border-border bg-card'}`}>
                <h3 className="text-lg font-semibold">{planName}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{planPrices[planName]}</span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                {info && (
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center gap-2 text-sm text-body">
                      <Check className="h-4 w-4 text-success" strokeWidth={1.5} />
                      {info.limits.maxEntities === -1 ? 'Unlimited' : info.limits.maxEntities} entities
                    </li>
                    <li className="flex items-center gap-2 text-sm text-body">
                      <Check className="h-4 w-4 text-success" strokeWidth={1.5} />
                      {info.limits.maxNotes === -1 ? 'Unlimited' : info.limits.maxNotes} notes
                    </li>
                    <li className="flex items-center gap-2 text-sm text-body">
                      <Check className="h-4 w-4 text-success" strokeWidth={1.5} />
                      {info.limits.maxHabits === -1 ? 'Unlimited' : info.limits.maxHabits} habits
                    </li>
                    {info.limits.advancedMetrics && (
                      <li className="flex items-center gap-2 text-sm text-body">
                        <Check className="h-4 w-4 text-success" strokeWidth={1.5} /> Advanced metrics
                      </li>
                    )}
                    {info.limits.dataExport && (
                      <li className="flex items-center gap-2 text-sm text-body">
                        <Check className="h-4 w-4 text-success" strokeWidth={1.5} /> Data export
                      </li>
                    )}
                  </ul>
                )}
                <Link to="/register"
                  className={`mt-6 block rounded-lg py-2.5 text-center text-sm font-medium transition-smooth ${
                    highlight ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}>
                  Get started
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
