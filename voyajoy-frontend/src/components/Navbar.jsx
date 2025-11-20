import React, { useContext } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    
 const {user, logout}  = useContext(AuthContext);

  const handleLogout = ()=>{
    logout(),
    Navigate("/")
 };
 

    return (
    <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/*Logo*/}
            <Link to='/'className="text-2xl font-bold"> 
            VoyaJoy
            </Link>

            <div className="flex gap-6 items-center">
                {/*Home*/}
                <Link to='/home'className="hover:text-gray-200">
                Home
                </Link>
                {/*Destination*/}
                
                 {/*If user loged in*/}
                {user?(
                    <>
                    <span className="text-sm"> 
                    Welcome, {user.username}!
                    </span>

                    {user.role=="CUSTOMER" && (
                        <>
                        <Link to=''>My Bookings</Link>
                        </>
                    )}

                    {user.role=="MANAGER" && (
                        <>
                        <LinL to=''>Dashboard</LinL>
                        </>
                    )}

                    <button onLClick={handleLogout}
                    className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                    </>
                ):(
                    /*If user not logged in */
                    
                    <>
                    <Link to="/login" className="hover:text-gray-200">
                    Login
                    </Link>
                    
                    <Link to="/register"  className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
                    > 
                    Register
                    </Link>
                    </>
                )}
            </div>
        </div>
    </nav>
  );
};

export default Navbar;