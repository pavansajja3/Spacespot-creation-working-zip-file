const express = require("express");
const router = express.Router();
const { Op, fn, col, literal } = require("sequelize");
const { Space, Floor, Unit, Lease } = require("../models");

router.get("/summary", async (req, res) => {
  try {
    const availableSpaces = await Space.count({
      where: {
        deleted_at: null,
        status: {
          [Op.in]: ["approved", "pending"],
        },
      },
    });

    const rentedSpaces = await Space.count({
      where: {
        deleted_at: null,
        status: "approved",
      },
    });

    const totalSpaces = await Space.count({
      where: { deleted_at: null },
    });

    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const leasesClosedLastMonth = await Lease.count({
      where: {
        deleted_at: null,
        status: "active",
        signed_at: {
          [Op.gte]: lastMonthStart,
          [Op.lt]: thisMonthStart,
        },
      },
    });

    res.json({
      availableSpaces,
      rentedSpaces,
      leasesClosedLastMonth,
      precinct: totalSpaces > 0 ? "Live Data" : "No spaces yet",
      fastLeasing: rentedSpaces > 0 ? "Live Unit" : "No rented units",
    });
  } catch (err) {
    console.error("Failed to fetch summary:", err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

router.get("/occupancy", async (req, res) => {
  try {
    const rented = await Unit.count({
      where: { deleted_at: null, occupancy_status: "occupied" },
    });

    const available = await Unit.count({
      where: { deleted_at: null, occupancy_status: "available" },
    });

    res.json([
      { id: "occupied", name: "Rented", value: rented },
      { id: "available", name: "Available", value: available },
    ]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch occupancy data" });
  }
});

router.get("/analytics", async (req, res) => {
  try {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    const available = await Unit.count({
      where: { deleted_at: null, occupancy_status: "available" },
    });

    const rented = await Unit.count({
      where: { deleted_at: null, occupancy_status: "occupied" },
    });

    const revenue = await Lease.sum("monthly_rent", {
      where: { deleted_at: null, status: "active" },
    });

    res.json(
      months.map((month, index) => ({
        id: index + 1,
        month,
        available,
        rented,
        revenue: Number(revenue || 0),
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

router.get("/monthly-stats", async (req, res) => {
  try {
    const available = await Unit.count({
      where: { deleted_at: null, occupancy_status: "available" },
    });

    const rented = await Unit.count({
      where: { deleted_at: null, occupancy_status: "occupied" },
    });

    res.json([
      {
        month: new Date().toLocaleString("default", { month: "short" }),
        available,
        rented,
        revenue: 0,
      },
    ]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch monthly stats" });
  }
});

router.get("/availability", async (req, res) => {
  try {
    const available = await Unit.count({
      where: { deleted_at: null, occupancy_status: "available" },
    });

    const rented = await Unit.count({
      where: { deleted_at: null, occupancy_status: "occupied" },
    });

    res.json([
      {
        id: 1,
        month: new Date().toLocaleString("default", { month: "short" }),
        available,
        rented,
      },
    ]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch availability" });
  }
});

router.get("/events/:year/:month", async (req, res) => {
  try {
    const { year, month } = req.params;

    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 1);

    const leases = await Lease.findAll({
      where: { deleted_at: null },
      raw: true, // ✅ important fix
    });

    const events = leases
      .map((lease) => {
        const rawDate =
          lease.lease_end_date ||
          lease.end_date ||
          lease.leaseEndDate ||
          lease.endDate;

        if (!rawDate) return null;

        const date = new Date(rawDate);

        if (isNaN(date)) return null; // ✅ prevent invalid date crash

        if (date < start || date >= end) return null;

        return {
          id: lease.id,
          title: `Lease ending - ${lease.status || "active"}`,
          date: rawDate,
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
          type: "deadline",
          leaseId: lease.id,
        };
      })
      .filter(Boolean);

    res.json(events);
  } catch (err) {
    console.error("Failed to fetch calendar events:", err);
    res.status(500).json({
      error: "Failed to fetch calendar events",
      details: err.message,
    });
  }
});

module.exports = router;