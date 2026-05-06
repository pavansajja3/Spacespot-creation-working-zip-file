// Validation Index
module.exports = {
  // Base schemas
  ValidationUtils: require('./baseSchema'),
  
  // Entity schemas
  customerSchema: require('./customerSchema'),
  spaceSchema: require('./spaceSchema'),
  unitSchema: require('./unitSchema'),
  leaseSchema: require('./leaseSchema'),
  bookingSchema: require('./bookingSchema'),
  pricingSchema: require('./pricingSchema'),
  paymentSchema: require('./paymentSchema'),
  documentSchema: require('./documentSchema'),
  notificationSchema: require('./notificationSchema'),
  userSchema: require('./userSchema'),
  
  // Validation utilities
  ValidationErrorHandler: require('./validationErrorHandler'),
  ValidationMiddleware: require('./validationMiddleware')
};
