import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import React, { useContext, useEffect } from 'react';
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
import { AuthContext } from './context/AuthContext';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppRoutes() {
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext)

  // Define las opciones de navegación específicas de cada página
  const getNavbarOptions = () => {
    if (location.pathname === '/home') {
      return 'HOME';
    } else if (location.pathname === '/vehicle') {
      return 'VEHICLE PAGE';
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
      </Routes>
    </>
  );
}

export default App;
