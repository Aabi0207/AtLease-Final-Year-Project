import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BadgeCheck, CircleDollarSign, CreditCard, Landmark, Loader2, ShieldCheck, WalletCards } from 'lucide-react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { paymentOptions } from '../data/marketplaceData';

const formatPrice = value => {
  const numericValue = Number(value || 0);
  return `$${numericValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const addLeaseMonths = (startDate, leaseTerm) => {
  const start = new Date(startDate);
  const monthCount = Number.parseInt(leaseTerm, 10) || 12;
  const end = new Date(start);
  end.setMonth(end.getMonth() + monthCount);
  return end.toISOString().slice(0, 10);
};

const createTransactionHash = () => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `0x${Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')}`;
};

const mintApiBase = import.meta.env.VITE_MINT_API_URL || 'http://localhost:3001';


const iconMap = {
  card: CreditCard,
  bank: Landmark,
  usdc: WalletCards,
};

const PaymentFlow = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(paymentOptions[0].id);
  const [confirmed, setConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [certificateResult, setCertificateResult] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  const paymentState = location.state || {};
  const leaseTerm = paymentState.leaseTerm || '12 months';
  const startDate = paymentState.startDate || new Date().toISOString().slice(0, 10);
  const notes = paymentState.notes || '';
  const paymentStages = ['Authorizing payment', 'Minting certificate', 'Finalizing lease record'];

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

  useEffect(() => {
    if (!processing) return;

    const timer = window.setInterval(() => {
      setProcessingStage(current => (current + 1) % paymentStages.length);
    }, 700);

    return () => window.clearInterval(timer);
  }, [processing]);

  const handleMakePayment = async () => {
    if (!warehouse) return;

    setConfirmed(true);
    setPaymentError(null);
    setProcessing(true);
    setProcessingStage(0);

    try {
      const endDate = addLeaseMonths(startDate, leaseTerm);
      const leaseData = {
        lessee: {
          display_name: [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim() || user?.username || 'AtLease Customer',
          lessee_reference_id: `LESSEE-${String(user?.id || 0).padStart(4, '0')}`,
        },
        warehouse: {
          id: warehouse.id,
          location: `${warehouse.city}, ${warehouse.state}`,
        },
        lease_terms: {
          start_date: startDate,
          end_date: endDate,
          duration_months: Number.parseInt(leaseTerm, 10) || 12,
        },
      };

      const mintResponse = await fetch(`${mintApiBase}/api/mint-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leaseData }),
      });

      if (!mintResponse.ok) {
        const mintError = await mintResponse.json().catch(() => ({}));
        throw new Error(mintError.error || 'Certificate minting failed');
      }

      const mintResult = await mintResponse.json();

      if (!mintResult.success) {
        throw new Error(mintResult.error || 'Certificate minting failed');
      }

      const metadata = mintResult.metadata || {};
      const metadataUri = mintResult.ipfsCID ? `ipfs://${mintResult.ipfsCID}` : '';

      const bookingResponse = await api.post('/customer/bookings/', {
        warehouse: warehouse.id,
        start_date: startDate,
        end_date: endDate,
        metadata_uri: metadataUri,
        transaction_hash: mintResult.txHash || createTransactionHash(),
        certificate_id: metadata.certificate_id || '',
        token_id: mintResult.tokenId ? String(mintResult.tokenId) : '',
        chain: metadata.blockchain?.network || 'Polygon',
      });

      const booking = bookingResponse.data;
      const certificate = booking?.certificate || null;

      setCertificateResult({ booking, certificate, mintResult });

      window.setTimeout(() => {
        if (certificate?.id) {
          navigate(`/certificate/${certificate.id}`, {
            state: {
              certificate,
              booking,
              warehouse,
              notes,
            },
          });
          return;
        }

        setPaymentError('Payment could not be completed. Please try again.');
      }, 1100);
      return;
    } catch (error) {
      setPaymentError(error.message || 'Payment could not be completed. Please try again.');
      setCertificateResult(null);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl premium-panel-strong rounded-[32px] px-6 py-16 text-center">
          <CircleDollarSign className="mx-auto h-16 w-16 text-[var(--text-muted)]" />
          <h1 className="mt-6 text-3xl font-semibold text-[var(--text)]">Loading payment session</h1>
          <p className="mt-3 text-[var(--text-muted)]">Fetching live warehouse data from the marketplace.</p>
        </div>
      </section>
    );
  }

  if (!warehouse) {
    return (
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl premium-panel-strong rounded-[32px] px-6 py-16 text-center">
          <CircleDollarSign className="mx-auto h-16 w-16 text-[var(--text-muted)]" />
          <h1 className="mt-6 text-3xl font-semibold text-[var(--text)]">Payment session unavailable</h1>
          <p className="mt-3 text-[var(--text-muted)]">Go back and choose a warehouse to continue the flow.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="premium-panel-strong rounded-[34px] p-6 sm:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            <ShieldCheck className="h-4 w-4" />
            Payment flow
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)]">Secure payment confirmation</h1>
                <p className="mt-3 max-w-2xl text-[var(--text-muted)] leading-7">
                  Review the live lease cost for this warehouse before you continue to booking payment.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {paymentOptions.map(option => {
                  const Icon = iconMap[option.id];
                  const active = selectedMethod === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedMethod(option.id)}
                      className={`rounded-[28px] border p-5 text-left transition ${
                        active
                          ? 'border-[var(--accent-strong)] bg-[var(--surface-strong)] shadow-lg'
                          : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-strong)]'
                      }`}
                    >
                      <Icon className="h-5 w-5 text-[var(--text)]" />
                      <p className="mt-4 text-lg font-semibold text-[var(--text)]">{option.label}</p>
                      <p className="mt-2 text-sm text-[var(--text-muted)]">{option.detail}</p>
                      <span className="mt-4 inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                        {option.accent}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5">
                  <p className="text-sm text-[var(--text-muted)]">Payment protections</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text)]">Escrow, invoice trail, and audit logs</p>
                </div>
                <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5">
                  <p className="text-sm text-[var(--text-muted)]">Settlement timing</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text)]">Instant confirmation state</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-6">
                <p className="text-sm text-[var(--text-muted)]">Checkout summary</p>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-[var(--text)]">{warehouse.name}</h2>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{warehouse.city}, {warehouse.state}</p>
                  </div>
                    <p className="text-3xl font-semibold text-[var(--text)]">{formatPrice(warehouse.price_per_month)}</p>
                </div>

                <div className="mt-6 space-y-3 text-sm text-[var(--text-muted)]">
                  <div className="flex items-center justify-between rounded-2xl bg-white/55 px-4 py-3 dark:bg-white/5">
                    <span>Monthly lease</span>
                      <span className="font-semibold text-[var(--text)]">{formatPrice(warehouse.price_per_month)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/55 px-4 py-3 dark:bg-white/5">
                    <span>Escrow fee</span>
                      <span className="font-semibold text-[var(--text)]">$250</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/55 px-4 py-3 dark:bg-white/5">
                    <span>Certificate minting</span>
                    <span className="font-semibold text-[var(--text)]">Included</span>
                  </div>
                </div>

                {!confirmed ? (
                  <button
                    type="button"
                    onClick={handleMakePayment}
                    disabled={processing}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent-strong)] px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-80"
                  >
                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                    {processing ? paymentStages[processingStage] : 'Make payment'}
                  </button>
                ) : paymentError ? (
                  <div className="mt-6 rounded-[28px] bg-red-500/10 p-5 text-red-800 dark:text-red-200">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]">
                      <BadgeCheck className="h-4 w-4" />
                      Payment failed
                    </div>
                    <p className="mt-3 text-sm leading-7">{paymentError}</p>
                    <button
                      type="button"
                      onClick={handleMakePayment}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent-strong)] px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                    >
                      Retry payment
                      <CreditCard className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 rounded-[28px] bg-emerald-500/10 p-5 text-emerald-800 dark:text-emerald-200">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]">
                      <BadgeCheck className="h-4 w-4" />
                      Payment approved
                    </div>
                    <p className="mt-3 text-sm leading-7">
                      {certificateResult
                        ? 'Lease payment completed and certificate generated successfully.'
                        : 'Making payment and generating your lease certificate.'}
                    </p>
                    {processing ? (
                      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/50 px-4 py-3 text-sm font-semibold text-[var(--text)] dark:bg-white/5">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {paymentStages[processingStage]}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate(`/certificate/${certificateResult?.certificate?.id || certificateResult?.certificate?.certificate_id || warehouse.id}`)}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent-strong)] px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                      >
                        View lease certificate
                        <ArrowRightIcon />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ArrowRightIcon = () => <span aria-hidden="true">→</span>;

export default PaymentFlow;