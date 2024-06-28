import React from 'react';
import { Link } from 'react-router-dom';
import { updateStatus } from '../utils/api';
// import { useHistory } from 'react-router-dom';

async function HandleUpdateStatus(reservation_id, status, history) {
  // const history = useHistory();
  const abortController = new AbortController();
  try {
    await updateStatus(reservation_id, status, abortController.signal);
    history.go(0);
  } catch (error) {
    console.error(error);
  }
  return () => abortController.abort();
}

const DisplayReservation = ({ reservations, history }) => {
  const handleFinishReservation = async (reservation_id) => {
    if (window.confirm('Do you want to cancel this reservation?')) {
      await HandleUpdateStatus(reservation_id, 'finished', history);
    }
  };

  const reservationsTable = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <th scope='row'>{reservation.reservation_time}</th>
      <td>{reservation.reservation_id}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.first_name}</td>
      <td>{reservation.people}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td data-reservation-id-status={reservation.reservation_id}>
        {reservation.status}
      </td>
      {reservation.status === 'booked' && (
        <>
          <td>
            <Link
              to={`/reservations/${reservation.reservation_id}/edit`}
              className='btn btn-secondary'
            >
              Edit
            </Link>
          </td>
          <td>
            <Link
              to={`/reservations/${reservation.reservation_id}/seat`}
              className='btn btn-primary'
            >
              Seat
            </Link>
          </td>
          <td>
            <button
              type='button'
              className='btn btn-danger'
              data-reservation-id-cancel={reservation.reservation_id}
              onClick={() =>
                handleFinishReservation(reservation.reservation_id)
              }
            >
              Cancel
            </button>
          </td>
        </>
      )}
    </tr>
  ));

  return <>{reservationsTable}</>;
};

export default DisplayReservation;
