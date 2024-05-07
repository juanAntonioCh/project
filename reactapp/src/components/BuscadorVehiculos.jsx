import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import 'react-datepicker/dist/react-datepicker.css';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export const BuscadorVehiculos = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startDateHour, setStartDateHour] = useState(null);
    const [endDateHour, setEndDateHour] = useState(null);
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
        navigate('/vehicle', { replace: false })
    }

    return (
        <form onSubmit={handleSubmit} className="form-inline d-flex">
            <PlacesAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div >

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
                )}
            </PlacesAutocomplete>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Recogida"
                    slotProps={{
                        textField: {
                            helperText: 'MM/DD/YYYY',
                        },
                    }}
                />
                <DemoContainer components={['TimePicker']}>
                    <TimePicker
                        label="Hora"
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                        }}
                    />
                </DemoContainer>
                <DatePicker
                    label="Devolución"
                    slotProps={{
                        textField: {
                            helperText: 'MM/DD/YYYY',
                        },
                    }}
                />
                <DemoContainer components={['TimePicker']}>
                    <TimePicker
                        label="Hora"
                        className="custom-timepicker"
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                        }}
                    />
                </DemoContainer>
            </LocalizationProvider>

            <button type='submit' className='btn btn-primary'>Buscar</button>
        </form>


    );
}
