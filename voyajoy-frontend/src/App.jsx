import { Route, Routes } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/public/Login'
import   Register from './pages/public/Register'
import Home from './pages/public/Home'

const App = () => {
  return (
    
      <AuthProvider>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>  
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
        
      </AuthProvider>
  )
}

export default App;
