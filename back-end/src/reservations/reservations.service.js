const knex = require('../db/connection');

function list(date) {
  return knex('reservations')
    .select('*')
    .where({ reservation_date: date })
    .whereNot({ status: 'finished' })
    .orderBy('reservation_time');
}

function search(mobile_number) {
  return knex('reservations')
    .select('*')
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, '')}%`
    )
    .orderBy('reservation_date');
}

function create(reservation) {
  return knex('reservations')
    .insert(reservation)
    .returning('*')
    .then((createdRecords) => createdRecords[0]);
}
function read(reservation_id) {
  return knex('reservations').select('*').where({ reservation_id }).first();
}

function update(updatedReservation) {
  return knex('reservations')
    .select('*')
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, '*')
    .then((createdRecords) => createdRecords[0]);
}

function updateStatus(reservation_id, status) {
  return (
    knex('reservations')
      // .select('*')
      .where({ reservation_id })
      .update({ status }, '*')
      .then((createdRecords) => createdRecords[0])
  );
}
module.exports = {
  list,
  search,
  create,
  read,
  update,
  updateStatus,
};
