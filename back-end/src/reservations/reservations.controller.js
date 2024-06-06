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
  isBooked,
  hasValidStatus,
} = require('./reservations.validation');

async function reservationExists(req, res, next) {
  const reservation = await reservationService.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${req.params.reservation_id} cannot be found.`,
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

async function update(req, res) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await reservationService.update(updatedReservation);
  res.status(200).json({ data });
}

async function updateStatus(req, res) {
  const { status } = res.locals;
  const { reservation_id } = res.locals.reservation;

  const data = await reservationService.updateStatus(reservation_id, status);
  res.status(200).json({ data });
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
    isBooked,
    asyncErrorBoundary(create),
  ],
  update: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidDate,
    hasValidTime,
    hasValidNumber,
    reservationExists,
    hasValidStatus,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    reservationExists,
    hasValidStatus,
    asyncErrorBoundary(updateStatus),
  ],
  reservationExists,
};
