export const heroMetrics = [
  { label: 'Active spaces', value: '128' },
  { label: 'Enterprise tenants', value: '72' },
  { label: 'Avg. lease cycle', value: '14 days' },
];

export const warehouseCatalog = [
  {
    id: 101,
    name: 'Atlas Logistics Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    region: 'South India',
    address: '14 Aerospace Road, KIADB Industrial Area',
    price: '$18,500',
    area: '42,000 sq ft',
    occupancy: 92,
    available: true,
    image:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508710947060-28b4d476b6f0?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['24/7 security', 'Cold storage', 'Dock levelers', 'Solar backup'],
    leaseTerm: '12 month minimum',
    rating: 4.9,
    description:
      'Prime enterprise distribution node with high-clearance bays, climate-controlled storage, and compliance-ready access lanes.',
  },
  {
    id: 102,
    name: 'Northline Supply Hub',
    city: 'Pune',
    state: 'Maharashtra',
    region: 'West India',
    address: '88 Logistics Corridor, Chakan MIDC',
    price: '$14,200',
    area: '31,500 sq ft',
    occupancy: 84,
    available: true,
    image:
      'https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Highway access', 'Loading docks', 'Fire suppression', 'Visitor lounge'],
    leaseTerm: '6 month minimum',
    rating: 4.8,
    description:
      'Designed for fast-moving consumer goods and regional distribution with efficient truck circulation and premium tenant amenities.',
  },
  {
    id: 103,
    name: 'Vertex Distribution Yard',
    city: 'Hyderabad',
    state: 'Telangana',
    region: 'South India',
    address: '12 Innovation Drive, Shamshabad Logistics Park',
    price: '$21,800',
    area: '58,000 sq ft',
    occupancy: 97,
    available: false,
    image:
      'https://images.unsplash.com/photo-1507652313519-d4e9121cd1c6?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507652313519-d4e9121cd1c6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Heavy duty flooring', 'CCTV', 'Backup power', 'Smart metering'],
    leaseTerm: '18 month preferred',
    rating: 5.0,
    description:
      'Enterprise-grade campus with multi-tenant zoning and smart telemetry for high-volume operators.',
  },
  {
    id: 104,
    name: 'Harbor One Storage',
    city: 'Chennai',
    state: 'Tamil Nadu',
    region: 'South India',
    address: '7 Port Access Road, Manali Industrial Estate',
    price: '$16,900',
    area: '36,250 sq ft',
    occupancy: 89,
    available: true,
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Port proximity', 'Secure yard', 'RFID gates', 'Air handling'],
    leaseTerm: '9 month minimum',
    rating: 4.7,
    description:
      'Strategic last-mile and export-ready storage with premium safety controls and flexible lease options.',
  },
];

export const featuredWarehouses = [
  {
    id: 1,
    name: 'Atlas Logistics Park',
    location: 'Bengaluru, India',
    price: '$18.5k / mo',
    size: '42,000 sq ft',
    status: 'Verified',
    highlight: 'Cold storage, loading bays, 24/7 security',
  },
  {
    id: 2,
    name: 'Northline Supply Hub',
    location: 'Pune, India',
    price: '$14.2k / mo',
    size: '31,500 sq ft',
    status: 'Available',
    highlight: 'Near highway access, solar backup, docks',
  },
  {
    id: 3,
    name: 'Vertex Distribution Yard',
    location: 'Hyderabad, India',
    price: '$21.8k / mo',
    size: '58,000 sq ft',
    status: 'Premium',
    highlight: 'Multi-tenant, heavy duty floors, smart meters',
  },
];

export const analyticsPreview = [
  { label: 'Booked this month', value: '86', delta: '+18%' },
  { label: 'Occupancy rate', value: '92%', delta: '+4.2%' },
  { label: 'Certificates minted', value: '64', delta: '+12%' },
  { label: 'Payment success', value: '99.4%', delta: '+0.8%' },
];

export const certificateVault = [
  {
    id: 'AL-2026-001',
    warehouse: 'Atlas Logistics Park',
    tenant: 'NovaCommerce Pvt Ltd',
    issuedOn: '2026-04-18',
    status: 'Stored',
    chain: 'Polygon',
    tokenId: '0x1a2f...9bc4',
  },
  {
    id: 'AL-2026-002',
    warehouse: 'Northline Supply Hub',
    tenant: 'Gridline Retail',
    issuedOn: '2026-04-30',
    status: 'Verified',
    chain: 'Polygon',
    tokenId: '0x7c5e...11af',
  },
  {
    id: 'AL-2026-003',
    warehouse: 'Harbor One Storage',
    tenant: 'Apex Foods',
    issuedOn: '2026-05-08',
    status: 'Archived',
    chain: 'Polygon',
    tokenId: '0x9db2...44ce',
  },
];

export const bookingMilestones = [
  'Select warehouse',
  'Review lease terms',
  'Confirm booking',
  'Complete payment',
  'Mint certificate',
];

export const paymentOptions = [
  { id: 'card', label: 'Corporate card', detail: 'Instant authorization', accent: 'Recommended' },
  { id: 'bank', label: 'Bank transfer', detail: 'Manual confirmation', accent: 'Enterprise' },
  { id: 'usdc', label: 'Stablecoin', detail: 'On-chain settlement', accent: 'Web3' },
];

export const dashboardMetrics = [
  { label: 'Active leases', value: '28', delta: '+9%' },
  { label: 'Gross revenue', value: '$284k', delta: '+13%' },
  { label: 'Certificate uptime', value: '99.98%', delta: '+0.02%' },
  { label: 'Pending renewals', value: '07', delta: '-3' },
];

export const loginRoleCopy = {
  customer: {
    eyebrow: 'Customer portal',
    title: 'Reserve warehouse capacity with enterprise-grade confidence.',
    description:
      'Search premium spaces, book instantly, and collect a verifiable lease certificate after payment.',
  },
  vendor: {
    eyebrow: 'Vendor portal',
    title: 'Monetize your warehouse inventory from a clean, premium dashboard.',
    description:
      'List space, manage demand, and track lease performance with analytics and certificate storage.',
  },
};