import React, { useState } from 'react';

export const Map = () => {


    return (
        <LoadScriptNext
            googleMapsApiKey='AIzaSyC_G0xCXyALB3IgkE5D4RpWWAxRIg9xCuQ'>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={11.5}
                center={defaultCenter}
                onLoad={handleLoad}
            >
                {
                    obtenerVehiculosPorPagina().map(vehiculo => {
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
