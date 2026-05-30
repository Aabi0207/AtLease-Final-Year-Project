# AtLease Demo Frontend - Quick Start Guide

## ✅ Setup Complete!

Your AtLease blockchain demo frontend is ready to use.

## 🚀 Running the Application

### Start Development Server

```bash
cd frontend
npm run dev
```

The app will be available at: **http://localhost:5173/**

## 🎯 Demo Walkthrough

### Step 1: View Available Warehouses
- Open the app in your browser
- You'll see 4 demo warehouses from Maharashtra
- Each shows: location, size, monthly rent, features

### Step 2: Generate a Lease Certificate
1. Click **"Lease Now"** on any warehouse
2. Fill in the form:
   - **Lessee Name**: Enter any name (e.g., "John Doe")
   - **Start Date**: Select a date
   - **Duration**: Choose 6, 12, 24, or 36 months
3. Click **"Generate Lease Certificate (Demo)"**
4. Wait 1-2 seconds for mock blockchain processing

### Step 3: View Certificate Results
- You'll see a success modal with:
  - ✅ Token ID
  - ✅ Contract Address  
  - ✅ Transaction Hash
  - ✅ IPFS CID
- Links to Polygonscan and IPFS gateway

### Step 4: View Full Certificate
- Click **"View Certificate Details"**
- See the complete formatted lease certificate with:
  - Lessee information
  - Warehouse details
  - Lease terms (start, end, duration)
  - Blockchain verification badges
- Click **"Back to Dashboard"** to return

## 🎨 Features Demonstrated

### ✅ Professional UI
- Modern gradient header
- Clean card-based layout
- Responsive design (works on mobile/tablet)
- Professional color scheme

### ✅ Blockchain Concepts
- Non-transferable NFT badges
- ERC-721 token standard
- IPFS metadata storage
- Polygon PoS network
- Transaction verification links

### ✅ User Experience
- Smooth modals and transitions
- Loading states during processing
- Copy-to-clipboard functionality
- External links to block explorer

## 🔗 Connecting to Real Blockchain

Currently, the app uses **mock data**. To connect to your actual smart contract:

### 1. Create a Backend API

Create `atlease-blockchain/api/mint-certificate.js`:

```javascript
import { ethers } from 'ethers';
import { uploadToIPFS } from '../scripts/ipfsService.ts';

export async function mintCertificate(leaseData) {
  // 1. Upload metadata to IPFS
  const { ipfsUri, cid } = await uploadToIPFS(leaseData.metadata);
  
  // 2. Connect to contract
  const contract = await ethers.getContractAt("LeaseCertificate", CONTRACT_ADDRESS);
  
  // 3. Mint NFT
  const tx = await contract.mint(leaseData.recipient, ipfsUri);
  const receipt = await tx.wait();
  
  // 4. Return blockchain data
  return {
    tokenId: receipt.events[0].args.tokenId,
    txHash: tx.hash,
    ipfsCID: cid,
    metadata: leaseData.metadata
  };
}
```

### 2. Update Frontend API Call

In `frontend/src/App.jsx`, replace the mock function:

```javascript
const handleGenerateCertificate = async (leaseData) => {
  // Call your backend API
  const response = await fetch('http://localhost:3000/api/mint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leaseData)
  });
  
  const data = await response.json();
  setCertificateData(data);
  setSelectedWarehouse(null);
};
```

## 📊 Demo Data

### Warehouses
- **Pune** - WH-21 - ₹25,000/mo - 2000 sq.ft.
- **Mumbai** - WH-15 - ₹45,000/mo - 1500 sq.ft.
- **Nagpur** - WH-32 - ₹18,000/mo - 2500 sq.ft.
- **Nashik** - WH-08 - ₹20,000/mo - 1800 sq.ft.

### Contract Details
- **Address**: `0x8DCE258b9578585c28E4ef46d9d6C0F17326CB8B`
- **Network**: Polygon Amoy Testnet
- **Standard**: ERC-721
- **Transferable**: No (Soulbound)

## 🎓 For Faculty Presentation

### Key Points to Highlight:

1. **Blockchain Integration**
   - "Each lease is minted as an NFT on Polygon blockchain"
   - "Metadata stored on IPFS for decentralization"
   - "Non-transferable ensures lease certificates cannot be traded"

2. **Professional UI/UX**
   - "Modern responsive design suitable for production"
   - "Clear user flow from selection to certificate generation"
   - "Blockchain verification through Polygonscan links"

3. **Technical Stack**
   - "React with Vite for fast development"
   - "Tailwind CSS for professional styling"
   - "Smart contracts deployed on Polygon testnet"

4. **Security & Trust**
   - "Immutable blockchain records"
   - "Transparent verification through block explorer"
   - "Non-transferable prevents unauthorized transfers"

## 📝 Notes

- This is a **DEMO** version
- No actual payment processing
- Mock blockchain transactions for demonstration
- Can be connected to real smart contract with backend API

## 🚀 Deployment Options

For live demo during presentation:

### Vercel (Recommended)
```bash
npm run build
# Upload dist/ folder to Vercel
```

### Netlify
```bash
npm run build
# Drag dist/ to Netlify drop zone
```

## 📞 Support

For questions about this demo, refer to the main project README or contact the development team.

---

**Happy Demoing! 🎉**
