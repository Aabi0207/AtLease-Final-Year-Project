import { useState } from 'react';
import { ArrowRight, Building2, CheckCircle2, Loader2, ShieldCheck, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleOptions = [
  { key: 'CUSTOMER', label: 'Customer', description: 'Rent warehouse space', icon: UserRound },
  { key: 'OWNER', label: 'Vendor', description: 'List and manage spaces', icon: Building2 },
];

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = event => {
    setFormData(current => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(formData.username, formData.email, formData.password, formData.role);
      navigate('/login/customer', { replace: true });
    } catch (err) {
      const respData = err.response?.data;
      if (respData) {
        const errors = Object.values(respData).flat().join(', ');
        setError(errors || 'Registration failed. Check details.');
      } else {
        setError('Network problem. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 premium-grid opacity-60" />
      <div className="absolute left-0 top-0 -z-10 h-72 w-72 rounded-full bg-white/40 blur-3xl dark:bg-white/5" />

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)]">
            <ShieldCheck className="h-4 w-4" />
            New account
          </div>

          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
              Create your AtLease account with a premium enterprise onboarding flow.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
              Use one workspace for vendors and customers, with role-specific access, secure login, and a polished lease experience.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['Fast onboarding', 'Under 2 minutes'],
              ['Role-based access', 'Customer or vendor'],
              ['Verified leases', 'Built for auditability'],
            ].map(([title, text]) => (
              <div key={title} className="premium-panel rounded-3xl p-5">
                <p className="text-sm text-[var(--text-muted)]">{title}</p>
                <p className="mt-2 text-xl font-semibold text-[var(--text)]">{text}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {roleOptions.map(option => {
              const Icon = option.icon;
              const active = formData.role === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setFormData(current => ({ ...current, role: option.key }))}
                  className={`premium-panel flex items-center justify-between rounded-3xl px-4 py-4 text-left transition hover:-translate-y-1 ${
                    active ? 'border-[var(--accent)] bg-[var(--surface-strong)]' : ''
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--text-muted)]">Register as</p>
                    <div className="mt-1 flex items-center gap-2 text-base font-semibold text-[var(--text)]">
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </div>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{option.description}</p>
                  </div>
                  {active ? <CheckCircle2 className="h-5 w-5 text-[var(--success)]" /> : <ArrowRight className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="premium-panel-strong rounded-[32px] p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Account setup</p>
              <h2 className="text-2xl font-semibold text-[var(--text)]">Start creating</h2>
            </div>
            <div className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text)]">
              {formData.role}
            </div>
          </div>

          {error ? (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-semibold text-[var(--text)]">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="acme_ops"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-white dark:bg-white/5 dark:focus:bg-white/8"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[var(--text)]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="operations@company.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-white dark:bg-white/5 dark:focus:bg-white/8"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[var(--text)]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-white dark:bg-white/5 dark:focus:bg-white/8"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent-strong)] px-5 py-3.5 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create account'}
              </button>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-strong)]"
              >
                Sign in instead
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;