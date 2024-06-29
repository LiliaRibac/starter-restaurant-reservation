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
    people: 1,
  };

  const [error, setError] = useState(null);
  // const [formErrors, setFormErrors] = useState({});
  const history = useHistory();

  const [reservation, setReservations] = useState({
    ...initialReservationState,
  });

  // const validateForm = () => {
  //   const errors = {};
  //   const mobileRegex = /^\d{3}-\d{3}-\d{4}$/;

  //   if (!mobileRegex.test(reservation.mobile_number)) {
  //     errors.mobile_number = 'Invalid contact number';
  //   }
  //   return errors;
  // };

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

    // const errors = validateForm();
    // if (Object.keys(errors).length > 0) {
    //   setFormErrors(errors);
    //   return;
    // }

    const abortController = new AbortController();
    try {
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
        // formErrors={formErrors}
      />
    </section>
  );
};

export default ReservationNew;
