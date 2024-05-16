import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';


export const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(email)
    }, [email])

    const handlePasswordReset = async (e) => {
        e.preventDefault()
        try {
            console.log(email)
            const response = await axios.post('http://localhost:8000/auth/password/reset/', { email });
            console.log(response)
            console.log('Inicio de sesión exitoso');
            //navigate('/', { replace: true });

        } catch (error) {
            //console.error('Error en el inicio de sesión');
            console.log('Error en el inicio de sesión', error)
        }
    }

    return (
        <div className="login-body">
            <div className='container w-50'>
                <div className="row pt-5">

                    <div className="col bg-white">

                        <form className="form-container needs-validation p-4" noValidate onSubmit={handlePasswordReset}>
                            <h3>Introduce el correo electrónico al que enviaremos el mensaje para restablecer la contraseña</h3>

                            <div className="form-group mb-3 mt-4 w-50 text-center">

                                <input type="email" className="form-control"
                                    id="email"
                                    title="Ingresa un correo electrónico válido"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Correo electrónico'
                                    required />
                                {!error && (
                                    <div className="valid-tooltip">
                                        Perfecto!
                                    </div>
                                )}
                                <div className="invalid-tooltip">
                                    Este campo es obligatorio
                                </div>
                            </div>

                            <div className="form-action text-center">
                                <button className="btn btn-primary w-50 mb-3" type="submit">Restablecer contraseña</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
