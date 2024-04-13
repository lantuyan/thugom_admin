const express = require('express');
const UserController = require("../controllers/person_controller");
const router = express.Router();

router.get('/', UserController.viewUser);

router.get('/create', UserController.form);
router.post('/create', UserController.createUser);


router.get('/:id', UserController.editUser);
router.post('/:id', UserController.updateUser);

router.get('/delete/:id', UserController.deleteUser);

router.get('/blacklist/:id', UserController.banUser);


module.exports = router;
