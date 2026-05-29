import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, Building2, MapPin, Search, SlidersHorizontal, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const filterPills = ['All', 'Available', 'Verified'];

const Warehouses = () => {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [warehouses, setWarehouses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWarehouses = async () => {
      setLoading(true);
      setError(null);

      try {
        const [warehousesResponse, statsResponse] = await Promise.all([
          api.get('/customer/warehouses/'),
          api.get('/customer/warehouses/stats/'),
        ]);

        setWarehouses(warehousesResponse.data || []);
        setStats(statsResponse.data || null);
      } catch (fetchError) {
        setError('Failed to load marketplace listings.');
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  const formatPrice = value => {
    if (value === null || value === undefined || value === '') {
      return '$0';
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return '$0';
    }

    return `$${numericValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const filteredWarehouses = useMemo(() => {
    return warehouses.filter(warehouse => {
      const haystack = [warehouse.name, warehouse.city, warehouse.state, warehouse.region, ...(warehouse.amenities || [])]
        .join(' ')
        .toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesFilter =
        selectedFilter === 'All' ||
        (selectedFilter === 'Available' && warehouse.is_available) ||
        (selectedFilter === 'Verified' && warehouse.owner_username);

      return matchesQuery && matchesFilter;
    });
  }, [query, selectedFilter, warehouses]);

  const totalSpaces = stats?.total_spaces ?? warehouses.length;
  const verifiedOwners = stats?.verified_owners ?? new Set(warehouses.map(warehouse => warehouse.owner_username).filter(Boolean)).size;
  const occupancyRate = stats?.occupancy_rate ?? 0;
  const activeBookings = stats?.active_bookings ?? warehouses.filter(warehouse => !warehouse.is_available).length;

  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)]">
              <BadgeCheck className="h-4 w-4" />
              Marketplace listing
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
              Browse premium warehouses built for enterprise leasing.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-[var(--text-muted)]">
              Filter by availability, compare lease-ready spaces, and move directly into booking when the right fit appears.
            </p>
          </div>

          <div className="premium-panel-strong rounded-[32px] p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3">
              <Search className="h-5 w-5 text-[var(--text-muted)]" />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search by city, warehouse, or amenity"
                className="min-w-0 flex-1 bg-transparent text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
              />
              <div className="hidden items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] sm:flex">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Smart filters
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {filterPills.map(pill => {
                const active = pill === selectedFilter;
                return (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => setSelectedFilter(pill)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? 'bg-[var(--accent-strong)] text-white'
                        : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-strong)]'
                    }`}
                  >
                    {pill}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Spaces online', String(totalSpaces)],
            ['Verified owners', String(verifiedOwners)],
            ['Avg. occupancy', `${occupancyRate}%`],
            ['Active bookings', String(activeBookings)],
          ].map(([label, value]) => (
            <div key={label} className="premium-panel rounded-[28px] p-5">
              <p className="text-sm text-[var(--text-muted)]">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{value}</p>
            </div>
          ))}
        </div>

        {error ? (
          <div className="rounded-[28px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center text-[var(--text-muted)]">
            Loading marketplace listings...
          </div>
        ) : null}

        {!loading && filteredWarehouses.length === 0 ? (
          <div className="premium-panel rounded-[32px] px-6 py-16 text-center">
            <Building2 className="mx-auto h-16 w-16 text-[var(--text-muted)]" />
            <h2 className="mt-6 text-2xl font-semibold text-[var(--text)]">No spaces match your filters</h2>
            <p className="mt-3 text-[var(--text-muted)]">Try a broader search or switch back to all warehouses.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedFilter('All');
              }}
              className="mt-6 rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-2">
            {filteredWarehouses.map(warehouse => (
              <article key={warehouse.id} className="premium-panel-strong overflow-hidden rounded-[32px]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={warehouse.image || warehouse.gallery?.[0] || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'}
                    alt={warehouse.name}
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <span className="rounded-full bg-black/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                      {warehouse.is_available ? 'Available now' : 'Not available'}
                    </span>
                    <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 backdrop-blur">
                      {warehouse.region}
                    </span>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                        <MapPin className="h-4 w-4" />
                        {warehouse.city}, {warehouse.state}
                      </div>
                      <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">{warehouse.name}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-[var(--text)]">{warehouse.price}</p>
                      <p className="text-sm text-[var(--text-muted)]">{warehouse.area}</p>
                    </div>
                  </div>

                  <p className="leading-7 text-[var(--text-muted)]">{warehouse.description}</p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                      <p className="text-sm text-[var(--text-muted)]">Occupancy</p>
                      <p className="mt-2 text-xl font-semibold text-[var(--text)]">{warehouse.occupancy}%</p>
                    </div>
                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                      <p className="text-sm text-[var(--text-muted)]">Bookings</p>
                      <p className="mt-2 flex items-center gap-1 text-xl font-semibold text-[var(--text)]">
                        <Star className="h-4 w-4 fill-current text-amber-500" />
                        {warehouse.booking_count}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {warehouse.amenities.map(amenity => (
                      <span
                        key={amenity}
                        className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-medium text-[var(--text)]"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
                    <div>
                      <p className="text-sm text-[var(--text-muted)]">Available from</p>
                      <p className="mt-1 text-base font-semibold text-[var(--text)]">{warehouse.available_from}</p>
                    </div>
                    <Link
                      to={`/warehouses/${warehouse.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                    >
                      View details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Warehouses;