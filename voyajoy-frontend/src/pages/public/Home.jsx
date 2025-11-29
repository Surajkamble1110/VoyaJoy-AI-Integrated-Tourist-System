import { useEffect, useState } from "react"
import destinationService from './../../services/destinationService';
import DestinationCard from "../../components/DestinationCard";
import { Link } from "react-router-dom";
import ErrorHandler from "../../services/ErrorHandler";


const Home = () => {

const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [featuredDestinations, setFeaturedDestinations] = useState([]);

useEffect(()=>{

   const fetchDestinations = async ()=>{
    
    try{      
      setLoading(true);
      const response  =  await destinationService.getAllDestinations();
      console.log('Response data:', response.data); 
      setFeaturedDestinations(response.data.slice(0,3));
      setError(null);

    }catch(err){

      setError(err);

    }finally{

      setLoading(false);
    } 
  };
  
  fetchDestinations();
} ,
[]);

  return (

    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to VoyaJoy
          </h1>
          <p className="text-xl mb-8">
            Explore amazing destinations around the world
          </p>
          <Link
            to="/destinations"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
          >
            Explore All Destinations
          </Link>
        </div>
      </section>

       {/* Featured Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-2">Featured Destinations</h2>
        <p className="text-gray-600 mb-8">
          Check out our most popular travel packages
        </p>

        { loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading destinations...</p>
          </div>
        )}


    
        <ErrorHandler
          error={error} 
          onClose={() => setError(null)} 
        />

       
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Why Choose VoyaJoy?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">
                Curated Destinations
              </h3>
              <p className="text-gray-600">
                Handpicked destinations for unforgettable experiences
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">
                Best Prices
              </h3>
              <p className="text-gray-600">
                Competitive pricing with no hidden charges
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Round-the-clock customer support for your peace of mind
              </p>
            </div>
          </div>
        </div>
      </section>


    </div>

  );
};

export default Home;
