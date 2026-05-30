import React from 'react';
import { BLOCK_EXPLORER, CONTRACT_ADDRESS } from '../data/demoData';

/**
 * Certificate View Component
 * Displays full certificate details in a professional card format
 */
const CertificateView = ({ metadata, tokenId, txHash, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </button>

        {/* Certificate Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-primary-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 text-center">
            <div className="inline-block p-3 bg-white/20 rounded-full mb-4">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">{metadata.name}</h1>
            <p className="text-primary-100">{metadata.description}</p>
          </div>

          <div className="p-8">
            {/* Certificate ID */}
            <div className="mb-8 text-center">
              <div className="inline-block px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg">
                <span className="text-sm text-primary-700 font-semibold">
                  Certificate ID: {metadata.certificate_id}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Lessee Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                  Lessee Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Name</div>
                    <div className="text-gray-900 font-medium">
                      {metadata.lessee.display_name}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Reference ID</div>
                    <div className="text-gray-900 font-mono text-sm">
                      {metadata.lessee.lessee_reference_id}
                    </div>
                  </div>
                </div>
              </div>

              {/* Warehouse Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                  Warehouse Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Warehouse ID</div>
                    <div className="text-gray-900 font-medium">
                      {metadata.warehouse.warehouse_id}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Location</div>
                    <div className="text-gray-900 font-medium">
                      {metadata.warehouse.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lease Terms */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                  Lease Terms
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Start Date</div>
                    <div className="text-gray-900 font-medium">
                      {new Date(metadata.lease_terms.start_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">End Date</div>
                    <div className="text-gray-900 font-medium">
                      {new Date(metadata.lease_terms.end_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Duration</div>
                    <div className="text-gray-900 font-medium">
                      {metadata.lease_terms.duration_months} months
                    </div>
                  </div>
                </div>
              </div>

              {/* Blockchain Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                  Blockchain Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Network</div>
                    <div className="text-gray-900 font-medium">
                      {metadata.blockchain.network}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Token Standard</div>
                    <div className="text-gray-900 font-medium">
                      {metadata.blockchain.token_standard}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Token ID</div>
                    <div className="text-gray-900 font-medium">#{tokenId}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issuer Information */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
              <h3 className="text-sm font-semibold text-primary-900 uppercase mb-4">
                Issued By
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-primary-700">Platform</div>
                  <div className="text-primary-900 font-medium">
                    {metadata.issuer.platform}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-primary-700">Issued By</div>
                  <div className="text-primary-900 font-medium">
                    {metadata.issuer.issued_by}
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              <span className="px-4 py-2 bg-red-100 text-red-800 text-sm font-semibold rounded-full border border-red-200">
                🔒 Non-Transferable
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-full border border-green-200">
                ✓ Blockchain Verified
              </span>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full border border-blue-200">
                📦 IPFS Stored
              </span>
            </div>

            {/* Contract Address */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-xs text-gray-500 mb-2">Contract Address</div>
              <div className="font-mono text-xs text-gray-900 break-all">
                {CONTRACT_ADDRESS}
              </div>
            </div>

            {/* View on Explorer Button */}
            <div className="flex justify-center">
              <a
                href={`${BLOCK_EXPLORER}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Verify on Blockchain Explorer
              </a>
            </div>

            {/* Footer Note */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
              Version {metadata.version} • Generated using AtLease Platform Demo •
              This certificate is immutable and stored on blockchain
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
