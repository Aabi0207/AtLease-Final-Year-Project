import React from 'react';

/**
 * Hero section with project description
 * Displays welcome message and platform overview
 */
const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">
            Warehouse Leasing Platform
          </h2>
          <p className="text-xl text-primary-100 mb-2">
            Blockchain-Based Lease Certificate Demo
          </p>
          <p className="text-primary-200 max-w-2xl mx-auto">
            Experience secure, non-transferable digital lease certificates powered by
            blockchain technology. Each lease is minted as an NFT on Polygon PoS with
            metadata stored on IPFS.
          </p>
          
          <div className="mt-8 flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold">4</div>
              <div className="text-primary-200 text-sm">Demo Warehouses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">ERC-721</div>
              <div className="text-primary-200 text-sm">Token Standard</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">IPFS</div>
              <div className="text-primary-200 text-sm">Metadata Storage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
