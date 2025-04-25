import React,{useState} from 'react';
import { StoreContextProvider } from './context/StoreContext';
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart/Cart';
import Placeorder from './pages/Placeorder/Placeorder';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation';
import MyOrders from './pages/myorders/MyOrders';


const App = () => {
  const [showLogin,setShowLogin]=useState(false)
  return (
    <>
    {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : null}

    <StoreContextProvider>
        <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/order' element={<Placeorder/>}/>
          <Route path='/myorders' element={<MyOrders/>}/>
   
        <Route path="/order-confirmed" element={<OrderConfirmation />} />
        </Routes>
        </div>
       
    </StoreContextProvider>
     <Footer/>
     </>

  )
}

export default App
