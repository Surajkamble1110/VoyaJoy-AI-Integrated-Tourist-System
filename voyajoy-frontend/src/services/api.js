import axios from "axios";


const API_BASE_URL = "https://voyajoy-backend.onrender.com/voyajoy/api";

const api = axios.create({

  baseURL : API_BASE_URL,
  headers : {
    'Content-Type' : 'application/json',
  },

});

api.interceptors.request.use(

  (config)=>{

    const token  = localStorage.getItem('token');

    if(token){

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  
  (error)=>{
    return Promise.reject(error);
  }
   
);

api.interceptors.response.use(

  (response)=>response,
  (error)=>{

    //unauthorized
    if(error.response?.status=== 401){

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href='/login';

    }

    //aunathourized for specfic role  
    if(error.response?.status=== 403){

      console.error('Access Denied:', error.response.data.message);
      window.location.href='/';
    }

    if(error.response?.status=== 404){

      console.error('resource not found:', error.response.data.message);
    }

     if(error.response?.status=== 400){

      console.error('Bad request:', error.response.data.message);
    }

     if(error.response?.status=== 500){

      console.error('Internal server error:', error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default api;