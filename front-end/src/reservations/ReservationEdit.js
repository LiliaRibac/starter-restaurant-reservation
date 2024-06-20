import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { readReservation, updateReservation } from '../utils/api';
import { formatReservationDate } from '../utils/format-reservation-date';

import { formatReservationTime } from '../utils/format-reservation-time';

import ReservationForm from './ReservationForm';
import ErrorAlert from '../layout/ErrorAlert';

const ReservationEdit = () => {
  const { reservation_id } = useParams();
  const history = useHistory();

  const initialFormState = {
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: 0,
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [reservationError, setReservationError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle input changes
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  // Load the reservation data
  useEffect(() => {
    const abortController = new AbortController();
    setReservationError(null);
    setIsLoading(true);

    readReservation(reservation_id, abortController.signal)
      .then((reservation) => {
        formatReservationDate(reservation);
        formatReservationTime(reservation);
        setFormData(reservation);
        setIsLoading(false);
      })
      .catch((error) => {
        setReservationError(error);
        setIsLoading(false);
      });

    return () => abortController.abort();
  }, [reservation_id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const abortController = new AbortController();

    try {
      await updateReservation(formData, abortController.signal);
      history.goBack();
    } catch (error) {
      setReservationError(error);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Reservation</h1>
      <ErrorAlert error={reservationError} />
      <ReservationForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default ReservationEdit;
