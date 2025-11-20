import React, { createContext, useState } from 'react'

export const AuthContext = createContext();

const AuthProvider = ({children}) => {

const [user, setUser] = useState(null);
const [error, setError] = useState(false);
const [loading, setLoading] = useState(null);

    const login = (userData)=>{

        setUser(userData);
        setError(null);

        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = ()=>{

        setUser(null);
        setError(null);
   
        localStorage.removeItem("user");
    };

    const register= (userData)=>{

        setUser(userData);
        setError(null);

    };

  return (

    <AuthContext.Provider value={{

        user,
        error,
        loading,
        login,
        logout,
        register,
        setError,
        setLoading,
    }}>

        {children}

    </AuthContext.Provider>

  )
}

export default AuthProvider;