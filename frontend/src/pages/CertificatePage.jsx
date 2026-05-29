import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Copy, Download, ExternalLink, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';

const formatCurrency = value => {
  const numericValue = Number(value || 0);
  return `$${numericValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const CertificatePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const certificateFromState = location.state?.certificate || null;

  useEffect(() => {
    if (certificateFromState) {
      setCertificates([certificateFromState]);
      setLoading(false);
      return;
    }

    const fetchCertificates = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get('/customer/certificates/');
        setCertificates(response.data || []);
      } catch (fetchError) {
        setError('Please sign in to view certificate details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [certificateFromState]);

  const certificate = useMemo(() => {
    return certificates.find(item => String(item.id) === String(id) || String(item.certificate_id) === String(id)) || null;
  }, [certificates, id]);

  const metadata = certificate?.metadata || null;
  const mintMetadata = metadata?.mint || {};
  const warehouseMetadata = metadata?.warehouse || {};
  const leaseTerms = metadata?.lease_terms || {};
  const blockchain = metadata?.blockchain || {};
  const issuer = metadata?.issuer || {};
  const lessee = metadata?.lessee || {};

  const copyToClipboard = text => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-center rounded-[32px] premium-panel-strong px-6 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--text-muted)]" />
        </div>
      </section>
    );
  }

  if (error || !certificate || !metadata) {
    return (
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl premium-panel-strong rounded-[32px] px-6 py-16 text-center">
          <ShieldCheck className="mx-auto h-16 w-16 text-[var(--text-muted)]" />
          <h1 className="mt-6 text-3xl font-semibold text-[var(--text)]">Certificate not found</h1>
          <p className="mt-3 text-[var(--text-muted)]">{error || 'The lease certificate could not be resolved.'}</p>
          <button
            type="button"
            onClick={() => navigate('/certificates')}
            className="mt-6 rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white"
          >
            Open certificate vault
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <button
          type="button"
          onClick={() => navigate('/certificates')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--text)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to certificate vault
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="premium-panel-strong rounded-[36px] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              <Sparkles className="h-4 w-4" />
              NFT lease certificate
            </div>

            <div className="mt-6 rounded-[34px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.96))] p-6 text-white shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">AtLease Verified Lease</p>
                  <h1 className="mt-4 text-3xl font-semibold">{metadata.name}</h1>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-white/75">{metadata.description}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-right backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Token ID</p>
                  <p className="mt-2 font-mono text-sm text-white">{certificate.token_id}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  ['Certificate ID', metadata.certificate_id],
                  ['Certificate name', metadata.name],
                  ['Tenant', lessee.display_name || certificate.customer_display_name],
                  ['Lessee ref', lessee.lessee_reference_id],
                  ['Issuer chain', blockchain.network || certificate.chain],
                  ['Token standard', blockchain.token_standard],
                  ['Transferable', String(blockchain.transferable)],
                  ['Issued on', new Date(certificate.minted_at).toLocaleDateString()],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-3xl border border-white/10 bg-white/8 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/55">{label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(certificate.token_id)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <Copy className="h-4 w-4" />
                  Copy token hash
                </button>
                <Link
                  to="/certificates"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Open vault
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="premium-panel-strong rounded-[32px] p-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                <ShieldCheck className="h-4 w-4" />
                Certificate metadata
              </div>
              <div className="mt-5 space-y-3 text-sm text-[var(--text-muted)]">
                <div className="flex items-center justify-between rounded-2xl bg-[var(--surface)] px-4 py-3">
                  <span>Status</span>
                  <span className="font-semibold text-[var(--text)]">{certificate.status}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[var(--surface)] px-4 py-3">
                  <span>Warehouse</span>
                  <span className="font-semibold text-[var(--text)]">{warehouseMetadata.location}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[var(--surface)] px-4 py-3">
                  <span>Lease state</span>
                  <span className="font-semibold text-[var(--text)]">Active</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[var(--surface)] px-4 py-3">
                  <span>IPFS URI</span>
                  <span className="max-w-[12rem] break-all text-right font-semibold text-[var(--text)]">
                    {certificate.metadata_uri || 'Not uploaded'}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[var(--surface)] px-4 py-3">
                  <span>Mint tx</span>
                  <span className="max-w-[12rem] break-all text-right font-semibold text-[var(--text)]">
                    {mintMetadata.transaction_hash || certificate.transaction_hash || 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[var(--surface)] px-4 py-3">
                  <span>Version</span>
                  <span className="font-semibold text-[var(--text)]">{metadata.version}</span>
                </div>
              </div>
            </div>

            <div className="premium-panel rounded-[32px] p-6">
              <p className="text-sm text-[var(--text-muted)]">Associated lease</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">{certificate.warehouse_title}</h2>
              <p className="mt-3 text-[var(--text-muted)] leading-7">{certificate.warehouse_address}</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/50 p-4 dark:bg-white/5">
                  <p className="text-sm text-[var(--text-muted)]">Monthly value</p>
                  <p className="mt-2 text-xl font-semibold text-[var(--text)]">{formatCurrency(certificate.monthly_rent)}</p>
                </div>
                <div className="rounded-3xl bg-white/50 p-4 dark:bg-white/5">
                  <p className="text-sm text-[var(--text-muted)]">Lease window</p>
                  <p className="mt-2 text-xl font-semibold text-[var(--text)]">
                    {leaseTerms.start_date} - {leaseTerms.end_date}
                  </p>
                </div>
                <div className="rounded-3xl bg-white/50 p-4 dark:bg-white/5">
                  <p className="text-sm text-[var(--text-muted)]">Warehouse ID</p>
                  <p className="mt-2 text-xl font-semibold text-[var(--text)]">{warehouseMetadata.warehouse_id}</p>
                </div>
                <div className="rounded-3xl bg-white/50 p-4 dark:bg-white/5">
                  <p className="text-sm text-[var(--text-muted)]">Duration</p>
                  <p className="mt-2 text-xl font-semibold text-[var(--text)]">{leaseTerms.duration_months} months</p>
                </div>
                <div className="rounded-3xl bg-white/50 p-4 dark:bg-white/5">
                  <p className="text-sm text-[var(--text-muted)]">Issuer</p>
                  <p className="mt-2 text-xl font-semibold text-[var(--text)]">{issuer.issued_by}</p>
                </div>
                <div className="rounded-3xl bg-white/50 p-4 dark:bg-white/5">
                  <p className="text-sm text-[var(--text-muted)]">Blockchain</p>
                  <p className="mt-2 text-xl font-semibold text-[var(--text)]">{blockchain.network}</p>
                </div>
              </div>
              <div className="mt-5 rounded-3xl bg-white/50 p-4 dark:bg-white/5">
                <p className="text-sm text-[var(--text-muted)]">Certificate description</p>
                <p className="mt-2 leading-7 text-[var(--text)]">{metadata.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificatePage;
