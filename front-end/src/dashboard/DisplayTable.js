import React, { useState } from 'react';
// import { freeTable, listTables } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import { useHistory } from 'react-router-dom';

const DisplayTable = ({ tables, handleFinish }) => {
  const [error, setError] = useState(null);
  const history = useHistory();

  return (
    <>
      <ErrorAlert error={error} />
      {tables.map((table) => (
        <tr key={table.table_id}>
          <td>{table.table_name}</td>
          <td data-table-id-status={table.table_id}>
            {table.reservation_id ? 'Occupied' : 'Free'}
          </td>
          <td>{table.capacity}</td>
          <td>
            {table.reservation_id ? (
              <button
                data-table-id-finish={table.table_id}
                type='button'
                className='btn btn-primary'
                onClick={() => handleFinish(table.table_id)}
              >
                Finish
              </button>
            ) : null}
          </td>
        </tr>
      ))}
    </>
  );
};

export default DisplayTable;
