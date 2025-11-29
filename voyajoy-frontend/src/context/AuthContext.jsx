import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext();

const AuthProvider = ({children}) => {

const [user, setUser] = useState(null);
const [error, setError] = useState(false);
const [loading, setLoading] = useState(null);
const [token, setToken] = useState(null);

    useEffect(()=>{

        initalizeToken();
    
    },[]);

   const initalizeToken = ()=>{

    const getUser = localStorage.getItem('user');
    const getToken = localStorage.getItem('token');

    if(getUser && getToken){

        setUser(JSON.parse(getUser));
        setToken(getToken);
    }

   }

    const login = (userData)=>{

        setUser(userData);
        setToken(userData.token);
        setError(null);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
    };

    const logout = ()=>{

        setUser(null);
         setToken(null);
        setError(null);
       
   
        localStorage.removeItem("user");
        localStorage.removeItem("token");  

    };

    const register= (userData)=>{

        setUser(userData);
        setToken(userData.token);
        setError(null);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem('token', userData.token);

    };

 
  return (

    <AuthContext.Provider value={{

        user,
        error,
        token,
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