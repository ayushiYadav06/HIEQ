const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const listManagementController = require("../controllers/listmanagement.controller");

// All routes require authentication and admin role
router.use(auth.verifyToken);
router.use(auth.requireRole("SUPER_ADMIN", "ADMIN", "CONTENT_ADMIN"));

// GET /api/admin/listmanagement/:type - Get all items by type
router.get("/:type", listManagementController.getByType);

// GET /api/admin/listmanagement/:type/:id - Get single item
router.get("/:type/:id", listManagementController.getById);

// POST /api/admin/listmanagement/:type - Create new item
router.post("/:type", listManagementController.create);

// PATCH /api/admin/listmanagement/:type/:id - Update item
router.patch("/:type/:id", listManagementController.update);

// DELETE /api/admin/listmanagement/:type/:id - Delete item
router.delete("/:type/:id", listManagementController.delete);

// PATCH /api/admin/listmanagement/:type/:id/status - Toggle status
router.patch("/:type/:id/status", listManagementController.toggleStatus);

module.exports = router;

