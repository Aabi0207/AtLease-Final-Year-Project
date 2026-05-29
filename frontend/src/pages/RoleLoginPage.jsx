import { useState } from 'react';
import { ArrowRight, Building2, CheckCircle2, ShieldCheck, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginRoleCopy } from '../data/marketplaceData';

const roleOptions = [
  {
    key: 'customer',
    label: 'Customer',
    icon: UserRound,
    route: '/login/customer',
    backendRole: 'CUSTOMER',
  },
  {
    key: 'vendor',
    label: 'Vendor',
    icon: Building2,
    route: '/login/vendor',
    backendRole: 'OWNER',
  },
];

const RoleLoginPage = ({ role = 'customer' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const copy = loginRoleCopy[role] || loginRoleCopy.customer;
  const selectedRole = roleOptions.find(option => option.key === role)?.backendRole || 'CUSTOMER';

  const handleSubmit = async event => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password, selectedRole);
      navigate('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.error || 'Login failed. Please check your details and try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 premium-grid opacity-60" />
      <div className="absolute left-0 top-0 -z-10 h-72 w-72 rounded-full bg-white/40 blur-3xl dark:bg-white/5" />

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)]">
            <ShieldCheck className="h-4 w-4" />
            {copy.eyebrow}
          </div>

          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
              {copy.title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
              {copy.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {roleOptions.map(option => {
              const Icon = option.icon;
              const active = option.key === role;

              return (
                <Link
                  key={option.key}
                  to={option.route}
                  className={`premium-panel flex items-center justify-between rounded-3xl px-4 py-4 transition hover:-translate-y-1 ${
                    active ? 'border-[var(--accent)] bg-[var(--surface-strong)]' : ''
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--text-muted)]">Login as</p>
                    <div className="mt-1 flex items-center gap-2 text-base font-semibold text-[var(--text)]">
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </div>
                  {active ? <CheckCircle2 className="h-5 w-5 text-[var(--success)]" /> : <ArrowRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="premium-panel rounded-3xl p-5">
              <p className="text-sm text-[var(--text-muted)]">Security</p>
              <p className="mt-2 text-2xl font-semibold">2FA ready</p>
            </div>
            <div className="premium-panel rounded-3xl p-5">
              <p className="text-sm text-[var(--text-muted)]">Leases</p>
              <p className="mt-2 text-2xl font-semibold">Smart contracts</p>
            </div>
            <div className="premium-panel rounded-3xl p-5">
              <p className="text-sm text-[var(--text-muted)]">Payouts</p>
              <p className="mt-2 text-2xl font-semibold">Same-day settlement</p>
            </div>
          </div>
        </div>

        <div className="premium-panel-strong rounded-[32px] p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Secure access</p>
              <h2 className="text-2xl font-semibold text-[var(--text)]">Sign in to AtLease</h2>
            </div>
            <div className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text)]">
              {role}
            </div>
          </div>

          {error ? (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--text)]" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="ops@acme.com"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-white dark:bg-white/5 dark:focus:bg-white/8"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--text)]" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-white dark:bg-white/5 dark:focus:bg-white/8"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-strong)] px-5 py-3.5 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-[var(--text-muted)]">
            <Link to="/signup" className="font-semibold text-[var(--text)] hover:underline">
              Create a new account
            </Link>
            <Link to="/marketplace" className="font-semibold text-[var(--text)] hover:underline">
              Explore marketplace
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoleLoginPage;