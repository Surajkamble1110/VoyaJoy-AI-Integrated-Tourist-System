import { Route, Routes } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/public/Login'
import   Register from './pages/public/Register'
import Home from './pages/public/Home'
import Destinations from './pages/public/Destinations'
import DestinationDetail from './pages/public/DestinationDetail'
import BookingPage from './pages/auth/BookingPage'
import PaymentPage from './pages/auth/PaymentPage'
import BookingConfirmation from './pages/auth/BookingConfirmation'

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
          <Route path="/booking/:bookingId" element={<BookingPage/>}/>
          <Route path="/payment/:bookingId" element={<PaymentPage/>}/>
          <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
        </Routes>
        
      </AuthProvider>
  )
}

export default App;
