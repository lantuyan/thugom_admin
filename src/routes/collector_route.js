const express = require('express');
const Collector = require("../controllers/collector_controller");
const router = express.Router();

router.get('/', Collector.viewCollector);

router.get('/create', Collector.form);
router.post('/create', Collector.createCollector);


router.get('/:id', Collector.editCollector);
router.post('/:id', Collector.updateCollector);

router.get('/delete/:id', Collector.deleteCollector);

router.get('/blacklist/:id', Collector.banCollector);




module.exports = router;
