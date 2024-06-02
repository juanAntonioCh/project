import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/vehicle.api';


export const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener todos los formularios para aplicarle las clases de Bootstrap
        const forms = document.querySelectorAll('.needs-validation');
        console.log('los formus son: ', forms);

        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            }, false);
        });
    }, []);

    useEffect(() => {
        let timeout;
        if (error) {
            timeout = setTimeout(() => {
                setError(null);
            }, 4000);
        }
        if (success) {
            timeout = setTimeout(() => {
                setSuccess(null);
            }, 4000);
        }
        return () => clearTimeout(timeout);
    }, [error]);


    useEffect(() => {
        console.log(email)
    }, [email])

    const handleCloseAlert = () => {
        setError(null);
        setSuccess(null)
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault()
        try {
            console.log(email)
            const response = await api.post('/api/forgot-password/', { email });

            setSuccess('Se ha enviado un correo electrónico a la dirección proporcionada. Por favor, revise su bandeja de entrada y siga las instrucciones para restablecer su contraseña.')

            console.log(response)
            console.log('Inicio de sesión exitoso');
            //navigate('/', { replace: true });

        } catch (error) {
            //console.error('Error en el inicio de sesión');
            setError('Dirección de correo no válida')
        }
    }

    return (
        <div className="login-body">
            {success && (
                <div className="alert-container">
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>{success}</strong>
                        <button type="button" className="btn-close login-alert-button" onClick={handleCloseAlert} aria-label="Close"></button>
                    </div>
                </div>
            )}
            {error && (
                <div className="alert-container">
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>{error}</strong>
                        <button type="button" className="btn-close login-alert-button" onClick={handleCloseAlert} aria-label="Close"></button>
                    </div>
                </div>
            )}
            <div className='container'>
                <div className="row pt-5">

                    <div className="col bg-white">

                        <form className="form-container needs-validation p-4 text-center" noValidate onSubmit={handlePasswordReset}>
                            <h4>Introduce la dirección de correo a la que enviaremos el mensaje para restablecer la contraseña</h4>

                            <div className="form-group mt-5 position-relative">
                                <div className='row'>

                                    <div className='col-md-3 text-md-end'>
                                        <label htmlFor="email" className='form-label'>Correo electrónico: </label>
                                    </div>

                                    <div className="col-md-6">
                                        <input type="email" className="form-control"
                                            id="email"
                                            title="Ingresa un correo electrónico válido"
                                            value={email} onChange={(e) => setEmail(e.target.value)}
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
                                </div>
                            </div>

                            <div className="form-action text-center">
                                <button className="btn btn-primary w-25 m-4" type="submit">Restablecer contraseña</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
