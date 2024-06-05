import React from 'react';
import { Link } from "react-router-dom";

export const NotFound = () => {
    return (
        <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="text-center">
          <h2>Página no encontrada</h2>
          <p>Lo sentimos, la página que estás buscando no existe.</p>
          <Link to="/home" className="btn btn-primary">Volver a la página principal</Link>
        </div>
      </div>
    );
  };
  