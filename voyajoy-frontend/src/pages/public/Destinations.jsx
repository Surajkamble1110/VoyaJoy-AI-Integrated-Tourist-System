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
    <div  className="min-h-screen bg-gray-50">
        {/* Header */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">All Destinations</h1>
          <p className="text-lg">
            Discover {destinations.length} amazing places to visit
          </p>
        </div>
      </div>
      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Search Bar */}
        <form onSubmit={searchHandler} className="flex gap-2">
            <input
            type="text"
            placeholder="Searcch destinations..."
            value={searchQuery}
            onChange={(e)=>{setSearchQuery(e.target.value)}}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit"
             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
            search
            </button>
        </form>

        <select
        value={filterLocation}
        onChange={handlerLocation}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >

            <option value=""> All location</option>
            <option value="Goa"> Goa</option>
            <option value="Kerela"> Kerela</option>
            <option value="Banglore"> Banglore</option>
            <option value="Pune"> Pune</option>
            <option value="Mumbai"> Mumbai</option>

        </select>
        </div>

         {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading destinations...</p>
          </div>
        )}

         
        
        <ErrorHandler 
          error={error} 
          onClose={() => setError(null)} 
        />

       {/* Destinations Grid */}
        {!loading && !error && destinations.length>0 &&(
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination)=>(
               <DestinationCard
                key={destination.destinationId}
                destination={destination}
               />
            ))}
            </div>
        )}

        {/* No Results */}
        {!loading && !error && destinations.length==0 && (
         <div className="text-center py-12">
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