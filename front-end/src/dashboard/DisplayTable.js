import React from 'react';

const DisplayTable = ({ tables }) => {
  return (
    <>
      {tables.map((table) => (
        <tr key={table.table_id}>
          <td>{table.table_name}</td>
          <td>{table.capacity}</td>
          <td>{table.occupied ? 'Yes' : 'No'}</td>
        </tr>
      ))}
    </>
  );
};

export default DisplayTable;
