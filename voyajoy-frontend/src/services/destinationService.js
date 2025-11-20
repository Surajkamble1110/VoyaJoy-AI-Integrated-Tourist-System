import api from "./api";

const destinationService =  {

  addDestination : (destinationData)=>{
     
    return api.post("/destination/add-destination", destinationData);
  },

  getAllDestinations : ()=>{

    return api.get("/destination/all-destinations");

  },

  getDestinationById: (id)=>{

    return api.get(`/destination/profile/${id}`);
  },

  updateDestination : (id, data)=>{
    return api.put(`/destination/update-destination/${id}`, data);
  },

  deleteDestination : (id)=>{

    return api.delete(`/destination/delete-destination/${id}`);
  }, 

    getByName : (name)=>{
      return api.get(`/destination/by-name/${name}`);
    },

    getByLocation : (location )=>{
      return api.get(`/destination/by-location/${location}`);
    },

    getByRange : (minRange, maxRange)=>{
      return api.get(`/destination/by-range/${minRange}/${maxRange}`); 
    },

};

export default destinationService;