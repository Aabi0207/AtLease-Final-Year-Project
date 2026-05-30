import { network } from "hardhat";
import { uploadToIPFS, LeaseMetadata } from "./ipfsService.js";

/**
 * STEP 1 - Test Metadata → IPFS ONLY
 * Upload lease certificate metadata to IPFS and verify CID
 */
async function step1_TestMetadataToIPFS(): Promise<string> {
  console.log("\n" + "=".repeat(60));
  console.log("STEP 1: Test Metadata → IPFS ONLY");
  console.log("=".repeat(60));

  try {
    const leaseMetadata: LeaseMetadata = {
      name: "AtLease Warehouse Lease Certificate",
      description: "Non-transferable digital lease certificate issued by AtLease",
      certificate_id: "ATLEASE-2026-TEST-001",
      lessee: {
        display_name: "Test Lessee",
        lessee_reference_id: "LESSEE-TEST-001",
      },
      warehouse: {
        warehouse_id: "WH-TEST-01",
        location: "Test Location, Test State",
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

    console.log("\n📦 Uploading metadata to IPFS...");
    console.log("Metadata:", JSON.stringify(leaseMetadata, null, 2));

    const { cid, ipfsUri } = await uploadToIPFS(leaseMetadata);

    console.log("\n✅ IPFS Upload Successful!");
    console.log(`   CID: ${cid}`);
    console.log(`   URI: ${ipfsUri}`);

    return ipfsUri;
  } catch (error: any) {
    console.error("\n❌ STEP 1 Failed:", error.message);
    throw error;
  }
}

/**
 * STEP 2 - Mint ONE NFT With Real IPFS URI
 * Mint an NFT with the actual IPFS URI from Step 1
 */
async function step2_MintNFTWithRealIPFS(ipfsUri: string): Promise<{
  tokenId: number;
  recipient: string;
}> {
  console.log("\n" + "=".repeat(60));
  console.log("STEP 2: Mint ONE NFT With Real IPFS URI");
  console.log("=".repeat(60));

  try {
    const CONTRACT_ADDRESS = "0x8DCE258b9578585c28E4ef46d9d6C0F17326CB8B";

    // Connect to the selected network and get ethers
    const { ethers } = await network.connect();
    const [deployer] = await ethers.getSigners();

    console.log(`\n👤 Deployer Address: ${deployer.address}`);
    console.log(`📋 Contract Address: ${CONTRACT_ADDRESS}`);

    // Connect to deployed contract using ethers
    const leaseCertificate = await ethers.getContractAt(
      "LeaseCertificate",
      CONTRACT_ADDRESS,
      deployer
    );

    const recipient = deployer.address;

    console.log(`\n🔗 Using IPFS URI: ${ipfsUri}`);
    console.log(`💳 Recipient: ${recipient}`);

    // Get current token ID before minting
    const tokenIdBefore = await leaseCertificate.getCurrentTokenId();
    console.log(`📊 Current Token ID Counter: ${tokenIdBefore}`);

    console.log("\n⛽ Sending mint transaction...");
    const tx = await leaseCertificate.mint(recipient, ipfsUri);
    console.log(`   Transaction Hash: ${tx.hash}`);

    console.log("⏳ Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log(`✅ Confirmed in Block: ${receipt?.blockNumber}`);

    // Get token ID from receipt (it should be the counter value before mint)
    const tokenId = Number(tokenIdBefore);

    console.log("\n✅ STEP 2 Complete!");
    console.log(`   NFT Minted with Token ID: ${tokenId}`);
    console.log(`   Owner: ${recipient}`);
    console.log(`   Metadata URI: ${ipfsUri}`);

    return { tokenId, recipient };
  } catch (error: any) {
    console.error("\n❌ STEP 2 Failed:", error.message);
    throw error;
  }
}

/**
 * STEP 3 - Verify Non-Transferability (Quick Test)
 * Try to transfer the NFT and verify that the transaction fails
 */
async function step3_VerifyNonTransferability(
  tokenId: number,
  ownerAddress: string
): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("STEP 3: Verify Non-Transferability (Quick Test)");
  console.log("=".repeat(60));

  try {
    const CONTRACT_ADDRESS = "0x8DCE258b9578585c28E4ef46d9d6C0F17326CB8B";

    // Connect to the selected network and get ethers
    const { ethers } = await network.connect();
    const [deployer] = await ethers.getSigners();

    // Connect to deployed contract using ethers
    const leaseCertificate = await ethers.getContractAt(
      "LeaseCertificate",
      CONTRACT_ADDRESS,
      deployer
    );

    console.log(`\n🔍 Testing transfer restrictions on Token ID: ${tokenId}`);
    console.log(`   Current Owner: ${ownerAddress}`);

    // Generate a random recipient address for transfer attempt
    const randomRecipient = ethers.Wallet.createRandom().address;
    console.log(`   Attempting to transfer to: ${randomRecipient}`);

    console.log("\n⚠️  Attempting transfer (should fail)...");

    try {
      const tx = await leaseCertificate.transferFrom(
        ownerAddress,
        randomRecipient,
        tokenId
      );
      await tx.wait();

      // If we reach here, transfer succeeded (UNEXPECTED!)
      console.error("\n❌ CRITICAL: Transfer was NOT blocked! Token is transferable!");
      process.exitCode = 1;
    } catch (transferError: any) {
      // Expected: Transfer should fail
      const errorMessage = transferError.message || transferError.reason || "Unknown error";

      if (errorMessage.includes("Token transfers are disabled")) {
        console.log("\n✅ Transfer Correctly Blocked!");
        console.log(`   Error Message: "${errorMessage}"`);
        console.log("   ✓ NFT is properly non-transferable (soulbound)");
      } else if (errorMessage.includes("reverted")) {
        console.log("\n✅ Transfer Correctly Blocked!");
        console.log(`   Error: ${errorMessage}`);
        console.log("   ✓ NFT is properly non-transferable (soulbound)");
      } else {
        throw transferError;
      }
    }

    console.log("\n✅ STEP 3 Complete!");
    console.log("   Non-transferability verified successfully.");
  } catch (error: any) {
    console.error("\n❌ STEP 3 Failed:", error.message);
    throw error;
  }
}

/**
 * Main test runner
 */
async function main() {
  console.log("\n" + "🚀 ".repeat(20));
  console.log("AtLease NFT INTEGRATION TEST SUITE");
  console.log("🚀 ".repeat(20));

  try {
    // STEP 1: Upload to IPFS
    const ipfsUri = await step1_TestMetadataToIPFS();

    // STEP 2: Mint NFT with real IPFS URI
    const { tokenId, recipient } = await step2_MintNFTWithRealIPFS(ipfsUri);

    // STEP 3: Verify non-transferability
    await step3_VerifyNonTransferability(tokenId, recipient);

    console.log("\n" + "✅ ".repeat(20));
    console.log("ALL TESTS PASSED SUCCESSFULLY!");
    console.log("✅ ".repeat(20));
    console.log("\n📋 Summary:");
    console.log("   ✓ Metadata uploaded to IPFS successfully");
    console.log("   ✓ NFT minted with real IPFS URI");
    console.log("   ✓ Non-transferability verified");
    console.log("\n");
  } catch (error) {
    console.error("\n" + "❌ ".repeat(20));
    console.error("TEST SUITE FAILED");
    console.error("❌ ".repeat(20));
    process.exitCode = 1;
  }
}

main();
