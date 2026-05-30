import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Store for lease certificates (in-memory, for demo)
// In production, use a database
let certificates = [];

/**
 * Mint a new lease certificate on blockchain
 * This actually calls your scripts to mint NFT with IPFS
 */
app.post('/api/mint-certificate', async (req, res) => {
  try {
    const { leaseData } = req.body;
    
    console.log('📝 Received mint request for:', leaseData.lessee.display_name);

    // Create metadata in the format your ipfsService expects
    const metadata = {
      name: "AtLease Warehouse Lease Certificate",
      description: "Non-transferable digital lease certificate issued by AtLease",
      certificate_id: `ATLEASE-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      lessee: leaseData.lessee,
      warehouse: {
        warehouse_id: leaseData.warehouse.id,
        location: leaseData.warehouse.location,
      },
      lease_terms: leaseData.lease_terms,
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

    // Create temporary minting script with this specific data
    const mintScriptPath = join(__dirname, '..', 'scripts', 'mint-dynamic.ts');
    const mintScript = `
import { network } from "hardhat";
import { uploadToIPFS } from "./ipfsService";

async function main() {
  const CONTRACT_ADDRESS = "0x8DCE258b9578585c28E4ef46d9d6C0F17326CB8B";
  
  const { ethers } = await network.connect();
  const [deployer] = await ethers.getSigners();
  
  const leaseCertificate = await ethers.getContractAt(
    "LeaseCertificate",
    CONTRACT_ADDRESS,
    deployer
  );
  
  const recipient = deployer.address;
  
  const leaseMetadata = ${JSON.stringify(metadata, null, 2)};
  
  console.log("📦 Uploading lease metadata to IPFS...");
  const { ipfsUri, cid } = await uploadToIPFS(leaseMetadata);
  console.log("✓ IPFS upload complete");
  
  console.log("⛓️  Minting lease certificate on blockchain...");
  const tx = await leaseCertificate.mint(recipient, ipfsUri);
  console.log("✓ Transaction sent:", tx.hash);
  
  const receipt = await tx.wait();
  console.log("✓ Transaction confirmed in block:", receipt?.blockNumber);
  
  // Get token ID from the current counter (it was incremented after mint)
  const currentTokenId = await leaseCertificate.getCurrentTokenId();
  const tokenId = Number(currentTokenId) - 1;
  
  // Output result as JSON on a single line for parsing
  const resultData = {
    success: true,
    tokenId: tokenId,
    txHash: tx.hash,
    ipfsCID: cid,
    metadata: leaseMetadata
  };
  
  console.log("===RESULT_START===");
  console.log(JSON.stringify(resultData));
  console.log("===RESULT_END===");
}

main().catch((error) => {
  console.log("===RESULT_START===");
  console.log(JSON.stringify({ success: false, error: error.message }));
  console.log("===RESULT_END===");
  process.exitCode = 1;
});
`;

    // Write temporary script
    await fs.writeFile(mintScriptPath, mintScript);

    // Execute hardhat script
    console.log('⛓️  Executing blockchain minting...');
    const { stdout, stderr } = await execAsync(
      `cd ${join(__dirname, '..')} && npx hardhat run scripts/mint-dynamic.ts --network polygonAmoy`,
      { maxBuffer: 1024 * 1024 * 10 }
    );

    // Clean up temporary script
    await fs.unlink(mintScriptPath).catch(() => {});

    console.log('📤 Script executed successfully');

    // Parse the output to get the result between markers
    const resultMatch = stdout.match(/===RESULT_START===([\s\S]*?)===RESULT_END===/);
    
    if (!resultMatch) {
      console.error('❌ Could not find result markers in output');
      console.error('Full output:', stdout);
      throw new Error('Failed to parse minting result - no result markers found');
    }

    const resultJson = resultMatch[1].trim();
    const result = JSON.parse(resultJson);

    if (!result || !result.success) {
      throw new Error(result?.error || 'Minting failed on blockchain');
    }

    // Store certificate in memory
    const certificate = {
      id: certificates.length + 1,
      ...result,
      timestamp: new Date().toISOString(),
    };
    
    certificates.push(certificate);

    console.log('✅ Certificate minted successfully! Token ID:', result.tokenId);

    res.json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error('❌ Minting error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to mint certificate'
    });
  }
});

/**
 * Get all minted certificates
 */
app.get('/api/certificates', (req, res) => {
  res.json({
    success: true,
    certificates: certificates,
    count: certificates.length
  });
});

/**
 * Get specific certificate by ID
 */
app.get('/api/certificates/:id', (req, res) => {
  const cert = certificates.find(c => c.id === parseInt(req.params.id));
  
  if (!cert) {
    return res.status(404).json({
      success: false,
      error: 'Certificate not found'
    });
  }
  
  res.json({
    success: true,
    certificate: cert
  });
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AtLease API is running',
    certificates: certificates.length
  });
});

app.listen(PORT, () => {
  console.log('🚀 AtLease API Server Started');
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`💾 Certificates in memory: ${certificates.length}`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`  POST   http://localhost:${PORT}/api/mint-certificate`);
  console.log(`  GET    http://localhost:${PORT}/api/certificates`);
  console.log(`  GET    http://localhost:${PORT}/api/certificates/:id`);
  console.log(`  GET    http://localhost:${PORT}/api/health`);
});
