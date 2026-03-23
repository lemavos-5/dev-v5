import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, FileText, Users, BarChart3, ArrowRight, Check } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
  }),
};

export default function Landing() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <Zap className="h-3 w-3" /> Now in public beta
            </span>
          </motion.div>
          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="mx-auto max-w-3xl text-4xl font-bold md:text-6xl"
          >
            Your research,{' '}
            <span className="text-accent">connected</span>
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="mx-auto mt-6 max-w-xl text-lg text-body"
          >
            Continuum helps you capture notes, link ideas to people and projects, and track habits — all in one place.
          </motion.p>
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-smooth hover:bg-primary/90"
            >
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
            >
              View pricing
            </Link>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(217_91%_60%/0.08),transparent_70%)]" />
      </section>

      {/* Features */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Everything you need to think clearly</h2>
            <p className="mt-3 text-body">A minimal toolkit for serious researchers and thinkers.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: FileText, title: 'Connected Notes', desc: 'Write notes that link to people, projects, and habits. See how ideas connect.' },
              { icon: Users, title: 'Entity Tracking', desc: 'Track people, projects, and habits. See relationships and activity over time.' },
              { icon: BarChart3, title: 'Visual Insights', desc: 'Heatmaps, streaks, and metrics that show your research patterns at a glance.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="surface-elevated p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-base font-semibold">{title}</h3>
                <p className="text-sm text-body">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Simple, transparent pricing</h2>
            <p className="mt-3 text-body">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { plan: 'Free', price: '$0', features: ['20 entities', '50 notes', '3 habits', '30 day history'] },
              { plan: 'Plus', price: '$9', features: ['100 entities', '500 notes', '10 habits', 'Advanced metrics'], highlight: true },
              { plan: 'Pro', price: '$29', features: ['Unlimited everything', 'Data export', 'Calendar sync', 'Priority support'] },
            ].map(({ plan, price, features, highlight }) => (
              <div
                key={plan}
                className={`rounded-xl border p-6 ${highlight ? 'border-accent bg-accent/5 shadow-md' : 'border-border bg-card'}`}
              >
                <h3 className="text-lg font-semibold">{plan}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{price}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-body">
                      <Check className="h-4 w-4 text-success" strokeWidth={1.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`mt-6 block rounded-lg py-2.5 text-center text-sm font-medium transition-smooth ${
                    highlight
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">Frequently asked questions</h2>
          <div className="space-y-6">
            {[
              { q: 'What is Continuum Research?', a: 'A knowledge and research tool that helps you capture notes, connect ideas to people and projects, and track habits — all in one interconnected workspace.' },
              { q: 'Can I use it for free?', a: 'Yes! The free plan includes 20 entities, 50 notes, and 3 habits with 30 days of history. No credit card required.' },
              { q: 'How does entity linking work?', a: 'When writing a note, mention any entity using @EntityName. Continuum automatically creates connections between your notes and entities.' },
              { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel at any time. You\'ll keep access until the end of your billing period.' },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-border pb-6">
                <h3 className="mb-2 text-sm font-semibold">{q}</h3>
                <p className="text-sm text-body">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Start connecting your research today</h2>
          <p className="mt-3 text-body">Free forever. No credit card required.</p>
          <Link
            to="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-smooth hover:bg-primary/90"
          >
            Create your account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
