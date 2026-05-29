import { ArrowRight, BadgeCheck, BarChart3, Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsPreview, featuredWarehouses, heroMetrics } from '../data/marketplaceData';

const Home = () => {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-12">
      <div className="absolute inset-0 -z-10 premium-grid opacity-50" />
      <div className="absolute -left-16 top-16 -z-10 h-80 w-80 rounded-full bg-white/55 blur-3xl" />
      <div className="absolute right-0 top-24 -z-10 h-96 w-96 rounded-full bg-slate-900/10 blur-3xl dark:bg-white/5" />

      <div className="mx-auto max-w-7xl space-y-10 lg:space-y-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)]">
              <Sparkles className="h-4 w-4" />
              Premium B2B warehouse marketplace
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-[var(--text)] sm:text-6xl lg:text-7xl">
                Lease industrial space with the polish of a modern enterprise platform.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--text-muted)] sm:text-xl">
                AtLease connects warehouse owners and enterprise buyers through curated listings, instant booking,
                secure payments, and NFT-backed lease certificates.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={user?.role === 'OWNER' ? '/login/vendor' : '/login/customer'}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                {user ? 'Continue to dashboard' : 'Start with customer login'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5 hover:bg-[var(--surface-strong)]"
              >
                Browse marketplace
              </Link>
              <Link
                to="/login/vendor"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5 hover:bg-[var(--surface)]"
              >
                Vendor access
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {heroMetrics.map(metric => (
                <div key={metric.label} className="premium-panel rounded-3xl p-5">
                  <p className="text-sm text-[var(--text-muted)]">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="premium-panel rounded-3xl p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <ShieldCheck className="h-4 w-4" />
                  Trusted leasing
                </div>
                <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
                  Smart-contract lease certificates and storage controls built for auditability.
                </p>
              </div>
              <div className="premium-panel rounded-3xl p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <BadgeCheck className="h-4 w-4" />
                  Verified listings
                </div>
                <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
                  Premium industrial spaces with photos, amenities, and availability intelligence.
                </p>
              </div>
            </div>
          </div>

          <div className="premium-panel-strong rounded-[36px] p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-muted)]">Market pulse</p>
                <h2 className="text-2xl font-semibold text-[var(--text)]">Live operations overview</h2>
              </div>
              <div className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] p-3 text-[var(--text)]">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {analyticsPreview.map(card => (
                <div key={card.label} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <p className="text-sm text-[var(--text-muted)]">{card.label}</p>
                  <div className="mt-3 flex items-end justify-between gap-4">
                    <p className="text-3xl font-semibold text-[var(--text)]">{card.value}</p>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      {card.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {featuredWarehouses.map(warehouse => (
                <div key={warehouse.id} className="flex items-center justify-between rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      <Building2 className="h-4 w-4" />
                      {warehouse.status}
                    </div>
                    <p className="mt-2 text-lg font-semibold text-[var(--text)]">{warehouse.name}</p>
                    <p className="truncate text-sm text-[var(--text-muted)]">{warehouse.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold text-[var(--text)]">{warehouse.price}</p>
                    <p className="text-sm text-[var(--text-muted)]">{warehouse.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: 'Separate vendor and customer login',
              text: 'Role-aware entry points keep operations distinct while preserving a single premium experience.',
            },
            {
              title: 'End-to-end booking flow',
              text: 'Move from discovery to payment and certificate issuance without leaving the app shell.',
            },
            {
              title: 'NFT lease certificate storage',
              text: 'Track, store, and verify every lease certificate in a secure enterprise dashboard.',
            },
          ].map(item => (
            <div key={item.title} className="premium-panel rounded-[28px] p-6">
              <h3 className="text-xl font-semibold text-[var(--text)]">{item.title}</h3>
              <p className="mt-3 text-[var(--text-muted)] leading-7">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;