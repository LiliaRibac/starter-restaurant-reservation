// import React, { useState } from 'react';
// import { listReservations } from '../utils/api';
// import DisplayReservation from '../dashboard/DisplayReservation';
// import { useHistory } from 'react-router-dom';

// const Search = () => {
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [reservations, setReservations] = useState([]);
//   const [noResults, setNoResults] = useState(false);
//   const history = useHistory();

//   const handleChange = (e) => {
//     setMobileNumber(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = await listReservations({ mobile_number: mobileNumber });
//       setReservations(data);
//       setNoResults(data.length === 0);
//     } catch (error) {
//       console.log('Error searching reservation:', error);
//     }
//   };
//   return (
//     <section>
//       <h1>Search your reservation</h1>
//       <form onSubmit={handleSubmit} className='form-group'>
//         <div className='row search-bar'>
//           <label
//             htmlFor='mobile_number'
//             style={{ maxWidth: 500 }}
//             className='col'
//           >
//             <input
//               type='text'
//               id='mobile_number'
//               name='mobile_number'
//               placeholder="Enter a customer's phone number"
//               value={mobileNumber}
//               className='form-control'
//               onChange={handleChange}
//             />
//           </label>
//           <button type='submit' className='btn btn-primary'>
//             Find
//           </button>
//         </div>
//       </form>
//       {noResults ? (
//         <p>No reservations found.</p>
//       ) : (
//         <div>
//           <h3>Reservations</h3>
//           {/* <ul>
//             {reservations.map((reservation) => (
//               <li key={reservation.reservation_id}>
//                 {reservation.first_name} {reservation.last_name} -{' '}
//                 {reservation.mobile_number}
//               </li>
//             ))}
//           </ul> */}

//           <div className='table-responsive'>
//             <table className='table'>
//               <thead className='thead-light'>
//                 <tr>
//                   <th scope='col'>Time</th>
//                   <th scope='col'>ID</th>
//                   <th scope='col'>Last Name</th>
//                   <th scope='col'>First Name</th>
//                   <th scope='col'># Guests</th>
//                   <th scope='col'>Contact Number</th>
//                   <th scope='col'>Date</th>
//                   <th scope='col'>Status</th>
//                   <th scope='col'></th>
//                   <th scope='col'></th>
//                   <th scope='col'></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <DisplayReservation
//                   reservations={reservations ? reservations : []}
//                   history={history}
//                 />
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default Search;

import React, { useState } from 'react';
import { listReservations } from '../utils/api';
import DisplayReservation from '../dashboard/DisplayReservation';
import { useHistory } from 'react-router-dom';

const Search = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [reservations, setReservations] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleChange = (e) => {
    const value = e.target.value;
    // Remove any non-numeric characters from the input
    const cleanedValue = value.replace(/\D/g, '');
    setMobileNumber(cleanedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the mobile number
    const { isValid, errors, formattedNumber } =
      validateMobileNumber(mobileNumber);
    if (!isValid) {
      setError(errors);
      setReservations([]);
      return;
    }

    try {
      const data = await listReservations({ mobile_number: formattedNumber });
      setReservations(data);
      setNoResults(data.length === 0);
      setError(null);
    } catch (error) {
      console.log('Error searching reservation:', error);
      setError('An error occurred while searching for reservations.');
    }
  };

  return (
    <section>
      <h1>Search your reservation</h1>
      <form onSubmit={handleSubmit} className='form-group'>
        <div className='row search-bar'>
          <label
            htmlFor='mobile_number'
            style={{ maxWidth: 500 }}
            className='col'
          >
            <input
              type='text'
              id='mobile_number'
              name='mobile_number'
              placeholder="Enter a customer's phone number"
              value={mobileNumber}
              className='form-control'
              onChange={handleChange}
            />
          </label>
          <button type='submit' className='btn btn-primary'>
            Find
          </button>
        </div>
      </form>
      {error && <p className='text-danger'>{error}</p>}
      {noResults ? (
        <p>No reservations found.</p>
      ) : (
        <div>
          <h3>Reservations</h3>
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
                  <th scope='col'></th>
                  <th scope='col'></th>
                  <th scope='col'></th>
                </tr>
              </thead>
              <tbody>
                <DisplayReservation
                  reservations={reservations ? reservations : []}
                  history={history}
                />
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

function validateMobileNumber(mobile_number) {
  const formattedNumber = mobile_number.replace(/\D/g, ''); // Remove all non-digit characters
  const errors = [];

  // Check if the cleaned mobile number has exactly 10 digits
  if (!/^\d{10}$/.test(formattedNumber)) {
    errors.push(
      `Mobile number must contain exactly 10 digits. Received ${mobile_number}.`
    );
  }

  // If the mobile number is valid, reformat it to XXX-XXX-XXXX
  if (errors.length === 0) {
    mobile_number = formattedNumber.replace(
      /(\d{3})(\d{3})(\d{4})/,
      '$1-$2-$3'
    );
  }

  return {
    isValid: errors.length === 0,
    errors: errors.join('\n'),
    formattedNumber: mobile_number,
  };
}

export default Search;
