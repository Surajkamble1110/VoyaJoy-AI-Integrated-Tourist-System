import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";
import ErrorHandler, { getErrorMessage } from "../../services/ErrorHandler";

const Register = () => {

  const navigate = useNavigate();
  const { register, setError: setContextError } = useContext(AuthContext);

  const [formData, setFormData] = useState({

    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    role: "CUSTOMER",
  });

 const  handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {

      const response = await authService.register(formData);

      
      register(response.data);
      alert("Registertraion Successfull! Please Login");

      navigate("/login");

    } catch (err) {
      console.log("Registration Error", err);

      const errorMessage = getErrorMessage(err);
      setError(err);  
      setContextError(errorMessage);
    
    } finally {
      setLoading(false);
    }

  };

  return (
   <div className="min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-pink-400 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        
        {/* Glow Background */}
        <div className="absolute inset-0 bg-linear-to-br from-purple-200 via-pink-100 to-white opacity-30 blur-2xl"></div>

        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-center mb-6 bg-linear-to-r from-purple-700 via-pink-600 to-pink-500 bg-clip-text text-transparent">
            Create Your Account
          </h2>

          <ErrorHandler error={error} onClose={() => setError(null)} />

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">

            {/* Username */}
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl bg-purple-50 border-pink-200 
                         focus:ring-2 focus:ring-pink-400 focus:outline-none text-gray-700"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl bg-purple-50 border-pink-200 
                         focus:ring-2 focus:ring-pink-400 focus:outline-none text-gray-700"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl bg-purple-50 border-pink-200 
                         focus:ring-2 focus:ring-pink-400 focus:outline-none text-gray-700"
            />

            {/* Phone Number */}
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl bg-purple-50 border-pink-200 
                         focus:ring-2 focus:ring-pink-400 focus:outline-none text-gray-700"
            />

            {/* Role */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl bg-purple-50 border-pink-200 
                         focus:ring-2 focus:ring-pink-400 focus:outline-none text-gray-700"
            >
              <option value="CUSTOMER">Customer</option>
            </select>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-purple-600 via-pink-500 to-pink-600 
                         text-white py-3 rounded-xl font-bold text-lg shadow-xl 
                         hover:opacity-90 transform hover:scale-[1.02] transition-all
                         disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-700">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-pink-600 hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};


export default Register;