import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, ClipboardList, CreditCard, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { bookingMilestones } from '../data/marketplaceData';

const formatPrice = value => {
  const numericValue = Number(value || 0);
  return `$${numericValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const BookingFlow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [leaseTerm, setLeaseTerm] = useState('12 months');
  const [startDate, setStartDate] = useState('2026-06-01');
  const [notes, setNotes] = useState('Need 24/7 access and temperature monitoring.');

  useEffect(() => {
    const fetchWarehouse = async () => {
      setLoading(true);

      try {
        const response = await api.get(`/customer/warehouses/${id}/`);
        setWarehouse(response.data || null);
      } catch (fetchError) {
        setWarehouse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouse();
  }, [id]);

  if (loading) {
    return (
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl premium-panel-strong rounded-[32px] px-6 py-16 text-center">
          <ClipboardList className="mx-auto h-16 w-16 text-[var(--text-muted)]" />
          <h1 className="mt-6 text-3xl font-semibold text-[var(--text)]">Loading booking session</h1>
          <p className="mt-3 text-[var(--text-muted)]">Fetching live warehouse data from the marketplace.</p>
        </div>
      </section>
    );
  }

  if (!warehouse) {
    return (
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl premium-panel-strong rounded-[32px] px-6 py-16 text-center">
          <ClipboardList className="mx-auto h-16 w-16 text-[var(--text-muted)]" />
          <h1 className="mt-6 text-3xl font-semibold text-[var(--text)]">Booking session unavailable</h1>
          <p className="mt-3 text-[var(--text-muted)]">Please choose a warehouse from the marketplace first.</p>
          <Link to="/marketplace" className="mt-6 inline-flex rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white">
            Return to marketplace
          </Link>
        </div>
      </section>
    );
  }

  const summary = [
    ['Warehouse', warehouse.name],
    ['Location', `${warehouse.city}, ${warehouse.state}`],
    ['Lease term', leaseTerm],
    ['Start date', startDate],
  ];

  const monthlyLease = Number(warehouse.price_per_month || 0);

  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          <CheckCircle2 className="h-4 w-4" />
          Booking flow
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="premium-panel-strong rounded-[32px] p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[var(--text-muted)]">
                {bookingMilestones.map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 ${index < 2 ? 'bg-[var(--accent-strong)] text-white' : 'bg-[var(--accent-soft)] text-[var(--text)]'}`}>
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-[0.95fr_1.05fr]">
                <div className="overflow-hidden rounded-[28px]">
                  <img src={warehouse.image || warehouse.gallery?.[0]} alt={warehouse.name} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Selected warehouse</p>
                    <h1 className="mt-2 text-3xl font-semibold text-[var(--text)]">{warehouse.name}</h1>
                    <p className="mt-2 text-[var(--text-muted)]">{warehouse.address}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[var(--text)]">Lease term</span>
                      <select
                        value={leaseTerm}
                        onChange={event => setLeaseTerm(event.target.value)}
                        className="w-full rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3 outline-none dark:bg-white/5"
                      >
                        <option>6 months</option>
                        <option>9 months</option>
                        <option>12 months</option>
                        <option>18 months</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[var(--text)]">Start date</span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={event => setStartDate(event.target.value)}
                        className="w-full rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3 outline-none dark:bg-white/5"
                      />
                    </label>
                  </div>

                  <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                    <p className="text-sm text-[var(--text-muted)]">Protection</p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                      <ShieldCheck className="h-4 w-4" />
                      Booking protected by lease escrow.
                    </div>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[var(--text)]">Special requirements</span>
                    <textarea
                      rows="4"
                      value={notes}
                      onChange={event => setNotes(event.target.value)}
                      className="w-full rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3 outline-none dark:bg-white/5"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Pre-approved', 'Lease terms verified'],
                ['Fast review', 'Live listing data'],
                ['Enterprise ready', 'Escrow and certificate baked in'],
              ].map(([title, text]) => (
                <div key={title} className="premium-panel rounded-[28px] p-5">
                  <p className="text-base font-semibold text-[var(--text)]">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="premium-panel-strong rounded-[32px] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                <CreditCard className="h-4 w-4" />
                Booking summary
              </div>

              <div className="mt-5 space-y-4">
                {summary.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                    <span className="text-sm text-[var(--text-muted)]">{label}</span>
                    <span className="text-sm font-semibold text-[var(--text)] text-right">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[28px] bg-[var(--accent-strong)] p-5 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Total estimate</p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <p className="text-4xl font-semibold">{formatPrice(monthlyLease)}</p>
                  <p className="text-sm text-white/70">Per month</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/book/${warehouse.id}/payment`, { state: { leaseTerm, startDate, notes } })}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent-strong)] px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Continue to payment
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingFlow;