import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
// const ReservationForm = ({
//   reservation,
//   handleChange,
//   handleSubmit,
//   formErrors,
// }) => {

const ReservationForm = ({
  reservation,
  handleChange,
  handleSubmit,
  formErrors,
}) => {
  const history = useHistory();
  if (!reservation) {
    return <p>Loading...</p>;
  }

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
            value={reservation.first_name}
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
            value={reservation.last_name}
            className='form-control'
            required
          />
        </label>
      </div>
      <div className='row'>
        <label htmlFor='mobile_number' className='col'>
          Mobile number:
          <input
            type='tel'
            id='mobile_number'
            name='mobile_number'
            onChange={handleChange}
            value={reservation.mobile_number}
            className='form-control'
            required
          />
          {formErrors.mobile_number && (
            <div className='text-danger'>{formErrors.mobile_number}</div>
          )}
        </label>
      </div>
      <div className='row'>
        <label htmlFor='reservation_date' className='col'>
          Date of reservation:
          <input
            type='date'
            id='reservation_date'
            name='reservation_date'
            onChange={handleChange}
            value={reservation.reservation_date ?? ''}
            className='form-control'
            required
          />
        </label>
        <label htmlFor='reservation_time' className='col'>
          Time of reservation:
          <input
            type='time'
            id='reservation_time'
            name='reservation_time'
            onChange={handleChange}
            value={reservation.reservation_time}
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
            onChange={handleChange}
            value={reservation.people}
            className='form-control'
            min='1'
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
        className='btn btn-secondary'
      >
        Cancel
      </button>
    </form>
  );
};

export default ReservationForm;
