const express = require('express');
const router = express.Router();
const siteController = require("../controllers/site_controller");

// Route GET /
router.get('/', siteController.index);

module.exports = router;
