const express = require('express');
const Collector = require("../controllers/collector_controller");
const router = express.Router();

router.get('/', Collector.viewUser);

router.get('/create', Collector.form);
router.post('/create', Collector.createUser);


router.get('/:id', Collector.editUser);
router.post('/:id', Collector.updateUser);

router.get('/delete/:id', Collector.deleteUser);




module.exports = router;
