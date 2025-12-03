import { useEffect, useState } from "react"
import destinationService from "../../services/destinationService";
import DestinationCard from "../../components/DestinationCard";
import ErrorHandler from "../../services/ErrorHandler";


const Destinations = () => {

    const [loading , setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [destinations, setDestinations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterLocation, setFilterLocation] = useState('');

    useEffect(()=>{
        fetchAllDestination();
    }, []);

        const fetchAllDestination=async ()=>{

            try{

            setLoading(true);
            const response  = await destinationService.getAllDestinations();
            setDestinations(response.data);
            setError(null);
        
        }catch(err){
                
                setError(err);
        
        }finally{

                setLoading(false);
            }
        };

          {/* Search and Filter */}
       const searchHandler= async (e)=>{
            e.preventDefault();

            if(!searchQuery.trim()){
                fetchAllDestination();
                return;
            }

            try{
            setLoading(true);    
            const response = await destinationService.getByName(searchQuery);
            setDestinations(response.data);
            setError(null);
            
        }catch(err){

            setError("No destinations found fo this location");

            }finally{
                setLoading(false);
            }
        };

        {/* Location Filter */}
        const handlerLocation= async(e)=>{
            e.preventDefault
         setFilterLocation(e.trget.value);

         if(!filterLocation){

            fetchAllDestination();
            return ;
         }

         try{

            setLoading(true);
            const response = await destinationService.getByLocation(filterLocation);
            setDestinations(response.data);
            setError(null);
            
         }catch(err){

         setError("No destinations found for this location");
        
        }finally{
        
            setLoading(false);
        
        }

        }

    return (
        <div className="min-h-screen bg-linear-to-b from-purple-50 to-pink-50">
      
      {/* HEADER */}
      <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white py-16 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Explore All Destinations
          </h1>
          <p className="text-lg md:text-xl mt-2 text-purple-100">
            Discover {destinations.length} beautiful places across India
          </p>
        </div>
      </div>

      {/* SEARCH + FILTER SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/40">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Search */}
            <form onSubmit={searchHandler} className="flex gap-3 col-span-2">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-md hover:opacity-90 transition"
              >
                Search
              </button>
            </form>

            {/* Filter */}
            <select
              value={filterLocation}
              onChange={handlerLocation}
              className="px-4 py-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
            >
              <option value="">All Locations</option>
              <option value="Goa">Goa</option>
              <option value="Kerela">Kerela</option>
              <option value="Banglore">Banglore</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
            </select>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg animate-pulse">
              Loading destinations...
            </p>
          </div>
        )}

        {/* ERROR HANDLER */}
        <ErrorHandler error={error} onClose={() => setError(null)} />

        {/* DESTINATIONS GRID */}
        {!loading && !error && destinations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {destinations.map((destination) => (
              <DestinationCard
                key={destination.destinationId}
                destination={destination}
              />
            ))}
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && !error && destinations.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              No destinations found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
    
export default Destinations;