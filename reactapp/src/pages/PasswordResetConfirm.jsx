import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/vehicle.api';

export const PasswordResetConfirm = () => {
    const { uidb64, token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
        // Obtener todos los formularios para aplicarle las clases de Bootstrap
        const forms = document.querySelectorAll('.needs-validation');
        //console.log('los formus son: ', forms);

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

    const handlePasswordResetConfirm = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await api.post('/api/reset-password-confirm/', {
                uidb64,
                token,
                password
            });
            if (response.data.success) {
                navigate('/login');
            } else {
                setError('Error al restablecer la contraseña. Inténtalo de nuevo.');
            }
        } catch (error) {
            setError('Hubo un error al restablecer la contraseña. Inténtalo de nuevo.');
        }
    };

    const handleCloseAlert = () => {
        setError(null);
    };

    return (
        <div className="login-body">
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

                        <form className="form-container text-center needs-validation p-4" noValidate onSubmit={handlePasswordResetConfirm}>
                            <h3>Restablecer Contraseña</h3>

                            <div className="form-group mb-4 mt-4 position-relative">
                                <div className="row align-items-center">
                                    <div className="col-md-3 text-md-end">
                                        <label className="form-label mb-0">Nueva contraseña:</label>
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="password"
                                            value={password}
                                            className="form-control"
                                            onChange={(e) => setPassword(e.target.value)}
                                            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                                            title="La contraseña debe contener al menos 8 caracteres, incluyendo al menos una letra y un número"
                                            required
                                        />
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

                            <div className="form-group mb-4 mt-4 text-center position-relative">
                                <div className="row align-items-center">
                                    <div className="col-md-3 text-md-end">
                                        <label className="form-label mb-0">Confirmar nueva contraseña:</label>
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                                            title="La contraseña debe contener al menos 8 caracteres, incluyendo al menos una letra y un número"
                                            required
                                        />
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
                                <button className="btn btn-primary w-50 mb-3" type="submit">Restablecer contraseña</button>
                            </div>

                        </form>
                        <div />
                    </div>
                </div>
            </div>
        </div>

    );
};

