Below is a **complete, examiner-oriented `README.md`** you can drop directly into your repo.
It is written to **pre-empt teacher questions**, justify **why blockchain/NFTs are used**, and clearly explain **what problem this solves** without hype.

You can copy–paste this as-is.

---

# AtLease – Blockchain Lease Certificate System

## Overview

AtLease is a **decentralized warehouse leasing platform** where traditional leasing operations (search, pricing, payments) are handled off-chain, while **lease certificates** are issued and verified on a blockchain using **non-transferable NFTs**.

The blockchain component of AtLease focuses on **proof, integrity, and verifiability**, not on payments or speculation.

This repository contains the **blockchain layer** of the project.

---

## Why Do We Need Lease Certificates?

In traditional warehouse leasing systems:

- Lease records are stored in centralized databases
- Records can be:
  - modified
  - deleted
  - disputed
- Verification depends entirely on the platform’s backend
- Third parties (auditors, legal entities, regulators) must **trust the platform**

This creates problems:
- ❌ Single point of failure
- ❌ Difficult dispute resolution
- ❌ No independent verification
- ❌ Risk of data tampering

---

## Why NFT-Based Lease Certificates?

An **NFT (Non-Fungible Token)** is:
- Unique
- Immutable
- Publicly verifiable
- Cryptographically secured

In AtLease, **each lease = one NFT certificate**.

The NFT represents:
- Proof that a lease was issued
- Proof of when it was issued
- Proof of who it was issued to
- Proof that the record has not been altered

> The NFT is **not** an asset for trading.  
> It is a **digital certificate**, similar to a registered property or legal document.

---

## Why Non-Transferable NFTs?

Lease certificates **must not be transferable**, because:

- A lease cannot be sold or transferred without legal process
- Ownership should remain bound to the original lessee
- Trading lease certificates would break real-world semantics

### How This Is Enforced

- The smart contract explicitly **blocks all transfers**
- NFTs are **soulbound-style**
- Ownership is permanent unless explicitly revoked (not implemented in demo)

This design aligns blockchain behavior with **real-world leasing rules**.

---

## Why Blockchain at All?

Blockchain is used **only where it adds real value**.

### Blockchain Provides:
- **Immutability** – records cannot be changed after issuance
- **Public verification** – anyone can independently verify a lease
- **Timestamping** – cryptographic proof of issuance time
- **Ownership proof** – tied to a cryptographic wallet, not a database row

### Blockchain Does NOT Handle:
- Payments (UPI is used off-chain)
- User authentication
- Business logic
- Pricing

This avoids unnecessary complexity and gas costs.

---

## Why IPFS Is Used

Storing full lease data on-chain is:
- Expensive
- Inefficient
- Bad practice

Instead, AtLease uses **IPFS (InterPlanetary File System)**.

### Architecture:
- Lease metadata is stored on IPFS
- Blockchain stores only the **IPFS CID**
- Any change to metadata changes the hash, making tampering detectable

This provides:
- Decentralized storage
- Content-addressed integrity
- Low cost
- Scalability

---

## High-Level Architecture


Frontend (React)
|
| Lease request
v
Backend (Spring Boot)
|
| Payment verified (UPI)
v
Blockchain Service (Node.js)
|
| Upload metadata → IPFS
| Mint NFT → Polygon Amoy
v
Blockchain + IPFS

---

## Why Polygon PoS (Amoy Testnet)?

Polygon PoS was chosen because:
- Ethereum-compatible (Solidity, ERC-721)
- Very low gas cost
- Fast confirmation
- Widely supported tooling
- Ideal for NFT-based certificates

### Network Choice:
- **Polygon PoS**
- **Amoy testnet** (for development & demo)
- Mainnet-ready with no code changes

---

## What Exactly Is Stored Where?

### On Blockchain
- Token ID
- Owner wallet address
- IPFS metadata URI
- Immutable issuance record

### On IPFS
- Lease ID
- Warehouse ID
- Lessee name
- Lease start & end dates
- Issuer information

### On Backend Database
- Payment records
- Internal user IDs
- Business logic state

---

## Security & Trust Model

- Only the **platform wallet** can mint certificates
- Users cannot create fake certificates
- Private keys are never exposed to frontend
- NFT ownership is cryptographically verifiable
- No centralized authority can alter issued certificates

---

## Common Questions & Answers (For Viva / Review)

### Q: Why not just use a database?
**A:** Databases are mutable and require trust in the platform. Blockchain provides tamper-proof, independently verifiable records.

---

### Q: Why use NFTs instead of normal blockchain transactions?
**A:** NFTs naturally represent unique certificates with ownership semantics, making them ideal for lease documentation.

---

### Q: Why are payments not on blockchain?
**A:** Blockchain payments add cost and complexity without benefit here. UPI is faster, cheaper, and legally accepted in India.

---

### Q: Can certificates be transferred?
**A:** No. The contract explicitly blocks transfers to reflect real-world lease rules.

---

### Q: What happens if the platform shuts down?
**A:** Lease certificates remain accessible and verifiable on the blockchain and IPFS.

---

### Q: Is this system scalable?
**A:** Yes. Only lightweight metadata hashes are stored on-chain, keeping costs minimal.

---

## Current Status

- Smart contract deployed on Polygon Amoy
- Non-transferable lease NFTs implemented
- Minting successfully tested
- IPFS integration planned next

---

## Disclaimer

This project is built for **academic and demonstration purposes**.
Mainnet deployment would require:
- Formal audits
- Key management hardening
- Legal compliance checks

---

## Conclusion

AtLease demonstrates a **practical, non-hyped use of blockchain**:
- NFTs as certificates, not assets
- Blockchain as proof infrastructure, not a payment system
- Decentralization where it matters, simplicity where it doesn’t

---
