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
       <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 pb-20">

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/destinations')}
          className="text-purple-700 hover:underline font-medium flex items-center gap-1"
        >
          ← Back to Destinations
        </button>
      </div>

      {/* Hero Image */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <img
          src={destination.image}
          alt={destination.destinationName}
          className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-2xl border-4 border-white"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left Column */}
        <div className="lg:col-span-2">

          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            {destination.destinationName}
          </h1>

          <p className="text-lg text-gray-700 mb-8 flex items-center gap-2">
            <span className="text-pink-500 text-xl">📍</span> {destination.location}
          </p>

          {/* About */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-pink-300 mb-10">
            <h2 className="text-3xl font-semibold text-purple-700 mb-4">
              About the Destination
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {destination.description}
            </p>
          </div>

          {/* Itinerary */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-purple-300">
            <h2 className="text-3xl font-semibold text-pink-600 mb-4">
              Itinerary
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {destination.itinerary}
            </p>
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-xl sticky top-24 border-2 border-pink-100">

            {/* Price */}
            <div className="mb-8">
              <p className="text-gray-500 text-sm">Total Package Price</p>
              <h3 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                ₹{destination.totalBudget}
              </h3>
            </div>

            {/* Advance Payment */}
            <div className="mb-10 pb-6 border-b border-gray-200">
              <p className="text-gray-500 text-sm">Advance Payment Required</p>
              <p className="text-2xl font-semibold text-purple-700">
                ₹{destination.advancePayment}
              </p>
            </div>

            {/* Book Button */}
            <button
              onClick={() => navigate(`/booking/${destination.destinatonId}`)}
              className="w-full bg-linear-to-r from-purple-600 via-pink-500 to-purple-600 text-white py-4 rounded-full font-semibold shadow-lg hover:shadow-pink-300/50 transition-all hover:scale-105"
            >
              Book Now
            </button>

            {/* Sub Info */}
            <div className="mt-6 text-sm text-gray-600 space-y-2">
              <p>✓ Best price guarantee</p>
              <p>✓ 24/7 customer support</p>
              <p>✓ Flexible cancellation policy</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;