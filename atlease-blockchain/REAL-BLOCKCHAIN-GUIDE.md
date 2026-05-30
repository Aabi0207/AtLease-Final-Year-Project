# 🚀 Quick Start - Real Blockchain Integration

Your frontend is now connected to REAL blockchain minting!

## Start Both Servers

### Terminal 1 - API Server (Backend)
```bash
cd api
npm start
```
Server will run on: **http://localhost:3001**

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on: **http://localhost:5173/**

## How to Test

1. **Open Frontend**: Go to http://localhost:5173/
2. **Click "Lease Now"** on any warehouse
3. **Fill the form**:
   - Lessee Name: Your name
   - Start Date: Any future date
   - Duration: Select months
4. **Click "Generate Lease Certificate"**
5. **Wait 10-30 seconds** for:
   - ✅ Metadata upload to IPFS
   - ✅ NFT minting on Polygon blockchain
6. **View Results**:
   - Real Token ID
   - Real Transaction Hash (click to see on Polygonscan)
   - Real IPFS CID (click to see metadata)
7. **View Certificate** to see full details
8. **Click "View All Certificates"** to see history of all minted leases

## What's Different Now?

### ❌ Before (Mock):
- Fake transaction hashes
- No actual blockchain interaction
- Data disappeared on refresh

### ✅ Now (Real):
- **Real IPFS uploads** via Pinata
- **Real NFT minting** on Polygon Amoy
- **Real transaction hashes** verifiable on Polygonscan
- **Persistent history** - all certificates stored
- **Viewable on blockchain** forever

## Verify on Blockchain

Every certificate you mint:
1. Has a real transaction: `https://amoy.polygonscan.com/tx/{TX_HASH}`
2. Has IPFS metadata: `https://gateway.pinata.cloud/ipfs/{CID}`
3. Is visible on the contract: `https://amoy.polygonscan.com/address/0x8DCE258b9578585c28E4ef46d9d6C0F17326CB8B`

## Troubleshooting

### "Failed to mint certificate"
- Make sure API server is running (`cd api && npm start`)
- Check `.env` file has PINATA_JWT and PRIVATE_KEY
- Ensure you have testnet MATIC in your wallet

### "Network error"
- API server must be on port 3001
- Check if both servers are running
- Try refreshing the frontend

## Architecture

```
Frontend (React)
    ↓ HTTP Request
API Server (Express)
    ↓ Calls
Hardhat Scripts (TypeScript)
    ↓ Executes
- Upload to IPFS (Pinata)
- Mint NFT (Polygon Blockchain)
    ↓ Returns
Real blockchain data back to frontend
```

## For Presentation

Show faculty members:
1. **Live Demo**: Mint a certificate in real-time
2. **Polygonscan**: Show the transaction on blockchain
3. **IPFS**: Show the metadata stored decentralized
4. **Certificate History**: Show all minted certificates
5. **Non-Transferability**: Explain soulbound concept

Your project now has REAL blockchain integration! 🎉
