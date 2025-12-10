const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const assessmentController = require("../controllers/assessment.controller");

// All routes require authentication and admin role
router.use(auth.verifyToken);
router.use(auth.requireRole("SUPER_ADMIN", "ADMIN", "CONTENT_ADMIN"));

// GET /api/admin/assessment/:type - Get all items by type
router.get("/:type", assessmentController.getByType);

// GET /api/admin/assessment/:type/:id - Get single item
router.get("/:type/:id", assessmentController.getById);

// POST /api/admin/assessment/:type - Create new item
router.post("/:type", assessmentController.create);

// PATCH /api/admin/assessment/:type/:id - Update item
router.patch("/:type/:id", assessmentController.update);

// DELETE /api/admin/assessment/:type/:id - Delete item
router.delete("/:type/:id", assessmentController.delete);

// PATCH /api/admin/assessment/:type/:id/status - Toggle status
router.patch("/:type/:id/status", assessmentController.toggleStatus);

module.exports = router;

