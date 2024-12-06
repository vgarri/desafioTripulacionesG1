const express = require('express');
// Rutas de admin
const adminController = require("../controllers/admin.controller");
const router = express.Router();

router.get('/test', adminController.testConnection)
router.get('/', adminController.getAdmin);
router.get('/email', adminController.getAdminByEmail)
router.post('/login', adminController.login);
router.post('/', adminController.createAdmin);
router.get('/logout', adminController.logout);

module.exports = router;