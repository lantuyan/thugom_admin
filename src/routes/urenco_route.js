const express = require('express');
const urenco = require("../controllers/subrole_controller");
const router = express.Router();

router.get('/', urenco.viewUrenco);


module.exports = router;
