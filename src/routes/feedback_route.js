const express = require('express');
const feedbackController = require("../controllers/feedback_controller");
const router = express.Router();

router.get('/', feedbackController.viewFeedback);

router.get('/delete/:id', feedbackController.deleteFeedback);


module.exports = router;