import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const EditVehicleImages = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext)
  const [vehiculoId, setVehiculoId] = useState({});
  const [vehiculo, setVehiculo] = useState({});
  const [newImage, setNewImage] = useState('');
  const [imagenes, setImagenes] = useState([]);
  //const [userId, setUserId] = useState('')
  const [imagenesBack, setImagenesBack] = useState([]);

  useEffect(() => {
    console.log('Las imagenes que se ven en pantalla', imagenes)
  }, [imagenes])

  useEffect(() => {
    console.log('las imagenes que se van a enviar ', imagenesBack)
  }, [imagenesBack])

  useEffect(() => {
    console.log('NUEVA IMG', newImage)
  }, [newImage])

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await axios.get(`http://127.0.0.1:8000/api/vehicles/${id}`);
        setImagenes(data.imagenes);
        setImagenesBack(data.imagenes);
        //setUserId(data.propietario)
        setVehiculoId(data.id)
        console.log(data);
      } catch (error) {
        console.error("Error fetching vehicle", error);
      }
    };
    fetchVehicle();
  }, [id]);

  // Cambiar la imagen seleccionada en el frontend
  const handleImageChange = (e, id) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = () => {
      const imageSrc = fileReader.result;
      //console.log(imageSrc)
      const updatedImagenes = imagenes.map(imagen => {
        if (imagen.id === id) {
          return { ...imagen, imagen: imageSrc };
        }
        return imagen;
      });

      const updatedImagenesBack = imagenesBack.map(imagen => {
        if (imagen.id === id) {
          return { ...imagen, imagen: file };
        }
        return imagen;
      });

      setImagenes(updatedImagenes);
      setImagenesBack(updatedImagenesBack)
    };

    fileReader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      await Promise.all(imagenesBack.map(async (file) => {
        const formData = new FormData();
        formData.append('imagen', file.imagen);
        console.log('file del submit ', file.imagen)

        await axios.put(`http://127.0.0.1:8000/api/vehicle/image/update/${file.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(formData)
      }));
      console.log("Cambios guardados exitosamente");
      navigate(`/my-vehicles/${user}`)

    } catch (error) {
      console.error("Error al guardar los cambios", error);
    }
  };

  const deleteImage = async (imgId) => {
    try {
      console.log(imgId)
      await axios.delete(`http://127.0.0.1:8000/api/imagenes/${imgId}/`)

    } catch (error) {
      console.error('No se ha podido eliminar la imagen ', error)
    }
  }


  const addImage = (e) => {
    const imagen = e.target.files[0];
    console.log(imagen)
    setNewImage(imagen)
  }

  const submitImage = async (e) => {
    if (newImage) {
      const imagen = {
        vehiculo: vehiculoId,
        imagen: newImage
      }

      console.log(imagen)

      try {
        await axios.post(`http://127.0.0.1:8000/api/imagenes/`, imagen, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

      } catch (error) {
        console.error('No se ha podido añadir la imagen ', error)
      }
    } else {
      console.log('No se ha seleccionado ninguna imagen')
    }
  }


  return (
    <div className="login-body" >
      <div className='container'>
        {/* <h1 className='text-center pt-1 edit-vehicle-h1'>Editar imágenes</h1> */}

        <div className='row bg-white p-4 edit-vehicle-imgs-row'>
          {imagenes.length === 0 ? (
            <div>
              <p>No hay imágenes del vehículo.</p>
              <div className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <input className='mb-4' type="file" accept="image/*" onChange={(e) => addImage(e)} />
                    <button onClick={submitImage} className="btn btn-info">Añadir imagen</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="row">
                {imagenes.map(imagen => (
                  <div key={imagen.id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card">
                      <img src={imagen.imagen} className="card-img-top" alt={`Imagen ${imagen.id}`} />
                      <div className="card-body">
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, imagen.id)} />
                        <button className="btn fw-bold edit-vehicle-imgs-delete" onClick={() => deleteImage(imagen.id)}>Eliminar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Card vacío para añadir nueva imagen */}
              <div className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <input className='mb-4' type="file" accept="image/*" onChange={(e) => addImage(e)} />
                    <button onClick={submitImage} className="btn fw-bold edit-vehicle-imgs-add">Añadir imagen</button>
                  </div>
                </div>
              </div>

              <div className="text-center d-flex justify-content-center mt-4">
                <button className="btn btn-primary" onClick={handleSubmit}>Guardar cambios</button>
                <Link to={`/my-vehicles/${user}`} className="btn btn-secondary mx-3">Cancelar</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};