import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Home } from './pages/Home'
import { AuthProvider } from './context/AuthProvider'
import 'bootstrap/dist/css/bootstrap.min.css';
import { RentCar } from './pages/RentCar'
import { VehicleDetailView } from './components/VehicleDetailView'
import { VehiclesPage } from './pages/VehiclesPage'

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
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
