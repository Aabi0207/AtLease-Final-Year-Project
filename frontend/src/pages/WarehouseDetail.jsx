import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, CalendarDays, CheckCircle2, Clock3, Loader2, MapPin, ShieldCheck, Sparkles, Star } from 'lucide-react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const formatDate = value => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString();
};

const WarehouseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWarehouse = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/customer/warehouses/${id}/`);
        setWarehouse(response.data || null);
      } catch (fetchError) {
        setError('The selected listing could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouse();
  }, [id]);

  if (loading) {
    return (
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-center rounded-[32px] premium-panel-strong px-6 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--text-muted)]" />
        </div>
      </section>
    );
  }

  if (error || !warehouse) {
    return (
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl premium-panel-strong rounded-[32px] px-6 py-16 text-center">
          <BadgeCheck className="mx-auto h-16 w-16 text-[var(--text-muted)]" />
          <h1 className="mt-6 text-3xl font-semibold text-[var(--text)]">Warehouse not found</h1>
          <p className="mt-3 text-[var(--text-muted)]">{error || 'The selected listing may have moved or is no longer active.'}</p>
          <button
            type="button"
            onClick={() => navigate('/marketplace')}
            className="mt-6 rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to marketplace
          </button>
        </div>
      </section>
    );
  }

  const gallery = warehouse.gallery?.length ? warehouse.gallery : warehouse.image ? [warehouse.image] : [];
  const heroImage = gallery[activeImage] || warehouse.image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80';

  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <button
          type="button"
          onClick={() => navigate('/marketplace')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--text)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to marketplace
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-[34px] premium-panel-strong">
              <div className="absolute left-5 top-5 z-10 flex gap-2">
                <span className="rounded-full bg-black/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  {warehouse.is_available ? 'Available now' : 'Booked'}
                </span>
                <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 backdrop-blur">
                  {warehouse.region}
                </span>
              </div>
              <img
                src={heroImage}
                alt={warehouse.name}
                className="aspect-[16/10] h-full w-full object-cover"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`overflow-hidden rounded-3xl border-2 transition ${
                    index === activeImage ? 'border-[var(--accent-strong)]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={image} alt={`${warehouse.name} ${index + 1}`} className="h-36 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="premium-panel-strong rounded-[34px] p-6 sm:p-8">
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <MapPin className="h-4 w-4" />
                  {warehouse.city}, {warehouse.state}
                </div>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--text)]">{warehouse.name}</h1>
                <p className="mt-3 text-[var(--text-muted)] leading-7">{warehouse.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm text-[var(--text-muted)]">Lease price</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--text)]">{warehouse.price}</p>
                </div>
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm text-[var(--text-muted)]">Total area</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--text)]">{warehouse.area}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm text-[var(--text-muted)]">Occupancy</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{warehouse.occupancy}%</p>
                </div>
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm text-[var(--text-muted)]">Bookings</p>
                  <p className="mt-2 flex items-center gap-1 text-2xl font-semibold text-[var(--text)]">
                    <Star className="h-5 w-5 fill-current text-amber-500" />
                    {warehouse.booking_count}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[var(--text)]">Included amenities</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {warehouse.amenities.map(amenity => (
                    <span
                      key={amenity}
                      className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-medium text-[var(--text)]"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <ShieldCheck className="h-4 w-4" />
                  Lease readiness
                </div>
                <div className="mt-4 grid gap-3 text-sm text-[var(--text-muted)] sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/50 p-4 dark:bg-white/5">
                    <p className="font-semibold text-[var(--text)]">Available from</p>
                    <p className="mt-1">{formatDate(warehouse.available_from)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/50 p-4 dark:bg-white/5">
                    <p className="font-semibold text-[var(--text)]">Availability</p>
                    <p className="mt-1">{warehouse.is_available ? 'Ready for booking' : 'Occupied until renewal'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] bg-[var(--accent-strong)] p-6 text-white">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                  <Sparkles className="h-4 w-4" />
                  Next step
                </div>
                <h3 className="mt-3 text-2xl font-semibold">Lock this warehouse into a guided booking flow.</h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/75">
                  Review the lease, confirm booking terms, complete payment, and generate the NFT lease certificate in one flow.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {user?.role === 'CUSTOMER' ? (
                    <Link
                      to={`/book/${warehouse.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
                    >
                      Start booking
                      <CalendarDays className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      to="/login/customer"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
                    >
                      Log in as customer
                      <CalendarDays className="h-4 w-4" />
                    </Link>
                  )}
                  <Link
                    to="/certificates"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    View certificates
                    <CheckCircle2 className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <Clock3 className="h-4 w-4" />
                Live listing data synced from the marketplace feed.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WarehouseDetail;