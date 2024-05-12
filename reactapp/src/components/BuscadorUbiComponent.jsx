import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { UseBuscador } from '../hooks/UseBuscador';

export const BuscadorUbiComponent = () => {
    const { handleSelect, address, setAddress } = UseBuscador()

    return (
        <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={handleSelect}
        >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className="form-inline d-flex">
                    <div className="flex-grow-1 position-relative">
                        <input className='form-control' {...getInputProps({ placeholder: 'Buscar ubicaciones ...' })} />

                        <div className='suggestions-container'>
                            {loading && <div className="loading">Cargando...</div>}
                            {suggestions.map((suggestion, index) => {
                                const className = suggestion.active ? 'suggestion-item active' : 'suggestion-item';
                                return (
                                    <div key={index} className={className} onClick={() => getSuggestionItemProps(suggestion)}>
                                        <span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            )}
        </PlacesAutocomplete>
    );
}
