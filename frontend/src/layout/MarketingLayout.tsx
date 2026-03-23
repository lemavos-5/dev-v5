import { Link, Outlet, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function MarketingLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Zap className="h-4 w-4 text-accent-foreground" strokeWidth={1.5} />
            </div>
            <span className="text-sm font-semibold text-foreground">Continuum</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/pricing" className="text-sm text-muted-foreground transition-smooth hover:text-foreground">
              Pricing
            </Link>
            <Link to="/login" className="text-sm text-muted-foreground transition-smooth hover:text-foreground">
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:bg-primary/90"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>
      <Outlet />
      {isHome && <MarketingFooter />}
    </div>
  );
}

function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-surface py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
                <Zap className="h-3.5 w-3.5 text-accent-foreground" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-semibold">Continuum</span>
            </div>
            <p className="text-sm text-muted-foreground">Your knowledge, connected.</p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</h4>
            <div className="space-y-2">
              <Link to="/pricing" className="block text-sm text-foreground/70 hover:text-foreground">Pricing</Link>
              <span className="block text-sm text-foreground/70">Features</span>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</h4>
            <div className="space-y-2">
              <span className="block text-sm text-foreground/70">About</span>
              <span className="block text-sm text-foreground/70">Blog</span>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Legal</h4>
            <div className="space-y-2">
              <span className="block text-sm text-foreground/70">Privacy</span>
              <span className="block text-sm text-foreground/70">Terms</span>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Continuum Research. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
