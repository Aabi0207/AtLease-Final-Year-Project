// Demo warehouse data for AtLease platform
export const demoWarehouses = [
  {
    id: "WH-21",
    name: "Pune Central Warehouse",
    city: "Pune",
    state: "Maharashtra",
    location: "Pune, Maharashtra",
    size: 2000,
    monthlyRent: 25000,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400",
    features: ["24/7 Security", "Climate Control", "Loading Dock"],
  },
  {
    id: "WH-15",
    name: "Mumbai Port Warehouse",
    city: "Mumbai",
    state: "Maharashtra",
    location: "Mumbai, Maharashtra",
    size: 1500,
    monthlyRent: 45000,
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=400",
    features: ["Port Access", "24/7 Security", "Fire Safety"],
  },
  {
    id: "WH-32",
    name: "Nagpur Industrial Hub",
    city: "Nagpur",
    state: "Maharashtra",
    location: "Nagpur, Maharashtra",
    size: 2500,
    monthlyRent: 18000,
    image: "https://images.unsplash.com/photo-1565610222536-ef125c59da2e?w=400",
    features: ["Large Space", "Highway Access", "Loading Bays"],
  },
  {
    id: "WH-08",
    name: "Nashik Logistics Center",
    city: "Nashik",
    state: "Maharashtra",
    location: "Nashik, Maharashtra",
    size: 1800,
    monthlyRent: 20000,
    image: "https://images.unsplash.com/photo-1619468129361-605ebea04b44?w=400",
    features: ["Modern Facility", "Security System", "Easy Access"],
  },
];

// Helper to format currency in INR
export const formatINR = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Mock blockchain contract address (Polygon Amoy)
export const CONTRACT_ADDRESS = "0x8DCE258b9578585c28E4ef46d9d6C0F17326CB8B";
export const NETWORK_NAME = "Polygon Amoy Testnet";
export const BLOCK_EXPLORER = "https://amoy.polygonscan.com";
