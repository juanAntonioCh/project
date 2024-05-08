import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axios from 'axios'

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);

      const fetchUserDetails = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/user-details', {
            headers: {
              'Authorization': `Token ${token}`
            }
          })
          setUser(response.data.id);
          console.log('EL USUARIO ES  ', response.data)
          console.log(response.data.id)
          console.log(response)

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
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  )
}