import React from 'react';
import { formatINR } from '../data/demoData';

/**
 * Warehouse card component
 * Displays individual warehouse details with lease button
 */
const WarehouseCard = ({ warehouse, onLeaseClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
        <img
          src={warehouse.image}
          alt={warehouse.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 rounded-full">
            ID: {warehouse.id}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {warehouse.name}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-4">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-sm">{warehouse.location}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Size</span>
            <div className="font-semibold text-gray-900">
              {warehouse.size.toLocaleString()} sq. ft.
            </div>
          </div>
          <div>
            <span className="text-gray-500">Monthly Rent</span>
            <div className="font-semibold text-gray-900">
              {formatINR(warehouse.monthlyRent)}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {warehouse.features.map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {feature}
            </span>
          ))}
        </div>
        
        <button
          onClick={() => onLeaseClick(warehouse)}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Lease Now
        </button>
      </div>
    </div>
  );
};

export default WarehouseCard;
