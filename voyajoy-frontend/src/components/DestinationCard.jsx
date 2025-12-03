import { Link } from "react-router-dom"

const DestinationCard = ({destination}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-pink-100">
      {/* Image with Gradient Overlay */}
      <div className="relative overflow-hidden group">
        <img 
          src={destination.image}        
          alt={destination.destinationName}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <div className="p-6">
        {/* Title */}
        <h3 className="text-2xl font-bold mb-3 text-gray-800 hover:text-purple-700 transition">
          {destination.destinationName}
        </h3>

        {/* Location */}
        <p className="text-gray-600 text-sm mb-4 flex items-center gap-2">
          <span className="text-lg">📍</span>
          {destination.location}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-gray-500">Starting from</p>
            <p className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> 
              ₹{destination.totalBudget}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">per person</p>
          </div>
        </div>

        {/* Button */}
        <Link 
          to={`/destinations/${destination.destinatonId}`}
          className="block w-full bg-linear-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl text-center font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default DestinationCard;