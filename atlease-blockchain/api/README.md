# AtLease API Server

Backend API that connects the frontend to the blockchain scripts.

## Setup

```bash
cd api
npm install
```

## Start Server

```bash
npm start
```

Server runs on: **http://localhost:3001**

## Endpoints

- `POST /api/mint-certificate` - Mint new lease certificate
- `GET /api/certificates` - Get all minted certificates
- `GET /api/certificates/:id` - Get specific certificate
- `GET /api/health` - Health check

## How It Works

1. Frontend sends lease data to `/api/mint-certificate`
2. API creates metadata and calls your `ipfsService.ts`
3. Uploads metadata to IPFS via Pinata
4. Mints NFT on Polygon blockchain
5. Returns real Token ID, TX Hash, and IPFS CID
6. Stores certificate in memory for history viewing

## Requirements

- Node.js 16+
- `.env` file with PINATA_JWT and PRIVATE_KEY
- Polygon Amoy testnet RPC access
