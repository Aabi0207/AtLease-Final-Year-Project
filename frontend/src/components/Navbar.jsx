import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, LogOut, ShieldCheck, User as UserIcon, WalletCards } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isOwner = user?.role === 'OWNER';
  const isCustomer = user?.role === 'CUSTOMER';

  const navLinks = isOwner
    ? [
        { to: '/add-warehouse', label: 'Create listing', icon: Building2 },
        { to: '/dashboard', label: 'My listings', icon: ArrowRight },
      ]
    : isCustomer
      ? [
          { to: '/marketplace', label: 'Marketplace', icon: ArrowRight },
          { to: '/certificates', label: 'Certificates', icon: WalletCards },
          { to: '/dashboard', label: 'Dashboard', icon: ArrowRight },
        ]
      : [
          { to: '/marketplace', label: 'Marketplace', icon: ArrowRight },
          { to: '/certificates', label: 'Certificates', icon: WalletCards },
          { to: '/dashboard', label: 'Dashboard', icon: ArrowRight },
        ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => navigate('/')} className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-strong)] text-white shadow-lg shadow-slate-900/20">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="text-left">
            <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
              AtLease
            </span>
            <span className="block text-lg font-semibold text-[var(--text)]">Premium warehouse marketplace</span>
          </span>
        </button>

        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)]">
          {navLinks.map(item => {
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[var(--accent-soft)] hover:text-[var(--text)]"
                to={item.to}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <ThemeToggle />

          {user ? (
            <>
              <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-sm font-medium text-[var(--text)]">
                <UserIcon className="h-4 w-4" />
                <span>{user.username}</span>
                <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-soft)]"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login/customer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5"
              >
                Customer login
              </Link>
              <Link
                to="/login/vendor"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Vendor login
                <Building2 className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;