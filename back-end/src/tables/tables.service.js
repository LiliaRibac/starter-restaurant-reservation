const knex = require('../db/connection');

function list() {
  return knex('tables').select('*').orderBy('table_name');
}

function create(table) {
  return knex('tables')
    .insert(table)
    .returning('*')
    .then((createdRecords) => createdRecords[0]);
}

function read(table_id) {
  return knex('tables').select('*').where({ table_id }).first();
}

function update(table_id, updatedTable) {
  return knex('tables')
    .where({ table_id })
    .update(updatedTable, '*')
    .then((updatedRecords) => updatedRecords[0]);
}

async function clear(table_id) {
  const table = await read(table_id);
  const reservation_id = table.reservation_id;

  const trx = await knex.transaction();
  try {
    await trx('tables')
      .where({ table_id })
      .update({ reservation_id: null, occupied: false });

    await trx('reservations')
      .where({ reservation_id })
      .update({ status: 'finished' });

    await trx.commit();
    return read(table_id);
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

module.exports = { list, create, read, update, clear };
