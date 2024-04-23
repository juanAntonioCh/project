import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

export const BuscadorUbis = () => {
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleSelect = address => {
        setAddress(address);
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                console.log('Success', latLng)
                localStorage.setItem('coordenadas', JSON.stringify(latLng))
                console.log(address)
                //navigate('/vehicle', {replace:true})
            })
            .catch(error => console.error('Error', error))
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/vehicle', {replace:false})
    }

    return (
        <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={handleSelect}
        >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <form onSubmit={handleSubmit} className="form-inline d-flex">
                    <div className="flex-grow-1 position-relative"> 
                        <input className='form-control' {...getInputProps({ placeholder: 'Buscar ubicaciones ...' })} />

                        <div className='suggestions-container'>
                            {loading && <div className="loading">Cargando...</div>}
                            {suggestions.map((suggestion, index) => {
                                const className = suggestion.active
                                    ? 'suggestion-item active'
                                    : 'suggestion-item';
                                return (
                                    <div key={index} {...getSuggestionItemProps(suggestion, { className })}>
                                        <span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button type="submit" className='btn btn-primary'>Buscar</button>
                </form>
            )}
        </PlacesAutocomplete>


    );
}
