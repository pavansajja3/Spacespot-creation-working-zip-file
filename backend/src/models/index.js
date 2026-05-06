const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const User = require('./User');
const Customer = require('./Customer');
const Space = require('./Space');
const Floor = require('./Floor');
const Unit = require('./Unit');
const Lease = require('./Lease');
const Pricing = require('./Pricing');
const Booking = require('./Booking');
const Payment = require('./Payment');
const Document = require('./Document');
const Notification = require('./Notification');

// Prevent duplicate Sequelize alias registration
if (!Space.associations.floors) {
  // User relationships
  User.hasMany(Customer, { foreignKey: 'created_by', as: 'createdCustomers' });
  Customer.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

  // Space -> Floor -> Unit
  Space.hasMany(Floor, { foreignKey: 'space_id', as: 'floors' });
  Floor.belongsTo(Space, { foreignKey: 'space_id', as: 'space' });

  Floor.hasMany(Unit, { foreignKey: 'floor_id', as: 'units' });
  Unit.belongsTo(Floor, { foreignKey: 'floor_id', as: 'floor' });

  // Space pricing
  Space.hasMany(Pricing, { foreignKey: 'space_id', as: 'pricings' });
  Pricing.belongsTo(Space, { foreignKey: 'space_id', as: 'space' });

  // Customer relationships
  Customer.hasMany(Lease, { foreignKey: 'customer_id', as: 'leases' });
  Lease.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

  Customer.hasMany(Payment, { foreignKey: 'customer_id', as: 'payments' });
  Payment.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

  Customer.hasMany(Booking, { foreignKey: 'customer_id', as: 'bookings' });
  Booking.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

  Customer.hasMany(Document, { foreignKey: 'customer_id', as: 'documents' });
  Document.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

  // Unit relationships
  Unit.hasMany(Lease, { foreignKey: 'unit_id', as: 'leases' });
  Lease.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });

  Unit.hasMany(Pricing, { foreignKey: 'unit_id', as: 'unitPricings' });
  Pricing.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });

  Unit.hasMany(Booking, { foreignKey: 'unit_id', as: 'bookings' });
  Booking.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });

  Unit.hasMany(Notification, { foreignKey: 'unit_id', as: 'unitNotifications' });
  Notification.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });

  // Lease relationships
  Lease.hasMany(Payment, { foreignKey: 'lease_id', as: 'leasePayments' });
  Payment.belongsTo(Lease, { foreignKey: 'lease_id', as: 'lease' });

  Lease.hasMany(Document, { foreignKey: 'lease_id', as: 'leaseDocuments' });
  Document.belongsTo(Lease, { foreignKey: 'lease_id', as: 'lease' });

  Lease.hasMany(Notification, { foreignKey: 'lease_id', as: 'leaseNotifications' });
  Notification.belongsTo(Lease, { foreignKey: 'lease_id', as: 'lease' });

  // Booking relationships
  Booking.hasMany(Payment, { foreignKey: 'booking_id', as: 'bookingPayments' });
  Payment.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

  Booking.hasMany(Notification, { foreignKey: 'booking_id', as: 'bookingNotifications' });
  Notification.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

  // Payment relationships
  Payment.hasMany(Notification, { foreignKey: 'payment_id', as: 'paymentNotifications' });
  Notification.belongsTo(Payment, { foreignKey: 'payment_id', as: 'payment' });

  // Document relationships
  Document.hasMany(Notification, { foreignKey: 'document_id', as: 'documentNotifications' });
  Notification.belongsTo(Document, { foreignKey: 'document_id', as: 'document' });

  // User notifications
  User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
  Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
}

module.exports = {
  sequelize,
  Sequelize,
  User,
  Customer,
  Space,
  Floor,
  Unit,
  Lease,
  Pricing,
  Booking,
  Payment,
  Document,
  Notification
};