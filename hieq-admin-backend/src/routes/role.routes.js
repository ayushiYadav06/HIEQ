const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleController = require('../controllers/role.controller');

// All routes require authentication and admin role
router.use(auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'));

// Role routes
router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);
router.post('/', roleController.createRole);
router.patch('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

// Permission routes
router.get('/permissions/all', roleController.getAllPermissions);
router.post('/permissions', roleController.createPermission);
router.patch('/permissions/:id', roleController.updatePermission);
router.delete('/permissions/:id', roleController.deletePermission);

module.exports = router;

