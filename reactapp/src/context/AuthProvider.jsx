import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { api } from "../api/vehicle.api";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [logoutMessage, setLogoutMessage] = useState('')

  useEffect(() => {
    console.log(error)
  }, [error])

  //botón de X para cerrar la alerta
  const handleCloseAlert = () => {
    setError(null);
  };

  //limpiar la alerta pasados 4 segundos
  useEffect(() => {
    let timeout;
    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [error]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);

      const fetchUserDetails = async () => {
        try {
          const response = await api.get('/api/user-details', {
            headers: {
              'Authorization': `Token ${token}`
            }
          })
          setUser(response.data);
          console.log('EL USUARIO ES  ', response.data)
          console.log(response.data.id)
          //console.log(response)

        } catch (error) {
          console.error('Error al obtener los detalles del usuario', error);
        }
      }
      fetchUserDetails();

    } else {
      console.log('NO HAY USUARIO ACTIVO')
      setUser('')
    }
  }, [isAuthenticated]);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setLogoutMessage('Sesión finalizada')
    setIsAuthenticated(false);
    navigate('/', { replace: true, state: { logoutMessage } });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, logoutMessage, setLogoutMessage }}>
      {children}
    </AuthContext.Provider>
  )
}