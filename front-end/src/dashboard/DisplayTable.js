import React, { useState } from 'react';
import { freeTable, listTables } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import { useHistory } from 'react-router-dom';

const DisplayTable = ({ tables, setTables }) => {
  const [error, setError] = useState(null);
  const history = useHistory();

  // const handleFinish = async (tableId) => {
  //   const confirm = window.confirm(
  //     'Is this table ready to seat new guests? This cannot be undone.'
  //   );
  //   if (confirm) {
  //     const abortController = new AbortController();
  //     setError(null);
  //     try {
  //       // await freeTable(tableId, abortController.signal);
  //       // history.push('/');
  //       if (confirm) {
  //         await freeTable(tables.tableId, abortController.signal);
  //         history.push('/');
  //       }
  //     } catch (error) {
  //       setError(error);
  //     }
  //   }
  // };

  const handleFinish = async (tableId) => {
    const controller = new AbortController();
    const confirm = window.confirm(
      'Is this table ready to seat new guests? This cannot be undone.'
    );
    if (confirm) {
      freeTable(Number(tableId), controller.signal)
        .then(() => {
          history.push('/');
        })
        .catch(setError);
    }
    return () => controller.abort();
  };
  return (
    <>
      <ErrorAlert error={error} />
      {tables.map((table) => (
        <tr key={table.table_id}>
          <td>{table.table_name}</td>
          <td data-table-id-status={table.table_id}>
            {table.occupied ? 'Occupied' : 'Free'}
          </td>
          <td>{table.capacity}</td>
          <td>
            {table.occupied ? (
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
