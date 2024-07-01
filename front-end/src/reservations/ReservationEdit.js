import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { readReservation, updateReservation } from '../utils/api';
import { formatAsDate, formatAsTime } from '../utils/date-time';
import ReservationForm from './ReservationForm';
// Initial form state
const initialFormState = {
  first_name: '',
  last_name: '',
  mobile_number: '',
  reservation_date: '',
  reservation_time: '',
  people: 1,
};

const EditReservation = () => {
  const { reservation_id } = useParams();
  const history = useHistory();

  // State for form data and error handling
  const [formData, setFormData] = useState({ ...initialFormState });
  const [reservationError, setReservationError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Effect to load reservation data on page load
  useEffect(() => {
    const abortController = new AbortController();

    const loadReservation = async () => {
      setReservationError(null);
      setIsLoading(true);

      try {
        const data = await readReservation(
          reservation_id,
          abortController.signal
        );
        console.log(data);

        // Format the fetched data
        const formattedReservation = {
          ...data,
          reservation_date: formatAsDate(data.reservation_date),
          reservation_time: formatAsTime(data.reservation_time),
        };

        setFormData(formattedReservation);
        setIsLoading(false);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          setReservationError(error);
          setIsLoading(false);
        }
      }
    };

    loadReservation();

    // Cleanup function to abort the fetch if the component unmounts
    return () => abortController.abort();
  }, [reservation_id]);

  const handleChange = ({ target }) => {
    let value = target.value;
    if (target.name === 'people') {
      value = Number(value);
    }
    // } else if (target.name === 'mobile_number') {
    //   // Remove any non-numeric characters from the input
    //   value = value.replace(/\D/g, '');
    // }
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateReservation(formData);
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      setReservationError(error);
    }
  };

  // Render loading message while fetching data
  if (isLoading) return <p>Loading...</p>;

  return (
    <main>
      <h1>Edit Reservation</h1>
      <ErrorAlert error={reservationError} />
      <ReservationForm
        reservation={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </main>
  );
};

export default EditReservation;
