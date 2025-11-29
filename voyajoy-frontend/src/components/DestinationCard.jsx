import { Link } from "react-router-dom"

const DestinationCard = ({destination}) => {

    return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img src={destination.image}        
        alt={destination.destinationName}
        className="w-full h-48 object-cover"
        />

        <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">
                {destination.destinationName}
            </h3>

            <p className="text-gray-600 text-sm mb-2">
               📍{destination.location}
            </p>

            <p className="text-lg font-bold text-blue-600 mb-4"> 
                ₹ {destination.totalBudget}                
            </p>

            <Link 
            to={`/destinations/${destination.destinatonId}`}
             className="w-full bg-blue-600 text-white py-2 rounded-lg text-center hover:bg-blue-700 transition"
             >View Details
            </Link>
        </div>
    </div>
  );
};

export default DestinationCard;