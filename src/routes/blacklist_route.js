const express = require('express');
const blacklist = require("../controllers/blacklist_controller");
const router = express.Router();

router.get('/', blacklist.viewBlacklist);
router.get('/:id', blacklist.editBlacklist);
router.post('/:id', blacklist.updateBlacklist);

router.get('/delete/:id', blacklist.deleteBlacklist);

module.exports = router;
