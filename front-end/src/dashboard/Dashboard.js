import React, { useEffect, useState } from 'react';
import { listReservations } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import DisplayReservation from './DisplayReservation';
import useQuery from '../utils/useQuery';
import { today } from '../utils/date-time';
import { useHistory } from 'react-router-dom';

/**
 * Dashboard Component
 * Displays reservations and tables for a specific date
 */
function Dashboard({ date }) {
  // Extract query parameters
  const query = useQuery();
  const dateParam = query.get('date');
  if (dateParam) date = dateParam;

  // State variables
  const [reservations, setReservations] = useState([]);

  const [reservationsError, setReservationsError] = useState(null);
  const [formDate, setFormDate] = useState(date);

  const history = useHistory();

  // Load dashboard data whenever the date changes
  useEffect(loadDashboard, [date]);

  // Fetch reservations and tables data
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setFormDate(date);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    return () => abortController.abort();
  }

  // Handle date navigation
  function changeDate(your_direction) {
    const newDate = new Date(date);
    if (your_direction === 'back') {
      newDate.setUTCDate(newDate.getUTCDate() - 1);
    } else if (your_direction === 'today') {
      newDate.setTime(today());
    } else if (your_direction === 'forward') {
      newDate.setUTCDate(newDate.getUTCDate() + 1);
    }
    const formattedDate = newDate.toISOString().slice(0, 10);
    history.push(`/dashboard?date=${formattedDate}`);
  }

  // Handle direct date input change
  function handleDateChange(e) {
    const newDate = e.target.value;
    setFormDate(newDate);
    history.push(`/dashboard?date=${newDate}`);
  }

  // Display text for reservations section
  const reservationText = `Reservations for date ${date}`;

  return (
    <main>
      <h1>Dashboard</h1>
      <div className='d-md-flex mb-3'>
        <h4 className='mb-0 reservation-text'>{reservationText}</h4>
      </div>
      <div style={{ paddingBottom: 25 }}>
        <button
          type='button'
          className='btn btn-secondary'
          onClick={() => changeDate('back')}
        >
          Previous
        </button>
        <button
          type='button'
          className='btn btn-primary'
          onClick={() => changeDate('today')}
        >
          Today
        </button>
        <button
          type='button'
          className='btn btn-secondary'
          onClick={() => changeDate('forward')}
        >
          Next
        </button>
        <label htmlFor='dashboard_date'>
          <input
            type='date'
            id='dashboard_date'
            name='dashboard_date'
            onChange={handleDateChange}
            value={formDate}
            className='form-control date-control'
          />
        </label>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className='table-responsive'>
        <table className='table'>
          <thead className='thead-light'>
            <tr>
              <th scope='col'>Time</th>
              <th scope='col'>ID</th>
              <th scope='col'>Last Name</th>
              <th scope='col'>First Name</th>
              <th scope='col'># Guests</th>
              <th scope='col'>Contact Number</th>
              <th scope='col'>Date</th>
              <th scope='col'>Status</th>
              {/* <th scope='col'></th>
              <th scope='col'></th>
              <th scope='col'></th> */}
            </tr>
          </thead>
          <tbody>
            <DisplayReservation reservations={reservations} history={history} />
          </tbody>
        </table>
      </div>
      <div className='table-responsive'>
        <table className='table'>
          <thead className='thead-light'>
            <tr>
              <th scope='col'>Table Name</th>
              <th scope='col'>Table Capacity</th>
              <th scope='col'>Occupied</th>
              <th scope='col'></th>
            </tr>
          </thead>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;
