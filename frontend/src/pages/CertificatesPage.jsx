import { useEffect, useMemo, useState } from 'react';
import { Search, ShieldCheck, Sparkles, Vault, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const CertificatesPage = () => {
  const [query, setQuery] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get('/customer/certificates/');
        setCertificates(response.data || []);
      } catch (fetchError) {
        setError('Please sign in to view your certificates.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const filteredCertificates = useMemo(() => {
    return certificates.filter(item => {
      const haystack = [
        item.certificate_id,
        item.warehouse_title,
        item.warehouse_city,
        item.customer_display_name,
        item.status,
        item.chain,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [certificates, query]);

  const storedCount = certificates.length;
  const verifiedCount = certificates.filter(item => item.status === 'VERIFIED' || item.status === 'MINTED').length;
  const archivedCount = certificates.filter(item => item.status === 'ARCHIVED').length;

  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)]">
              <Vault className="h-4 w-4" />
              Certificate storage dashboard
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
              Store, verify, and audit lease certificates in one vault.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-[var(--text-muted)]">
              The certificate vault shows only the certificates for your account, with live booking and metadata details.
            </p>
          </div>

          <div className="premium-panel-strong rounded-[32px] p-5 sm:p-6">
            <div className="flex items-center gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3">
              <Search className="h-5 w-5 text-[var(--text-muted)]" />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search certificate, tenant, chain"
                className="min-w-0 flex-1 bg-transparent text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ['Stored', String(storedCount)],
                ['Verified', String(verifiedCount)],
                ['Archived', String(archivedCount)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
                  <p className="text-sm text-[var(--text-muted)]">{label}</p>
                  <p className="mt-1 text-2xl font-semibold text-[var(--text)]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['On-chain sync', 'Live'],
            ['Audit readiness', '24/7'],
            ['Median mint time', 'Instant'],
            ['Storage nodes', String(storedCount || 0)],
          ].map(([label, value]) => (
            <div key={label} className="premium-panel rounded-[28px] p-5">
              <p className="text-sm text-[var(--text-muted)]">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{value}</p>
            </div>
          ))}
        </div>

        {error ? (
          <div className="rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center rounded-[32px] border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-[var(--text-muted)]">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : null}

        {!loading && filteredCertificates.length === 0 ? (
          <div className="premium-panel rounded-[32px] px-6 py-16 text-center">
            <Vault className="mx-auto h-16 w-16 text-[var(--text-muted)]" />
            <h2 className="mt-6 text-2xl font-semibold text-[var(--text)]">No certificates match your filters</h2>
            <p className="mt-3 text-[var(--text-muted)]">Complete a booking and payment to generate your first certificate.</p>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          {filteredCertificates.map(item => (
            <article key={item.id} className="premium-panel-strong rounded-[32px] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    <Sparkles className="h-4 w-4" />
                    {item.status}
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">{item.warehouse_title}</h2>
                  <p className="mt-2 text-[var(--text-muted)]">Tenant: {item.customer_display_name}</p>
                </div>
                <ShieldCheck className="h-8 w-8 text-[var(--success)]" />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm text-[var(--text-muted)]">Certificate ID</p>
                  <p className="mt-1 font-semibold text-[var(--text)]">{item.certificate_id}</p>
                </div>
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm text-[var(--text-muted)]">Chain</p>
                  <p className="mt-1 font-semibold text-[var(--text)]">{item.chain}</p>
                </div>
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm text-[var(--text-muted)]">Issued on</p>
                  <p className="mt-1 font-semibold text-[var(--text)]">{new Date(item.minted_at).toLocaleDateString()}</p>
                </div>
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm text-[var(--text-muted)]">Token hash</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-[var(--text)]">{item.token_id}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to={`/certificate/${item.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Open certificate
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface)]"
                >
                  Archive copy
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificatesPage;
