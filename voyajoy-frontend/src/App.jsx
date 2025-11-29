import { Route, Routes } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/public/Login'
import   Register from './pages/public/Register'
import Home from './pages/public/Home'
import Destinations from './pages/public/Destinations'
import DestinationDetail from './pages/public/DestinationDetail'

const App = () => {
  return (
    
      <AuthProvider>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>  
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/destinations" element={<Destinations/>}/>
          <Route path="/destinations/:id" element={<DestinationDetail/>}/>
        </Routes>
        
      </AuthProvider>
  )
}

export default App;
