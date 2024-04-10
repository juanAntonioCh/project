import React from 'react';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';

export const Mapa = ({ vehiculos }) => {
    
    const coordenadas = JSON.parse(localStorage.getItem('coordenadas'))
    console.log('Estas son las coordenandas: ', coordenadas)

    const mapStyles = {
        height: "400px",
        width: "100%"
    };

    const defaultCenter = {
        lat: coordenadas.lat, lng: coordenadas.lng
        //lat: 43.3623436, lng: -8.4115401
    }

    const iconMarker = {
        path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "blue",
        fillOpacity: 0.8,
        strokeWeight: 0.5,
        rotation: 0,
        scale: 1.8,
        anchor: new google.maps.Point(0, 20),
    };

    //console.log(vehiculos[0].latitud)

    return (
        <LoadScriptNext
            googleMapsApiKey='AIzaSyC_G0xCXyALB3IgkE5D4RpWWAxRIg9xCuQ'>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={10}
                center={defaultCenter}>
                {
                    vehiculos.map(vehiculo => {
                        return (
                            <Marker key={vehiculo.id}
                                icon={iconMarker}
                                position={{
                                    lat: vehiculo.latitud,
                                    lng: vehiculo.longitud
                                }}
                            />
                        )
                    })
                }
            </GoogleMap>
        </LoadScriptNext>
    )
}

