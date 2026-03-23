import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { Plus, FileText, Users, BarChart3 } from 'lucide-react';
import apiClient from '../api/client';
import { DashboardMetrics } from '../types/api';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get<DashboardMetrics>('/metrics/dashboard');
        setMetrics(data);
      } catch (err: any) {
        console.error('Failed to fetch metrics:', err);
        // Don't show error - metrics are optional
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const totalConnections = metrics 
    ? (metrics.uniquePeople || 0) + (metrics.uniqueProjects || 0) + (metrics.uniqueHabits || 0)
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10 animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Research Overview</h1>
          <p className="mt-1 text-sm text-body">
            {metrics 
              ? `${totalConnections} entities with ${metrics.totalMentions || 0} total mentions`
              : 'Loading your workspace...'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/notes" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:bg-primary/90">
            <Plus className="h-4 w-4" strokeWidth={1.5} /> New Note
          </Link>
        </div>
      </header>

      {/* Metric cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard icon={Users} label="People" value={metrics?.uniquePeople} loading={loading} />
        <MetricCard icon={FileText} label="Projects" value={metrics?.uniqueProjects} loading={loading} />
        <MetricCard icon={BarChart3} label="Habits" value={metrics?.uniqueHabits} loading={loading} />
      </section>

      {/* Heatmap */}
      {metrics?.globalHeatmap && Object.keys(metrics.globalHeatmap).length > 0 && (
        <section className="surface-elevated p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Activity Density</h3>
          <div className="flex flex-wrap gap-1">
            {Object.entries(metrics.globalHeatmap).sort().slice(-90).map(([date, val]) => (
              <div
                key={date}
                title={`${date}: ${val}`}
                className="h-3 w-3 rounded-sm transition-smooth"
                style={{
                  backgroundColor: val === 0 ? 'hsl(var(--muted))' : `hsl(217 91% 60% / ${Math.min(val / 10, 1)})`,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Habits today */}
      {metrics?.habitsCompletedToday && metrics.habitsCompletedToday.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold mb-3">Completed today</h3>
          <div className="flex flex-wrap gap-2">
            {metrics.habitsCompletedToday.map((h) => (
              <span key={h} className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                {h}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Top entities */}
      {metrics?.topPeople && metrics.topPeople.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold mb-3">Top people</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metrics.topPeople.slice(0, 4).map((p) => (
              <Link key={p.entityId} to={`/entities/${p.entityId}`}
                className="surface flex items-center justify-between p-4 transition-smooth hover:shadow-md">
                <span className="text-sm font-medium">{p.title}</span>
                <span className="text-xs text-muted-foreground">{p.count} mentions</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!loading && totalConnections === 0 && (
        <div className="surface-elevated p-12 text-center">
          <h3 className="text-lg font-semibold">Start your research</h3>
          <p className="mt-2 text-sm text-body">Create your first note or entity to get started.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/notes" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              <FileText className="h-4 w-4" /> Create a note
            </Link>
            <Link to="/entities" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
              <Users className="h-4 w-4" /> Add an entity
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, loading }: { icon: any; label: string; value?: number; loading: boolean }) {
  return (
    <div className="surface-elevated p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
          <Icon className="h-4 w-4 text-accent" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          {loading ? (
            <div className="mt-1 h-6 w-12 animate-pulse rounded bg-muted" />
          ) : (
            <p className="text-2xl font-bold tabular-nums">{value ?? 0}</p>
          )}
        </div>
      </div>
    </div>
  );
}
