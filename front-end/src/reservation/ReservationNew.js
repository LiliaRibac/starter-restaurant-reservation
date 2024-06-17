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
    reservation_data: '',
    reservation_time: '',
    people: 1,
  };

  const history = useHistory();
  const [reservation, setReservations] = useState({
    ...initialReservationState,
  });

  const handleChange = ({ target }) => {
    setReservations({
      ...reservation,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
