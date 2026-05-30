import { network } from "hardhat";
import { uploadToIPFS, LeaseMetadata } from "./ipfsService.js";

async function main() {
  const CONTRACT_ADDRESS = "0x8DCE258b9578585c28E4ef46d9d6C0F17326CB8B";

  // Hardhat v3 network connection providing ethers runtime
  const { ethers } = await network.connect();
  const [deployer] = await ethers.getSigners();

  // Connect to deployed contract using ethers
  const leaseCertificate = await ethers.getContractAt(
    "LeaseCertificate",
    CONTRACT_ADDRESS,
    deployer
  );

  // Demo user wallet (can be your own MetaMask address for now)
  const recipient = deployer.address;

  // Create lease metadata
  const leaseMetadata: LeaseMetadata = {
    name: "AtLease Warehouse Lease Certificate",
    description: "Non-transferable digital lease certificate issued by AtLease",
    certificate_id: "ATLEASE-2026-0001",
    lessee: {
      display_name: "John Doe",
      lessee_reference_id: "LESSEE-1029",
    },
    warehouse: {
      warehouse_id: "WH-21",
      location: "Pune, Maharashtra",
    },
    lease_terms: {
      start_date: "2026-02-01",
      end_date: "2027-01-31",
      duration_months: 12,
    },
    issuer: {
      platform: "AtLease",
      issued_by: "AtLease Platform Wallet",
    },
    blockchain: {
      network: "Polygon PoS",
      token_standard: "ERC-721",
      transferable: false,
    },
    version: "1.0",
  };

  // Upload metadata to IPFS and get tokenURI
  console.log("Uploading lease metadata to IPFS...");
  const { ipfsUri } = await uploadToIPFS(leaseMetadata);
  const tokenURI = ipfsUri;

  console.log("Minting lease certificate...");
  const tx = await leaseCertificate.mint(recipient, tokenURI);
  console.log("Mint transaction sent:", tx.hash);
  const receipt = await tx.wait();
  console.log("Mint transaction confirmed in block:", receipt?.blockNumber);

  console.log("Lease certificate minted successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
