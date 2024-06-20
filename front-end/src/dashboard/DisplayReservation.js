import React from 'react';
import { putSeatingStatus } from '../utils/api';

async function cancelReservation(reservation_id, history) {
  if (
    window.confirm(
      `Do you want to cancel this reservation? This cannot be undone.`
    )
  ) {
    const abortController = new AbortController();
    await putSeatingStatus(
      { reservation_id, status: 'cancelled' },
      abortController.signal
    );
    history.go(0);
    return () => abortController.abort();
  }
}

const DisplayReservation = ({ reservations, history }) => {
  const reservationsTable = reservations.map((reservation) => {
    if (
      reservation.status !== 'finished' &&
      reservation.status !== 'cancelled'
    ) {
      return (
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
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={() =>
                    history.push(
                      `/reservations/${reservation.reservation_id}/edit`
                    )
                  }
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={() =>
                    history.push(
                      `/reservations/${reservation.reservation_id}/seat`
                    )
                  }
                >
                  Seat
                </button>
              </td>
              <td>
                <button
                  type='button'
                  className='btn btn-danger'
                  data-reservation-id-cancel={reservation.reservation_id}
                  onClick={async () => {
                    await cancelReservation(
                      reservation.reservation_id,
                      history
                    );
                  }}
                >
                  Cancel
                </button>
              </td>
            </>
          )}
        </tr>
      );
    }
    return null;
  });

  return <>{reservationsTable}</>;
};

export default DisplayReservation;