import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button, Modal } from 'react-bootstrap';
import { api } from '../api/vehicle.api';

export const EditVehicleImages = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [vehiculoId, setVehiculoId] = useState({});
  const [newImage, setNewImage] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [imagenesBack, setImagenesBack] = useState([]);
  const [imagenesAEliminar, setImagenesAEliminar] = useState([]);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await api.get(`/api/vehicles/${id}`);
        setImagenes(data.imagenes);
        setImagenesBack(data.imagenes);
        setVehiculoId(data.id);
      } catch (error) {
        console.error("Error fetching vehicle", error);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleImageChange = (e, id) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = () => {
      const imageSrc = fileReader.result;

      const updatedImagenes = imagenes.map(imagen => (
        imagen.id === id ? { ...imagen, imagen: imageSrc } : imagen
      ));

      const updatedImagenesBack = imagenesBack.map(imagen => (
        imagen.id === id ? { ...imagen, imagen: file } : imagen
      ));

      setImagenes(updatedImagenes);
      setImagenesBack(updatedImagenesBack);
    };

    fileReader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      // Actualiza las imágenes modificadas o nuevas
      await Promise.all(imagenesBack.map(async (file) => {
        const formData = new FormData();
        formData.append('imagen', file.imagen);

        await api.put(`/api/vehicle/image/update/${file.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }));

      // Elimina las imágenes que se han marcado para eliminación
      await Promise.all(imagenesAEliminar.map(async (imgId) => {
        await api.delete(`/api/imagenes/${imgId}/`);
      }));

      console.log("Cambios guardados exitosamente");
      navigate(`/my-vehicles/${user.id}`);
    } catch (error) {
      console.error("Error al guardar los cambios", error);
    }
  };

  const markImageForDeletion = (imgId) => {
    setImagenes(imagenes.filter(imagen => imagen.id !== imgId));
    setImagenesBack(imagenesBack.filter(imagen => imagen.id !== imgId));
    setImagenesAEliminar([...imagenesAEliminar, imgId]);
  };

  const addImage = (e) => {
    const imagen = e.target.files[0];
    setNewImage(imagen);
  };

  const submitImage = async () => {
    if (newImage) {
      const formData = new FormData();
      formData.append('vehiculo', vehiculoId);
      formData.append('imagen', newImage);

      try {
        const { data } = await api.post(`/api/imagenes/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setImagenes([...imagenes, data]);
        setImagenesBack([...imagenesBack, data]);
        setNewImage('');
      } catch (error) {
        console.error('No se ha podido añadir la imagen', error);
      }
    } else {
      console.log('No se ha seleccionado ninguna imagen');
    }
  };


  return (
    <div className="login-body">
      <div className="container pt-5 pb-5">
        <div className="row bg-white p-4 edit-vehicle-imgs-row">
          {imagenes.length === 0 ? (
            <div>
              <p>No hay imágenes del vehículo.</p>
              <div className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <input className="mb-4" type="file" accept="image/*" onChange={addImage} />
                    <button onClick={submitImage} className="btn fw-bold edit-vehicle-imgs-add">Añadir imagen</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="row">
                {imagenes.map(imagen => (
                  <div key={imagen.id} className="col-md-6 col-lg-3 mb-4">
                    <div className="edit-vehicle-imgs-card-imgs">
                      <img src={imagen.imagen} className="card-img-top edit-vehicle-imgs-card-img-top" alt={`Imagen ${imagen.id}`} />
                      <div className="card p-3 mt-2">
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, imagen.id)} />
                        <button className="btn fw-bold edit-vehicle-imgs-delete mt-2" onClick={() => markImageForDeletion(imagen.id)}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body edit-vehicle-imgs-card-body">
                    <input className="mb-4" type="file" accept="image/*" onChange={addImage} />
                    <button onClick={submitImage} className="btn fw-bold edit-vehicle-imgs-add">Añadir imagen</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="text-center d-flex justify-content-center mt-4">
            <button className="btn btn-primary" onClick={handleSubmit}>Guardar cambios</button>
            <Link to={`/my-vehicles/${user.id}`} className="btn btn-secondary mx-3">Cancelar</Link>
          </div>
        </div>
      </div>
    </div>
  );
};