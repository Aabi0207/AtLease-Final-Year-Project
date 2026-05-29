import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BarChart3, Building2, CalendarDays, CheckCircle2, Layers3, Loader2, PlusCircle, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const formatCurrency = value => {
  if (value === null || value === undefined || value === '') {
    return '$0';
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return '$0';
  }

  return `$${numericValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const Dashboard = () => {
  const { user } = useAuth();

  const isOwner = user?.role === 'OWNER';
  const isCustomer = user?.role === 'CUSTOMER';
  const [ownerStats, setOwnerStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(isOwner);
  const [statsError, setStatsError] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(isOwner);
  const [listingsError, setListingsError] = useState(null);
  const [customerBookings, setCustomerBookings] = useState([]);
  const [customerCertificates, setCustomerCertificates] = useState([]);
  const [customerLoading, setCustomerLoading] = useState(isCustomer);
  const [customerError, setCustomerError] = useState(null);

  useEffect(() => {
    if (!isCustomer) return;

    const fetchCustomerData = async () => {
      setCustomerLoading(true);
      setCustomerError(null);

      try {
        const [bookingsResponse, certificatesResponse] = await Promise.all([
          api.get('/customer/bookings/'),
          api.get('/customer/certificates/'),
        ]);

        setCustomerBookings(bookingsResponse.data || []);
        setCustomerCertificates(certificatesResponse.data || []);
      } catch (error) {
        setCustomerError('Failed to load your customer dashboard data.');
      } finally {
        setCustomerLoading(false);
      }
    };

    fetchCustomerData();
  }, [isCustomer]);

  const customerSummary = useMemo(() => {
    const activeBookings = customerBookings.filter(booking => booking.status === 'PAID');
    const upcomingRenewals = customerBookings.filter(booking => {
      if (!booking.end_date) return false;
      const endDate = new Date(booking.end_date);
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);
      return endDate >= now && endDate <= thirtyDaysFromNow;
    });

    return [
      ['Bookings in progress', customerLoading ? 'Loading…' : String(activeBookings.length)],
      ['Certificates stored', customerLoading ? 'Loading…' : String(customerCertificates.length)],
      ['Upcoming renewals', customerLoading ? 'Loading…' : String(upcomingRenewals.length)],
    ];
  }, [customerBookings, customerCertificates, customerLoading]);

  const ownerSummary = ownerStats
    ? [
        ['Active listings', String(ownerStats.active_listings ?? 0)],
        ['Occupancy', `${ownerStats.occupancy_rate ?? 0}%`],
        ['Revenue this month', formatCurrency(ownerStats.revenue_this_month)],
      ]
    : [
        ['Active listings', statsLoading ? 'Loading…' : '0'],
        ['Occupancy', statsLoading ? 'Loading…' : '0%'],
        ['Revenue this month', statsLoading ? 'Loading…' : '$0'],
      ];

  const roleSummary = isOwner ? ownerSummary : customerSummary;

  const activeCustomerBookings = useMemo(() => {
    return customerBookings
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);
  }, [customerBookings]);

  const latestCertificates = useMemo(() => {
    return customerCertificates
      .slice()
      .sort((a, b) => new Date(b.minted_at) - new Date(a.minted_at))
      .slice(0, 3);
  }, [customerCertificates]);

  const customerActivityCards = useMemo(() => {
    const activeBookings = customerBookings.filter(booking => booking.status === 'PAID');
    const completedBookings = customerBookings.filter(booking => booking.status === 'COMPLETED');
    const mintedCertificates = customerCertificates.filter(certificate => certificate.status === 'MINTED' || certificate.status === 'VERIFIED');
    const expiringSoon = customerBookings.filter(booking => {
      if (!booking.end_date) return false;
      const endDate = new Date(booking.end_date);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() + 30);
      return endDate <= cutoff && endDate >= new Date();
    });

    return [
      ['Pending bookings', String(activeBookings.length)],
      ['Certificates minted', String(mintedCertificates.length)],
      ['Payments cleared', String(completedBookings.length || activeBookings.length)],
      ['Renewals due', String(expiringSoon.length)],
    ];
  }, [customerBookings, customerCertificates]);

  useEffect(() => {
    if (!isOwner) return;

    const fetchOwnerStats = async () => {
      setStatsLoading(true);
      setStatsError(null);

      try {
        const response = await api.get('/owner/warehouses/stats/');
        setOwnerStats(response.data || null);
      } catch (error) {
        setStatsError('Failed to load your dashboard stats.');
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchListings = async () => {
      setListingsLoading(true);
      setListingsError(null);

      try {
        const response = await api.get('/owner/warehouses/my_listings/');
        setMyListings(response.data || []);
      } catch (error) {
        setListingsError('Failed to load your listings.');
      } finally {
        setListingsLoading(false);
      }
    };

    fetchOwnerStats();
    fetchListings();
  }, [isOwner]);

  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)]">
              <BarChart3 className="h-4 w-4" />
              Analytics dashboard
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
              Welcome back, {user?.username || 'operator'}.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-[var(--text-muted)]">
              {isOwner
                ? 'Manage your warehouse inventory, create new listings, and monitor occupancy from one premium control surface.'
                : 'Track leasing performance, certificate activity, and operational health from one premium control surface.'}
            </p>
          </div>

          {/* <div className="premium-panel-strong rounded-[32px] p-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {dashboardMetrics.map(metric => (
                <div key={metric.label} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm text-[var(--text-muted)]">{metric.label}</p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-3xl font-semibold text-[var(--text)]">{metric.value}</p>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      {metric.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {roleSummary.map(([label, value]) => (
            <div key={label} className="premium-panel rounded-[28px] p-5">
              <p className="text-sm text-[var(--text-muted)]">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{value}</p>
            </div>
          ))}
        </div>

        {!isOwner && customerError ? (
          <div className="rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
            {customerError}
          </div>
        ) : null}

        {isOwner && statsError ? (
          <div className="rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
            {statsError}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="premium-panel-strong rounded-[34px] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--text-muted)]">Active pipeline</p>
                <h2 className="text-2xl font-semibold text-[var(--text)]">
                  {isOwner ? 'Your listing workspace' : 'Current leasing momentum'}
                </h2>
              </div>
              {isOwner ? (
                <Link
                  to="/add-warehouse"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Create listing
                  <PlusCircle className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Marketplace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            <div className="mt-6 space-y-4">
              {isOwner ? (
                <>
                  <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-[var(--text-muted)]">Create your next warehouse listing</p>
                        <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">Add a premium space to your portfolio</h3>
                      </div>
                      <Link
                        to="/add-warehouse"
                        className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Add listing
                        <PlusCircle className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {listingsLoading ? (
                    <div className="flex items-center justify-center rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-10">
                      <Loader2 className="h-6 w-6 animate-spin text-[var(--text-muted)]" />
                    </div>
                  ) : listingsError ? (
                    <div className="rounded-[28px] border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                      {listingsError}
                    </div>
                  ) : myListings.length === 0 ? (
                    <div className="rounded-[28px] border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                      <Building2 className="mx-auto h-12 w-12 text-[var(--text-muted)]" />
                      <h3 className="mt-4 text-xl font-semibold text-[var(--text)]">No listings yet</h3>
                      <p className="mt-2 text-[var(--text-muted)]">Create your first warehouse listing to start receiving bookings.</p>
                      <Link
                        to="/add-warehouse"
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white"
                      >
                        Create listing
                        <PlusCircle className="h-4 w-4" />
                      </Link>
                    </div>
                  ) : (
                    myListings.map(item => (
                      <div key={item.id} className="flex items-center justify-between gap-4 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 overflow-hidden rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-[var(--text-muted)]" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-[var(--text)]">{item.title}</p>
                            <p className="text-sm text-[var(--text-muted)]">{item.city}, {item.state}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[var(--text-muted)]">Price / mo</p>
                          <p className="text-lg font-semibold text-[var(--text)]">${Number(item.price_per_month).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </>
              ) : (
                customerLoading ? (
                  <div className="flex items-center justify-center rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-10">
                    <Loader2 className="h-6 w-6 animate-spin text-[var(--text-muted)]" />
                  </div>
                ) : activeCustomerBookings.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                    <CalendarDays className="mx-auto h-12 w-12 text-[var(--text-muted)]" />
                    <h3 className="mt-4 text-xl font-semibold text-[var(--text)]">No active bookings yet</h3>
                    <p className="mt-2 text-[var(--text-muted)]">Book a warehouse to see your current leases here.</p>
                    <Link
                      to="/marketplace"
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white"
                    >
                      Browse marketplace
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : activeCustomerBookings.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-4 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-[var(--text-muted)]" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-[var(--text)]">{item.warehouse_details?.name || item.warehouse_details?.title || 'Warehouse booking'}</p>
                        <p className="text-sm text-[var(--text-muted)]">
                          {item.warehouse_details?.city}, {item.warehouse_details?.state}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--text-muted)]">Status</p>
                      <p className="text-lg font-semibold text-[var(--text)]">{item.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            {isOwner ? (
              <div className="premium-panel-strong rounded-[34px] p-6 sm:p-8">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <Building2 className="h-4 w-4" />
                  Owner actions
                </div>
                <div className="mt-5 grid gap-4">
                  <Link
                    to="/add-warehouse"
                    className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:bg-[var(--surface-strong)]"
                  >
                    <p className="text-sm text-[var(--text-muted)]">Create listing</p>
                    <p className="mt-2 text-xl font-semibold text-[var(--text)]">Add a new warehouse to the marketplace</p>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:bg-[var(--surface-strong)]"
                  >
                    <p className="text-sm text-[var(--text-muted)]">My listings</p>
                    <p className="mt-2 text-xl font-semibold text-[var(--text)]">Review occupancy and edit current spaces</p>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="premium-panel-strong rounded-[34px] p-6 sm:p-8">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <Layers3 className="h-4 w-4" />
                  Activity cards
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {customerActivityCards.map(([label, value]) => (
                    <div key={label} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                      <p className="text-sm text-[var(--text-muted)]">{label}</p>
                      <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isOwner && (
              <div className="premium-panel rounded-[34px] p-6">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <WalletCards className="h-4 w-4" />
                  Latest certificates
                </div>
                <div className="mt-5 space-y-3">
                  {customerLoading ? (
                    <div className="flex items-center justify-center rounded-2xl bg-white/55 px-4 py-8 dark:bg-white/5">
                      <Loader2 className="h-5 w-5 animate-spin text-[var(--text-muted)]" />
                    </div>
                  ) : latestCertificates.length === 0 ? (
                    <div className="rounded-2xl bg-white/55 px-4 py-4 text-sm text-[var(--text-muted)] dark:bg-white/5">
                      No certificates yet. Complete a payment to mint your first lease certificate.
                    </div>
                  ) : latestCertificates.map(item => (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white/55 px-4 py-3 dark:bg-white/5">
                      <div>
                        <p className="font-semibold text-[var(--text)]">{item.warehouse_title}</p>
                        <p className="text-sm text-[var(--text-muted)]">{item.customer_display_name}</p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="premium-panel rounded-[34px] p-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                <CalendarDays className="h-4 w-4" />
                Recommended next step
              </div>
              <p className="mt-4 text-[var(--text-muted)] leading-7">
                {isOwner
                  ? 'Create a new listing, update your portfolio, and keep occupancy high.'
                  : 'Continue browsing marketplace inventory and finalize your next booking.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
