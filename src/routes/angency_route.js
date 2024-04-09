const express = require('express');
const angency = require("../controllers/subrole_controller");
const router = express.Router();

router.get('/', angency.viewAngency);


module.exports = router;
