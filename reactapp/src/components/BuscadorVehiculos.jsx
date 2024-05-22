import React from 'react';
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

export const BuscadorVehiculos = ({setError}) => {
    const navigate = useNavigate();
    const { startDate, endDate,
        startHour, endHour,
        address, setAddress,
        handleStartDateChange,
        handleEndDateChange,
        handleStartHourChange,
        handleEndHourChange,
        calculateHourDifference, handleSelect } = UseBuscador()


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
            console.log('Fecha seleccionada ', startDate, ' Hora seleccionada ', startHour)
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
            console.log('Fecha seleccionada ', endDate, ' Hora seleccionada ', endHour)
            setError('La fecha de devolución no puede ser anterior a la fecha de recogida.')
            return;
        }

        const differenceInMilliseconds = endDateAsDate - startDateAsDate;
        const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

        console.log('LA DIFERENCIA DE HORAS ES: ', differenceInHours)

        if (differenceInHours < 1) {
            setError('No es posible alquilar un vehículo por menos de una hora')
            return;
        }

        setError('');
        const rentDuration = calculateHourDifference(startDate, startHour, endDate, endHour)
        console.log('Horas de alquiler:', rentDuration);
        navigate('/vehicle', { state: { rentDuration, address } })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='row buscador'>
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
            </div>

            <div className='d-flex'>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <div className='date-picker'>
                        <DatePicker
                            label="Recogida"
                            onChange={handleStartDateChange}
                            slotProps={{
                                textField: {
                                    helperText: 'MM/DD/YYYY',
                                },
                            }}
                        />
                    </div>

                    <div className='time-picker'>
                        {/* <DemoContainer components={['TimePicker']}> */}
                        <TimePicker
                            label="Hora"
                            onChange={handleStartHourChange}
                            viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                                seconds: renderTimeViewClock,
                            }}
                        />
                        {/* </DemoContainer> */}
                    </div>

                    <div className='date-picker'>
                        <DatePicker
                            label="Devolución"
                            onChange={handleEndDateChange}
                            slotProps={{
                                textField: {
                                    helperText: 'MM/DD/YYYY',
                                },
                            }}
                        />
                    </div>

                    {/* <DemoContainer components={['TimePicker']}> */}
                    <div className='time-picker'>
                        <TimePicker
                            label="Hora"
                            className="custom-timepicker"
                            onChange={handleEndHourChange}
                            viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                                seconds: renderTimeViewClock,
                            }}
                        />
                    </div>
                    {/* </DemoContainer> */}

                </LocalizationProvider>
            </div>

            <div>
                <button type='submit' className='btn btn-primary'>Buscar</button>
            </div>
        </form>
    );
}
