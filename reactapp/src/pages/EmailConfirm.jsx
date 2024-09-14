import React from 'react'

export const EmailConfirm = () => {

    // const handleResendEmail = () => {
    //     console.log('Reenviar correo de verificación');
    // };

    return (
        <div className='login-body pt-5'>
            <div className='container'>
                <div className='row bg-white p-4 rounded shadow'>
                    <div className='col-md-8 offset-md-2'>
                        <h2 className='text-center mb-4'>¡Verificación de Correo Enviada!</h2>
                        <p className='text-center mb-4'>
                            Hemos enviado un correo electrónico de verificación a tu dirección. 
                            Por favor, revisa tu bandeja de entrada y haz click en el enlace de verificación para completar el registro.
                        </p>
                        {/* <p className='text-center'>
                            Si no recibiste el correo, puedes <button onClick={handleResendEmail} className='btn btn-primary'>Reenviarlo</button>.
                        </p> */}
                    </div>
                </div>
            </div>

        </div>
    )
}
