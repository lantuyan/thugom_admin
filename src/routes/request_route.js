const express = require('express');
const RequestController = require("../controllers/request_controller");
const router = express.Router();

router.get('/', RequestController.viewRequest);


router.get('/:id', RequestController.editRequest);
router.post('/:id', RequestController.updateRequest);

router.get('/delete/:id', RequestController.deleteRequest);


module.exports = router;
