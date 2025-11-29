import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import destinationService from '../../services/destinationService';
import ErrorHandler from '../../services/ErrorHandler';


const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        const response = await destinationService.getDestinationById(id);
        setDestination(response.data);
        setError(null);
      } catch (err) {
        
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading destination details...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        
         <ErrorHandler 
          error={error} 
          onClose={() => navigate('/destinations')} 
        />

        <button
          onClick={() => navigate('/destinations')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Destinations
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/destinations')}
          className="text-blue-600 hover:underline"
        >
          ← Back to Destinations
        </button>
      </div>

      {/* Hero Image */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <img
          src={destination.image}
          alt={destination.destinationName}
          className="w-full h-96 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title */}
            <h1 className="text-4xl font-bold mb-2">
              {destination.destinationName}
            </h1>

            {/* Location */}
            <p className="text-gray-600 text-lg mb-6">
              📍 {destination.location}
            </p>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {destination.description}
              </p>
            </div>

            {/* Itinerary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Itinerary</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {destination.itinerary}
              </p>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-20">
              {/* Price */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm">Total Package Price</p>
                <h3 className="text-3xl font-bold text-blue-600">
                  ₹{destination.totalBudget}
                </h3>
              </div>

              {/* Advance Payment */}
              <div className="mb-6 pb-6 border-b">
                <p className="text-gray-600 text-sm">Advance Payment Required</p>
                <p className="text-xl font-semibold">
                  ₹{destination.advancePayment}
                </p>
              </div>

              {/* Book Button */}
              <button
                onClick={() => navigate(`/booking/${destination.destinationId}`)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-4"
              >
                Book Now
              </button>

              {/* Info */}
              <div className="text-sm text-gray-600">
                <p>✓ Best price guarantee</p>
                <p>✓ 24/7 customer support</p>
                <p>✓ Flexible cancellation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;