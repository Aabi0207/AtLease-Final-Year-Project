import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WarehouseCard from './components/WarehouseCard';
import LeaseModal from './components/LeaseModal';
import CertificateResult from './components/CertificateResult';
import CertificateView from './components/CertificateView';
import CertificateHistory from './components/CertificateHistory';
import { demoWarehouses, CONTRACT_ADDRESS } from './data/demoData';

const API_BASE_URL = 'http://localhost:3001';

/**
 * Main App Component
 * Manages the application state and orchestrates the flow
 */
function App() {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [certificateData, setCertificateData] = useState(null);
  const [showCertificateView, setShowCertificateView] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load certificates on mount
  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/certificates`);
      const data = await response.json();
      if (data.success) {
        setCertificates(data.certificates);
      }
    } catch (err) {
      console.error('Failed to fetch certificates:', err);
    }
  };

  /**
   * Real function to mint certificate on blockchain
   * Calls backend API which executes actual blockchain transaction
   */
  const handleGenerateCertificate = async (leaseData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔗 Calling blockchain API...');
      
      const response = await fetch(`${API_BASE_URL}/api/mint-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leaseData }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to mint certificate');
      }

      console.log('✅ Certificate minted successfully!', data);

      // Set certificate data from real blockchain response
      setCertificateData({
        tokenId: data.tokenId,
        txHash: data.txHash,
        ipfsCID: data.ipfsCID,
        metadata: data.metadata,
      });

      // Refresh certificates list
      await fetchCertificates();

      // Close the lease modal
      setSelectedWarehouse(null);
      
    } catch (err) {
      console.error('❌ Minting error:', err);
      setError(err.message || 'Failed to mint certificate. Make sure the API server is running.');
      alert(`Error: ${err.message}\n\nMake sure to start the API server:\ncd api && npm install && npm start`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCertificate = () => {
    setShowCertificateView(true);
    setCertificateData(null); // Close the result modal
  };

  const handleViewCertificateFromHistory = (cert) => {
    setCertificateData(cert);
    setShowCertificateView(true);
    setShowHistory(false);
  };

  const handleBackToDashboard = () => {
    setShowCertificateView(false);
    setCertificateData(null);
  };

  const handleCloseCertificateResult = () => {
    setCertificateData(null);
  };

  // If viewing certificate details
  if (showCertificateView && certificateData) {
    return (
      <CertificateView
        metadata={certificateData.metadata}
        tokenId={certificateData.tokenId}
        txHash={certificateData.txHash}
        onBack={handleBackToDashboard}
      />
    );
  }

  // Main dashboard view
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />

      {/* Action Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View All Certificates ({certificates.length})
          </button>
        </div>
      </div>

      {/* Warehouses Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Available Warehouses
          </h2>
          <p className="text-gray-600">
            Select a warehouse to generate a blockchain lease certificate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demoWarehouses.map((warehouse) => (
            <WarehouseCard
              key={warehouse.id}
              warehouse={warehouse}
              onLeaseClick={setSelectedWarehouse}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">AtLease Platform</h3>
              <p className="text-sm text-gray-600">
                Blockchain-based warehouse leasing platform demo for final year
                engineering project.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Technology Stack</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Polygon PoS Blockchain</li>
                <li>• IPFS (via Pinata)</li>
                <li>• ERC-721 NFT Standard</li>
                <li>• React + Vite</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Contract Info</h3>
              <p className="text-xs text-gray-600 font-mono break-all">
                {CONTRACT_ADDRESS}
              </p>
              <p className="text-xs text-gray-500 mt-2">Polygon Amoy Testnet</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>
              © 2026 AtLease Demo • Final Year Engineering Project • For
              Educational Purposes Only
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedWarehouse && (
        <LeaseModal
          warehouse={selectedWarehouse}
          onClose={() => setSelectedWarehouse(null)}
          onGenerateCertificate={handleGenerateCertificate}
          isLoading={isLoading}
        />
      )}

      {certificateData && !showCertificateView && (
        <CertificateResult
          certificateData={certificateData}
          onViewCertificate={handleViewCertificate}
          onClose={handleCloseCertificateResult}
        />
      )}

      {showHistory && (
        <CertificateHistory
          certificates={certificates}
          onViewCertificate={handleViewCertificateFromHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

export default App;
