const VALID_PROPERTIES = [
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people',
  'status',
  'reservation_id',
  'created_at',
  'updated_at',
];

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

function hasRequiredProperties(req, res, next) {
  const requiredFields = [
    'first_name',
    'last_name',
    'mobile_number',
    'reservation_date',
    'reservation_time',
    'people',
  ];
  const { data = {} } = req.body;
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length) {
    return next({
      status: 400,
      message: `Missing required field(s): ${missingFields.join(', ')}`,
    });
  }
  next();
}

function hasValidDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const formatDate = new Date(`${reservation_date}T${reservation_time}`);
  const day = new Date(reservation_date).getUTCDay();

  if (isNaN(Date.parse(reservation_date))) {
    return next({
      status: 400,
      message: `Invalid reservation_date`,
    });
  }

  if (day === 2) {
    return next({
      status: 400,
      message: `Sorry, our Restaurant is closed on Tuesdays.`,
    });
  }

  if (formatDate <= new Date()) {
    return next({
      status: 400,
      message: `We take reservation for today or a future date.`,
    });
  }
  next();
}

function hasValidTime(req, res, next) {
  const { reservation_time } = req.body.data;
  if (!/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(reservation_time)) {
    return next({
      status: 400,
      message: `Invalid reservation_time`,
    });
  }

  const hours = Number(reservation_time.split(':')[0]);
  const minutes = Number(reservation_time.split(':')[1]);

  if (hours < 10 || (hours === 10 && minutes < 30)) {
    return next({
      status: 400,
      message: `Reservation must be after 10:30AM`,
    });
  }
  if (hours > 21 || (hours === 21 && minutes > 30)) {
    return next({
      status: 400,
      message: `Reservation must be before 9:30PM`,
    });
  }
  next();
}

function hasValidNumber(req, res, next) {
  const { people } = req.body.data;

  if (!Number.isInteger(people) || people < 1) {
    return next({
      status: 400,
      message: `Invalid number of people`,
    });
  }
  next();
}

function hasValidStatus(req, res, next) {
  const { status } = req.body.data;
  const currentStatus = res.locals.reservation.status;

  if (currentStatus === 'finished' || currentStatus === 'canceled') {
    return next({
      status: 400,
      message: `Reservation status is finished.`,
    });
  }
  if (
    status === 'booked' ||
    status === 'seated' ||
    status === 'finished' ||
    status === 'cancelled'
  ) {
    res.locals.status = status;
    return next();
  }
  next({
    status: 400,
    message: `Invalid status: ${status}`,
  });
}

function isBooked(req, res, next) {
  const { status } = req.body.data;

  // if (!status) {
  //   req.body.data.status = 'booked'; // Set like a default status to 'booked'
  // } else if (status !== 'booked') {

  if (status && status !== 'booked') {
    return next({
      status: 400,
      message: `Invalid status: ${status}`,
    });
  }
  next();
}

module.exports = {
  hasOnlyValidProperties,
  hasRequiredProperties,
  hasValidDate,
  hasValidTime,
  hasValidNumber,
  isBooked,
  hasValidStatus,
};
