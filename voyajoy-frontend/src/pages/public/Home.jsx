import { useEffect, useState } from "react"
import destinationService from './../../services/destinationService';
import DestinationCard from "../../components/DestinationCard";
import { Link } from "react-router-dom";
import ErrorHandler from "../../services/ErrorHandler";

const Home = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredDestinations, setFeaturedDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {      
        setLoading(true);
        const response = await destinationService.getAllDestinations();
        setFeaturedDestinations(response.data.slice(0,3));
        setError(null);
      } catch(err) {
        setError(err);
      } finally {
        setLoading(false);
      } 
    };
    
    fetchDestinations();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Purple-Pink Gradient */}
      <section className="relative bg-linear-to-br from-purple-600 via-pink-500 to-pink-400 text-white py-24 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block mb-6 animate-bounce">
            <span className="text-7xl">🌍</span>
          </div>
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Welcome to{' '}
            <span className="bg-linear-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
              VoyaJoy
            </span>
          </h1>
          <p className="text-2xl mb-10 text-pink-50 max-w-2xl mx-auto">
            Explore amazing destinations around the world with personalized travel experiences
          </p>
          <Link
            to="/destinations"
            className="inline-block bg-white text-purple-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-50 shadow-2xl hover:shadow-pink-300/50 transform hover:scale-105 transition-all"
          >
            🔍 Explore All Destinations
          </Link>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path fill="rgba(251, 207, 232, 0.3)" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-linear-to-r from-purple-700 via-pink-600 to-pink-500 bg-clip-text text-transparent">
            ✨ Featured Destinations
          </h2>
          <p className="text-gray-700 text-lg">
            Check out our most popular travel packages
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4">Loading destinations...</p>
          </div>
        )}

        <ErrorHandler error={error} onClose={() => setError(null)} />

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((destination) => (
              <DestinationCard
                key={destination.destinatonId}
                destination={destination}
              />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose VoyaJoy Section */}
      <section className="bg-linear-to-br from-pink-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold mb-16 text-center bg-linear-to-r from-purple-700 via-pink-600 to-pink-500 bg-clip-text text-transparent">
            🌟 Why Choose VoyaJoy?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-pink-100">
              <div className="text-6xl mb-4 text-center">🌍</div>
              <h3 className="text-2xl font-bold mb-3 text-center text-purple-700">
                Curated Destinations
              </h3>
              <p className="text-gray-600 text-center">
                Handpicked destinations for unforgettable experiences
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-pink-100">
              <div className="text-6xl mb-4 text-center">💰</div>
              <h3 className="text-2xl font-bold mb-3 text-center text-pink-600">
                Best Prices
              </h3>
              <p className="text-gray-600 text-center">
                Competitive pricing with no hidden charges
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-pink-100">
              <div className="text-6xl mb-4 text-center">🤝</div>
              <h3 className="text-2xl font-bold mb-3 text-center text-purple-600">
                24/7 Support
              </h3>
              <p className="text-gray-600 text-center">
                Round-the-clock customer support for your peace of mind
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-r from-purple-600 via-pink-500 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Adventure? 🎒
          </h2>
          <p className="text-xl mb-8 text-pink-50">
            Book your dream vacation today and create memories that last forever
          </p>
          <Link
            to="/destinations"
            className="inline-block bg-white text-purple-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-50 shadow-2xl hover:shadow-pink-300/50 transform hover:scale-105 transition-all"
          >
            Browse All Destinations →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;