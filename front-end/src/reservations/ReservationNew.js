import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ReservationForm from './ReservationForm';

import { createReservation } from '../utils/api';

import ErrorAlert from '../layout/ErrorAlert';

const ReservationNew = () => {
  const initialReservationState = {
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: 0,
  };

  const [error, setError] = useState(null);
  const history = useHistory();

  const [reservation, setReservations] = useState({
    ...initialReservationState,
  });

  const handleChange = ({ target }) => {
    const value =
      target.name === 'people' ? Number(target.value) : target.value;
    setReservations({
      ...reservation,
      [target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(reservation);

    try {
      const abortController = new AbortController();
      setError(null);
      await createReservation(reservation, abortController.signal);
      history.push(`/dashboard?date=${reservation.reservation_date}`);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <section>
      <ErrorAlert error={error} />
      <ReservationForm
        reservation={reservation}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </section>
  );
};

export default ReservationNew;
