import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import {
  Loader2,
  Plus,
  Building,
  Lock,
  Video,
  IndianRupee,
  Target,
  ChevronLeft,
  ShieldCheck,
  Battery,
  Warehouse as WarehouseIcon,
  UploadCloud,
  Sparkles,
} from 'lucide-react';
import MediaUploader from '../components/MediaUploader';

const featureOptions = [
  { name: 'has_parking', label: 'Dedicated Parking', icon: Plus },
  { name: 'has_security', label: '24/7 Security', icon: Lock },
  { name: 'has_cctv', label: 'CCTV Surveillance', icon: Video },
  { name: 'has_loading_dock', label: 'Loading Docks', icon: Building },
  { name: 'power_backup', label: 'Power Backup', icon: Battery },
];

const AddWarehousePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    price_per_month: '',
    capacity: '',
    available_from: '',
    has_parking: false,
    has_security: false,
    has_cctv: false,
    has_loading_dock: false,
    power_backup: false,
  });

  useEffect(() => {
    if (!isEditMode || user?.role !== 'OWNER') {
      setFetching(false);
      return;
    }

    const fetchWarehouse = async () => {
      try {
        const res = await api.get(`/owner/warehouses/${id}/`);
        const data = res.data;
        setFormData({
          title: data.title || '',
          description: data.description || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          price_per_month: data.price_per_month || '',
          capacity: data.capacity || '',
          available_from: data.available_from || '',
          has_parking: !!data.has_parking,
          has_security: !!data.has_security,
          has_cctv: !!data.has_cctv,
          has_loading_dock: !!data.has_loading_dock,
          power_backup: !!data.power_backup,
        });
      } catch (err) {
        setError('Failed to load warehouse data.');
      } finally {
        setFetching(false);
      }
    };

    fetchWarehouse();
  }, [id, isEditMode, user]);

  if (!user || user.role !== 'OWNER') {
    return (
      <section className="px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-[32px] border border-[var(--border)] bg-[var(--surface-strong)] p-8 text-center shadow-2xl">
          <WarehouseIcon className="mx-auto h-16 w-16 text-[var(--text-muted)]" />
          <h2 className="mt-5 text-2xl font-semibold text-[var(--text)]">Access denied</h2>
          <p className="mt-3 text-[var(--text-muted)]">
            You must be logged in as an owner to create or edit warehouse listings.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white"
          >
            Return home
          </button>
        </div>
      </section>
    );
  }

  const handleInputChange = event => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let warehouseId = id;

      if (isEditMode) {
        await api.put(`/owner/warehouses/${id}/`, formData);
      } else {
        const warehouseRes = await api.post('/owner/warehouses/', formData);
        warehouseId = warehouseRes.data.id;
      }

      if (files.length > 0) {
        const mediaFormData = new FormData();
        files.forEach(file => mediaFormData.append('file', file.file));

        await api.post(`/owner/warehouses/${warehouseId}/upload_media/`, mediaFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          Object.values(err.response?.data || {}).flat().join(', ') ||
          (isEditMode ? 'Failed to update warehouse.' : 'Failed to list warehouse.')
      );
    } finally {
      setLoading(false);
    }
  };

  const cardClass = 'rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-8';
  const inputClass = 'w-full rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-white dark:bg-white/5 dark:focus:bg-white/8';

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 premium-grid opacity-50" />
      <div className="absolute right-0 top-10 -z-10 h-72 w-72 rounded-full bg-slate-900/10 blur-3xl dark:bg-white/5" />

      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--text)]"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)]">
              <Sparkles className="h-4 w-4" />
              {isEditMode ? 'Update listing' : 'Create listing'}
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
              {isEditMode ? 'Refine your warehouse listing' : 'List a warehouse with enterprise polish'}
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
              Add the operational details, pricing, and amenities that matter most to serious tenants.
            </p>
          </div>
        </div>

        {fetching ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--text-muted)]" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                {isEditMode ? 'Listing updated successfully.' : 'Listing created successfully.'} Redirecting you back...
              </div>
            ) : null}

            <div className={cardClass}>
              <h3 className="mb-6 flex items-center text-lg font-semibold text-[var(--text)]">
                <Building className="mr-2 h-5 w-5 text-[var(--text-muted)]" />
                Basic information
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="mb-2 block text-sm font-semibold text-[var(--text)]">Listing title</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    placeholder="e.g. 10,000 sq ft premium cold storage in Pune"
                    className={inputClass}
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="mb-2 block text-sm font-semibold text-[var(--text)]">Detailed description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    placeholder="Highlight key features, location benefits, and property history..."
                    className={`${inputClass} resize-y`}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="mb-2 block text-sm font-semibold text-[var(--text)]">Street address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    placeholder="123 Industrial Ave, Pune, Maharashtra"
                    className={inputClass}
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="city" className="mb-2 block text-sm font-semibold text-[var(--text)]">City</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    placeholder="Pune"
                    className={inputClass}
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="state" className="mb-2 block text-sm font-semibold text-[var(--text)]">State / region</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    required
                    placeholder="Maharashtra"
                    className={inputClass}
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <h3 className="mb-6 flex items-center text-lg font-semibold text-[var(--text)]">
                <Target className="mr-2 h-5 w-5 text-[var(--text-muted)]" />
                Pricing and capacity
              </h3>

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label htmlFor="price_per_month" className="mb-2 block text-sm font-semibold text-[var(--text)]">Monthly lease ($)</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <IndianRupee className="h-4 w-4 text-[var(--text-muted)]" />
                    </div>
                    <input
                      id="price_per_month"
                      name="price_per_month"
                      type="number"
                      step="0.01"
                      required
                      placeholder="5000.00"
                      className={`${inputClass} pl-9`}
                      value={formData.price_per_month}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="capacity" className="mb-2 block text-sm font-semibold text-[var(--text)]">Capacity (sq ft)</label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    required
                    placeholder="15000"
                    className={inputClass}
                    value={formData.capacity}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="available_from" className="mb-2 block text-sm font-semibold text-[var(--text)]">Available from</label>
                  <input
                    id="available_from"
                    name="available_from"
                    type="date"
                    required
                    className={inputClass}
                    value={formData.available_from}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <h3 className="mb-6 flex items-center text-lg font-semibold text-[var(--text)]">
                <ShieldCheck className="mr-2 h-5 w-5 text-[var(--text-muted)]" />
                Premium amenities
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {featureOptions.map(feature => {
                  const Icon = feature.icon;
                  const active = formData[feature.name];

                  return (
                    <label
                      key={feature.name}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-4 transition ${
                        active
                          ? 'border-[var(--accent)] bg-[var(--surface-strong)]'
                          : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-strong)]'
                      }`}
                    >
                      <input type="checkbox" name={feature.name} className="sr-only" checked={active} onChange={handleInputChange} />
                      <span className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                        <Icon className="h-4 w-4 text-[var(--text-muted)]" />
                        {feature.label}
                      </span>
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${active ? 'border-[var(--accent-strong)] bg-[var(--accent-strong)]' : 'border-[var(--border)]'}`}>
                        {active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className={cardClass}>
              <h3 className="mb-3 flex items-center text-lg font-semibold text-[var(--text)]">
                <UploadCloud className="mr-2 h-5 w-5 text-[var(--text-muted)]" />
                Media files
              </h3>
              <p className="mb-5 text-sm leading-6 text-[var(--text-muted)]">
                Add high-quality photos or videos to increase conversion and help tenants evaluate the space.
              </p>
              <MediaUploader files={files} setFiles={setFiles} />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-strong)]"
                disabled={loading || success}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-75"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : success ? (
                  isEditMode ? 'Updated' : 'Listed'
                ) : (
                  isEditMode ? 'Update warehouse' : 'List warehouse'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default AddWarehousePage;
