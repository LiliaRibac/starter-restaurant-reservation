import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createTable } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

const TableNew = () => {
  const initialFormState = {
    table_name: '',
    capacity: 0,
  };

  const [tables, setTables] = useState({ ...initialFormState });
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleChange = ({ target }) => {
    const value =
      target.name === 'capacity' ? Number(target.value) : target.value;
    setTables({
      ...tables,
      [target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const abortController = new AbortController();
    try {
      setError(null);
      await createTable(tables, abortController.signal);
      history.push('/dashboard');
    } catch (error) {
      setError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='form-group row'>
        <label htmlFor='table_name' className='col'>
          Table Name:
          <input
            type='text'
            id='table_name'
            name='table_name'
            className='form-control'
            minLength='2'
            onChange={handleChange}
            value={tables.table_name}
            required
          />
        </label>
        <label htmlFor='capacity' className='col'>
          Capacity:
          <input
            type='number'
            id='capacity'
            name='capacity'
            min='1'
            className='form-control'
            onChange={handleChange}
            value={tables.capacity}
            required
          />
        </label>
      </div>
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
      <div className='row'>
        <ErrorAlert error={error} />
      </div>
    </form>
  );
};

export default TableNew;
