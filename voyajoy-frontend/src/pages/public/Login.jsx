import { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext";
import authService from './../../services/authService';
import { useNavigate } from "react-router-dom";
import ErrorHandler, { getErrorMessage } from "../../services/ErrorHandler";

const Login = () => {
const navigate=  useNavigate();
 const {login , setError: setContextError } =useContext(AuthContext);

 const [formData, setFormData] = useState({
   
  username : '',
  password : '',
 });

 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const handleChange=(e)=>{

 const { name, value}  = e.target;
  setFormData({
    ...formData,
    [name] : value,
  });
};

 const handleSubmit=async(e)=>{
  e.preventDefault();
  setLoading(true);
  setError(null);
  try{
  const response= await authService.login(formData);
  login(response.data); 
  if(response.data.role=='CUSTOMER'){
    navigate("/customer/dashboard");
  }
  else if(response.data.role=='MANAGER'){
    navigate("/manager/dashboard");
  }else{
    navigate("/");
  }
 
}catch(err){
  
  console.log("Login Failed", err);
  const errorMsg = getErrorMessage(err);
  setError(err);
  setContextError(errorMsg);


  }finally{
    setLoading(false);
  }
 };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        
         <ErrorHandler 
          error={error} 
          onClose={() => setError(null)} 
        />

        <form onSubmit={handleSubmit}>
          <input
          type="text"
          name="username"
          value={formData.username}
          placeholder="Enter name"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
          type="password"
          name="password"
          value={formData.password}
          placeholder="Enter password"
          onChange={handleChange}
          className="w-full px-4 py-2 mt-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 mt-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in...": "Login"}
          </button>
        </form>

        <p>
          Don't have account {''}
          <a href="/register" className="text-blue-600 hover:underline">
          Register 
          </a>
        </p>

      </div>

    </div>
  );
};

export default Login;