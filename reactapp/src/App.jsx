import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import React, { useEffect } from 'react';
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Home } from './pages/Home'
import { AuthProvider } from './context/AuthProvider'
import 'bootstrap/dist/css/bootstrap.min.css';
import styled, { createGlobalStyle } from 'styled-components';
import { RentCar } from './pages/RentCar'
import { VehicleDetailView } from './components/VehicleDetailView'
import { VehiclesPage } from './pages/VehiclesPage'
import { VehiclesUserPage } from './pages/VehiclesUserPage'
import { EditVehiclePage } from './pages/EditVehiclePage'
import { EditVehicle } from './components/EditVehicle'
import { EditVehicleImages } from './components/EditVehicleImages'
import { Navbar } from './components/Navbar';
import { VehiclesProvider } from './context/VehiclesProvider';
import { PasswordReset } from './pages/PasswordReset';
import { PasswordResetConfirm } from './pages/PasswordResetConfirm';
import { LoadScript } from '@react-google-maps/api';
import { BuzonMensajes } from './pages/BuzonMensajes';
import { AlquileresUser } from './pages/AlquileresUser';
import { NotFound } from './pages/NotFound';


function App() {
  //const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const apiKey = 'AIzaSyC_G0xCXyALB3IgkE5D4RpWWAxRIg9xCuQ'
  
  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={['places']}
    >
    <BrowserRouter>
      <AuthProvider>
        <VehiclesProvider>
          <AppRoutes />
        </VehiclesProvider>
      </AuthProvider>
    </BrowserRouter>
    </LoadScript>
  );
}

function AppRoutes() {
  const location = useLocation();

  // Definir las opciones de navegación específicas de cada página
  const getNavbarOptions = () => {
    if (location.pathname === '/home') {
      return 'HOME';
    } else if (location.pathname === '/vehicle') {
      return 'VEHICLE PAGE';
    } else if (location.pathname === '/register') {
      return 'REGISTER';
    } else {
      return [];
    }
    
  };

  return (
    <>
      <Navbar option={getNavbarOptions()} />
      <Routes>
        <Route path='/' element={<Navigate to='/home' />} />
        <Route path='/home' element={<Home />} />
        <Route path='/vehicle' element={<VehiclesPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/rent-car' element={<RentCar />} />
        <Route path='/vehicle/:id' element={<VehicleDetailView />} />
        <Route path='/my-vehicles/:id' element={<VehiclesUserPage />} />
        <Route path='/edit-vehicle/:id' element={<EditVehicle />} />
        <Route path='/edit-vehicle/images/:id' element={<EditVehicleImages />} />
        <Route path='/password/reset' element={<PasswordReset />} />
        <Route path="/reset-password-confirm/:uidb64/:token" element={<PasswordResetConfirm />} />
        <Route path='/reservas/recibidas' element={<BuzonMensajes/>}></Route>
        <Route path='/alquileres' element={<AlquileresUser/>}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
