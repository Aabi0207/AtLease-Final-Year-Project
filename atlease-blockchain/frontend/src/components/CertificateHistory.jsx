import React from 'react';
import { BLOCK_EXPLORER } from '../data/demoData';

/**
 * Certificate History Component
 * Shows all minted lease certificates
 */
const CertificateHistory = ({ certificates, onViewCertificate, onClose }) => {
  if (certificates.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Certificate History</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Yet</h3>
            <p className="text-gray-600">Start by generating your first lease certificate</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Certificate History</h2>
              <p className="text-gray-600">{certificates.length} certificate(s) minted</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            {certificates.map((cert, index) => (
              <div key={cert.id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {cert.metadata.lessee.display_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {cert.metadata.warehouse.location} • {cert.metadata.warehouse.warehouse_id}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Token #{cert.tokenId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Certificate ID</span>
                    <div className="font-medium text-gray-900">{cert.metadata.certificate_id}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration</span>
                    <div className="font-medium text-gray-900">
                      {cert.metadata.lease_terms.duration_months} months
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Start Date</span>
                    <div className="font-medium text-gray-900">
                      {new Date(cert.metadata.lease_terms.start_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Minted</span>
                    <div className="font-medium text-gray-900">
                      {new Date(cert.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <a
                    href={`${BLOCK_EXPLORER}/tx/${cert.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    View TX
                  </a>
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${cert.ipfsCID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                  >
                    View IPFS
                  </a>
                </div>

                <button
                  onClick={() => onViewCertificate(cert)}
                  className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  View Full Certificate
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateHistory;
