/**
 * List handler for reservation resources
 */

const reservationService = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const {
  hasOnlyValidProperties,
  hasRequiredProperties,
  hasValidDate,
  hasValidTime,
  hasValidNumber,
} = require('./reservations.validation');

async function reservationExists(req, res, next) {
  const reservation = await reservationService.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next;
  }
  next({
    status: 400,
    message: `Reservation ${reservation_id} cannot be found.`,
  });
}

async function list(req, res) {
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;

  const data = await (date
    ? reservationService.list(date)
    : reservationService.search(mobile_number));
  res.json({
    data,
  });
}
async function create(req, res) {
  const data = await reservationService.create(req.body.data);
  res.status(201).json({ data });
}

async function read(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [reservationExists, asyncErrorBoundary(read)],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidDate,
    hasValidTime,
    hasValidNumber,
    asyncErrorBoundary(create),
  ],
};
