const express = require('express');
// Rutas de admin
const adminController = require("../controllers/admin.controller");
const router = express.Router();

router.get('/test', adminController.testConnection)
router.get('/', adminController.getAdmin);
router.post('/login', adminController.login);
router.get('/logout', adminController.logout);

module.exports = router;