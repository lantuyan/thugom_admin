const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth_controller");

// Route GET auth/login
router.get('/login', authController.login);

// Route GET auth/logout
router.get('/logout', authController.logout);

// Route GET /auth
router.get('/', authController.login);

// Route POST auth/login
router.post('/login', authController.loginSubmit);

module.exports = router;
