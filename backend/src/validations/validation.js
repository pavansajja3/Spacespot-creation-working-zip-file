const { body, param, query, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Auth validations
const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation
];

const validateRegister = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  handleValidation
];

// Customer validations
const validateCreateUnit = [
  body('floor_id')
    .isInt({ min: 1 })
    .withMessage('Invalid floor ID'),

  body('unit_number')
    .notEmpty()
    .withMessage('Unit number is required'),

  body('area_sqm')
    .notEmpty()
    .withMessage('Area is required')
    .isNumeric()
    .withMessage('Area must be a number'),

  handleValidation
];
const validateCreateCustomer = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required'),

  body('brand_name')
    .optional()
    .notEmpty()
    .withMessage('Brand name is required'),

  handleValidation
];
const validateUpdateCustomer = [
  param('id').isInt().withMessage('Invalid customer ID'),
  handleValidation
];

// Space validations
const validateCreateSpace = [
  body('name').notEmpty().withMessage('Space name is required'),
  body('name')
  .notEmpty()
  .withMessage('Space name is required'),

body('address')
  .if(body('status').equals('pending'))
  .notEmpty()
  .withMessage('address is required'),

body('city')
  .if(body('status').equals('pending'))
  .notEmpty()
  .withMessage('City is required'),

body('state')
  .if(body('status').equals('pending'))
  .notEmpty()
  .withMessage('State is required'),

body('managedByPhone')
  .if(body('status').equals('pending'))
  .notEmpty()
  .withMessage('Managed By Phone is required'),

  handleValidation
];

const validateUpdateSpace = [
  param('id').isInt().withMessage('Invalid space ID'),
  handleValidation
];

// Floor validations
const validateCreateFloor = [
  body('space_id')
    .isInt({ min: 1 })
    .withMessage('Invalid space ID'),

  body('floor_number')
    .notEmpty()
    .withMessage('Floor number is required'),

  handleValidation
];

const validateUpdateFloor = [
  param('id').isInt().withMessage('Invalid floor ID'),
  handleValidation
];

const validateUpdateUnit = [
  param('id').isInt().withMessage('Invalid unit ID'),
  handleValidation
];

// Lease validations
const validateCreateLease = [
  body('customer_id').isInt().withMessage('Invalid customer ID'),
  body('unit_id').isInt().withMessage('Invalid unit ID'),
  body('start_date').isISO8601().withMessage('Valid start date is required'),
  body('end_date').isISO8601().withMessage('Valid end date is required'),
  body('monthly_rent').isDecimal().withMessage('Monthly rent must be a number').notEmpty().withMessage('Monthly rent is required'),
  handleValidation
];

const validateUpdateLease = [
  param('id').isInt().withMessage('Invalid lease ID'),
  handleValidation
];

// Booking validations
const validateCreateBooking = [
  body('customer_id').isInt().withMessage('Invalid customer ID'),
  body('unit_id').isInt().withMessage('Invalid unit ID'),
  body('check_in_date').isISO8601().withMessage('Valid check-in date is required'),
  body('check_out_date').isISO8601().withMessage('Valid check-out date is required'),
  body('guest_count').isInt({ min: 1 }).withMessage('Guest count must be at least 1'),
  handleValidation
];

const validateUpdateBooking = [
  param('id').isInt().withMessage('Invalid booking ID'),
  handleValidation
];

// Payment validations
const validateCreatePayment = [
  body('customer_id').isInt().withMessage('Invalid customer ID'),
  body('amount').isDecimal().withMessage('Amount must be a number').notEmpty().withMessage('Amount is required'),
  body('due_date').isISO8601().withMessage('Valid due date is required'),
  body('payment_type').isIn(['rent', 'deposit', 'late_fee', 'service_charge', 'refund', 'other']).withMessage('Invalid payment type'),
  handleValidation
];

const validateUpdatePayment = [
  param('id').isInt().withMessage('Invalid payment ID'),
  handleValidation
];

// Document validations
const validateCreateDocument = [
  body('title').notEmpty().withMessage('Document title is required'),
  body('document_type').isIn(['lease_agreement', 'addendum', 'invoice', 'receipt', 'contract', 'policy', 'other']).withMessage('Invalid document type'),
  handleValidation
];

const validateUpdateDocument = [
  param('id').isInt().withMessage('Invalid document ID'),
  handleValidation
];

// Notification validations
const validateCreateNotification = [
  body('user_id').isInt().withMessage('Invalid user ID'),
  body('notification_type').isIn(['info', 'warning', 'error', 'success', 'payment_due', 'lease_expiring', 'booking_confirmation', 'booking_cancelled', 'document_ready', 'system']).withMessage('Invalid notification type'),
  body('title').notEmpty().withMessage('Title is required'),
  body('message').notEmpty().withMessage('Message is required'),
  handleValidation
];

module.exports = {
  validateLogin,
  validateRegister,
  validateCreateCustomer,
  validateUpdateCustomer,
  validateCreateSpace,
  validateUpdateSpace,
  validateCreateFloor,
  validateUpdateFloor,
  validateCreateUnit,
  validateUpdateUnit,
  validateCreateLease,
  validateUpdateLease,
  validateCreateBooking,
  validateUpdateBooking,
  validateCreatePayment,
  validateUpdatePayment,
  validateCreateDocument,
  validateUpdateDocument,
  validateCreateNotification
};
