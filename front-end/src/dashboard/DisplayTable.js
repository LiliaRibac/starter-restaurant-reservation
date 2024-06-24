import React, { useState } from 'react';
import { freeTable, listTables } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import { useHistory } from 'react-router-dom';

const DisplayTable = ({ tables, setTables }) => {
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleFinish = async (tableId) => {
    const confirm = window.confirm(
      'Is this table ready to seat new guests? This cannot be undone.'
    );
    if (confirm) {
      const abortController = new AbortController();
      setError(null);
      try {
        await freeTable(tableId, abortController.signal);
        // Reload the table list after finishing the table
        const updatedTables = await listTables(abortController.signal);
        setTables(updatedTables);
      } catch (error) {
        setError(error);
      }
    }
  };

  return (
    <>
      <ErrorAlert error={error} />
      {tables.map((table) => (
        <tr key={table.table_id}>
          <td>{table.table_name}</td>
          <td>{table.capacity}</td>
          <td>{table.occupied ? 'Yes' : 'No'}</td>
          {table.occupied && (
            <td>
              <button
                data-table-id-finish={table.table_id}
                onClick={() => handleFinish(table.table_id)}
                className='btn btn-danger'
              >
                Finish
              </button>
            </td>
          )}
        </tr>
      ))}
    </>
  );
};

export default DisplayTable;
