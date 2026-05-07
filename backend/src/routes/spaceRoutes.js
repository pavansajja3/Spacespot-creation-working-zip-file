const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middleware/auth");
const upload = require("../middleware/uploadMiddleware");
const Document = require("../models/Document");
const {
  validateCreateSpace,
  validateUpdateSpace
} = require("../validations/validation");

const SpaceService = require("../services/spaceService");

// =======================
// PUBLIC SPACES (NO AUTH)
// =======================
router.get("/public", async (req, res) => {
  try {
    const spaces = await SpaceService.getAllSpaces({
      ...req.query,
      status: "approved"
    });

    res.json({ success: true, data: spaces });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =======================
// GET STATISTICS
// =======================
router.get("/statistics", authenticate, async (req, res) => {
  try {
    const statistics = await SpaceService.getSpaceStatistics();
    res.json({ success: true, data: statistics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =======================
// GET ALL SPACES (ADMIN)
// =======================
router.get("/", authenticate, async (req, res) => {
  try {
    const spaces = await SpaceService.getAllSpaces(req.query);

    const spacesArray =
      spaces?.spaces ||
      spaces?.data?.spaces ||
      spaces?.data ||
      spaces ||
      [];

    const updatedSpaces = spacesArray.map((space) => {
      const totalUnits = Number(
        space.total_units ||
        space.units_count ||
        space.units ||
        0
      );

      const availableUnits = Number(
        space.available_units ||
        space.availableUnits ||
        space.available_units_count ||
        0
      );

      const occupancy =
        totalUnits > 0
          ? Math.round(((totalUnits - availableUnits) / totalUnits) * 100)
          : 0;

      return {
        ...space,
        total_units: totalUnits,
        available_units: availableUnits,
        occupancy,
      };
    });

    res.json({
      success: true,
      data: {
        spaces: updatedSpaces,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =======================
// GET SPACE BY ID
// =======================
router.get("/:id", authenticate, async (req, res) => {
  try {
    const space = await SpaceService.getSpaceById(req.params.id);

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Space not found"
      });
    }

    res.json({ success: true, data: space });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
const getDocumentTypeFromFileName = (fileName = "") => {
  const name = fileName.toLowerCase();

  if (name.includes("guideline") || name.includes("guidelines") || name.includes("rules")) {
    return "guidelines";
  }

  if (name.includes("safety") || name.includes("fire") || name.includes("emergency")) {
    return "safety";
  }

  if (
    name.includes("legal") ||
    name.includes("agreement") ||
    name.includes("contract") ||
    name.includes("lease")
  ) {
    return "legal";
  }

  return "other";
};
// =======================
// CREATE SPACE
// =======================
router.post(
  "/",
  authenticate,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "documents", maxCount: 10 }
  ]),
  validateCreateSpace,
  async (req, res) => {
    try {
      if (req.body.amenities) {
        req.body.amenities = JSON.parse(req.body.amenities);
      }

      if (req.body.features) {
        req.body.features = JSON.parse(req.body.features);
      }

      if (req.body.floors) {
        req.body.floors = JSON.parse(req.body.floors);
      }

      const images =
        req.files?.images?.map(file => `/uploads/spaces/photos/${file.filename}`) || [];

      const documents =
        req.files?.documents?.map(file => `/uploads/spaces/documents/${file.filename || file.originalname}`) || [];

      // ✅ CREATE SPACE FIRST
      const space = await SpaceService.createSpace(
        {
          ...req.body,
          images,
          documents,
          status: req.body.status || "draft"
        },
        req.user.id
      );

      // ✅ THEN SAVE INTO documents TABLE
      if (req.files?.documents) {
        for (let file of req.files.documents) {
          await Document.create({
            document_reference: `DOC-${Date.now()}-${Math.random()}`,
            space_id: space.id,
            document_type: getDocumentTypeFromFileName(file.originalname),
            title: file.originalname,
            description: "",
            file_url: `/uploads/spaces/documents/${file.filename || file.originalname}`,
            file_name: file.originalname,
            file_size: file.size,
            file_type: file.mimetype,
            created_by: req.user.id,
            status: "approved"
          });
        }
      }

      res.status(201).json({
        success: true,
        message: "Space created successfully",
        data: space
      });

    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

// =======================
// APPROVE
// =======================
router.put("/:id/approve", authenticate, authorize("admin"), async (req, res) => {
  try {
    const space = await SpaceService.updateSpace(
      req.params.id,
      {
        status: "approved",
        approval_note: req.body.approval_note || null
      },
      req.user.id
    );

    res.json({ success: true, message: "Approved", data: space });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// =======================
// REJECT
// =======================
router.put("/:id/reject", authenticate, authorize("admin"), async (req, res) => {
  try {
    const space = await SpaceService.updateSpace(
      req.params.id,
      {
        status: "rejected",
        approval_note: req.body.approval_note || "Rejected"
      },
      req.user.id
    );

    res.json({ success: true, message: "Rejected", data: space });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// =======================
// DELETE
// =======================
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await SpaceService.deleteSpace(req.params.id, req.user.id);

    res.json({
      success: true,
      message: "Space deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;