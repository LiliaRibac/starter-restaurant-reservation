const tableService = require('./tables.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const hasProperties = require('../errors/hasProperties');
const reservationService = require('../reservations/reservations.service');

const hasRequiredProperties = hasProperties('table_name', 'capacity');

const VALID_PROPERTIES = ['table_name', 'capacity', 'reservation_id'];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(', ')}`,
    });
  }
  next();
}

async function tableExists(req, res, next) {
  const table = await tableService.read(req.params.table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table ${req.params.table_id} cannot be found.`,
  });
}

function tableName(req, res, next) {
  const { table_name } = req.body.data;

  if (table_name.length < 2) {
    return next({ status: 400, message: `Invalid table_name` });
  }
  next();
}

function hasValidCapacity(req, res, next) {
  const { capacity } = req.body.data;

  if (typeof capacity !== 'number' || capacity < 1) {
    return next({ status: 400, message: `Invalid capacity` });
  }
  next();
}

function validateSeatRequest(req, res, next) {
  const { data = {} } = req.body;

  if (!data.reservation_id) {
    return next({
      status: 400,
      message: 'reservation_id is missing',
    });
  }

  next();
}
async function list(req, res) {
  const data = await tableService.list();
  res.json({ data });
}

async function create(req, res) {
  const data = await tableService.create(req.body.data);
  res.status(201).json({ data });
}

async function seat(req, res, next) {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  if (!reservation_id) {
    return next({
      status: 400,
      message: 'reservation_id is missing',
    });
  }

  const table = res.locals.table;

  if (table.reservation_id) {
    return next({
      status: 400,
      message: `Table ${table_id} is already occupied.`,
    });
  }

  const reservation = await reservationService.read(reservation_id);
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ${reservation_id} cannot be found.`,
    });
  }

  if (reservation.status === 'seated') {
    return next({
      status: 400,
      message: 'Reservation is already seated',
    });
  }

  if (table.capacity < reservation.people) {
    return next({
      status: 400,
      message: `Table capacity is less than the number of people in the reservation.`,
    });
  }

  await tableService.update(table_id, { reservation_id });
  await reservationService.updateStatus(reservation_id, 'seated');

  res.json({ data: { status: 'seated' } });
}

async function clear(req, res, next) {
  const { table_id } = req.params;

  const table = res.locals.table;

  if (!table.reservation_id) {
    return next({
      status: 400,
      message: `Table ${table_id} is not occupied.`,
    });
  }

  await tableService.clear(table_id);

  res.json({ data: { status: 'finished' } });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    tableName,
    hasValidCapacity,
    asyncErrorBoundary(create),
  ],
  seat: [
    asyncErrorBoundary(tableExists),
    validateSeatRequest,
    asyncErrorBoundary(seat),
  ],
  clear: [asyncErrorBoundary(tableExists), asyncErrorBoundary(clear)],
};
