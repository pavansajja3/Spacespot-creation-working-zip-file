const express = require('express');
const authRoutes = require('./authRoutes');
const customerRoutes = require('./customerRoutes');
const spaceRoutes = require('./spaceRoutes');
const floorRoutes = require('./floorRoutes');
const unitRoutes = require('./unitRoutes');
const leaseRoutes = require('./leaseRoutes');
const bookingRoutes = require('./bookingRoutes');
const paymentRoutes = require('./paymentRoutes');
const paymentWebhookRoutes = require('./paymentWebhookRoutes');
const documentRoutes = require('./documentRoutes');
const notificationRoutes = require('./notificationRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use('/customers', customerRoutes);
router.use('/spaces', spaceRoutes);
router.use('/floors', floorRoutes);
router.use('/units', unitRoutes);
router.use('/leases', leaseRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/payments/webhook', paymentWebhookRoutes);
router.use('/documents', documentRoutes);
router.use('/notifications', notificationRoutes);

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SpaceSpot API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      customers: '/api/customers',
      spaces: '/api/spaces',
      floors: '/api/floors',
      units: '/api/units',
      leases: '/api/leases',
      bookings: '/api/bookings',
      payments: '/api/payments',
      documents: '/api/documents',
      notifications: '/api/notifications'
    }
  });
});

module.exports = router;
