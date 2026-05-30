import React from 'react';
import { CONTRACT_ADDRESS, BLOCK_EXPLORER } from '../data/demoData';

/**
 * Certificate Result Component
 * Displays success message with blockchain transaction details
 */
const CertificateResult = ({ certificateData, onViewCertificate, onClose }) => {
  const { tokenId, txHash, ipfsCID, metadata } = certificateData;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Lease Certificate Generated!
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Your blockchain-based lease certificate has been successfully created
          </p>

          {/* Certificate Details */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-600">Token ID</span>
                <button
                  onClick={() => copyToClipboard(tokenId.toString())}
                  className="text-primary-600 hover:text-primary-700 text-xs"
                >
                  Copy
                </button>
              </div>
              <div className="font-mono text-gray-900 font-semibold">
                #{tokenId}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-600">Contract Address</span>
                <button
                  onClick={() => copyToClipboard(CONTRACT_ADDRESS)}
                  className="text-primary-600 hover:text-primary-700 text-xs"
                >
                  Copy
                </button>
              </div>
              <div className="font-mono text-xs text-gray-900 break-all">
                {CONTRACT_ADDRESS}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-600">Transaction Hash</span>
                <button
                  onClick={() => copyToClipboard(txHash)}
                  className="text-primary-600 hover:text-primary-700 text-xs"
                >
                  Copy
                </button>
              </div>
              <div className="font-mono text-xs text-gray-900 break-all">
                {txHash}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-600">IPFS CID</span>
                <button
                  onClick={() => copyToClipboard(ipfsCID)}
                  className="text-primary-600 hover:text-primary-700 text-xs"
                >
                  Copy
                </button>
              </div>
              <div className="font-mono text-xs text-gray-900 break-all">
                {ipfsCID}
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <a
              href={`${BLOCK_EXPLORER}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
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
              View on Polygonscan
            </a>

            <a
              href={`https://gateway.pinata.cloud/ipfs/${ipfsCID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View IPFS Metadata
            </a>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
              ✓ Non-Transferable NFT
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              ERC-721
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
              Polygon PoS
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onViewCertificate}
              className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              View Certificate Details
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateResult;
