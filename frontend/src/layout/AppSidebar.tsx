import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings, CreditCard, LogOut, Zap } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/notes', label: 'Notes', icon: FileText },
  { to: '/entities', label: 'Entities', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/billing', label: 'Billing', icon: CreditCard },
];

export default function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Zap className="h-4 w-4 text-accent-foreground" strokeWidth={1.5} />
        </div>
        <span className="text-sm font-semibold text-foreground">Continuum</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-smooth ${
                active
                  ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        {user && user.plan !== 'PRO' && user.plan !== 'VISION' && (
          <Link
            to="/billing"
            className="mb-2 flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-2 text-xs font-medium text-accent transition-smooth hover:bg-accent/20"
          >
            <Zap className="h-3.5 w-3.5" strokeWidth={1.5} />
            Upgrade to Pro
          </Link>
        )}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{user?.username}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.plan} plan</p>
          </div>
          <button
            onClick={() => logout()}
            className="rounded-md p-1.5 text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}
