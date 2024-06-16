import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

export const UseBuscador = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startHour, setStartHour] = useState(null);
    const [endHour, setEndHour] = useState(null);
    const [address, setAddress] = useState('');

    const handleStartDateChange = (e) => {
        const day = e.$D;
        const month = e.$M + 1; // Los meses en Day.js son base cero, por lo que se suma 1
        const year = e.$y;
        setStartDate(`${year}-${month}-${day}`)

    }
    const handleEndDateChange = (e) => {
        const day = e.$D;
        const month = e.$M + 1; // Los meses en Day.js son base cero, por lo que se suma 1
        const year = e.$y;
        setEndDate(`${year}-${month}-${day}`)

    }
    const handleStartHourChange = (e) => {
        const hour = e.$H;
        const min = e.$m;
        const segs = e.$s;
        setStartHour(`${hour}:${min}`)
    }

    const handleEndHourChange = (e) => {
        const hour = e.$H;
        const min = e.$m;
        const segs = e.$s;
        setEndHour(`${hour}:${min}`)
    }

    const calculateHourDifference = (startDate, startHour, endDate, endHour) => {
        const start = dayjs(`${startDate} ${startHour}`);
        const end = dayjs(`${endDate} ${endHour}`);
        const diffInMinutes = end.diff(start, 'minute');
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;

        return { hours, minutes };
    }

    // useEffect(() => {
    //     console.log(startDate)
    // }, [startDate])

    // useEffect(() => {
    //     console.log(endDate)
    // }, [endDate])

    // useEffect(() => {
    //     console.log(startHour)
    // }, [startHour])

    // useEffect(() => {
    //     console.log(endHour)
    // }, [endHour])

    const handleSelect = address => {
        setAddress(address);
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                //console.log('Success', latLng)
                localStorage.setItem('coordenadas', JSON.stringify(latLng))
                //console.log(address)
                //navigate('/vehicle', {replace:true})
            })
            .catch(error => console.error('Error', error))
    };

    return {
        startDate, 
        endDate, 
        startHour, 
        endHour,
        address, setAddress,
        handleStartDateChange,
        handleEndDateChange,
        handleStartHourChange,
        handleEndHourChange,
        calculateHourDifference,
        handleSelect,
    }
}
