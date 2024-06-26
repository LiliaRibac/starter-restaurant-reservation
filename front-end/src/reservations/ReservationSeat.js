import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { listTables, seatReservation } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export const ReservationSeat = () => {
  const { reservation_id } = useParams();
  const history = useHistory();
  const [tables, setTables] = useState([]);
  const [table_id, setTableId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const loadTables = async () => {
      setError(null);
      try {
        const tableList = await listTables(abortController.signal);
        setTables(tableList);
      } catch (error) {
        setError(error);
      }
    };
    loadTables();
    return () => abortController.abort();
  }, []);

  const handleChange = (e) => {
    setTableId(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);
    try {
      await seatReservation(reservation_id, table_id, abortController.signal);
      history.push(`/dashboard`);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <label htmlFor='table_id'>Table number:</label>
        <select
          name='table_id'
          id='table_id'
          value={table_id}
          onChange={handleChange}
          required
        >
          <option value=''>Select a table</option>
          {tables.map((table) => (
            <option key={table.table_id} value={table.table_id}>
              {table.table_name} - {table.capacity}
            </option>
          ))}
        </select>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
        <button
          type='button'
          className='btn btn-danger'
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};
