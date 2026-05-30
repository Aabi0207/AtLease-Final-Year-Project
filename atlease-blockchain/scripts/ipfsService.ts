import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * Lessee information
 */
export interface Lessee {
  display_name: string;
  lessee_reference_id: string;
}

/**
 * Warehouse information
 */
export interface Warehouse {
  warehouse_id: string;
  location: string;
}

/**
 * Lease terms
 */
export interface LeaseTerms {
  start_date: string; // ISO 8601 format: YYYY-MM-DD
  end_date: string; // ISO 8601 format: YYYY-MM-DD
  duration_months: number;
}

/**
 * Issuer information
 */
export interface Issuer {
  platform: string;
  issued_by: string;
}

/**
 * Blockchain information
 */
export interface BlockchainInfo {
  network: string;
  token_standard: string;
  transferable: boolean;
}

/**
 * AtLease warehouse lease certificate metadata structure
 */
export interface LeaseMetadata {
  name: string;
  description: string;
  certificate_id: string;
  lessee: Lessee;
  warehouse: Warehouse;
  lease_terms: LeaseTerms;
  issuer: Issuer;
  blockchain: BlockchainInfo;
  version: string;
  [key: string]: any; // Allow additional custom fields
}

/**
 * IPFS upload response
 */
export interface IPFSUploadResponse {
  cid: string;
  ipfsUri: string;
}

/**
 * Uploads lease metadata to IPFS using Pinata API (pinJSONToIPFS)
 * 
 * @param metadata - The lease metadata object to upload
 * @returns Promise containing the IPFS CID and URI
 * @throws Error if upload fails or credentials are missing
 */
export async function uploadToIPFS(
  metadata: LeaseMetadata
): Promise<IPFSUploadResponse> {
  const jwt = process.env.PINATA_JWT;
  const apiKey = process.env.PINATA_API_KEY;
  const apiSecret = process.env.PINATA_API_SECRET;

  // Check for authentication credentials (JWT preferred)
  if (!jwt && (!apiKey || !apiSecret)) {
    throw new Error(
      "Missing Pinata credentials. Please set either:\n" +
      "  - PINATA_JWT (recommended), or\n" +
      "  - Both PINATA_API_KEY and PINATA_API_SECRET\n" +
      "Get your credentials from: https://app.pinata.cloud/developers/api-keys"
    );
  }

  try {
    if (jwt) {
      // Use Pinata V3 API (works with "Files" Write permission)
      const url = "https://uploads.pinata.cloud/v3/files";
      
      // Create JSON string
      const jsonString = JSON.stringify(metadata, null, 2);
      const boundary = `----WebKitFormBoundary${Date.now()}`;
      const filename = `lease-${Date.now()}.json`;
      
      // Build multipart/form-data manually
      const body = [
        `--${boundary}`,
        `Content-Disposition: form-data; name="file"; filename="${filename}"`,
        `Content-Type: application/json`,
        '',
        jsonString,
        `--${boundary}--`
      ].join('\r\n');
      
      const response = await axios.post(url, body, {
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
        },
      });
      
      // V3 API returns different response structure
      const cid = response.data.data.cid;
      const ipfsUri = `ipfs://${cid}`;

      console.log(`✓ Metadata uploaded to IPFS successfully (V3 API)`);
      console.log(`  CID: ${cid}`);
      console.log(`  URI: ${ipfsUri}`);

      return { cid, ipfsUri };
      
    } else {
      // Use legacy API with API Key + Secret
      const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

      const data = {
        pinataContent: metadata,
        pinataMetadata: {
          name: `lease-${Date.now()}.json`,
        },
        pinataOptions: {
          cidVersion: 1,
        },
      };

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "pinata_api_key": apiKey!,
        "pinata_secret_api_key": apiSecret!,
      };

      const response = await axios.post(url, data, { headers });
    }

    const cid = response.data.IpfsHash;
    const ipfsUri = `ipfs://${cid}`;

    console.log(`✓ Metadata uploaded to IPFS successfully`);
    console.log(`  CID: ${cid}`);
    console.log(`  URI: ${ipfsUri}`);

    return {
      cid,
      ipfsUri,
    };
  } catch (error: any) {
    // Handle errors gracefully
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      const message = typeof errorData === 'object' 
        ? JSON.stringify(errorData, null, 2) 
        : (errorData || error.message);
      
      console.error("\n🔍 Pinata API Error Details:");
      console.error(`   Status: ${status}`);
      console.error(`   Response:`, errorData);
      
      if (status === 403 && errorData?.error?.reason === 'NO_SCOPES_FOUND') {
        console.error("\n💡 Solution:");
        console.error("   1. Go to https://app.pinata.cloud/developers/api-keys");
        console.error("   2. Create a new API key with 'pinFileToIPFS' permission");
        console.error("   3. Use the JWT token in your .env file as PINATA_JWT");
      }
      
      throw new Error(
        `Failed to upload to IPFS (HTTP ${status}): ${message}`
      );
    }
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
}

/**
 * Example usage (for reference):
 * 
 * const metadata: LeaseMetadata = {
 *   name: "Lease Certificate #1",
 *   description: "Digital lease certificate for property at 123 Main St",
 *   attributes: [
 *     { trait_type: "Property Address", value: "123 Main St" },
 *     { trait_type: "Lease Duration", value: "12 months" },
 *     { trait_type: "Monthly Rent", value: "$2000" }
 *   ]
 * };
 * 
 * const result = await uploadToIPFS(metadata);
 * console.log(result.ipfsUri); // ipfs://Qm...
 */
