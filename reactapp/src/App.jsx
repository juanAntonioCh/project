import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Navigate to='/home' />}></Route>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/vehicle' element={<VehiclesPage />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/rent-car' element={<RentCar />}></Route>
          <Route path='/vehicle/:id' element={<VehicleDetailView />} />
          <Route path='/my-vehicles/:id' element={<VehiclesUserPage />} />
          <Route path='/edit-vehicle/:id' element={<EditVehicle />} />
          <Route path='/edit-vehicle/images/:id' element={<EditVehicleImages />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
