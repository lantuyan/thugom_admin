const express = require('express');
const blacklist = require("../controllers/blacklist_controller");
const router = express.Router();

router.get('/', blacklist.viewBlacklist);

router.get('/delete/:id', blacklist.deleteBlacklist);
router.get('/unban/:id', blacklist.updateBlacklist);

module.exports = router;
