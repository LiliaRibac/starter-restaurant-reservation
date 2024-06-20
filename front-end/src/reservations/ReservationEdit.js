// import { useState, useEffect } from 'react';
// import { useParams, useHistory } from 'react-router-dom';
// import {
//   readReservation,
//   updateReservation,
//   listReservations,
// } from '../utils/api';
// import ReservationForm from './ReservationForm';
// import ErrorAlert from '../layout/ErrorAlert';

// const ReservationEdit = () => {
//   const { reservation_id } = useParams();
//   const history = useHistory();

//   const initialFormState = {
//     first_name: '',
//     last_name: '',
//     mobile_number: '',
//     reservation_date: '',
//     reservation_time: '',
//     people: 0,
//   };
//   const [formData, setFormData] = useState({ ...initialFormState });
//   const [reservation, setReservation] = useState(null);
//   const [reservationError, setReservationError] = useState(null);

//   const handleChange = ({ targe }) => {
//     setFormData({
//       ...formData,
//       [targe.name]: targe.value,
//     });
//   };

//   useEffect(loadReservation, [reservation_id]);

//   const loadReservation = () => {
//     const abortController = new abortController();
//     setReservationError(null);
//     listReservations(reservation_id, abortController.signal)
//       .then(setFormData)
//       .catch(setReservationError);
//     return () => abortController.abort();
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     updateReservation(formData, setReservationError, history);
//   };

//   return (
//     <ReservationForm
//       handleSubmit={handleSubmit}
//       initialFormState={reservation}
//     />
//   );
// };

// export default ReservationEdit;

import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  readReservation,
  updateReservation,
  formatReservationDate,
  formatReservationTime,
} from '../utils/api';
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
