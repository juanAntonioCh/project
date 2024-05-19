import React, { useState } from 'react';
import { GoogleMap, LoadScriptNext, Marker, useJsApiLoader } from '@react-google-maps/api';
//import { AdvancedMarkerElement } from '@googlemaps/marker';

export const MapComponent = ({ vehiculos }) => {
    const [map, setMap] = useState(null);

    console.log(vehiculos)

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyC_G0xCXyALB3IgkE5D4RpWWAxRIg9xCuQ',
        libraries: ['marker']
    });

    const mapStyles = {
        height: "600px",
        width: "100%",
        borderRadius: '20px',
    };

    const coordenadas = JSON.parse(localStorage.getItem('coordenadas'))
    //console.log('Estas son las coordenandas: ', coordenadas)
    const defaultCenter = {
        lat: coordenadas.lat, lng: coordenadas.lng
    }

    const iconMarker = {
        path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "blue",
        fillOpacity: 0.8,
        strokeWeight: 0.5,
        rotation: 0,
        scale: 1.8,
        anchor: new google.maps.Point(0, 20),
    }

    const handleLoad = (map) => {
        setMap(map);
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <LoadScriptNext googleMapsApiKey='AIzaSyC_G0xCXyALB3IgkE5D4RpWWAxRIg9xCuQ'>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={11.5}
                center={defaultCenter}
                onLoad={handleLoad}
            >
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
    );

};
