import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import 'react-datepicker/dist/react-datepicker.css';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../styles/BuscadorVehiculos.css'
import { UseBuscador } from '../hooks/UseBuscador';
import { VehiclesContext } from '../context/VehiclesContext';

export const BuscadorVehiculos = ({ setError }) => {
    const navigate = useNavigate();
    const { setFormatStartDate, setFormatEndDate } = useContext(VehiclesContext)
    const { startDate, endDate, startHour, endHour, address, setAddress, handleStartDateChange,
        handleEndDateChange, handleStartHourChange, handleEndHourChange, calculateHourDifference,
        handleSelect } = UseBuscador()


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!address) {
            setError('Por favor, introduce una dirección.')
            return;
        }
        if (!startDate) {
            setError('Por favor, selecciona una fecha de recogida.')
            return;
        }

        if (!startHour) {
            setError('Por favor, selecciona una hora de recogida.')
            return;
        }

        const currentDate = new Date();
        const [startYear, startMonth, startDay] = startDate.split('-')
        const [startHour2, startMinute] = startHour.split(':')
        const startDateAsDate = new Date(startYear, startMonth - 1, startDay, startHour2, startMinute)

        if (startDateAsDate < currentDate) {
            //console.log('Fecha seleccionada ', startDate, ' Hora seleccionada ', startHour)
            setError('La fecha de recogida no puede ser anterior a la fecha actual.')
            return;
        }

        if (!endDate) {
            setError('Por favor, selecciona una fecha de devolución.')
            return;
        }
        if (!endHour) {
            setError('Por favor, selecciona una hora de devolución.')
            return;
        }

        const [endYear, endMonth, endDay] = endDate.split('-')
        const [endHour2, endMinute] = endHour.split(':')
        const endDateAsDate = new Date(endYear, endMonth - 1, endDay, endHour2, endMinute)

        if (endDateAsDate < startDateAsDate) {
            //console.log('Fecha seleccionada ', endDate, ' Hora seleccionada ', endHour)
            setError('La fecha de devolución no puede ser anterior a la fecha de recogida.')
            return;
        }

        const differenceInMilliseconds = endDateAsDate - startDateAsDate;
        const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

        console.log('LA DIFERENCIA DE HORAS ES: ', differenceInHours)

        // if (differenceInHours < 1) {
        //     setError('No es posible alquilar un vehículo por menos de una hora')
        //     return;
        // }

        if (differenceInHours < 0.05) {
            setError('No es posible alquilar un vehículo por menos de 3 minutos')
            return;
        }

        if (differenceInHours >= 720) {
            setError('No es posible alquilar un vehículo más de 30 días')
            return;
        }

        const formatStartDate = startDate + ', ' + startHour
        setFormatStartDate(formatStartDate)
        //console.log(formatStartDate)

        const formatEndDate = endDate + ', ' + endHour
        setFormatEndDate(formatEndDate)
        //console.log(formatEndDate)

        localStorage.setItem('startDate', JSON.stringify(formatStartDate));
        localStorage.setItem('endDate', JSON.stringify(formatEndDate));

        setError('');
        const rentDuration = calculateHourDifference(startDate, startHour, endDate, endHour)
        localStorage.setItem('rentDuration', JSON.stringify(rentDuration));

        //console.log('Horas de alquiler:', rentDuration);
        navigate('/vehicle', { state: { rentDuration, address } })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="buscador-container row">
                <div className="col-lg-4 col-md-12 mb-3">
                    <PlacesAutocomplete
                        value={address}
                        onChange={setAddress}
                        onSelect={handleSelect}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div className="autocomplete-container">
                                <input className="form-control" {...getInputProps({ placeholder: 'Buscar ubicaciones ...' })} />
                                <div className="suggestions-container">
                                    {loading && <div className="loading">Cargando...</div>}
                                    {suggestions.map((suggestion, index) => {
                                        const className = suggestion.active ? 'suggestion-item active' : 'suggestion-item';
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
                </div>

                <div className='col-lg-6 date-time-container-2'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="date-time-container">
                            <DatePicker
                                label="Recogida"
                                onChange={handleStartDateChange}
                                className="mb-2"
                                slotProps={{
                                    textField: {
                                        helperText: 'MM/DD/YYYY',
                                    },
                                }}
                            />
                            <TimePicker
                                label="Hora"
                                onChange={handleStartHourChange}
                                className="custom-timepicker mb-3"
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock,
                                }}
                            />
                            <DatePicker
                                label="Devolución"
                                onChange={handleEndDateChange}
                                className="mb-2"
                                slotProps={{
                                    textField: {
                                        helperText: 'MM/DD/YYYY',
                                    },
                                }}
                            />
                            <TimePicker
                                label="Hora"
                                className="custom-timepicker mb-3"
                                onChange={handleEndHourChange}
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock,
                                }}
                            />
                        </div>
                    </LocalizationProvider>
                </div>


                <div className='col-lg-2'>
                    <button type="submit" className="buscador-button w-100">Buscar</button>
                </div>
            </div>
        </form>

    );
}
