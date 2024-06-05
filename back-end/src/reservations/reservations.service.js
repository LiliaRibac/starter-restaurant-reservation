const knex = require('../db/connection');

function list(date) {
  return knex('reservations')
    .select('*')
    .where({ reservation_date: date })
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
    .insert('reservations')
    .select('*')
    .then((createRecords) => createRecords[0]);
}
function read(reservation_id) {
  return knex('reservations').select('*').where({ reservation_id }).first();
}
module.exports = {
  list,
  search,
  create,
  read,
};
