import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';
import { readReservation, updateReservation } from '../utils/api';
import formatReservationDate from '../utils/format-reservation-date';
import formatReservationTime from '../utils/format-reservation-time';

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

        // Format the fetched data
        const formattedReservation = {
          ...data,
          reservation_date: formatReservationDate(data.reservation_date),
          reservation_time: formatReservationTime(data.reservation_time),
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

  // Handle input change
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
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
    <form onSubmit={handleSubmit} className='form-group'>
      <div className='row'>
        <label htmlFor='first_name' className='col'>
          First name:
          <input
            type='text'
            id='first_name'
            name='first_name'
            onChange={handleChange}
            value={formData.first_name}
            className='form-control'
            required
          />
        </label>
        <label htmlFor='last_name' className='col'>
          Last name:
          <input
            type='text'
            id='last_name'
            name='last_name'
            onChange={handleChange}
            value={formData.last_name}
            className='form-control'
            required
          />
        </label>
      </div>
      <div className='row'>
        <label htmlFor='reservation_date' className='col'>
          Date:
          <input
            type='date'
            id='reservation_date'
            name='reservation_date'
            onChange={handleChange}
            value={formData.reservation_date}
            className='form-control'
            required
          />
        </label>
        <label htmlFor='reservation_time' className='col'>
          Time:
          <input
            type='time'
            id='reservation_time'
            name='reservation_time'
            onChange={handleChange}
            value={formData.reservation_time}
            className='form-control'
            required
          />
        </label>
      </div>
      <div className='row'>
        <label htmlFor='people' className='col'>
          Number of people:
          <input
            type='number'
            id='people'
            name='people'
            min='1'
            onChange={handleChange}
            value={formData.people}
            className='form-control'
            required
          />
        </label>
        <label htmlFor='mobile_number' className='col'>
          Mobile number:
          <input
            type='text'
            id='mobile_number'
            name='mobile_number'
            onChange={handleChange}
            value={formData.mobile_number}
            className='form-control'
            required
          />
        </label>
      </div>
      <button type='submit' className='btn btn-primary'>
        Submit
      </button>
      <button
        type='button'
        onClick={() => history.goBack()}
        className='btn btn-danger'
      >
        Cancel
      </button>
      <div className='row'>
        <ErrorAlert error={reservationError} />
      </div>
    </form>
  );
};

export default EditReservation;
