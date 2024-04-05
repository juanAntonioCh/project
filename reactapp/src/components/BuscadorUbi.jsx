import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

export const BuscadorUbis = () => {
    const [address, setAddress] = useState('');
    const [coordenadas, setCoordenadas] = useState({})
    const navigate = useNavigate();

    const handleSelect = address => {
        setAddress(address);
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                console.log('Success', latLng)
                setCoordenadas(latLng)
                //navigate('/vehicle', {replace:true})
            })
            .catch(error => console.error('Error', error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(coordenadas)
        navigate('/vehicle', {replace:true})

    }

    return (
        <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={handleSelect}
        >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <form onSubmit={handleSubmit}>
                    <input {...getInputProps({ placeholder: 'Buscar ubicaciones ...' })} />
                    <div>
                        {loading && <div>Cargando...</div>}
                        {suggestions.map(suggestion => {
                            return (
                                <div key={suggestion.index} {...getSuggestionItemProps(suggestion)}>
                                    <span>{suggestion.description}</span>
                                    {/* {console.log(suggestion)} */}
                                </div>
                            );
                        })}
                    </div>
                    <input type="submit" value='Buscar' />
                </form>
            )}
        </PlacesAutocomplete>
    );
}
