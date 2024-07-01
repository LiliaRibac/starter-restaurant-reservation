import React, { useEffect, useState } from 'react';
import { listReservations, listTables, freeTable } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import DisplayReservation from './DisplayReservation';
import DisplayTable from './DisplayTable';
import useQuery from '../utils/useQuery';
import { today } from '../utils/date-time';
import { useHistory } from 'react-router-dom';

function Dashboard({ date }) {
  // const query = useQuery();
  const dateParam = query.get('date');
  if (dateParam) date = dateParam;

  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [formDate, setFormDate] = useState(date);

  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    setFormDate(date);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal).then(setTables).catch(setTablesError);

    return () => abortController.abort();
  }

  function changeDate(direction) {
    let newDate = new Date(date);
    if (direction === 'back') {
      newDate.setUTCDate(newDate.getUTCDate() - 1);
    } else if (direction === 'today') {
      newDate = new Date(today());
    } else if (direction === 'forward') {
      newDate.setUTCDate(newDate.getUTCDate() + 1);
    }
    const formattedDate = newDate.toISOString().slice(0, 10);
    history.push(`/dashboard?date=${formattedDate}`);
  }

  function handleDateChange(e) {
    const newDate = e.target.value;
    setFormDate(newDate);
    history.push(`/dashboard?date=${newDate}`);
  }

  async function handleFinish(table_id) {
    if (
      window.confirm(
        'Is this table ready to seat new guests? This cannot be undone.'
      )
    ) {
      const abortController = new AbortController();
      try {
        await freeTable(table_id, abortController.signal);
        history.goBack();
      } catch (error) {
        setTablesError(error);
      }
    }
  }
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
      <ErrorAlert error={tablesError} />
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
              {/* <th scope='col'>Edit</th>
              <th scope='col'>Your Seat</th>
              <th scope='col'>Cancel</th> */}
              <th cop='col'></th>
              <th cop='col'></th>
              <th cop='col'></th>
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
          <tbody>
            <DisplayTable
              tables={tables}
              setTables={setTables}
              handleFinish={handleFinish}
            />
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;
