import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Target, CheckCircle2, Clock } from 'lucide-react';

const WarehouseCard = ({ warehouse }) => {
  const {
    id,
    title,
    city,
    state,
    price_per_month,
    capacity,
    is_available,
    available_from,
    media
  } = warehouse;

  const thumbnail = media && media.length > 0 ? media[0].file : null;

  return (
    <Link 
      to={`/warehouses/${id}`}
      className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Target className="w-12 h-12 mb-2 opacity-20" />
            <span className="text-sm font-medium">No image</span>
          </div>
        )}
        
        {/* Availability Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          {is_available ? (
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              Available
            </span>
          ) : (
            <span className="bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center">
              <span className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
              Occupied
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-gray-600 transition-colors">
            {title}
          </h3>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 shrink-0" />
          <span className="truncate">{city}, {state}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Price / Mo</p>
            <p className="font-bold text-gray-900 flex items-center">
              <DollarSign className="w-4 h-4" />
              {Number(price_per_month).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Capacity</p>
            <p className="font-bold text-gray-900 flex items-center">
              <Target className="w-4 h-4 mr-1.5 text-gray-400" />
              {Number(capacity).toLocaleString()} <span className="text-xs text-gray-500 font-normal ml-1">sq ft</span>
            </p>
          </div>
        </div>

        {/* Footer / Action */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm font-medium">
            {is_available ? (
              <span className="text-green-600 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Ready to book
              </span>
            ) : (
              <span className="text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1.5" /> Avail. {new Date(available_from).toLocaleDateString()}
              </span>
            )}
          </div>
          <span className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors ${is_available ? 'bg-gray-900 text-white group-hover:bg-gray-800' : 'bg-gray-100 text-gray-400'}`}>
            {is_available ? 'Book Now' : 'View Details'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default WarehouseCard;